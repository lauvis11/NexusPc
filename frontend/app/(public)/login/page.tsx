"use client";

import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <LoginForm />
    </div>
  );
}
