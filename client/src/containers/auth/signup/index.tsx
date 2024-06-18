import { FC } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import SignUpForm from "./form";

const SignUp: FC = () => {
  return (
    <div className="flex flex-col">
      <h2 className="mb-4 px-8 text-4xl font-semibold">Sign up</h2>
      <SignUpForm />
      <div className="mt-6 flex justify-center space-x-1">
        <span className="text-sm text-muted-foreground">
          Already have an account?
        </span>
        <Button variant="link" size="none" asChild>
          <Link href="/auth/signin">Log in</Link>
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
