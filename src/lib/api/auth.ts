const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Forgot Password ────────────────────────────────────────────────
export async function forgotPassword(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    return res.json();
}

// ─── Verify OTP ──────────────────────────────────────────────────────
export async function verifyOtp(data: { email: string; otp: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

// ─── Resend OTP (same endpoint as forgotPassword) ────────────────────
export async function resendOtp(email: string) {
    const res = await fetch(`${API_BASE_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    return res.json();
}

// ─── Reset Password ─────────────────────────────────────────────────
export async function resetPassword(data: {
    email: string;
    newPassword: string;
}) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}
