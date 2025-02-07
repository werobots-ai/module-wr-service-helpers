// pageUtils.ts

type Range = {
  from?: number;
  to?: number;
};

// Parses a string into an array of range objects
const parseStringToRanges = (input: string, totalPages: number): Range[] => {
  const trimmedInput = input.trim();

  if (trimmedInput.toLowerCase() === "all" || trimmedInput === "") {
    return [{ from: 1, to: totalPages }];
  }

  const parts = trimmedInput.split(",");
  let ranges: Range[] = [];

  parts.forEach((part) => {
    part = part.trim();

    if (part.toLowerCase() === "all") {
      ranges = [{ from: 1, to: totalPages }];
      return;
    }

    let from: number | undefined;
    let to: number | undefined;

    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      from = startStr ? parseInt(startStr, 10) : undefined;
      to = endStr ? parseInt(endStr, 10) : undefined;
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page)) {
        from = to = page;
      }
    }

    ranges.push({ from, to });
  });

  return ranges;
};

// Expands an array of ranges into an array of page numbers
const expandRangesToPages = (ranges: Range[], totalPages: number): number[] => {
  const pages: number[] = [];

  ranges.forEach((range) => {
    let from = range.from !== undefined ? range.from : 1;
    let to = range.to !== undefined ? range.to : totalPages;

    if (from > to) [from, to] = [to, from];

    for (let i = from; i <= to; i++) {
      pages.push(i);
    }
  });

  return pages;
};

// Removes duplicate numbers from an array
const removeDuplicates = (numbers: number[]): number[] => {
  return Array.from(new Set(numbers));
};

// Sorts numbers in ascending order
const sortNumbers = (numbers: number[]): number[] => {
  return numbers.sort((a, b) => a - b);
};

// Compresses an array of page numbers into ranges
const compressPagesToRanges = (pages: number[]): Range[] => {
  if (pages.length === 0) return [];

  const ranges: Range[] = [];
  let start = pages[0];
  let end = pages[0];

  for (let i = 1; i <= pages.length; i++) {
    if (pages[i] === end + 1) {
      end = pages[i];
    } else {
      ranges.push({ from: start, to: end });
      start = pages[i];
      end = pages[i];
    }
  }

  return ranges;
};

// Converts an array of ranges into a string
const stringifyRanges = (ranges: Range[], totalPages?: number): string => {
  if (ranges.length === 1) {
    return `${ranges[0].from || 1}-${ranges[0].to || totalPages || ""}`;
  }

  const parts = ranges.map((range) => {
    const fromStr = range.from !== undefined ? range.from.toString() : "";
    const toStr = range.to !== undefined ? range.to.toString() : "";

    if (range.from === range.to) {
      return fromStr;
    } else if (range.from !== undefined && range.to !== undefined) {
      return `${fromStr}-${toStr}`;
    } else if (range.from === undefined) {
      return `-${toStr}`;
    } else if (range.to === undefined) {
      return `${fromStr}-`;
    }
    return "";
  });

  return parts.join(", ");
};

// Merges overlapping and adjacent ranges
const mergeOverlappingRanges = (ranges: Range[]): Range[] => {
  if (ranges.length === 0) return [];

  ranges.sort((a, b) => (a.from || 0) - (b.from || 0));

  const merged: Range[] = [];
  let prev = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const current = ranges[i];
    const prevTo = prev.to !== undefined ? prev.to : Infinity;
    const currentFrom = current.from !== undefined ? current.from : -Infinity;

    if (currentFrom <= prevTo + 1) {
      prev.to = Math.max(prevTo, current.to || prevTo);
    } else {
      merged.push(prev);
      prev = current;
    }
  }

  merged.push(prev);
  return merged;
};

// Validates and adjusts range bounds
const validateRangeBounds = (ranges: Range[], totalPages: number): Range[] => {
  return ranges.map((range) => {
    let from = range.from !== undefined ? Math.max(1, range.from) : 1;
    let to =
      range.to !== undefined ? Math.min(totalPages, range.to) : totalPages;
    if (from > to) [from, to] = [to, from];
    return { from, to };
  });
};

// Converts a string to JSON format (array of ranges)
const stringToJson = (input: string, totalPages: number): Range[] => {
  let ranges = parseStringToRanges(input, totalPages);
  ranges = validateRangeBounds(ranges, totalPages);
  ranges = mergeOverlappingRanges(ranges);
  return ranges;
};

// Converts JSON format (array of ranges) to an array of page numbers
const jsonToPages = (ranges: Range[], totalPages: number): number[] => {
  let pages = expandRangesToPages(ranges, totalPages);
  pages = removeDuplicates(pages);
  pages = sortNumbers(pages);
  return pages;
};

// Converts an array of page numbers to JSON format (array of ranges)
const pagesToJson = (pages: number[]): Range[] => {
  pages = removeDuplicates(pages);
  pages = sortNumbers(pages);
  const ranges = compressPagesToRanges(pages);
  return ranges;
};

// Converts JSON format (array of ranges) to a string
const jsonToString = (ranges: Range[], totalPages?: number): string => {
  ranges = mergeOverlappingRanges(ranges);
  return stringifyRanges(ranges, totalPages);
};

export const pagesStringToPageNumbers = (
  input: string,
  totalPages: number
): number[] => {
  const ranges = stringToJson(input, totalPages);
  return jsonToPages(ranges, totalPages);
};

export const pageNumbersToPagesString = (
  pages: number[],
  totalPages?: number
) => {
  const ranges = pagesToJson(pages);
  return jsonToString(ranges, totalPages);
};
