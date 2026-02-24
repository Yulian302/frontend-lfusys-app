export const validateEmail = (
  email: string,
): { isValid: boolean; error?: string } => {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email is required" }
  }

  const trimmedEmail = email.trim()

  // Basic structure check
  if (!trimmedEmail.includes("@")) {
    return { isValid: false, error: "Email must contain @ symbol" }
  }

  const [localPart, domain] = trimmedEmail.split("@")

  // Local part checks
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: "Email must have text before @" }
  }

  if (localPart.length > 64) {
    return {
      isValid: false,
      error: "Email username is too long (max 64 characters)",
    }
  }

  // Domain checks
  if (!domain || domain.length === 0) {
    return { isValid: false, error: "Email must have a domain after @" }
  }

  if (domain.length > 255) {
    return { isValid: false, error: "Email domain is too long" }
  }

  if (!domain.includes(".")) {
    return { isValid: false, error: "Domain must have a dot (e.g., gmail.com)" }
  }

  // Comprehensive regex validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: "Please enter a valid email address" }
  }

  // Common typos check
  const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]
  const domainPart = domain.toLowerCase()

  if (commonDomains.some((d) => d.includes(domainPart) && d !== domainPart)) {
    return { isValid: false, error: `Did you mean @${domainPart}?` }
  }

  return { isValid: true }
}
