import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

// Define the schema for a single field
const fieldSchema = z.object({
  value: z.string().min(1, { message: "Field cannot be empty" }),
})

// Define the schema for the entire form
const formSchema = z.object({
  fields: z.array(fieldSchema).min(1, { message: "At least one field is required" }),
})

// TypeScript type derived from the schema
type FormValues = z.infer<typeof formSchema>

export default function DynamicForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize react-hook-form with zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fields: [{ value: "" }],
    },
  })

  // Use fieldArray to handle dynamic fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Form submitted successfully:", data)
      toast.success("Form submitted successfully!", {
        duration: 4000,
      })

      // Reset form after successful submission
      reset({ fields: [{ value: "" }] })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit form. Please try again.", {
        duration: 4000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Dynamic Fields Form</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {errors.fields?.root?.message && (
            <Alert variant="destructive">
              <AlertDescription>{errors.fields.root.message}</AlertDescription>
            </Alert>
          )}

          {fields.map((field, index) => (
            <div key={field.id+index} className="flex gap-2">
              <div className="flex-1">
                <Controller
                  control={control}
                  name={`fields.${index}.value`}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        {...field}
                        placeholder={`Field ${index + 1}`}
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                      {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                    </div>
                  )}
                />
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button type="button" variant="outline" onClick={() => append({ value: "" })} className="w-full mt-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </CardContent>

        <CardFooter className="mt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

