import generateSchema from "generate-schema"
import TailwindForm from "@/components/rjsf"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import validator from "@rjsf/validator-ajv8"
import { useRoutes } from "react-router-dom"
import JsonEditor from "./components/json-editor"
import Samples from "./components/samples"
import { TailwindIndicator } from "./components/tailwind-indicator"
import { useStore } from "./store"
import { AppState } from "./types/store"

const selector = (state: AppState) => ({
  schema: state.schema,
  uiSchema: state.uiSchema,
  formData: state.formData,
  updateSchema: state.updateSchema,
  updateUiSchema: state.updateUiSchema,
  updateFormData: state.updateFormData,
})

const ResponsiveContainer = ({ heading, children, actions }: any) => {
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
    schema,
    uiSchema,
    formData,
    updateSchema,
    updateUiSchema,
    updateFormData,
  } = useStore(selector)

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
              <ResponsiveContainer heading="JSON Schema">
                <div className="flex h-[calc(100vh/2)] flex-col">
                  <JsonEditor
                    editorId="jsonSchemaEditorContainer"
                    jsonData={schema}
                    onChange={handleSchemaChange}
                  />
                </div>
              </ResponsiveContainer>
              <div>
                <div className="grid grid-cols-1 items-start justify-center gap-6 md:grid md:grid-cols-2">
                  <ResponsiveContainer heading="UI Schema">
                    <div className="flex h-[calc(100vh/3)] flex-col">
                      <JsonEditor
                        editorId="uiSchemaEditorContainer"
                        jsonData={uiSchema}
                        onChange={handleUiSchemaChange}
                      />
                    </div>
                  </ResponsiveContainer>
                  <ResponsiveContainer
                    heading="Form Data"
                    actions={
                      <button
                        className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                        onClick={handleGenerateSchemaFromData}
                        title="Generate schema from data"
                      >
                        Generate Schema
                      </button>
                    }
                  >
                    <div className="flex h-[calc(100vh/3)] flex-col">
                      <JsonEditor
                        editorId="formDataEditorContainer"
                        jsonData={formData}
                        onChange={handleFormDataChange}
                      />
                    </div>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
              <ResponsiveContainer heading="Tailwind Form">
                <div className="flex flex-col">
                  <div
                    className="border"
                    style={{
                      padding: 20,
                    }}
                  >
                    <TailwindForm
                      noHtml5Validate
                      schema={schema}
                      uiSchema={uiSchema}
                      formData={formData}
                      validator={validator}
                      onChange={(data: any) => {
                        updateFormData(data.formData)
                      }}
                    />
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
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
      </div>
      <TailwindIndicator />
    </ThemeProvider>
  )
}

export default App
