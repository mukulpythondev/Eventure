import * as z from "zod"

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title must be less than 255 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  eventImage:  z.string().url("Please provide a valid image URL."),
  startDateTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), "Invalid start date"),
  endDateTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), "Invalid end date"),
 venue: z.string().min(3, "Location must be at least 3 characters").max(400, "Location must be less than 400 characters"),
  isPaid: z.boolean().optional(),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val), z
    .number()
    .min(0, "Price must be at least 0").optional()),
  totalSeats: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val), 
    z.number().min(1, "Total seats must be at least 1")
  ),
  eventType: z.enum(["online", "offline"], { required_error: "Event type is required" }),
  hostEmail: z.string().email("Invalid email address"),
  category: z.string()
}).refine((data) => {
  // This validation runs on the entire schema after all individual field validations
  const startDate = new Date(data.startDateTime);
  const endDate = new Date(data.endDateTime);
  return endDate > startDate;
}, {
  message: "End date must be later than start date",
  path: ["endDateTime"] // This tells Zod which field to attach the error to
});
