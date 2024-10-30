"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapObject = exports.getSourceValue = void 0;
const json2markdown_1 = require("./json2markdown");
// Helper function to format DateTime if needed
const getCurrentDateTime = () => new Date().toISOString();
const methods = {
    currentDateTime: getCurrentDateTime,
};
// Retrieve a nested value using dot notation
const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
};
// Set a nested value using dot notation
const setNestedValue = (obj, path, value) => {
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
const getSourceValue = (source, sourceConfig) => {
    if ("sourceField" in sourceConfig) {
        return getNestedValue(source, sourceConfig.sourceField);
    }
    else if ("value" in sourceConfig) {
        return sourceConfig.value;
    }
    else if (sourceConfig.method === "concat") {
        // Process each part in the concat array and join results
        return sourceConfig.parts
            .map((part) => (0, exports.getSourceValue)(source, part))
            .join("");
    }
    else if (sourceConfig.method === "json" ||
        sourceConfig.method === "jsonAsMarkdown") {
        // Map the object based on provided mappings and return as JSON or Markdown
        const mappedObject = (0, exports.mapObject)(source, sourceConfig.mappings || []);
        return sourceConfig.method === "jsonAsMarkdown"
            ? (0, json2markdown_1.jsonToMarkdown)(mappedObject)
            : JSON.stringify(mappedObject, null, 2);
    }
    else if (sourceConfig.method && methods[sourceConfig.method]) {
        // Call method if it exists in the methods map
        return methods[sourceConfig.method]();
    }
    throw new Error(`Invalid sourceConfig: ${JSON.stringify(sourceConfig)}`);
};
exports.getSourceValue = getSourceValue;
// Function to map an object based on FieldMappingRule array
const mapObject = (source, rules) => {
    const mappedObject = {};
    for (const rule of rules) {
        const { targetField, ...sourceConfig } = rule;
        const value = (0, exports.getSourceValue)(source, sourceConfig);
        if (value !== undefined) {
            setNestedValue(mappedObject, targetField, value);
        }
    }
    return mappedObject;
};
exports.mapObject = mapObject;
