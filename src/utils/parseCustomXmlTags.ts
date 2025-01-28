import { Node } from "./XmlStreamReplacer";
import { calculateColumnWidths } from "./calculateColumnWidths";
import { getResultSorter } from "./getResultSorter";

const PAGE_KEYS = [
  "page",
  "pages",
  "page_number",
  "page_numbers",
  "page_no",
  "page_nos",
  "page_num",
  "page_nums",
];

const getStyledArrow = (sortOrder: "asc" | "desc") =>
  ` ${sortOrder.toLowerCase().includes("desc") ? "▲" : "▼"}`;

export const parseCustomXmlTags = async (
  node: Node,
  getSearch: any
): Promise<string> => {
  if (node.type === "text") return node.text || "";
  const children = await Promise.all(
    node.children?.map((node) => parseCustomXmlTags(node, getSearch)) || []
  );

  if (node.name === "data-result-table") {
    const { id, "sort-by": sortBy, "sort-order": sortOrder } = node.attributes;
    const data = await getSearch({
      id,
      includeResults: true,
    });

    const schema = data.schema
      .filter(({ key }: any) => key !== "relevance_score")
      .sort((a: any, b: any) => {
        if (a.key === sortBy) return -1;
        if (b.key === sortBy) return 1;

        if (a.key === "title") return -1;
        if (b.key === "title") return 1;

        if (a.key.includes("date")) return -1;
        if (b.key.includes("date")) return 1;

        if (PAGE_KEYS.includes(a.key)) return -1;
        if (PAGE_KEYS.includes(b.key)) return 1;

        return 0;
      });

    const header = schema.map(
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
        schema.map((field: { key: string }) =>
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
      schema,
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
                        `<td style="padding: 4px; width: ${
                          columnWidthsPercent[i]
                        }%">${
                          PAGE_KEYS.includes(schema[i].key)
                            ? `[${cell}](/assets/pages?p=${cell})`
                            : cell
                        }</td>`
                    )
                    .join("")}</tr>`
              )
              .join("")}
        </tbody>
    </table>`;
  }

  if (node.name === "data-page-view") {
    const { workspace, file, page } = node.attributes;

    return `<img src="/api/workspace/workspace/${workspace}/file/${encodeURIComponent(
      file
    )}/page/${page}" alt="Page ${page}" />`;
  }

  return `[${node.name}:${children}]`;
};
