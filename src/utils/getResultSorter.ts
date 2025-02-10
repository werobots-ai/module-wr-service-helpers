export const getResultSorter = (
  sort_by: string = "relevance_score",
  sort_order: "asc" | "desc" = "asc"
) => {
  if (sort_order.toLowerCase().includes("desc"))
    return (a: any, b: any) => {
      if (!isNaN(Number(a[sort_by])) && !isNaN(Number(b[sort_by]))) {
        return Number(a[sort_by]) > Number(b[sort_by])
          ? -1
          : Number(a[sort_by]) < Number(b[sort_by])
          ? 1
          : 0;
      }

      const lowerA = (a[sort_by] || "").toString().toLowerCase();
      const lowerB = (b[sort_by] || "").toString().toLowerCase();

      return lowerA < lowerB ? 1 : lowerA > lowerB ? -1 : 0;
    };

  return (a: any, b: any) => {
    if (!isNaN(Number(a[sort_by])) && !isNaN(Number(b[sort_by]))) {
      return Number(a[sort_by]) < Number(b[sort_by])
        ? -1
        : Number(a[sort_by]) > Number(b[sort_by])
        ? 1
        : 0;
    }

    const lowerA = (a[sort_by] || "").toString().toLowerCase();
    const lowerB = (b[sort_by] || "").toString().toLowerCase();

    return lowerA > lowerB ? 1 : lowerA < lowerB ? -1 : 0;
  };
};
