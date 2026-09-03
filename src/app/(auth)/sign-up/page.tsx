import Link from "next/link";
import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start building agents with a measurable performance history.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <p className="mt-6 text-center text-body-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
