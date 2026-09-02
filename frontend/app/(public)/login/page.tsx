import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse rounded-2xl bg-surface/50" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
