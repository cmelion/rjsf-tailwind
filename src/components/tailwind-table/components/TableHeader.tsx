// src/components/tailwind-table/components/TableHeader.tsx
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown"
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp"
import { FiPlus } from "@react-icons/all-files/fi/FiPlus"
import { Table } from "@tanstack/react-table"
import { useId } from "react"

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
  const columnMenuId = useId();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Data Table</h2>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleCreateForm}
          className="default-button"
          aria-label="Add new record"
        >
          <FiPlus className="mr-1" aria-hidden="true" /> Add New
        </button>
        <div className="relative">
          <button
            onClick={toggleColumnSelector}
            className="default-button"
            aria-expanded={isColumnSelectorOpen}
            aria-controls={columnMenuId}
            aria-haspopup="true"
          >
            Columns{" "}
            {isColumnSelectorOpen ? (
              <FiChevronUp className="ml-1" aria-hidden="true" />
            ) : (
              <FiChevronDown className="ml-1" aria-hidden="true" />
            )}
          </button>

          {isColumnSelectorOpen && (
            <div
              id={columnMenuId}
              className="absolute right-0 top-full z-10 mt-1 min-w-[200px] rounded-md border bg-background p-2 shadow-md"
              role="menu"
            >
              {table.getAllColumns().map((column) => {
                if (column.id !== "actions") {
                  const checkboxId = `column-toggle-${column.id}`;
                  return (
                    <div key={column.id} className="px-2 py-1" role="menuitemcheckbox">
                      <label className="flex items-center" htmlFor={checkboxId}>
                        <input
                          id={checkboxId}
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          className="mr-2"
                          aria-label={`Show ${column.id} column`}
                        />
                        {column.id}
                      </label>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}