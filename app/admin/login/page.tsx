import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Masuk Admin" };

const LOGO =
  "https://karangturi.sch.id/wp-content/uploads/2024/09/LOGO-GAOK-WEB-2.png";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <Image
            src={LOGO}
            alt="Pusaka"
            width={56}
            height={56}
            className="h-12 w-auto"
          />
          <h1 className="mt-4 text-xl font-extrabold text-navy">Pusaka Admin</h1>
          <p className="mt-1 text-sm text-muted">Masuk untuk mengelola situs</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
