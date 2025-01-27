import { application } from "express";
import { Schema } from "./calculateColumnWidths";
import { getResultSorter } from "./getResultSorter";

export const resultsToMdTable = (
  results: {
    [key: string]: any;
  }[],
  schema: Schema,
  sort_by: string,
  sort_order: "asc" | "desc",
  useKeysInHeader = false,
  colOrder: string[] = [],
  hiddenColumns: string[] = [],
  addRowNumbers = false
) => {
  const appliedSchema = (
    colOrder.length
      ? [
          ...colOrder.map((key) => schema.find((field) => field.key === key)),
          ...schema.filter((field) => !colOrder.includes(field.key)),
        ]
      : schema
  ).filter((field) => field && !hiddenColumns.includes(field.key)) as Schema;

  const header = [
    ...(addRowNumbers ? ["#"] : []),
    ...appliedSchema.map(
      (field) =>
        (useKeysInHeader ? field.key : field.label) +
        (sort_by === field.key
          ? ` ${sort_order.toLowerCase().includes("desc") ? "▲" : "▼"}`
          : "")
    ),
  ];

  const sorter = getResultSorter(sort_by, sort_order);

  const rows = [...results]
    .sort(sorter)
    .map((result, i) => [
      ...(addRowNumbers ? [i + 1] : []),
      ...appliedSchema.map((field) =>
        typeof result[field.key] === "boolean"
          ? result[field.key]
            ? "Yes"
            : "No"
          : result[field.key]
      ),
    ]);

  return `| ${header.join(" | ")} |
  | ${header.map(() => "---").join(" | ")} |
  ${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}`;
};
