// src/components/table-view.tsx
import TailwindTable from "@/components/tailwind-table"
import { useStore } from "@/store"
import { AppState } from "@/types/store"

const selector = (state: AppState) => ({
  schema: state.schema,
  uiSchema: state.uiSchema,
  formData: Array.isArray(state.formData) ? state.formData : [state.formData],
  updateFormData: state.updateFormData,
})

export default function TableView() {
  const { schema, uiSchema, formData, updateFormData } = useStore(selector)

  const handleDataChange = (updatedData: any[]) => {
    updateFormData(updatedData)
  }

  return (
    <TailwindTable
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      onChange={handleDataChange}
    />
  )
}