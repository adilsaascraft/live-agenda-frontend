"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { facultySchema } from "../schema";

import type { FacultyFormValues } from "../schema";
import type { Faculty } from "../type";

interface FacultyFormProps {
  faculty?: Faculty | null;
  isPending?: boolean;
  onSubmit: SubmitHandler<FacultyFormValues>;
  onCancel: () => void;
}

export function FacultyForm({
  faculty,
  isPending = false,
  onSubmit,
  onCancel,
}: FacultyFormProps) {
  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema) as Resolver<FacultyFormValues>,

    defaultValues: {
      fullName: faculty?.fullName ?? "",
      email: faculty?.email ?? "",
      mobile: faculty?.mobile ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: faculty?.fullName ?? "",
      email: faculty?.email ?? "",
      mobile: faculty?.mobile ?? "",
    });
  }, [faculty, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  placeholder="Enter faculty full name"
                  autoComplete="name"
                  maxLength={100}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter email address"
                  autoComplete="email"
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mobile */}
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  placeholder="Enter mobile number"
                  autoComplete="tel"
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? "Saving..."
              : faculty
                ? "Update Faculty"
                : "Create Faculty"}
          </Button>
        </div>
      </form>
    </Form>
  );
}