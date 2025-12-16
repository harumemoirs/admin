"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real-time password validation
  const passwordErrors = [];
  if (password && password.length < 8) {
    passwordErrors.push("At least 8 characters required");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kairos/v1/admin/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 400) {
          if (data.message?.includes("Token invalid or expired")) {
            setError("Your reset link has expired or is invalid. Please request a new one.");
          } else if (data.message?.includes("Password must be at least 8 characters")) {
            setError("Password must be at least 8 characters long");
          } else {
            setError(data.message || "Invalid request. Please try again.");
          }
        } else if (res.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.message || "Password reset failed. Please try again.");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
            <p className="text-sm text-gray-600 mt-2">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                Password reset successful! Redirecting to login...
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                  }}
                  disabled={loading || success}
                  className="w-full border border-gray-300 p-3 pr-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || success}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordErrors.length > 0 && password && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordErrors[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                  }}
                  disabled={loading || success}
                  className="w-full border border-gray-300 p-3 pr-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={loading || success}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || success || !password || !confirm}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Resetting...
              </span>
            ) : success ? (
              "Success!"
            ) : (
              "Reset Password"
            )}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <a href="/auth/login" className="text-black font-medium hover:underline">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}