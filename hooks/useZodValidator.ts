import { ZodSchema } from "zod";

export function validateZod<T>(
  schema: ZodSchema<T>,
  data: T,
  prefix?: string
) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, errors: {} };
  }

  const formattedErrors: Record<string, string> = {};

  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    const key = prefix ? `${prefix}.${path}` : path;
    formattedErrors[key] = issue.message;
  });

  return { success: false, errors: formattedErrors };
}