// src/templates/index.ts
import {
  getTemplate,
  getUiOptions,
  titleId,
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
  ObjectFieldTemplateProps,
} from '@rjsf/utils';

export function ObjectFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: ObjectFieldTemplateProps<T, S, F>
) {
  const { registry, properties, title, description, uiSchema, required, schema, idSchema } = props;
  const options = getUiOptions<T, S, F>(uiSchema);
  const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, options);
  return (
    <div>
      {title && (
        <TitleFieldTemplate
          id={titleId<T>(idSchema)}
          title={`Custom: ${title}`}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {description}
      <div className='row'>
        {properties.map((prop) => (
          <div className='col-lg-1 col-md-2 col-sm-4 col-xs-6' key={prop.content.key}>
            {prop.content}
          </div>
        ))}
      </div>
    </div>
  );
}