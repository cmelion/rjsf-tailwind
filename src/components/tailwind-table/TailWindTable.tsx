// src/components/tailwind-table/TailwindTable.tsx
import { useMemo, useState, useCallback } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table"
import { RJSFSchema } from "@rjsf/utils"
import { JSONSchema7 } from "json-schema"
import TailwindForm from "@/components/rjsf"
import validator from "@rjsf/validator-ajv8"
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown"
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp"
import { FiPlus } from "@react-icons/all-files/fi/FiPlus"
import { FiTrash2 } from "@react-icons/all-files/fi/FiTrash2"

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

    // Define all handler functions before they're referenced

    const toggleRowExpanded = useCallback((rowId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }))
    }, []);

    const handleDeleteRow = useCallback((index: number) => {
        const updatedData = [...formData]
        updatedData.splice(index, 1)
        onChange(updatedData)
    }, [formData, onChange]);

    const handleRowChange = useCallback((index: number, updatedRowData: any) => {
        const updatedData = [...formData]
        updatedData[index] = updatedRowData
        onChange(updatedData)
    }, [formData, onChange]);

    const handleCreateRow = useCallback((data: any) => {
        onChange([...formData, data.formData])
        setIsCreating(false)
        setNewRowData({})
    }, [formData, onChange]);

    // Generate columns from schema properties
    const columns = useMemo<ColumnDef<any>[]>(() => {
        if (!schema.properties || typeof schema.properties !== 'object') {
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
                    if (typedProp.type === 'boolean') {
                        return value ? '✓' : '✗'
                    } else if (typedProp.type === 'object' || typedProp.type === 'array') {
                        return JSON.stringify(value).substring(0, 50) + '...'
                    } else {
                        return String(value || '')
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
                id: 'actions',
                header: 'Actions',
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
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Data Table</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsCreating(prev => !prev)}
                        className="inline-flex items-center rounded bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                        <FiPlus className="mr-1" /> Add New
                    </button>
                    <div className="dropdown dropdown-end">
                        <button className="rounded border px-3 py-2 text-sm">Columns</button>
                        <div className="dropdown-content z-10 min-w-[200px] rounded-md bg-background p-1 shadow-md">
                            {table.getAllColumns().map(column => {
                                return column.id !== 'actions' ? (
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
                    </div>
                </div>
            </div>

            {/* Column Filters */}
            <div className="flex flex-wrap gap-2">
                {table.getHeaderGroups()[0].headers.map(header => {
                    const column = header.column
                    if (column.id !== 'actions' && column.getCanFilter()) {
                        return (
                            <div key={column.id} className="w-48">
                                <input
                                    type="text"
                                    placeholder={`Filter ${column.id}...`}
                                    value={(column.getFilterValue() as string) ?? ''}
                                    onChange={e => column.setFilterValue(e.target.value)}
                                    className="w-full rounded-md border px-3 py-1 text-sm"
                                />
                            </div>
                        )
                    }
                    return null
                })}
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="rounded-lg border p-4">
                    <div className="mb-2 flex justify-between">
                        <h3 className="text-lg font-medium">Create New Record</h3>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            ✕
                        </button>
                    </div>
                    <TailwindForm
                        schema={schema}
                        uiSchema={uiSchema}
                        formData={newRowData}
                        validator={validator}
                        onChange={(data: any) => setNewRowData(data.formData)}
                        onSubmit={handleCreateRow}
                    />
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <table className="w-full divide-y">
                    <thead className="bg-muted">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 text-left text-sm font-medium"
                                >
                                    {header.isPlaceholder ? null : (
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none flex items-center'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
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
                        table.getRowModel().rows.map(row => (
                            <>
                                <tr
                                    key={row.id}
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-2 text-sm">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                {expandedRows[row.id] && (
                                    <tr key={`${row.id}-expanded`}>
                                        <td colSpan={row.getVisibleCells().length} className="bg-muted/20 p-4">
                                            <div className="rounded border border-border bg-card p-4">
                                                <h3 className="mb-2 text-lg font-medium">Edit Record</h3>
                                                <TailwindForm
                                                    schema={schema}
                                                    uiSchema={uiSchema}
                                                    formData={row.original}
                                                    validator={validator}
                                                    onChange={(data: any) => handleRowChange(row.index, data.formData)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={allColumns.length}
                                className="px-4 py-8 text-center text-muted-foreground"
                            >
                                No records found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}