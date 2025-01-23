import { Node } from "./XmlStreamReplacer";
import { calculateColumnWidths } from "./calculateColumnWidths";
import { getResultSorter } from "./getResultSorter";

const getStyledArrow = (sortOrder: "asc" | "desc") =>
  `<span>${sortOrder.toLowerCase().includes("desc") ? "▲" : "▼"}</span>`;

export const resultsToHtmlTable = async (
  node: Node,
  getSearch: any
): Promise<string> => {
  if (node.type === "text") return node.text || "";
  const children = await Promise.all(
    node.children?.map((node) => resultsToHtmlTable(node, getSearch)) || []
  );

  if (node.name === "data-result-table") {
    const { id, "sort-by": sortBy, "sort-order": sortOrder } = node.attributes;
    const data = await getSearch({
      id,
      includeResults: true,
    });

    const header = data.schema.map(
      (field: { key: string; label: string }) =>
        field.label +
        (sortBy === field.key
          ? getStyledArrow(sortOrder as "asc" | "desc")
          : "")
    ) as string[];

    const sorter = getResultSorter(sortBy, sortOrder as "asc" | "desc");

    const rows = (data.results || [])
      .slice()
      .sort(sorter)
      .map((result: { [key: string]: any }) =>
        data.schema.map((field: { key: string }) =>
          typeof result[field.key] === "boolean"
            ? result[field.key]
              ? "Yes"
              : "No"
            : (result[field.key] as string)
        )
      ) as string[][];

    const columnWidths = calculateColumnWidths({
      header,
      rows,
      schema: data.schema,
      maxTableWidth: 100,
    });

    // Calculate total character width for all columns
    const totalColumnWidth = columnWidths.reduce(
      (sum, width) => sum + width,
      0
    );

    // Convert character widths to percentages
    const columnWidthsPercent = columnWidths.map(
      (width) => (width / totalColumnWidth) * 100
    );

    return `<table>
        <thead>
            <tr>
                ${header
                  .map(
                    (col, i) =>
                      `<th style="white-space: unset; vertical-align: middle; width:${columnWidthsPercent[i]}%">${col}</th>`
                  )
                  .join("")}
            </tr>
        </thead>
        <tbody>
        
           
            ${rows
              .map(
                (row) =>
                  `<tr>${row
                    .map(
                      (cell, i) =>
                        `<td style="padding: 4px; width: ${columnWidthsPercent[i]}%">${cell}</td>`
                    )
                    .join("")}</tr>`
              )
              .join("")}
        </tbody>
    </table>`;
  }

  return `[${node.name}:${children}]`;
};
