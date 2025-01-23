import { getResultSorter } from "./getResultSorter";
import { SearchManagerOutput } from "./types";

export const resultsToMdTable = (
  results: {
    [key: string]: any;
  }[],
  schema: SearchManagerOutput["schema"],
  sort_by: string,
  sort_order: "asc" | "desc",
  useKeysInHeader = false,
  renderRelevance = false,
  addRowNumbers = false
) => {
  const appliedSchema = renderRelevance ? schema : schema.slice(2);
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
