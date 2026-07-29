const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I for readability

/**
 * Generates a random uppercase alphanumeric code.
 * Length defaults to 7 (within the requested 6-8 char range).
 */
export function generateCode(length = 7): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
