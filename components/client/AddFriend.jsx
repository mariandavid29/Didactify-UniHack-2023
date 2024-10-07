"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import axios from "axios";

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

const formSchema = z.object({
  friend: z
    .string()
    .max(100, {
      message: "Friend email must be less than 100 characters.",
    })
    .email({
      message: "Friend must be a valid email.",
    }),
});

function AddFriend() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friend: "",
    },
  });

  async function onSubmit(values) {
    try {
      const res = await axios.post("/api/friend/addfriend", {
        friendEmail: values.friend,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-xl flex-col items-center justify-start gap-3 sm:flex-row"
      >
        <FormField
          control={form.control}
          name="friend"
          render={({ field }) => (
            <FormItem className="w-full max-w-3xl">
              <FormLabel className="text text-lg">
                Friend&apos;s email
              </FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="friend@cool.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-12 self-start py-0 text-lg sm:self-end"
        >
          Add
        </Button>
      </form>
    </Form>
  );
}

export default AddFriend;
