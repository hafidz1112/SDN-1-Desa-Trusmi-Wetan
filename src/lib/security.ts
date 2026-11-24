/**
 * Modul Keamanan: Proteksi Anti-SQL Injection & Validasi Input Keras
 * SDN 1 Trusmi Wetan
 */

// Pola tanda-tanda serangan SQL Injection umum
const SQLI_PATTERNS = [
  /(\%27)|(')|(\-\-)|(\%23)|(#)/i,                                      // Karakter kutip dan komentar
  /((\%3D)|(=))[^\n]*((\%27)|(')|(\-\-)|(\%3B)|(;))/i,                  // = diikuti kutip atau titik koma
  /\w*((\%27)|('))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,           // ' or
  /((\%27)|('))\s*union/i,                                              // ' union
  /union(\s+all)?\s+select/i,                                           // UNION SELECT
  /select\s+.*\s+from/i,                                                // SELECT ... FROM
  /insert\s+into/i,                                                     // INSERT INTO
  /drop\s+(table|database)/i,                                           // DROP TABLE/DATABASE
  /update\s+.*\s+set/i,                                                 // UPDATE ... SET
  /delete\s+from/i,                                                     // DELETE FROM
  /;\s*--/i,                                                            // ; --
  /\/\*.*\*\//i,                                                        // /* ... */ inline comment
  /benchmark\s*\(.*\)/i,                                                // MySQL BENCHMARK()
  /sleep\s*\(.*\)/i,                                                    // SLEEP()
  /waitfor\s+delay/i,                                                   // MSSQL WAITFOR DELAY
  /or\s+['"]?1['"]?\s*=\s*['"]?1['"]?/i,                               // OR 1=1 / OR '1'='1'
  /or\s+['"]?[a-z0-9]+['"]?\s*=\s*['"]?[a-z0-9]+['"]?/i,              // OR 'a'='a'
  /and\s+['"]?1['"]?\s*=\s*['"]?1['"]?/i,                              // AND 1=1
  /exec(\s|\+)+(s|x)p\w+/i,                                             // EXEC xp_
  /0x[0-9a-f]+/i,                                                       // Hexadecimal literals
];

/**
 * Mendeteksi apakah string mengandung pola injeksi SQL berbahaya
 */
export function containsSqlInjection(input: string): boolean {
  if (typeof input !== 'string') return true;

  // Bersihkan karakter null byte
  if (input.indexOf('\0') !== -1) return true;

  for (const pattern of SQLI_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  return false;
}

/**
 * Sanitasi string dasar: menghapus null byte dan merapikan whitespace
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/\0/g, '').trim();
}

/**
 * Validasi ketat untuk nama pengguna (username)
 * - Hanya menerima huruf (a-z, A-Z), angka (0-9), garis bawah (_), strip (-), titik (.), dan @
 * - Panjang: 3 hingga 50 karakter
 * - Memblokir pola SQL Injection
 */
export function validateUsername(username: unknown): {
  isValid: boolean;
  cleanUsername?: string;
  error?: string;
} {
  if (typeof username !== 'string') {
    return { isValid: false, error: 'Format nama pengguna tidak valid' };
  }

  const clean = sanitizeString(username);

  if (clean.length < 3 || clean.length > 50) {
    return {
      isValid: false,
      error: 'Nama pengguna harus memiliki panjang antara 3 hingga 50 karakter',
    };
  }

  // Cek injeksi SQL
  if (containsSqlInjection(clean)) {
    return {
      isValid: false,
      error: 'Karakter atau format tidak diizinkan pada nama pengguna (Potensi ancaman keamanan terdeteksi)',
    };
  }

  // Pola ketat karakter yang sah
  const validPattern = /^[a-zA-Z0-9_.@-]{3,50}$/;
  if (!validPattern.test(clean)) {
    return {
      isValid: false,
      error: 'Nama pengguna hanya boleh berisi huruf, angka, garis bawah (_), strip (-), titik (.), atau tanda @',
    };
  }

  return { isValid: true, cleanUsername: clean };
}

/**
 * Validasi ketat untuk kata sandi (password)
 * - Panjang: 6 hingga 128 karakter
 * - Memblokir null byte dan pola SQL injection
 */
export function validatePassword(password: unknown): {
  isValid: boolean;
  error?: string;
} {
  if (typeof password !== 'string') {
    return { isValid: false, error: 'Format kata sandi tidak valid' };
  }

  if (password.indexOf('\0') !== -1) {
    return { isValid: false, error: 'Karakter tidak valid pada kata sandi' };
  }

  if (password.length < 6 || password.length > 128) {
    return {
      isValid: false,
      error: 'Panjang kata sandi harus antara 6 hingga 128 karakter',
    };
  }

  if (containsSqlInjection(password)) {
    return {
      isValid: false,
      error: 'Pola tidak sah terdeteksi pada kata sandi',
    };
  }

  return { isValid: true };
}
