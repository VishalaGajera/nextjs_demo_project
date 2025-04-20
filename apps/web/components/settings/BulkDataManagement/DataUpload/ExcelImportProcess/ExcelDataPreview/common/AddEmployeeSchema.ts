import { DateTime } from "luxon";
import { z } from "zod";
import { isValidMobileNumber } from "../../../../../../../utils/mobileNumberValidate";
import type { MasterCodeOptionValues } from "../constant";

type ValidationRule = {
  required?: boolean;
  nullable?: boolean;
  // Add more possible validation rules
  type:
    | "string"
    | "number"
    | "date"
    | "email"
    | "phone"
    | "array"
    | "boolean"
    | "object";
  min?: number;
  max?: number;
  pattern?: string | RegExp;
  dependsOn?: {
    field: string;
    value?: unknown;
    condition:
      | "equals"
      | "equalsWithEmpty"
      | "notEquals"
      | "includes"
      | "excludes";
  };
  dateValidation?: {
    minDate?: string; // Field name for dynamic min date
    maxDate?: string; // Field name for dynamic max date
    notFutureDate?: boolean; // Cannot be a future date
    notPastDate?: boolean; // Cannot be a past date
    minAge?: number; // Minimum age in years (for date of birth)
    maxAge?: number; // Maximum age in years (for date of birth)
  };
  custom?: (value: unknown) => boolean;
  arrayOf?: ValidationRule;
  objectSchema?: Record<string, ValidationRule>;
};

type ValidationSchema = Record<string, ValidationRule>;

function createFieldSchema(
  rule: ValidationRule,
  masterCodeKey: MasterCodeOptionValues
): z.ZodTypeAny {
  let fieldSchema: z.ZodTypeAny;

  // Base type
  // eslint-disable-next-line no-use-before-define
  fieldSchema = getBaseTypeSchema(rule, masterCodeKey);

  // Apply required/optional
  if (rule.nullable) {
    fieldSchema = fieldSchema.nullable();
  }

  if (!rule?.required) {
    fieldSchema = fieldSchema.optional();
  } else {
    fieldSchema = fieldSchema.refine((val) => !!val, {
      message: "This field is required",
    });
  }

  // Apply custom validation if provided
  if (rule.custom) {
    fieldSchema = fieldSchema.refine(rule.custom);
  }

  return fieldSchema;
}

function getStringSchema(rule: ValidationRule): z.ZodString {
  let schema = z.string();

  if (rule.min) {
    schema = schema.min(rule.min);
  }

  if (rule.max) {
    schema = schema.max(rule.max);
  }

  if (rule.pattern) {
    schema = schema.refine(
      (val) => {
        // Skip pattern validation if value is empty
        if (!val) {
          return true;
        }

        // Only validate pattern if value exists
        return new RegExp(rule.pattern as string).test(val as string);
      },
      {
        message: "Invalid format",
      }
    ) as unknown as z.ZodString;
  }

  return schema;
}

function getNumberSchema(rule: ValidationRule): z.ZodNumber {
  let schema = z.number();

  if (rule.min) {
    schema = schema.min(rule.min);
  }

  if (rule.max) {
    schema = schema.max(rule.max);
  }

  return schema;
}

function getArraySchema(
  rule: ValidationRule,
  masterCodeKey: MasterCodeOptionValues
): z.ZodArray<z.ZodTypeAny> {
  if (rule.arrayOf) {
    const itemSchema = createFieldSchema(rule.arrayOf, masterCodeKey);

    return z.array(itemSchema);
  }

  return z.array(z.any());
}

