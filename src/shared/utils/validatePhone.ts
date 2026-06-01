export function validatePhone(phone: string) {
  const regex = /^(55)?(?:([1-9]{2})?)(\d{4,5})(\d{4})$/;
  const numbers = phone.replace(/\D/g, "")
  console.log(regex.test(numbers))
  return regex.test(numbers);
}