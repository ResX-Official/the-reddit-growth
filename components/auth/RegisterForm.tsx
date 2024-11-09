"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../common/FormError";
import FormSuccess from "../common/FormSuccess";
import { register } from "@/actions/register";

const RegisterForm = () => {
  const [isPending, startTransistion] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransistion(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };
  
  return (
    <div className="text-white">
    <CardWrapper
    headerLabel="Create an Account"
    backButtonLabel="Already Have an Account?"
    backButtonHref="/auth/login"
    showSocial
    >
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <FormField
    control={form.control}
    name="firstName"
    render={({ field }) => (
      <FormItem className="flex-1">
      <FormLabel className="text-sm font-medium text-white/70 hidden">
      First Name
      </FormLabel>
      <FormControl>
      <Input
      disabled={isPending}
      {...field}
      placeholder="First Name"
      className="bg-background border-input hover:border-white/40 focus:border-white"
      />
      </FormControl>
      <FormMessage className="text-xs text-orange-400 font-light" />
      </FormItem>
    )}
    />
    <FormField
    control={form.control}
    name="lastName"
    render={({ field }) => (
      <FormItem className="flex-1">
      <FormLabel className="text-sm font-medium text-white/70 hidden">
      Last Name
      </FormLabel>
      <FormControl>
      <Input
      disabled={isPending}
      {...field}
      placeholder="Second Name"
      className="bg-background border-input hover:border-white/40 focus:border-white"
      />
      </FormControl>
      <FormMessage className="text-xs text-orange-400 font-light" />
      </FormItem>
    )}
    />
    </div>
    
    <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
      <FormLabel className="text-sm font-medium text-white/70 hidden">
      Email
      </FormLabel>
      <FormControl>
      <Input
      disabled={isPending}
      {...field}
      placeholder="john.doe@example.com"
      type="email"
      className="bg-background border-input hover:border-white/40 focus:border-white"
      />
      </FormControl>
      <FormMessage className="text-xs text-orange-400 font-light" />
      </FormItem>
    )}
    />
    
    <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
      <FormLabel className="text-sm font-medium text-white/70 hidden">
      Password
      </FormLabel>
      <FormControl>
      <Input
      {...field}
      placeholder="••••••••"
      disabled={isPending}
      type="password"
      className="bg-background border-input hover:border-white/40 focus:border-white"
      />
      </FormControl>
      <FormMessage className="text-xs text-orange-400 font-light" />
      </FormItem>
    )}
    />
    </div>
    
    <FormError message={error} />
    <FormSuccess message={success} />
    
    <Button
    variant="default"
    type="submit"
    className="w-full font-medium"
    disabled={isPending}
    >
    {isPending ? "Creating Account..." : "Register a New Account"}
    </Button>
    </form>
    </Form>
    </CardWrapper>
    </div>
  );
};

export default RegisterForm;