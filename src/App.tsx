import validator from "@rjsf/validator-ajv8"
import generateSchema from "generate-schema"
import { ReactNode, useState } from "react"
import { useRoutes } from "react-router-dom"
import JsonEditor from "@/components/json-editor"
import {
  FormStyleProvider,
  FormStyleToggle,
  useFormStyle,
} from "@/components/providers/form-style"
import { ThemeProvider } from "@/components/providers/theme/theme-provider.tsx"
import {
  useViewMode,
  ViewModeProvider,
  ViewModeToggle,
} from "@/components/providers/view-mode"
import TailwindForm from "@/components/rjsf"
import Samples from "@/components/samples"
import { SiteHeader } from "@/components/site-header"
import TableView from "@/components/table-view"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { useStore } from "@/store"
import { AppState } from "@/types/store"

const selector = (state: AppState) => ({
  customValidate: state.customValidate,
  formData: state.formData,
  formKey: state.formKey,
  schema: state.schema,
  transformErrors: state.transformErrors,
  uiSchema: state.uiSchema,
  updateFormData: state.updateFormData,
  updateSchema: state.updateSchema,
  updateUiSchema: state.updateUiSchema,
  validateRules: state.validateRules,
  updateValidateRules: state.updateValidateRules,
});

interface ResponsiveContainerProps {
  heading?: string
  actions?: ReactNode
  children: ReactNode
}

const ResponsiveContainer = ({
  heading,
  actions,
  children,
}: ResponsiveContainerProps) => {
  return (
    <div className="flex items-center justify-center [&>div]:w-full">
      <div className="overflow-hidden bg-background sm:rounded-t-lg">
        <div className="flex items-center justify-between border bg-background px-4 py-5 sm:rounded-t-lg sm:px-6">
          <h3 className="text-base font-semibold leading-6">{heading}</h3>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        <>{children}</>
      </div>
    </div>
  )
}

const routes = [{ path: "/", element: <Home /> }]

