export function validatePassword({ pass1, pass2 }: { pass1: string; pass2: string }, errors: any) {
  if (pass1 !== pass2) {
    errors.pass2.addError("Passwords don't match.");
  }
  return errors;
}
