"use client";

import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

function LogInButtonTrimitator() {
  return (
    <Button
      onClick={() =>
        signIn("google", { callbackUrl: "/dashboard/createCourse" })
      }
    >
      Join now
    </Button>
  );
}

export default LogInButtonTrimitator;
