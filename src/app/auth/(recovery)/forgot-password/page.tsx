"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);

  const checkRateLimit = () => {
    const now = Date.now();
    const twoMinutesAgo = now - 2 * 60 * 1000;
    const recentRequests = requestTimestamps.filter(
      (timestamp) => timestamp > twoMinutesAgo
    );
    return recentRequests.length < 3;
  };

  const getRemainingTime = () => {
    if (requestTimestamps.length < 3) return 0;
    const now = Date.now();
    const oldestRequest = requestTimestamps[0];
    const twoMinutesFromOldest = oldestRequest + 2 * 60 * 1000;
    return Math.ceil((twoMinutesFromOldest - now) / 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit()) {
      setError("Rate limit exceeded. Please wait before trying again.");
      return;
    }
    
    setLoading(true);
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kairos/v1/admin/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
    } catch {
      // intentionally ignored (anti-enumeration)
    } finally {
      setLoading(false);
      setSubmitted(true);
      
      // Add current timestamp and clean old ones
      const now = Date.now();
      const twoMinutesAgo = now - 2 * 60 * 1000;
      setRequestTimestamps((prev) => 
        [...prev, now].filter((timestamp) => timestamp > twoMinutesAgo)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {submitted ? "Check Your Email" : "Forgot Password?"}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {submitted
                ? "We've sent you a password reset link"
                : "No worries, we'll send you reset instructions"}
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Email sent successfully</p>
                  <p>
                    If an account exists for{" "}
                    <span className="font-medium">{email}</span>, you will
                    receive a password reset link shortly.
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Didn&apos;t receive the email?</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500 ml-2">
                  <li>Check your spam or junk folder</li>
                  <li>Verify the email address is correct</li>
                  <li>Wait a few minutes and check again</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                disabled={!checkRateLimit()}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {!checkRateLimit()
                  ? `Rate limited. Wait ${getRemainingTime()}s`
                  : "Send another link"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                  }}
                  disabled={loading}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
                {error && (
                  <p className="text-xs text-red-600 mt-1.5">{error}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !email || !checkRateLimit()}
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
                    Sending...
                  </span>
                ) : !checkRateLimit() ? (
                  `Rate limited. Wait ${getRemainingTime()}s`
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}