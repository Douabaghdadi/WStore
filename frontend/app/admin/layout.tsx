import Script from "next/script";
import ProtectedRoute from "./components/ProtectedRoute";
import "./dashboard.css";

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
        body { 
          margin: 0; 
          padding: 0; 
          background: #f8fafc !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .container-scroller {
          overflow: visible !important;
        }
        .page-body-wrapper { 
          padding-top: 70px !important;
          min-height: 100vh;
          background: #f8fafc !important;
        }
        .main-panel {
          margin-left: 260px !important;
          width: calc(100% - 260px) !important;
          transition: all 0.3s ease;
          background: #f8fafc !important;
        }
        .content-wrapper {
          padding: 1.5rem !important;
          background: #f8fafc !important;
          min-height: calc(100vh - 70px);
        }
        /* Override old sidebar styles */
        .sidebar.sidebar-offcanvas {
          display: none !important;
        }
        .navbar.default-layout-navbar {
          display: none !important;
        }
        /* Fix logo size */
        .navbar-brand img {
          max-height: 40px !important;
          width: auto !important;
          max-width: 180px !important;
        }
      `}</style>
      {children}
      <Script src="/admin/vendors/js/vendor.bundle.base.js" />
      <Script src="/admin/js/off-canvas.js" />
      <Script src="/admin/js/misc.js" />
      <style>{`
        #chat-toggler, #settings-trigger, .nav-settings, #right-sidebar,
        #theme-settings, #layout-settings, .settings-panel, #proBanner,
        .pro-banner, [class*="floating"], [id*="chat"], [id*="settings"] {
          display: none !important;
          visibility: hidden !important;
        }
      `}</style>
    </ProtectedRoute>
  );
}
