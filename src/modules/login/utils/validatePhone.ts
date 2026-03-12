export function validatePhone(phone: string) {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10;
}