type SortDirection = "asc" | "desc";

type SortableRecord = Record<string, unknown>;

export function sortData<T extends SortableRecord>(data: T[], key: keyof T, direction: SortDirection): T[] {
  return [...data].sort((first, second) => {
    const firstValue = first[key] ?? "";
    const secondValue = second[key] ?? "";
    const result = String(firstValue).toLowerCase() < String(secondValue).toLowerCase() ? -1 : 1;

    return direction === "asc" ? result : -result;
  });
}
