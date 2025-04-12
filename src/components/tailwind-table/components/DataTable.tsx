// src/components/tailwind-table/components/DataTable.tsx
import { Table, flexRender } from "@tanstack/react-table"
import { Fragment } from "react"
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
  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full divide-y">
        <thead className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-medium"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, index) => (
              <Fragment key={row.id || `row-${index}`}>
                <tr className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
                {expandedRows[row.id] && (
                  <tr>
                    <td
                      colSpan={row.getVisibleCells().length}
                      className="bg-muted/20 p-4"
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
            <tr>
              <td
                colSpan={columnsLength}
                className="px-4 py-8 text-center text-muted-foreground"
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