import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { setAuthSession } from "../lib/auth";

const LoginPageContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const handleSuccess = async (authResult) => {
    const authCode = authResult?.code;

    if (!authCode) {
      const message = "Google did not return an authorization code. Please try again broooooo.";
      setAuthError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      const { data } = await api.post("/auth/google", { code: authCode });
      setAuthSession(data);

      const firstName = data.user?.name?.split(" ")?.[0] || "friend";
      toast.success(`Welcome back, ${firstName}!`);
      navigate("/", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to sign in with Google.";
      setAuthError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    const message = "Google sign-in was canceled or failed. Please try again.";
    setAuthError(message);
    toast.error(message);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/20 bg-neutral/80 p-8 shadow-[0_25px_90px_-35px_rgba(16,185,129,0.45)] backdrop-blur-md">
          <p className="text-xs tracking-[0.35em] uppercase text-emerald-200/90">RememberDaily</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">Sign in to your notes</h1>

          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="mt-8 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="flex items-center justify-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.1-1.8 2.8l2.9 2.2c1.7-1.6 2.7-3.9 2.7-6.8 0-.7-.1-1.4-.2-2H12z"
                />
                <path
                  fill="#34A853"
                  d="M12 21c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.8 1-3.1 1-2.4 0-4.4-1.6-5.1-3.8H3.9v2.4C5.4 19.2 8.4 21 12 21z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.9 13.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.8H3.9A9 9 0 0 0 3 12c0 1.5.4 2.9.9 4.2l3-2.4z"
                />
                <path
                  fill="#4285F4"
                  d="M12 6.4c1.3 0 2.5.4 3.4 1.3l2.6-2.6C16.5 3.8 14.4 3 12 3 8.4 3 5.4 4.8 3.9 7.8l3 2.4c.7-2.2 2.7-3.8 5.1-3.8z"
                />
              </svg>
              <span>{isLoading ? "Signing you in..." : "Continue with Google"}</span>
            </span>
          </button>

          {authError && <p className="mt-4 text-sm text-red-200">{authError}</p>}
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
        <div className="card max-w-lg w-full bg-base-100 shadow-xl border border-base-content/10">
          <div className="card-body">
            <h2 className="card-title">Missing Google OAuth Client ID</h2>
            <p>
              Set <strong>VITE_GOOGLE_CLIENT_ID</strong> in the root .env file and restart the
              frontend server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginPageContent />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;