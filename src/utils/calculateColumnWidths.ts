export type Schema = {
  key: string;
  label: string;
  type: "string" | "number" | "boolean";
  format: string | null;
  description: string;
  required: boolean;
  units_and_range: string | null;
}[];

export const calculateColumnWidths = ({
  header,
  rows,
  schema,
  maxTableWidth = 500,
}: {
  header: string[];
  rows: string[][];
  schema: Schema;
  maxTableWidth?: number;
}) => {
  const minRequiredColumnWidths = schema.map((field, index) => {
    const column = [header, ...rows].map((row) => row[index]);
    return (
      column.reduce(
        (a, b) =>
          Math.max(
            a,
            (typeof b === "number"
              ? (b as number).toString()
              : typeof b === "boolean"
              ? b
                ? "Yes"
                : "No"
              : b === null
              ? ""
              : b.toString()
            )
              .split(/\s+/)
              .reduce((a, b) => Math.max(a, b.length), 0)
          ),
        0
      ) + 2
    );
  });

  if (rows.length === 0) {
    return minRequiredColumnWidths;
  }

  const maxColumnWidths = schema.map((_, index) => {
    const column = rows.map((row) => row[index]);
    return Math.max(
      minRequiredColumnWidths[index],
      column.reduce(
        (a, b) =>
          Math.max(
            a,
            (
              (typeof b === "number"
                ? (b as number).toString()
                : typeof b === "boolean"
                ? b
                  ? "Yes"
                  : "No"
                : b === null
                ? ""
                : b.toString()
              ).toString() || ""
            ).length
          ),
        0
      )
    );
  });

  const avgColumnWidthsNoHeader = header.map((h, index) => {
    const column = rows.map((row) => row[index]);
    return (
      column.reduce(
        (a, b) =>
          a +
          (
            (typeof b === "number"
              ? (b as number).toString()
              : typeof b === "boolean"
              ? b
                ? "Yes"
                : "No"
              : b === null
              ? ""
              : b.toString()
            ).toString() || ""
          ).length,
        0
      ) / column.length
    );
  });

  const halfOfRowCount = rows.length / 2;

  let columnWidths = [...avgColumnWidthsNoHeader];
  let numberOfRowsOverAveragePerColumn: number[];

  while (true) {
    numberOfRowsOverAveragePerColumn = header.map((h, index) => {
      const column = rows.map((row) => row[index]);
      return column.filter(
        (cell) =>
          (
            (typeof cell === "number"
              ? (cell as number).toString()
              : typeof cell === "boolean"
              ? cell
                ? "Yes"
                : "No"
              : cell === null
              ? ""
              : cell.toString()
            ).toString() || ""
          ).length > columnWidths[index]
      ).length;
    });

    if (
      maxTableWidth &&
      !numberOfRowsOverAveragePerColumn.some((n) => n > halfOfRowCount) &&
      columnWidths.reduce((a, b) => a + b) + schema.length * 3 + 1 >=
        maxTableWidth
    )
      break;

    const columnIndexWithHighestNumberOfRowsOverAverage =
      numberOfRowsOverAveragePerColumn.reduce((acc, cur, i) => {
        if (acc === -1 || cur > numberOfRowsOverAveragePerColumn[acc]) {
          return i;
        }

        return acc;
      }, -1);

    if (columnIndexWithHighestNumberOfRowsOverAverage === -1) break;

    columnWidths[columnIndexWithHighestNumberOfRowsOverAverage] += 1;
  }

  const multiplier = maxTableWidth / columnWidths.reduce((a, b) => a + b);

  columnWidths = columnWidths.map((w, i) =>
    Math.max(
      Math.min(Math.round(w * multiplier), maxColumnWidths[i]),
      minRequiredColumnWidths[i]
    )
  );

  while (columnWidths.reduce((a, b) => a + b) > maxTableWidth) {
    const colsTatCanBeReduced = columnWidths
      .map((w, i) => (w > minRequiredColumnWidths[i] ? i : -1))
      .filter((i) => i !== -1);

    if (!colsTatCanBeReduced.length) break;

    const longestReducableCol = colsTatCanBeReduced.reduce((a, b) =>
      columnWidths[a] > columnWidths[b] ? a : b
    );

    columnWidths[longestReducableCol] -= 1;
  }

  while (
    columnWidths.reduce((a, b) => a + b) < maxTableWidth &&
    columnWidths.some((w, i) => w < maxColumnWidths[i])
  ) {
    const colsThatNeedExtending = columnWidths
      .map((w, i) => (w < maxColumnWidths[i] ? i : -1))
      .filter((i) => i !== -1);
    colsThatNeedExtending.forEach((index) => {
      columnWidths[index] += 1;
    });
  }

  return columnWidths;
};
