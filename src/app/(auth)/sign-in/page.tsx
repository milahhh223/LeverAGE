import Link from "next/link";
import type { Metadata } from "next";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back to your trading intelligence environment.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
        <p className="mt-6 text-center text-body-sm text-foreground-muted">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:text-primary-hover">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
