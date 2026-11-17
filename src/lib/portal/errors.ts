export function isSchemaError(error: { code?: string; message?: string }) {
  const message = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /does not exist/i.test(message) ||
    /schema cache/i.test(message) ||
    /could not find the table/i.test(message)
  );
}

export function isAuthKeyError(error: { code?: string; message?: string }) {
  const message = error.message ?? "";
  return (
    error.code === "PGRST301" ||
    /invalid api key/i.test(message) ||
    /jwt/i.test(message)
  );
}
