/**
 * E2E Encryption utilities using Web Crypto API (browser-native)
 * AES-256-GCM for message encryption
 * RSA-OAEP for session key exchange
 */

export async function generateKeyPair() {
  return window.crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function generateAESKey() {
  return window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function encryptMessage(message, aesKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(message)
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoded)
  return { encrypted: Array.from(new Uint8Array(encrypted)), iv: Array.from(iv) }
}

export async function decryptMessage(encryptedData, iv, aesKey) {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    aesKey,
    new Uint8Array(encryptedData)
  )
  return new TextDecoder().decode(decrypted)
}

export async function exportKey(key) {
  const exported = await window.crypto.subtle.exportKey('raw', key)
  return Array.from(new Uint8Array(exported))
}

export async function importKey(keyData) {
  return window.crypto.subtle.importKey(
    'raw', new Uint8Array(keyData),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// Convenience: encrypt text string, returns base64
export async function encryptText(text) {
  const key = await generateAESKey()
  const { encrypted, iv } = await encryptMessage(text, key)
  const keyData = await exportKey(key)
  return {
    ciphertext: btoa(String.fromCharCode(...encrypted)),
    iv: btoa(String.fromCharCode(...iv)),
    keyData,
  }
}

export async function decryptText(ciphertext, iv, keyData) {
  const key = await importKey(keyData)
  const encBuf = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0))
  const ivBuf = Uint8Array.from(atob(iv), c => c.charCodeAt(0))
  return decryptMessage(Array.from(encBuf), Array.from(ivBuf), key)
}
