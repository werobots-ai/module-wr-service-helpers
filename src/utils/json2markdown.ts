export const jsonToMarkdown = (
  jsonObj: Record<string, any>,
  indentLevel: number = 0
): string => {
  const indent = "  ".repeat(indentLevel);
  let markdown = "";

  Object.entries(jsonObj).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // If the value is an object, treat it as a nested section with a dynamic header
      const headerLevel = "#".repeat(indentLevel + 2);
      markdown += `\n${indent}${headerLevel} ${key}\n`;
      markdown += jsonToMarkdown(value, indentLevel + 1);
    } else if (Array.isArray(value)) {
      // If the value is an array, treat it as a list
      const headerLevel = "#".repeat(indentLevel + 2);
      markdown += `\n${indent}${headerLevel} ${key}\n`;
      value.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          // If the array item is an object, recursively convert it
          markdown += `${indent}- ${jsonToMarkdown(item, indentLevel + 1)}`;
        } else {
          // If the array item is a primitive, render it as a list item
          markdown += `${indent}- ${item}\n`;
        }
      });
    } else {
      // If the value is a primitive, render it as a key-value pair
      markdown += `${indent}- **${key}:** ${value}\n`;
    }
  });

  return markdown;
};
