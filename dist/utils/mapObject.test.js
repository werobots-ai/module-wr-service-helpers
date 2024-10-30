"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const mapObject_1 = require("./mapObject");
// Sample methods and mock data to use in tests
const sampleSource = {
    simpleField: "simpleValue",
    nestedField: { level1: { level2: "deepValue" } },
    arrayField: [{ item: 1 }, { item: 2 }],
    data: {
        introduction: "This is an intro",
        details: {
            summary: "This is a summary",
        },
    },
};
(0, node_test_1.describe)("getSourceValue", () => {
    (0, node_test_1.it)("should retrieve a simple nested field from source", () => {
        const result = (0, mapObject_1.getSourceValue)(sampleSource, {
            sourceField: "nestedField.level1.level2",
        });
        node_assert_1.default.strictEqual(result, "deepValue");
    });
    (0, node_test_1.it)("should retrieve a static value from sourceConfig", () => {
        const result = (0, mapObject_1.getSourceValue)(sampleSource, { value: "staticValue" });
        node_assert_1.default.strictEqual(result, "staticValue");
    });
    (0, node_test_1.it)("should retrieve a dynamic value from a method", () => {
        const result = (0, mapObject_1.getSourceValue)(sampleSource, { method: "currentDateTime" });
        node_assert_1.default.strictEqual(typeof result, "string");
    });
    (0, node_test_1.it)("should handle a concat of sourceField and static value", () => {
        const result = (0, mapObject_1.getSourceValue)(sampleSource, {
            method: "concat",
            parts: [
                { sourceField: "data.introduction" },
                { value: " - " },
                { sourceField: "data.details.summary" },
            ],
        });
        node_assert_1.default.strictEqual(result, "This is an intro - This is a summary");
    });
    (0, node_test_1.it)("should handle deeply nested concat", () => {
        const result = (0, mapObject_1.getSourceValue)(sampleSource, {
            method: "concat",
            parts: [
                { sourceField: "simpleField" },
                {
                    method: "concat",
                    parts: [
                        { value: "\n-- Nested Start --\n" },
                        { sourceField: "data.introduction" },
                        { value: "\n-- Nested End --\n" },
                    ],
                },
                { sourceField: "nestedField.level1.level2" },
            ],
        });
        node_assert_1.default.strictEqual(result, "simpleValue\n-- Nested Start --\nThis is an intro\n-- Nested End --\ndeepValue");
    });
    (0, node_test_1.it)("should handle jsonAsMarkdown", () => {
        const result = (0, mapObject_1.getSourceValue)(sampleSource, {
            method: "jsonAsMarkdown",
            mappings: [
                { sourceField: "simpleField", targetField: "simple" },
                { sourceField: "nestedField.level1.level2", targetField: "deepNested" },
            ],
        });
        node_assert_1.default.strictEqual(result, "- **simple:** simpleValue\n- **deepNested:** deepValue\n");
    });
    (0, node_test_1.it)("should throw error for invalid method", () => {
        node_assert_1.default.throws(() => (0, mapObject_1.getSourceValue)(sampleSource, { method: "invalidMethod" }), /Method "invalidMethod" not found/);
    });
    (0, node_test_1.it)("should throw an error for invalid sourceConfig", () => {
        node_assert_1.default.throws(() => (0, mapObject_1.getSourceValue)(sampleSource, { invalid: "config" }), /Invalid sourceConfig: {"invalid":"config"}/);
    });
});
(0, node_test_1.describe)("mapObject", () => {
    (0, node_test_1.it)("should map a simple object based on rules", () => {
        const rules = [
            { sourceField: "simpleField", targetField: "mappedSimpleField" },
        ];
        const result = (0, mapObject_1.mapObject)(sampleSource, rules);
        node_assert_1.default.deepStrictEqual(result, { mappedSimpleField: "simpleValue" });
    });
    (0, node_test_1.it)("should map a nested object field based on rules", () => {
        const rules = [
            {
                sourceField: "nestedField.level1.level2",
                targetField: "mappedDeepField",
            },
        ];
        const result = (0, mapObject_1.mapObject)(sampleSource, rules);
        node_assert_1.default.deepStrictEqual(result, { mappedDeepField: "deepValue" });
    });
    (0, node_test_1.it)("should map a static value based on rules", () => {
        const rules = [{ value: "staticValue", targetField: "mappedStaticField" }];
        const result = (0, mapObject_1.mapObject)(sampleSource, rules);
        node_assert_1.default.deepStrictEqual(result, { mappedStaticField: "staticValue" });
    });
    (0, node_test_1.it)("should handle non-existent sourceField gracefully", () => {
        const rules = [
            { sourceField: "nonExistentField", targetField: "mappedField" },
        ];
        const result = (0, mapObject_1.mapObject)(sampleSource, rules);
        node_assert_1.default.deepStrictEqual(result, {});
    });
    (0, node_test_1.it)("should handle a method-based mapping rule", () => {
        const rules = [
            { method: "currentDateTime", targetField: "mappedDateTime" },
        ];
        const result = (0, mapObject_1.mapObject)(sampleSource, rules);
        node_assert_1.default.strictEqual(typeof result.mappedDateTime, "string");
    });
    (0, node_test_1.it)("should handle a concat rule with multiple parts", () => {
        const rules = [
            {
                method: "concat",
                parts: [
                    { sourceField: "data.introduction" },
                    { value: " - " },
                    { sourceField: "data.details.summary" },
                ],
                targetField: "mappedConcatField",
            },
        ];
        const result = (0, mapObject_1.mapObject)(sampleSource, rules);
        node_assert_1.default.deepStrictEqual(result, {
            mappedConcatField: "This is an intro - This is a summary",
        });
    });
});
