"use client";

interface FacebookLoginProps {
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export default function FacebookLogin({ onSuccess, onError }: FacebookLoginProps) {
  const handleFacebookLogin = () => {
    const redirectUri = 'https://wstore.tn/login';
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=1770752150168884&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email&response_type=code`;
    window.location.href = facebookAuthUrl;
  };

  return (
    <button
      onClick={handleFacebookLogin}
      style={{
        width: "100%",
        padding: "14px 20px",
        backgroundColor: "#1877f2",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(24, 119, 242, 0.2)",
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "-0.2px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#166fe5";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(24, 119, 242, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#1877f2";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(24, 119, 242, 0.2)";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      Continuer avec Facebook
    </button>
  );
}