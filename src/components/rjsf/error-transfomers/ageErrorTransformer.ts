import { ErrorTransformer } from '@rjsf/utils';

export const ageErrorTransformer: ErrorTransformer = (errors) => {
  return errors.map((error) => {
    if (error.name === 'minimum' && error.schemaPath === '#/properties/age/minimum') {
      return Object.assign({}, error, {
        message: 'You need to be 18 because of some legal thing',
      });
    }
    return error;
  });
};
