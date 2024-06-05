"use client";

import { FC, useState } from "react";

import SignInForm from "./signin/form";
import SignUpForm from "./signup/form";

const UserAuth: FC = () => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to our app!</h1>
      <p className="text-lg mb-8">
        Please {authMode === "signin" ? "sign in" : "sign up"} to continue.
      </p>
      {authMode === "signin" ? <SignInForm /> : <SignUpForm />}
      <button
        className="text-blue-500 underline mt-4"
        onClick={() =>
          setAuthMode((prev) => (prev === "signin" ? "signup" : "signin"))
        }
      >
        {authMode === "signin" ? "Sign up" : "Sign in"} instead
      </button>
    </div>
  );
};

export default UserAuth;
