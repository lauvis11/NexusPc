"use client";

import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface-alt text-ink font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <RegisterForm />
    </div>
  );
}
