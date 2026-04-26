type OtpRecord = { code: string; expiresAt: number };

const store = new Map<string, OtpRecord>();

export function setOtp(phone: string, code: string, ttlMs: number) {
  store.set(phone, { code, expiresAt: Date.now() + ttlMs });
}

export function consumeOtp(phone: string, code: string): boolean {
  const rec = store.get(phone);
  if (!rec) return false;
  if (Date.now() > rec.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (rec.code !== code) return false;
  store.delete(phone);
  return true;
}
