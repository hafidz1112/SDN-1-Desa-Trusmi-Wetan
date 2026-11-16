import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getDb, initDb } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.AUTH_SECRET || 'sdn1-trusmi-wetan-super-secret-key-2026-cirebon'
);

const COOKIE_NAME = 'admin_session';

export interface AdminUser {
  id: number;
  username: string;
  nama: string;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export async function createSession(user: AdminUser): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    username: user.username,
    nama: user.nama,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m') // 30 minutes expiration (FR-ADM-004)
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 60, // 30 minutes in seconds
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as unknown as AdminUser;
    return {
      id: payload.id,
      username: payload.username,
      nama: payload.nama,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function checkRateLimitAndLock(): Promise<{ isLocked: boolean; remainingMinutes?: number }> {
  await initDb();
  const db = getDb();
  const res = await db.execute('SELECT failed_attempts, locked_until FROM users LIMIT 1');
  if (res.rows.length === 0) return { isLocked: false };

  const row = res.rows[0];
  const lockedUntil = row.locked_until ? new Date(row.locked_until as string) : null;
  const now = new Date();

  if (lockedUntil && lockedUntil > now) {
    const remainingMs = lockedUntil.getTime() - now.getTime();
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
    return { isLocked: true, remainingMinutes };
  }

  // If lock expired, reset
  if (lockedUntil && lockedUntil <= now) {
    await db.execute('UPDATE users SET failed_attempts = 0, locked_until = NULL');
  }

  return { isLocked: false };
}

export async function handleFailedLogin(): Promise<{ lockedNow: boolean }> {
  await initDb();
  const db = getDb();
  const res = await db.execute('SELECT id, failed_attempts FROM users LIMIT 1');
  if (res.rows.length === 0) return { lockedNow: false };

  const currentAttempts = (Number(res.rows[0].failed_attempts) || 0) + 1;
  if (currentAttempts >= 5) {
    const lockDuration = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins lock (FR-ADM-003)
    await db.execute({
      sql: 'UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?',
      args: [currentAttempts, lockDuration, res.rows[0].id],
    });
    return { lockedNow: true };
  } else {
    await db.execute({
      sql: 'UPDATE users SET failed_attempts = ? WHERE id = ?',
      args: [currentAttempts, res.rows[0].id],
    });
    return { lockedNow: false };
  }
}

export async function handleSuccessfulLogin(userId: number) {
  await initDb();
  const db = getDb();
  const now = new Date().toISOString();
  await db.execute({
    sql: 'UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login_at = ? WHERE id = ?',
    args: [now, userId],
  });
}
