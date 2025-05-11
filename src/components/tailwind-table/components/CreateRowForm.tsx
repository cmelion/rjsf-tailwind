import { JSONSchema7 } from "json-schema";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import TailwindForm from "@/components/rjsf";
import validator from "@rjsf/validator-ajv8";
import { IChangeEvent } from "@/components/rjsf/form/";
import { createElement, useId } from "react";

interface CreateRowFormProps {
  schema: JSONSchema7 | RJSFSchema;
  uiSchema?: UiSchema & {
    "ui:options"?: {
      [key: string]: unknown; // Define specific keys here if types are known
    };
  };
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (data: IChangeEvent) => void;
  onClose: () => void;
}

export function CreateRowForm({
                                schema,
                                uiSchema,
                                formData,
                                setFormData,
                                onSubmit,
                                onClose,
                              }: CreateRowFormProps) {
  const formId = useId();
  const titleId = useId();

  // Create strongly typed props
  const formProps = {
    schema: schema as RJSFSchema,
    uiSchema,
    formData,
    validator,
    onChange: (e: IChangeEvent) => setFormData(e.formData),
    onSubmit,
    // Add custom UI options to improve accessibility
    uiOptions: {
      ...(uiSchema?.["ui:options"] || {}),
      submitButtonOptions: {
        props: {
          "aria-label": "Create record",
        },
      },
    },
    id: formId,
  };

  return (
    <div
      className="rounded-lg border p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="mb-2 flex justify-between">
        <h3 id={titleId} className="text-lg font-medium">
          Create New Record
        </h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Close form"
        >
          ✕
        </button>
      </div>
      {createElement(TailwindForm, formProps as any)}
    </div>
  );
}