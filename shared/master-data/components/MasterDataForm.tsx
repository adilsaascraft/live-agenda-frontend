"use client";

import { useEffect } from "react";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useForm,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
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

interface MasterDataFieldConfig<T extends FieldValues> {
  key: FieldPath<T>;
  label: string;
  placeholder: string;
}

interface MasterDataSelectFieldConfig<T extends FieldValues>
  extends MasterDataFieldConfig<T> {
  options: {
    value: string;
    label: string;
  }[];
}

interface MasterDataFormProps<T extends FieldValues> {
  field: MasterDataFieldConfig<T>;
  statusField?: MasterDataSelectFieldConfig<T>;
  schema: z.ZodObject<z.ZodRawShape>;
  defaultValues: DefaultValues<T>;
  submitLabel: string;
  isPending?: boolean;
  onSubmit: SubmitHandler<T>;
}

export function MasterDataForm<T extends FieldValues>({
  field,
  statusField,
  schema,
  defaultValues,
  submitLabel,
  isPending = false,
  onSubmit,
}: MasterDataFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Main text field */}
        <FormField
          control={form.control}
          name={field.key}
          render={({ field: inputField }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {field.label}
              </FormLabel>

              <FormControl>
                <Input
                  {...inputField}
                  value={String(inputField.value ?? "")}
                  autoFocus
                  autoComplete="off"
                  placeholder={field.placeholder}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Optional select field */}
        {statusField && (
          <FormField
            control={form.control}
            name={statusField.key}
            render={({ field: selectField }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {statusField.label}
                </FormLabel>

                <Select
                  value={String(selectField.value ?? "")}
                  onValueChange={selectField.onChange}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={statusField.placeholder}
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {statusField.options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}