// src/components/tailwind-table/TailwindTable.tsx
import { RJSFSchema } from "@rjsf/utils"
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { JSONSchema7 } from "json-schema"
import { useCallback, useMemo, useState } from "react"
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown"
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp"
import { FiTrash2 } from "@react-icons/all-files/fi/FiTrash2"
import { IChangeEvent } from "@/components/rjsf/Form/Form"
import { TableHeader, ColumnFilters, CreateRowForm, DataTable } from "./components"

interface TailwindTableProps {
  schema: JSONSchema7 | RJSFSchema
  uiSchema?: object
  formData: any[]
  onChange: (data: any) => void
}

export default function TailwindTable({
  schema,
  uiSchema,
  formData,
  onChange,
}: TailwindTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [isCreating, setIsCreating] = useState(false)
  const [newRowData, setNewRowData] = useState({})
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)

  // Handler functions
  const toggleRowExpanded = useCallback((rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }))
  }, [])

  const handleDeleteRow = useCallback(
    (index: number) => {
      const updatedData = [...formData]
      updatedData.splice(index, 1)
      onChange(updatedData)
    },
    [formData, onChange],
  )

  const handleRowChange = useCallback(
    (index: number, updatedRowData: any) => {
      const updatedData = [...formData]
      updatedData[index] = updatedRowData
      onChange(updatedData)
    },
    [formData, onChange],
  )

  const handleCreateRow = useCallback(
    (data: IChangeEvent) => {
      onChange([...formData, data.formData])
      setIsCreating(false)
      setNewRowData({})
    },
    [formData, onChange],
  )

  // Generate columns from schema properties
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!schema.properties || typeof schema.properties !== "object") {
      return []
    }

    return Object.entries(schema.properties).map(([key, prop]) => {
      const typedProp = prop as JSONSchema7

      return {
        id: key,
        accessorKey: key,
        header: typedProp.title || key,
        cell: ({ row }) => {
          const value = row.getValue(key)

          // Format display based on property type
          if (typedProp.type === "boolean") {
            return value ? "✓" : "✗"
          } else if (
            typedProp.type === "object" ||
            typedProp.type === "array"
          ) {
            return JSON.stringify(value).substring(0, 50) + "..."
          } else {
            return String(value || "")
          }
        },
      }
    })
  }, [schema])

  // Add action column
  const allColumns = useMemo<ColumnDef<any>[]>(() => {
    return [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => toggleRowExpanded(row.id)}
              className="p-1 text-primary hover:text-primary/80"
              title={expandedRows[row.id] ? "Collapse row" : "Expand row"}
            >
              {expandedRows[row.id] ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <button
              onClick={() => handleDeleteRow(row.index)}
              className="p-1 text-destructive hover:text-destructive/80"
              title="Delete row"
            >
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ]
  }, [columns, expandedRows, handleDeleteRow, toggleRowExpanded])

  const table = useReactTable({
    data: formData,
    columns: allColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full space-y-4">
      <TableHeader
        toggleCreateForm={() => setIsCreating((prev) => !prev)}
        isColumnSelectorOpen={isColumnSelectorOpen}
        toggleColumnSelector={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
        table={table}
      />

      <ColumnFilters
        isFiltersOpen={isFiltersOpen}
        toggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
        table={table}
      />

      {isCreating && (
        <CreateRowForm
          schema={schema}
          uiSchema={uiSchema}
          formData={newRowData}
          setFormData={setNewRowData}
          onSubmit={handleCreateRow}
          onClose={() => setIsCreating(false)}
        />
      )}

      <DataTable
        table={table}
        expandedRows={expandedRows}
        toggleRowExpanded={toggleRowExpanded}
        handleDeleteRow={handleDeleteRow}
        handleRowChange={handleRowChange}
        schema={schema}
        uiSchema={uiSchema}
        columnsLength={allColumns.length}
      />
    </div>
  )
}