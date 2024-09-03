import { z, ZodTypeAny, ZodObject } from "zod";
import { InputField } from "../interfaces";

// Updated type for the shape object
type ZodShape = { [key: string]: ZodTypeAny };

export const createZodSchema = (inputs: InputField[]): ZodObject<ZodShape> => {
  const shape: ZodShape = {};

  inputs.forEach((input) => {
    let schema: ZodTypeAny;

    switch (input.type) {
      case "text":
        schema = z.string();
        if (input.required) {
          schema = (schema as z.ZodString).min(1, {
            message: `${input.label} is required`,
          });
        } else {
          schema = schema.optional();
        }
        break;

      case "email":
        schema = z.string().email({ message: "Invalid email address" });
        if (input.required) {
          schema = (schema as z.ZodString).min(1, {
            message: `${input.label} is required`,
          });
        } else {
          schema = schema.optional();
        }
        break;

      case "phone":
        schema = z.string().min(5, { message: "Enter complete phone" });
        if (input.required) {
          schema = (schema as z.ZodString).min(5, {
            message: `${input.label} is required`,
          });
        } else {
          schema = schema.optional();
        }
        break;

      case "select":
        schema = z.string();
        if (input.required) {
          schema = (schema as z.ZodString).min(1, {
            message: `${input.label} is required`,
          });
        } else {
          schema = schema.optional();
        }
        break;

      case "checkbox":
        schema = z.boolean();
        if (input.required) {
          schema = schema.refine((val) => val === true, {
            message: `${input.label} must be checked`,
          });
        } else {
          schema = schema.optional();
        }
        break;

      case "radio":
        schema = z.string();
        if (input.required) {
          schema = (schema as z.ZodString).min(1, {
            message: `${input.label} is required`,
          });
        } else {
          schema = schema.optional();
        }
        break;

      case "country":
        schema = z.string();
        if (input.required) {
          schema = (schema as z.ZodString).min(1, {
            message: `${input.label} is required`,
          });
        } else {
          schema = schema.optional();
        }
        break;

      default:
        schema = z.any();
    }

    shape[input.name] = schema;
  });

  return z.object(shape);
};
