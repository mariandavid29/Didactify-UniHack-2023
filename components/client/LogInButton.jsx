"use client";

import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

export default function LogInButton() {
  return (
    <Button type="button" variants="small" onClick={() => signIn("google")}>
      Login
    </Button>
  );
}
