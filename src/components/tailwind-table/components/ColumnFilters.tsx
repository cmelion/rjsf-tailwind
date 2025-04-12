// src/components/tailwind-table/components/ColumnFilters.tsx
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown"
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp"
import { Table } from "@tanstack/react-table"
import { useId } from "react"

interface ColumnFiltersProps {
  isFiltersOpen: boolean
  toggleFilters: () => void
  table: Table<any>
}

export function ColumnFilters({
                                isFiltersOpen,
                                toggleFilters,
                                table,
                              }: ColumnFiltersProps) {
  const headerId = useId();
  const regionId = useId();

  return (
    <div className="border-b">
      <button
        onClick={toggleFilters}
        className="flex w-full items-center justify-between bg-muted px-4 py-2 text-left text-sm font-medium"
        aria-expanded={isFiltersOpen}
        aria-controls={regionId}
        id={headerId}
      >
        <span>Column Filters</span>
        {isFiltersOpen ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
      </button>

      {isFiltersOpen && (
        <div
          className="border-b bg-background px-4 py-3"
          role="region"
          id={regionId}
          aria-labelledby={headerId}
        >
          <div className="flex flex-wrap gap-2">
            {table.getHeaderGroups()[0].headers.map((header) => {
              const column = header.column
              if (column.id !== "actions" && column.getCanFilter()) {
                const columnId = `filter-${column.id}`;
                const labelId = `${columnId}-label`;

                return (
                  <div key={column.id} className="w-48">
                    <label
                      id={labelId}
                      htmlFor={columnId}
                      className="sr-only"
                    >
                      Filter {column.id}
                    </label>
                    <input
                      id={columnId}
                      type="text"
                      placeholder={`Filter ${column.id}...`}
                      value={(column.getFilterValue() as string) ?? ""}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground"
                      aria-labelledby={labelId}
                    />
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      )}
    </div>
  )
}