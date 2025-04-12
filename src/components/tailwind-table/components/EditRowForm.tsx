import { JSONSchema7 } from "json-schema"
import { RJSFSchema, UiSchema } from "@rjsf/utils"
import TailwindForm from "@/components/rjsf"
import validator from "@rjsf/validator-ajv8"
import { IChangeEvent } from "@/components/rjsf/Form/Form"
import { createElement, useId } from "react"

interface EditRowFormProps {
  schema: JSONSchema7 | RJSFSchema
  uiSchema?: UiSchema
  formData: any
  rowIndex: number
  onRowChange: (index: number, data: any) => void
}

export function EditRowForm({
                              schema,
                              uiSchema,
                              formData,
                              rowIndex,
                              onRowChange,
                            }: EditRowFormProps) {
  const titleId = useId();
  const formId = useId();

  // Create strongly typed props
  const formProps = {
    schema: schema as RJSFSchema,
    uiSchema,
    formData,
    validator,
    onChange: (e: IChangeEvent) => {
      onRowChange(rowIndex, e.formData);
    },
    id: formId,
    "aria-labelledby": titleId
  };

  return (
    <div
      className="rounded border border-border bg-card p-4"
      role="region"
      aria-label="Edit record form"
    >
      <h3 id={titleId} className="mb-2 text-lg font-medium">Edit Record</h3>
      {/* Silence type errors with a specific cast when rendering */}
      {createElement(TailwindForm, formProps as any)}
    </div>
  )
}