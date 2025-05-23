// src/components/tailwind-table/components/DataTable.tsx
import { Table, flexRender } from "@tanstack/react-table"
import { Fragment, useId } from "react"
import { JSONSchema7 } from "json-schema"
import { RJSFSchema } from "@rjsf/utils"
import { EditRowForm } from "./EditRowForm"

interface DataTableProps {
  table: Table<any>
  expandedRows: Record<string, boolean>
  toggleRowExpanded: (rowId: string) => void
  handleDeleteRow: (index: number) => void
  handleRowChange: (index: number, data: any) => void
  schema: JSONSchema7 | RJSFSchema
  uiSchema?: object
  columnsLength: number
}

export function DataTable({
                            table,
                            expandedRows,
                            handleRowChange,
                            schema,
                            uiSchema,
                            columnsLength,
                          }: DataTableProps) {
  const tableId = useId();
  const captionId = useId();

  return (
    <div className="border-bg-muted overflow-x-auto border">
      <table
        id={tableId}
        className="w-full divide-y"
        aria-labelledby={captionId}
        role="grid"
      >
        <caption id={captionId} className="sr-only">Data records table</caption>
        <thead className="bg-muted">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} role="row">
            {headerGroup.headers.map((header) => {
              const isSorted = header.column.getIsSorted();

              return (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-medium"
                  scope="col"
                  role="columnheader"
                  aria-sort={isSorted ? (isSorted === "asc" ? "ascending" : "descending") : "none"}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                        role: header.column.getCanSort() ? "button" : undefined,
                        "aria-label": header.column.getCanSort()
                          ? `Sort by ${header.column.columnDef.header?.toString() || header.id}`
                          : undefined,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {isSorted && (
                        <span aria-hidden="true">
                            {isSorted === "asc" ? " 🔼" : " 🔽"}
                          </span>
                      )}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
        </thead>
        <tbody className="divide-y" role="rowgroup">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row, index) => (
            <Fragment key={row.id || `row-${index}`}>
              <tr className="hover:bg-muted/50" role="row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm" role="cell">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </td>
                ))}
              </tr>
              {expandedRows[row.id] && (
                <tr aria-label="Edit form row" role="row">
                  <td
                    colSpan={row.getVisibleCells().length}
                    className="bg-muted/20 p-4"
                    role="cell"
                  >
                    <EditRowForm
                      schema={schema}
                      uiSchema={uiSchema}
                      formData={row.original}
                      rowIndex={row.index}
                      onRowChange={handleRowChange}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          ))
        ) : (
          <tr role="row">
            <td
              colSpan={columnsLength}
              className="px-4 py-8 text-center text-muted-foreground"
              role="cell"
            >
              No records found
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}