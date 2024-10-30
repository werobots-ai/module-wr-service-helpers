import { describe, it } from "node:test";
import assert from "node:assert";
import { mapObject, getSourceValue } from "./objectToText";

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

describe("getSourceValue", () => {
  it("should retrieve a simple nested field from source", () => {
    const result = getSourceValue(sampleSource, {
      sourceField: "nestedField.level1.level2",
    });
    assert.strictEqual(result, "deepValue");
  });

  it("should retrieve a static value from sourceConfig", () => {
    const result = getSourceValue(sampleSource, { value: "staticValue" });
    assert.strictEqual(result, "staticValue");
  });

  it("should retrieve a dynamic value from a method", () => {
    const result = getSourceValue(sampleSource, { method: "currentDateTime" });
    assert.strictEqual(typeof result, "string");
  });

  it("should handle a concat of sourceField and static value", () => {
    const result = getSourceValue(sampleSource, {
      method: "concat",
      parts: [
        { sourceField: "data.introduction" },
        { value: " - " },
        { sourceField: "data.details.summary" },
      ],
    });
    assert.strictEqual(result, "This is an intro - This is a summary");
  });

  it("should handle deeply nested concat", () => {
    const result = getSourceValue(sampleSource, {
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
    assert.strictEqual(
      result,
      "simpleValue\n-- Nested Start --\nThis is an intro\n-- Nested End --\ndeepValue"
    );
  });

  it("should handle jsonAsMarkdown", () => {
    const result = getSourceValue(sampleSource, {
      method: "jsonAsMarkdown",
      mappings: [
        { sourceField: "simpleField", targetField: "simple" },
        { sourceField: "nestedField.level1.level2", targetField: "deepNested" },
      ],
    });
    assert.strictEqual(
      result,
      "- **simple:** simpleValue\n- **deepNested:** deepValue\n"
    );
  });

  it("should throw an error for invalid sourceConfig", () => {
    assert.throws(
      () => getSourceValue(sampleSource, { invalid: "config" } as any),
      Error
    );
  });
});

describe("mapObject", () => {
  it("should map a simple object based on rules", () => {
    const rules = [
      { sourceField: "simpleField", targetField: "mappedSimpleField" },
    ];
    const result = mapObject(sampleSource, rules);
    assert.deepStrictEqual(result, { mappedSimpleField: "simpleValue" });
  });

  it("should map a nested object field based on rules", () => {
    const rules = [
      {
        sourceField: "nestedField.level1.level2",
        targetField: "mappedDeepField",
      },
    ];
    const result = mapObject(sampleSource, rules);
    assert.deepStrictEqual(result, { mappedDeepField: "deepValue" });
  });

  it("should map a static value based on rules", () => {
    const rules = [{ value: "staticValue", targetField: "mappedStaticField" }];
    const result = mapObject(sampleSource, rules);
    assert.deepStrictEqual(result, { mappedStaticField: "staticValue" });
  });

  it("should handle non-existent sourceField gracefully", () => {
    const rules = [
      { sourceField: "nonExistentField", targetField: "mappedField" },
    ];
    const result = mapObject(sampleSource, rules);
    assert.deepStrictEqual(result, {});
  });

  it("should handle a method-based mapping rule", () => {
    const rules = [
      { method: "currentDateTime" as const, targetField: "mappedDateTime" },
    ];
    const result = mapObject(sampleSource, rules);
    assert.strictEqual(typeof result.mappedDateTime, "string");
  });

  it("should handle a concat rule with multiple parts", () => {
    const rules = [
      {
        method: "concat" as const,
        parts: [
          { sourceField: "data.introduction" },
          { value: " - " },
          { sourceField: "data.details.summary" },
        ],
        targetField: "mappedConcatField",
      },
    ];
    const result = mapObject(sampleSource, rules);
    assert.deepStrictEqual(result, {
      mappedConcatField: "This is an intro - This is a summary",
    });
  });
});
