import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  );

// Schema for inserting ProductList
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must at least have one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// we used zod to validate the keys of each product that will not be created automatically (ex. id) and for stock we used the coerce object as the value will come from db as string and we wanted to make it a number and in the banner weused the nullable method as it is optional (can be null). For price we used the refine method that takes a regular expression with which we want to test the value that will be returned from the function we put in the test method and also we put a message to display to users if the validation fails.
