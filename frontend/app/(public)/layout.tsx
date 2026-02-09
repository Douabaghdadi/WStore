import "../globals.css";
import PublicLayoutWrapper from "./public-layout-wrapper";
import Script from "next/script";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
      <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
    </>
  );
}
