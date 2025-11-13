// src/share/utils/tracking-number.ts
import crypto from "crypto";
export function generateTrackingNumber(prefix = "TRK"): string {
  const datePart = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ""); // YYYYMMDD

  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase(); // 8 ký tự ngẫu nhiên

  return `${prefix}-${datePart}-${randomPart}`;
}
