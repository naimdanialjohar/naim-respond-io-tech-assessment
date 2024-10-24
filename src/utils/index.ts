export const convertCamelCaseToTitleCase = (text: string) => {
  // Use a regex to insert a space before each uppercase letter
  const result = text.replace(/([A-Z])/g, ' $1')

  return result.replace(/^./, text[0].toUpperCase()) // Capitalize first letter
}
