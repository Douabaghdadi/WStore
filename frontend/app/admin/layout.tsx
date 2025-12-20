import Script from "next/script";
import ProtectedRoute from "./components/ProtectedRoute";

export const metadata = {
  title: "Admin - Parapharmacie",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <link rel="stylesheet" href="/admin/vendors/mdi/css/materialdesignicons.min.css" />
      <link rel="stylesheet" href="/admin/vendors/ti-icons/css/themify-icons.css" />
      <link rel="stylesheet" href="/admin/vendors/css/vendor.bundle.base.css" />
      <link rel="stylesheet" href="/admin/vendors/font-awesome/css/font-awesome.min.css" />
      <link rel="stylesheet" href="/admin/css/style.css" />
      <style>{`
        body { margin: 0; padding: 0; }
        .page-body-wrapper { padding-top: 63px; }
      `}</style>
      {children}
      <Script src="/admin/vendors/js/vendor.bundle.base.js" />
      <Script src="/admin/js/off-canvas.js" />
      <Script src="/admin/js/misc.js" />
    </ProtectedRoute>
  );
}
