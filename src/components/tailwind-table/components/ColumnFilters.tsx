// src/components/tailwind-table/components/ColumnFilters.tsx
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown"
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp"
import { Table } from "@tanstack/react-table"

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
  return (
    <div className="border-b">
      <button
        onClick={toggleFilters}
        className="flex w-full items-center justify-between bg-muted px-4 py-2 text-left text-sm font-medium"
      >
        <span>Column Filters</span>
        {isFiltersOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {isFiltersOpen && (
        <div className="border-b bg-background px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {table.getHeaderGroups()[0].headers.map((header) => {
              const column = header.column
              if (column.id !== "actions" && column.getCanFilter()) {
                return (
                  <div key={column.id} className="w-48">
                    <input
                      type="text"
                      placeholder={`Filter ${column.id}...`}
                      value={(column.getFilterValue() as string) ?? ""}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground"
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