function createDynamicZodSchema(
  validationRules: ValidationSchema,
  masterCodeKey: MasterCodeOptionValues
) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    schemaFields[fieldName] = createFieldSchema(rules, masterCodeKey);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const baseSchema = z.object(schemaFields).superRefine((data, ctx) => {
    // Validate required fields
    for (const [fieldName, rules] of Object.entries(validationRules)) {
      const value = data[fieldName as keyof typeof data];

      if (rules.dateValidation) {
        const date = DateTime.fromISO(value as string);

        const now = DateTime.now();

        // Not future date validation
        if (rules.dateValidation.notFutureDate && date > now) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date cannot be in the future",
            path: [fieldName],
          });
        }

        // Not past date validation
        if (rules.dateValidation.notPastDate && date < now) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date cannot be in the past",
            path: [fieldName],
          });
        }

        // Min age validation
        if (rules.dateValidation.minAge) {
          const minAgeDate = now.minus({ years: rules.dateValidation.minAge });

          if (date > minAgeDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Age must be at least ${rules.dateValidation.minAge} years`,
              path: [fieldName],
            });
          }
        }

        // Max age validation
        if (rules.dateValidation.maxAge) {
          const maxAgeDate = now.minus({ years: rules.dateValidation.maxAge });

          if (date < maxAgeDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Age cannot be more than ${rules.dateValidation.maxAge} years`,
              path: [fieldName],
            });
          }
        }

        // Min date validation (relative to another field)
        if (rules.dateValidation.minDate) {
          const minDateField = rules.dateValidation.minDate;

          const minDateValue = data[
            minDateField as keyof typeof data
          ] as string;

          if (minDateValue) {
            const minDateTime = DateTime.fromISO(minDateValue);

            if (minDateTime.isValid && date < minDateTime) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Must be after ${minDateField.replaceAll("_", " ")}`,
                path: [fieldName],
              });
            }
          }
        }

        // Max date validation (relative to another field)
        if (rules.dateValidation.maxDate) {
          const maxDateField = rules.dateValidation.maxDate;

          const maxDateValue = data[
            maxDateField as keyof typeof data
          ] as string;

          if (maxDateValue) {
            const maxDateTime = DateTime.fromISO(maxDateValue);

            if (maxDateTime.isValid && date > maxDateTime) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Must be before ${maxDateField.replaceAll("_", " ")}`,
                path: [fieldName],
              });
            }
          }
        }
      }

      if (rules.dependsOn) {
        const { field, value: dependentValue, condition } = rules.dependsOn;

        const dependentField = data[field as keyof typeof data];

        let shouldBeRequired = false;

        switch (condition) {
          case "equals":
            shouldBeRequired = dependentField === dependentValue;
            break;

          case "equalsWithEmpty":
            shouldBeRequired = !!dependentField && dependentField !== "";
            break;

          case "notEquals":
            shouldBeRequired = dependentField !== dependentValue;
            break;

          case "includes":
            shouldBeRequired =
              Array.isArray(dependentField) &&
              dependentField.includes(dependentValue);
            break;

          case "excludes":
            shouldBeRequired =
              Array.isArray(dependentField) &&
              !dependentField.includes(dependentValue);
            break;
        }

        if (
          shouldBeRequired &&
          (value === undefined || value === null || value === "")
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field is required",
            path: [fieldName],
          });
        } else if (shouldBeRequired && value && rules.pattern) {
          const pattern = new RegExp(rules.pattern as string);

          if (!pattern.test(value as string)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Invalid format",
              path: [fieldName],
            });
          }
        }
      }
    }
  });

  return z.object({
    [masterCodeKey]: z
      .array(baseSchema)
      .nonempty({ message: "At least one employee is required" }),
  });
}

function getObjectSchema(
  rule: ValidationRule,
  masterCodeKey: MasterCodeOptionValues
): z.ZodObject<z.ZodRawShape> {
  if (rule.objectSchema) {
    return createDynamicZodSchema(rule.objectSchema, masterCodeKey);
  }

  return z.object({});
}

function getBaseTypeSchema(
  rule: ValidationRule,
  masterCodeKey: MasterCodeOptionValues
): z.ZodTypeAny {
  switch (rule.type) {
    case "string":
      return getStringSchema(rule);

    case "number":
      return getNumberSchema(rule);

    case "date":
      return z.date();

    case "email":
      return z.string().email();

    case "phone":
      return z
        .string()
        .refine(isValidMobileNumber, {
          message: "common.mobileNumber.invalid",
        })
        .nullable();

    case "boolean":
      return z.boolean();

    case "array":
      return getArraySchema(rule, masterCodeKey);

    case "object":
      return getObjectSchema(rule, masterCodeKey);

    default:
      return z.any();
  }
}

export { createDynamicZodSchema, type ValidationRule, type ValidationSchema };