function Home() {
  const {
    customValidate,
    formData,
    formKey,
    schema,
    transformErrors,
    uiSchema,
    updateFormData,
    updateSchema,
    updateUiSchema,
    validateRules,
    updateValidateRules
  } = useStore(selector);

  const [activeTab, setActiveTab] = useState("schema")

  const { formStyle } = useFormStyle()

  const { viewMode } = useViewMode()

  const handleSchemaChange = (value: string) => {
    try {
      const parsedSchema = JSON.parse(value)
      updateSchema(parsedSchema)
    } catch (e) {
      console.error("Invalid JSON schema:", e)
    }
  }

  const handleUiSchemaChange = (value: string) => {
    try {
      const parsedUiSchema = JSON.parse(value)

      // Validate UI schema for common errors
      const validatedSchema = validateUiSchema(parsedUiSchema)

      updateUiSchema(validatedSchema)
    } catch (e) {
      console.error("Invalid UI schema JSON:", e)
    }
  }

  const handleFormDataChange = (value: string) => {
    try {
      const parsedFormData = JSON.parse(value)
      updateFormData(parsedFormData)
    } catch (e) {
      console.error("Invalid form data JSON:", e)
    }
  }

  const handleGenerateSchemaFromData = () => {
    try {
      // Generate schema from formData
      const generatedSchema = generateSchema.json("Schema", formData)

      // Clean up the generated schema
      delete generatedSchema.$schema

      // If there are properties, make them all required
      if (generatedSchema.properties) {
        generatedSchema.required = Object.keys(generatedSchema.properties)
      }

      // Update the schema in the store
      updateSchema(generatedSchema)

      console.log("Schema generated successfully")
    } catch (error) {
      console.error("Error generating schema:", error)
    }
  }

  const handleValidateRulesChange = (value: string) => {
    try {
      const parsedRules = JSON.parse(value);
      updateValidateRules(parsedRules);
    } catch (e) {
      console.error("Invalid validate rules JSON:", e);
    }
  };

  // Helper function to validate UI schema
  const validateUiSchema = (schema: any): object => {
    // Deep copy to avoid mutating the original
    const result = JSON.parse(JSON.stringify(schema))

    // List of valid widget names
    const validWidgets = [
      "text",
      "textarea",
      "select",
      "checkboxes",
      "radio",
      "hidden",
      "date",
      "datetime",
      "time",
      "color",
      "file",
      "email",
      "uri",
      "data-url",
      "password",
    ]

    // Recursively check and fix widgets
    const validateObject = (obj: any) => {
      if (!obj || typeof obj !== "object") return

      Object.entries(obj).forEach(([key, value]) => {
        // Fix 'ui:widget' entries
        if (key === "ui:widget" && typeof value === "string") {
          if (!validWidgets.includes(value)) {
            console.warn(`Replacing invalid widget "${value}" with "text"`)
            obj[key] = "text" // Replace with default widget
          }
        }
        // Continue recursively
        else if (value && typeof value === "object") {
          validateObject(value)
        }
      })
    }

    validateObject(result)
    return result
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          react-jsonschema-form components <br className="hidden sm:inline" />
          built with Tailwind CSS.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable @rjsf components that you can copy and
          paste into your apps. Free. Open Source. Built with Tailwind CSS.
        </p>
      </div>
      <div className="grid w-full gap-6">
        <Samples />
        <div className="overflow-hidden  border bg-background shadow">
          <div className="items-start justify-center gap-6 p-8 md:grid md:grid-cols-2">
            <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
              <ResponsiveContainer heading="JSON Editors">
                <div className="w-full">
                  {/* Simple tab buttons using Tailwind */}
                  <div className="flex border-b">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "schema" ? "border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => setActiveTab("schema")}
                    >
                      JSON Schema
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "uiSchema" ? "border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => setActiveTab("uiSchema")}
                    >
                      UI Schema
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "validateRules" ? "border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => setActiveTab("validateRules")}
                    >
                      Rules Engine
                    </button>
                  </div>

                  {/* Content panels with conditional visibility */}
                  <div className={`mt-2 h-[calc(100vh/2-48px)] ${activeTab === "schema" ? "" : "hidden"}`}>
                    <JsonEditor
                      editorId="jsonSchemaEditorContainer"
                      jsonData={schema}
                      onChange={handleSchemaChange}
                    />
                  </div>

                  <div className={`mt-2 h-[calc(100vh/2-48px)] ${activeTab === "uiSchema" ? "" : "hidden"}`}>
                    <JsonEditor
                      editorId="uiSchemaEditorContainer"
                      jsonData={uiSchema}
                      onChange={handleUiSchemaChange}
                      editorOptions={{ minimap: { enabled: false }, automaticLayout: true }}
                    />
                  </div>

                  <div className={`mt-2 h-[calc(100vh/2-48px)] ${activeTab === "validateRules" ? "" : "hidden"}`}>
                    <JsonEditor
                      editorId="validateRulesEditorContainer"
                      jsonData={validateRules || []}
                      onChange={handleValidateRulesChange}
                      editorOptions={{ minimap: { enabled: false }, automaticLayout: true }}
                    />
                  </div>
                </div>
              </ResponsiveContainer>

              <ResponsiveContainer
                heading="Form Data"
                actions={
                  <button
                    className="default-button"
                    onClick={handleGenerateSchemaFromData}
                    title="Generate schema from data"
                  >
                    Generate Schema
                  </button>
                }
              >
                <div className="flex h-[calc(100vh/2)] flex-col">
                  <JsonEditor
                    editorId="formDataEditorContainer"
                    jsonData={formData}
                    onChange={handleFormDataChange}
                    editorOptions={{ minimap: { enabled: false }, automaticLayout: true }}
                  />
                </div>
              </ResponsiveContainer>
            </div>
            <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
              <ResponsiveContainer
                heading="Tailwind Form"
                actions={
                  <>
                    <FormStyleToggle />
                    <ViewModeToggle />
                  </>
                }
              >
                <div className="flex flex-col">
                  <div
                    className={`border ${formStyle}`}
                    style={{
                      padding: 20,
                    }}
                  >
                    {viewMode === "form" ? (
                      <TailwindForm
                        key={formKey}
                        noHtml5Validate
                        schema={schema}
                        uiSchema={uiSchema}
                        formData={formData}
                        customValidate={customValidate}
                        transformErrors={transformErrors}
                        validator={validator}
                        onChange={(data: any) => {
                          updateFormData(data.formData);
                        }}
                      />
                    ) : (
                      <TableView />
                    )}
                  </div>
                </div>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const children = useRoutes(routes)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FormStyleProvider>
        <ViewModeProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
          </div>
          <TailwindIndicator />
        </ViewModeProvider>
      </FormStyleProvider>
    </ThemeProvider>
  )
}

export default App
