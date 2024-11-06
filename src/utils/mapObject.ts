import { FieldMappingRule, FieldSource } from "../types/WorkspacePreset";
import { jsonToMarkdown } from "./json2markdown";

// Helper function to format DateTime if needed
const getCurrentDateTime = (_: {
  targetField?: string;
  mappedObject?: Record<string, any>;
}): string => new Date().toISOString();

const deleteMethod = ({
  targetField,
  mappedObject,
}: {
  targetField?: string;
  mappedObject?: Record<string, any>;
}): undefined => {
  if (!targetField || !mappedObject) return;

  const targetParts = targetField.split(".");
  let current = mappedObject;
  for (let i = 0; i < targetParts.length - 1; i++) {
    current = current[targetParts[i]];
  }
  delete current[targetParts[targetParts.length - 1]];
};

const methods = {
  currentDateTime: getCurrentDateTime,
  delete: deleteMethod,
};

// Retrieve a nested value using dot notation
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  if (path === "") return obj;
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// Set a nested value using dot notation
const setNestedValue = (
  obj: Record<string, any>,
  path: string,
  value: any
): void => {
  if (path === "") {
    // clear the object and set the value
    Object.keys(obj).forEach((key) => delete obj[key]);
    Object.assign(obj, value);
    return;
  }

  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] || {};
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
};

const flattenObjOrArr = (
  obj: Record<string, any> | unknown[],
  path: string,
  keys: string[],
  separator?: string
): any => {
  if (!path) {
    if (!obj) return obj;

    if (!Array.isArray(obj)) {
      throw new Error(
        `Method "flattenObject" requires the parent field to be an array. Requested path: "${path}" on ${typeof obj} with value: ${JSON.stringify(
          obj
        )}`
      );
    }

    for (let i = 0; i < obj.length; i += 1) {
      obj[i] = obj[i]
        ? keys.map((key) => obj[i][key]).join(separator || "")
        : null;
    }

    return;
  }

  const pathParts = path.split(".");

  if (Array.isArray(obj)) {
    obj.forEach((item) => flattenObjOrArr(item, path, keys, separator));
    return;
  }

  const nextPath = pathParts.slice(1).join(".");
  flattenObjOrArr(obj[pathParts[0]], nextPath, keys, separator);
};

// Unified function to retrieve a value based on FieldSource configuration
export const getSourceValue = (
  source: Record<string, any>,
  sourceConfig: FieldSource,
  targetField?: string,
  mappedObject?: Record<string, any>
): any => {
  if ("method" in sourceConfig && sourceConfig.method) {
    if (sourceConfig.method === "flattenObject") {
      flattenObjOrArr(
        mappedObject!,
        targetField!,
        sourceConfig.keys,
        sourceConfig.separator
      );
      return;
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
    } else if (sourceConfig.method) {
      if (!(sourceConfig.method in methods)) {
        throw new Error(`Method "${sourceConfig.method}" not found.`);
      }

      // Call method if it exists in the methods map
      return methods[sourceConfig.method]({ targetField, mappedObject });
    }
    //
  } else if ("sourceField" in sourceConfig) {
    return getNestedValue(source, sourceConfig.sourceField);
  } else if ("value" in sourceConfig) {
    return sourceConfig.value;
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
    const value = getSourceValue(
      source,
      sourceConfig,
      targetField,
      mappedObject
    );
    if (value !== undefined) {
      setNestedValue(mappedObject, targetField, value);
    }
  }

  return mappedObject;
};
