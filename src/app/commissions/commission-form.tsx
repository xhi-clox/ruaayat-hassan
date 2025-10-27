"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const commissionFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  email: z.string().email("Please enter a valid email address."),
  commissionType: z.enum(["Digital Portrait", "Watercolor Piece", "Full Illustration", "Custom Inking"], {
    required_error: "You need to select a commission type.",
  }),
  budget: z.array(z.number()).min(1).max(1),
  description: z.string().min(10, "Please describe your project in at least 10 characters."),
  referenceFile: z.any().optional(),
});

type CommissionFormValues = z.infer<typeof commissionFormSchema>;

const defaultValues: Partial<CommissionFormValues> = {
  budget: [500],
};

export default function CommissionForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
    defaultValues,
  });

  async function onSubmit(data: CommissionFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(data);
    toast({
      title: "Request Sent!",
      description: "Thank you for your commission request. I'll get back to you soon.",
    });
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="jane.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="commissionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of commission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Digital Portrait">Digital Portrait</SelectItem>
                  <SelectItem value="Watercolor Piece">Watercolor Piece</SelectItem>
                  <SelectItem value="Full Illustration">Full Illustration</SelectItem>
                  <SelectItem value="Custom Inking">Custom Inking</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Range (USD)</FormLabel>
              <FormControl>
                <Slider
                  min={100}
                  max={2000}
                  step={50}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Approximate budget: ${field.value?.[0] || '100'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your vision, including characters, setting, mood, colors, etc."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referenceFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference File (Optional)</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
              <FormDescription>
                You can upload an image for reference (e.g., character, pose, style).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Submit Request'}
        </Button>
      </form>
    </Form>
  );
}
