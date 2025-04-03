import {
  canExpand,
  descriptionId,
  FormContextType,
  getTemplate,
  getUiOptions,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
  titleId,
} from "@rjsf/utils"

// Define Tailwind-specific grid widths
const GRID_SIZES: Record<string, string> = {
  full: "w-full",
  half: "w-1/2",
  third: "w-1/3",
  "two-thirds": "w-2/3",
  quarter: "w-1/4",
  "three-quarters": "w-3/4",
  "1/5": "w-1/5",
  "2/5": "w-2/5",
  "3/5": "w-3/5",
  "4/5": "w-4/5",
  // Add more if needed
};

// For backward compatibility with xs values
const XS_TO_TAILWIND: Record<number, string> = {
  3: "quarter",
  4: "third",
  6: "half",
  8: "two-thirds",
  9: "three-quarters",
  12: "full",
};

export default function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
    description,
    title,
    properties,
    required,
    uiSchema,
    idSchema,
    schema,
    formData,
    onAddClick,
    disabled,
    readonly,
    registry,
  }: ObjectFieldTemplateProps<T, S, F>) {
  const uiOptions = getUiOptions<T, S, F>(uiSchema)
  const TitleFieldTemplate = getTemplate<"TitleFieldTemplate", T, S, F>(
    "TitleFieldTemplate",
    registry,
    uiOptions,
  )
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, uiOptions)
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates

  // Check if grid layout is requested (with null safety check)
  const useGridLayout = uiSchema && (uiSchema as Record<string, any>)["ui:gridLayout"] === true;

  return (
    <>
      {title && (
        <TitleFieldTemplate
          id={titleId<T>(idSchema)}
          title={title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {description && (
        <DescriptionFieldTemplate
          id={descriptionId<T>(idSchema)}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {useGridLayout ? (
        // Grid layout implementation
        <div className="-mx-2 flex flex-wrap">
          {properties.map((element: any, index: number) => {
            // Check for Tailwind-specific width with null safety checks
            const elementUiSchema = element.content.props.uiSchema as Record<string, any> | undefined;
            let width: string | undefined;

            if (elementUiSchema && "tw:width" in elementUiSchema) {
              width = elementUiSchema["tw:width"] as string;
            }

            // For backward compatibility, check xs if tw:width is not present
            if (!width && elementUiSchema && "xs" in elementUiSchema) {
              const xsValue = elementUiSchema.xs as number;
              width = XS_TO_TAILWIND[xsValue] || "full";
            }

            // Get the corresponding Tailwind class
            const widthClass = width && width in GRID_SIZES ? GRID_SIZES[width] : GRID_SIZES.full;

            return (
              <div
                key={index}
                className={`mb-4 px-2 ${widthClass} ${element.hidden ? "hidden" : ""}`}
              >
                {element.content}
              </div>
            );
          })}
          {canExpand(schema, uiSchema, formData) ? (
            <div className="flex w-full px-2">
              <div className="ml-auto w-1/4 py-4">
                <AddButton
                  onClick={onAddClick(schema)}
                  disabled={disabled || readonly}
                  className="object-property-expand"
                  uiSchema={uiSchema}
                  registry={registry}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        // Original layout implementation
        <div className="p-0">
          {properties.map((element: any, index: number) => (
            <div
              key={index}
              className={`${element.hidden ? "hidden" : ""} mb-2.5 flex`}
            >
              <div className="w-full"> {element.content}</div>
            </div>
          ))}
          {canExpand(schema, uiSchema, formData) ? (
            <div className="flex">
              <div className="ml-auto w-1/4 py-4">
                <AddButton
                  onClick={onAddClick(schema)}
                  disabled={disabled || readonly}
                  className="object-property-expand"
                  uiSchema={uiSchema}
                  registry={registry}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  )
}