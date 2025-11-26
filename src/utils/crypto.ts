import CryptoJS from "crypto-js";

const BASE64_KEY = "DZQxY2lBMTIzNDU2Nzg5MGFiY2RlZg==";
const BASE64_IV  = "QWJjZGVmZ0hpSg==";

function padOrTrim(wordArray: CryptoJS.lib.WordArray, length: number) {
  const bytes = wordArray.sigBytes;

  if (bytes === length) return wordArray;

  const u8 = new Uint8Array(wordArray.words.length * 4);
  CryptoJS.lib.WordArray.create(u8).toString();

  for (let i = 0; i < bytes; i++) {
    u8[i] = wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8);
  }

  let finalBytes;

  if (bytes < length) {
    finalBytes = new Uint8Array(length);
    finalBytes.set(u8.subarray(0, bytes));
  } else {
    finalBytes = u8.subarray(0, length);
  }

  return CryptoJS.lib.WordArray.create(finalBytes);
}

export function decrypt(cipher: string | null) {
  if (!cipher) return null;

  try {
    let key = CryptoJS.enc.Base64.parse(BASE64_KEY);
    let iv  = CryptoJS.enc.Base64.parse(BASE64_IV);

    key = padOrTrim(key, 32);

    iv = padOrTrim(iv, 16);

    const decrypted = CryptoJS.AES.decrypt(cipher, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const text = decrypted.toString(CryptoJS.enc.Utf8);

    return text || null;
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}
