import { FieldMappingRule, FieldSource } from "../types/WorkspacePreset";
import { jsonToMarkdown } from "./json2markdown";

// Helper function to format DateTime if needed
const getCurrentDateTime = (): string => new Date().toISOString();

const methods = {
  currentDateTime: getCurrentDateTime,
};

// Retrieve a nested value using dot notation
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// Set a nested value using dot notation
const setNestedValue = (
  obj: Record<string, any>,
  path: string,
  value: any
): void => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] || {};
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
};

// Unified function to retrieve a value based on FieldSource configuration
export const getSourceValue = (
  source: Record<string, any>,
  sourceConfig: FieldSource
): any => {
  if ("sourceField" in sourceConfig) {
    return getNestedValue(source, sourceConfig.sourceField);
  } else if ("value" in sourceConfig) {
    return sourceConfig.value;
  } else if (sourceConfig.method === "concat") {
    // Process each part in the concat array and join results
    return sourceConfig.parts
      .map((part) => getSourceValue(source, part))
      .join("");
  } else if (
    sourceConfig.method === "json" ||
    sourceConfig.method === "jsonAsMarkdown"
  ) {
    // Map the object based on provided mappings and return as JSON or Markdown
    const mappedObject = mapObject(source, sourceConfig.mappings || []);
    return sourceConfig.method === "jsonAsMarkdown"
      ? jsonToMarkdown(mappedObject)
      : JSON.stringify(mappedObject, null, 2);
  } else if (sourceConfig.method && methods[sourceConfig.method]) {
    // Call method if it exists in the methods map
    return methods[sourceConfig.method]();
  }

  throw new Error(`Invalid sourceConfig: ${JSON.stringify(sourceConfig)}`);
};

// Function to map an object based on FieldMappingRule array
export const mapObject = (
  source: Record<string, any>,
  rules: FieldMappingRule[]
): Record<string, any> => {
  const mappedObject: Record<string, any> = {};

  for (const rule of rules) {
    const { targetField, ...sourceConfig } = rule;
    const value = getSourceValue(source, sourceConfig);
    if (value !== undefined) {
      setNestedValue(mappedObject, targetField, value);
    }
  }

  return mappedObject;
};
