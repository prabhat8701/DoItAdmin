export type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export type OtpRecord = {
  phone: string;
  code: string;
  expiresAt: number;
};

// Very simple in-memory stores for demo purposes only.
const usersByPhone = new Map<string, User>();
const otpsByPhone = new Map<string, OtpRecord>();

let nextId = 1;

export function createUser(name: string, phone: string, email: string): User {
  const existing = usersByPhone.get(phone);
  if (existing) {
    return existing;
  }
  const user: User = {
    id: String(nextId++),
    name,
    phone,
    email,
  };
  usersByPhone.set(phone, user);
  return user;
}

export function getUserByPhone(phone: string): User | undefined {
  return usersByPhone.get(phone);
}

export function ensureUserExists(name: string, phone: string, email: string): User {
  const user = usersByPhone.get(phone);
  if (user) return user;
  return createUser(name, phone, email);
}

export function generateAndStoreOtp(phone: string, ttlMs: number = 5 * 60 * 1000): OtpRecord {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const record: OtpRecord = {
    phone,
    code,
    expiresAt: Date.now() + ttlMs,
  };
  otpsByPhone.set(phone, record);
  return record;
}

export function verifyOtp(phone: string, code: string): boolean {
  const record = otpsByPhone.get(phone);
  if (!record) return false;
  const valid = record.code === code && Date.now() < record.expiresAt;
  if (valid) {
    otpsByPhone.delete(phone);
  }
  return valid;
}

export function clearAllStores(): void {
  usersByPhone.clear();
  otpsByPhone.clear();
  nextId = 1;
}

