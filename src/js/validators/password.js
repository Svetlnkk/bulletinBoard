// check on number
export function hasNumber(value) {
  return /\d/.test(value);
}

// check on lowercase
export function hasLowercaseLetter(value) {
  return /[a-z]/.test(value);
}

// check on uppercase
export function hasUppercaseLetter(value) {
  return /[A-Z]/.test(value);
}
