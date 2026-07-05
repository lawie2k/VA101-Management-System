import React from "react";
import PaymentQRPageContent from "../../components/payment-components/PaymentQRPageContent";

export default async function PaymentQRPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>;
}) {
  const resolvedParams = await searchParams;
  return <PaymentQRPageContent method={resolvedParams.method} />;
}
