// src/components/tailwind-table/components/TableHeader.tsx
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown"
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp"
import { FiPlus } from "@react-icons/all-files/fi/FiPlus"
import { Table } from "@tanstack/react-table"

interface TableHeaderProps {
  toggleCreateForm: () => void
  isColumnSelectorOpen: boolean
  toggleColumnSelector: () => void
  table: Table<any>
}

export function TableHeader({
  toggleCreateForm,
  isColumnSelectorOpen,
  toggleColumnSelector,
  table,
}: TableHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Data Table</h2>
      <div className="flex items-center space-x-2">
        <button onClick={toggleCreateForm} className="default-button">
          <FiPlus className="mr-1" /> Add New
        </button>
        <div className="relative">
          <button onClick={toggleColumnSelector} className="default-button">
            Columns{" "}
            {isColumnSelectorOpen ? (
              <FiChevronUp className="ml-1" />
            ) : (
              <FiChevronDown className="ml-1" />
            )}
          </button>

          {isColumnSelectorOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-[200px] rounded-md border bg-background p-2 shadow-md">
              {table.getAllColumns().map((column) => {
                return column.id !== "actions" ? (
                  <div key={column.id} className="px-2 py-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="mr-2"
                      />
                      {column.id}
                    </label>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}