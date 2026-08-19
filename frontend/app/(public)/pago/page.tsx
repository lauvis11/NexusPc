"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function PagoVerificador() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = (
      searchParams.get("status") ||
      searchParams.get("collection_status") ||
      ""
    ).toLowerCase();

    const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id") || "";
    const externalReference = searchParams.get("external_reference") || "";

    const queryParams = new URLSearchParams();
    if (paymentId) queryParams.set("payment_id", paymentId);
    if (externalReference) queryParams.set("external_reference", externalReference);
    if (status) queryParams.set("status", status);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    if (status === "approved" || status === "success") {
      router.replace(`/pago/exito${queryString}`);
    } else if (status === "rejected" || status === "failure" || status === "null") {
      router.replace(`/pago/error${queryString}`);
    } else if (status === "pending" || status === "in_process") {
      router.replace(`/pago/pendiente${queryString}`);
    } else {
      // Si no hay status específico, ir a /pago/exito por defecto si hay external_reference o /productos
      if (externalReference || paymentId) {
        router.replace(`/pago/exito${queryString}`);
      } else {
        router.replace("/productos");
      }
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm font-bold text-ink-secondary">
        Verificando estado de tu pago...
      </p>
    </div>
  );
}

export default function PagoRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-alt flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }
    >
      <PagoVerificador />
    </Suspense>
  );
}
