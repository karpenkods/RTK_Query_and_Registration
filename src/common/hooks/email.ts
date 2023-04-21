export function useEmail(email: string): boolean {
  const EMAIL_REGEXP =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

  const correctEmail = EMAIL_REGEXP.test(email)

  return correctEmail
}
