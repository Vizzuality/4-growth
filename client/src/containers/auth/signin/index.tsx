import { FC } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import SignInForm from "./form";

const SignUp: FC = () => {
  return (
    <div className="flex flex-col">
      <h2 className="mb-4 px-8 text-4xl font-semibold">Log in</h2>
      <SignInForm />
      <Button variant="link" size="none" className="mt-6 self-center" asChild>
        <Link href="/auth/forgot-password">Forgot password?</Link>
      </Button>
      <Separator className="my-10" />
      <div className="flex justify-center space-x-1">
        <span className="text-sm text-muted-foreground">
          Don&apos;t have an account?
        </span>
        <Button variant="link" size="none" asChild>
          <Link href="/auth/signup">Sign up</Link>
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
