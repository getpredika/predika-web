import { api } from "@/lib/api-client";
import type {
    User,
    RegisterRequest,
    LoginRequest,
    VerifyEmailRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ResendOTPRequest,
} from "@/types/api";

/**
 * Authentication API functions
 * All endpoints handle session-based authentication with cookies
 */

/**
 * Register a new user account
 * POST /auth/register
 */
export async function register(data: RegisterRequest): Promise<{ user: User }> {
    return api.post<{ user: User }>("/auth/register", data);
}

/**
 * Login existing user
 * POST /auth/login
 */
export async function login(data: LoginRequest): Promise<User> {
    return api.post<User>("/auth/login", data);
}

/**
 * Logout current user (ends session)
 * POST /auth/logout
 */
export async function logout(): Promise<null> {
    return api.post<null>("/auth/logout");
}

/**
 * Verify email with OTP code
 * POST /auth/verify-email
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<null> {
    return api.post<null>("/auth/verify-email", data);
}

/**
 * Get current authenticated user info
 * GET /auth/me
 */
export async function getMe(): Promise<User> {
    return api.get<User>("/auth/me");
}

/**
 * Request password reset OTP
 * POST /auth/password/forgot
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<null> {
    return api.post<null>("/auth/password/forgot", data);
}

/**
 * Reset password with verified OTP
 * POST /auth/password/reset
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<null> {
    return api.post<null>("/auth/password/reset", data);
}

/**
 * Resend verification or password reset OTP
 * POST /auth/otp/send
 */
export async function resendOTP(data: ResendOTPRequest): Promise<null> {
    return api.post<null>("/auth/otp/send", data);
}

/**
 * Initiate Google OAuth flow (client should redirect to this URL)
 * GET /auth/google
 */
export function getGoogleOAuthUrl(): string {
    const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? "http://localhost:3333" : "https://api.predika.app");
    return `${API_BASE_URL}/auth/google`;
}
