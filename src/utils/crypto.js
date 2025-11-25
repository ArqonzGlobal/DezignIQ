import CryptoJS from "crypto-js";

const SECRET_KEY = "my-encryption-key-123";
const SECRET_IV  = "my-encryption-iv-123";

export function decrypt(cipher) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      cipher,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(SECRET_IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
}
