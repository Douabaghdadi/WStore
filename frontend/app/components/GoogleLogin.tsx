"use client";

interface GoogleLoginProps {
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export default function GoogleLogin({ onSuccess, onError }: GoogleLoginProps) {
  const handleGoogleLogin = () => {
    const redirectUri = typeof window !== 'undefined' 
      ? `${window.location.origin}/login`
      : 'https://w-store.tn/login';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email profile&response_type=code&state=google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        width: "100%",
        padding: "14px 20px",
        backgroundColor: "#ffffff",
        color: "#1f1f1f",
        border: "1px solid #dadce0",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "500",
        cursor: "pointer",
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "-0.2px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f8f9fa";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        e.currentTarget.style.borderColor = "#c1c7cd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#ffffff";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "#dadce0";
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span style={{ fontFamily: "'Inter', sans-serif" }}>
        Continuer avec Google
      </span>
    </button>
  );
}