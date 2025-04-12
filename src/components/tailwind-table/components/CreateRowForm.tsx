// src/components/tailwind-table/components/CreateRowForm.tsx
import { JSONSchema7 } from "json-schema"
import { RJSFSchema } from "@rjsf/utils"
import TailwindForm from "@/components/rjsf"
import validator from "@rjsf/validator-ajv8"
import { IChangeEvent } from "@/components/rjsf/Form/Form"
import { createElement } from "react"

interface CreateRowFormProps {
  schema: JSONSchema7 | RJSFSchema
  uiSchema?: object
  formData: any
  setFormData: (data: any) => void
  onSubmit: (data: IChangeEvent) => void
  onClose: () => void
}

export function CreateRowForm({
                                schema,
                                uiSchema,
                                formData,
                                setFormData,
                                onSubmit,
                                onClose,
                              }: CreateRowFormProps) {
  // Create strongly typed props
  const formProps = {
    schema: schema as RJSFSchema,
    uiSchema,
    formData,
    validator,
    onChange: (e: IChangeEvent) => setFormData(e.formData),
    onSubmit
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex justify-between">
        <h3 className="text-lg font-medium">Create New Record</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      {createElement(TailwindForm, formProps as any)}
    </div>
  )
}