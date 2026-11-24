import { NextRequest } from 'next/server';

interface RateLimitRecord {
  attempts: number[];
  lockedUntil?: number;
}

// In-memory sliding window rate limiter map
const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleRecords() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, record] of ipStore.entries()) {
    if (record.lockedUntil && record.lockedUntil > now) continue;
    // Remove if last attempt was more than 30 minutes ago
    const lastAttempt = record.attempts[record.attempts.length - 1] || 0;
    if (now - lastAttempt > 30 * 60 * 1000) {
      ipStore.delete(ip);
    }
  }
}

/**
 * Mendapatkan IP klien asli dari request header
 */
export function getClientIp(req: NextRequest | Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Memeriksa apakah IP sedang terkena batasan rate limit
 * Aturan:
 * - Maksimal 5 percobaan gagal dalam rentang 15 menit
 * - Perlindungan burst: maksimal 3 percobaan dalam 10 detik
 */
export function checkIpRateLimit(ip: string): {
  isLimited: boolean;
  remainingMinutes?: number;
  remainingSeconds?: number;
  message?: string;
} {
  cleanupStaleRecords();
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record) {
    return { isLimited: false };
  }

  // 1. Cek apakah IP sedang dalam masa blokir/kunci
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingMs = record.lockedUntil - now;
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
    return {
      isLimited: true,
      remainingMinutes,
      message: `Terlalu banyak percobaan gagal dari IP Anda. Silakan coba lagi dalam ${remainingMinutes} menit.`,
    };
  }

  // 2. Filter hanya percobaan dalam 15 menit terakhir
  const WINDOW_MS = 15 * 60 * 1000;
  record.attempts = record.attempts.filter((timestamp) => now - timestamp < WINDOW_MS);

  // 3. Cek burst limit: maksimal 3 percobaan dalam 10 detik
  const BURST_WINDOW_MS = 10 * 1000;
  const recentBurstAttempts = record.attempts.filter((timestamp) => now - timestamp < BURST_WINDOW_MS);
  if (recentBurstAttempts.length >= 3) {
    return {
      isLimited: true,
      remainingSeconds: 10,
      message: 'Terlalu banyak permintaan dalam waktu singkat. Tunggu beberapa detik sebelum mencoba kembali.',
    };
  }

  // 4. Cek limit 15 menit: maksimal 5 percobaan
  const MAX_ATTEMPTS = 5;
  if (record.attempts.length >= MAX_ATTEMPTS) {
    const lockDurationMs = 15 * 60 * 1000;
    record.lockedUntil = now + lockDurationMs;
    return {
      isLimited: true,
      remainingMinutes: 15,
      message: 'Terlalu banyak percobaan gagal dari IP Anda. Akun diamankan sementara selama 15 menit.',
    };
  }

  return { isLimited: false };
}

/**
 * Mencatat kegagalan login untuk IP tertentu
 */
export function recordIpFailedAttempt(ip: string): { lockedNow: boolean; remainingMinutes?: number } {
  cleanupStaleRecords();
  const now = Date.now();
  let record = ipStore.get(ip);

  if (!record) {
    record = { attempts: [now] };
    ipStore.set(ip, record);
    return { lockedNow: false };
  }

  record.attempts.push(now);

  const WINDOW_MS = 15 * 60 * 1000;
  record.attempts = record.attempts.filter((timestamp) => now - timestamp < WINDOW_MS);

  const MAX_ATTEMPTS = 5;
  if (record.attempts.length >= MAX_ATTEMPTS) {
    record.lockedUntil = now + 15 * 60 * 1000;
    return { lockedNow: true, remainingMinutes: 15 };
  }

  return { lockedNow: false };
}

/**
 * Reset rate limit saat login berhasil
 */
export function resetIpRateLimit(ip: string) {
  ipStore.delete(ip);
}
