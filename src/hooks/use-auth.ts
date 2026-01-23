import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/api/auth";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendOTPRequest,
} from "@/types/api";
import { ApiError } from "@/lib/api-client";

// Query key for user data
const USER_QUERY_KEY = ["auth", "user"];

// Login result type
interface LoginResult {
  user: User;
  needsVerification: boolean;
  email: string;
}

// Register result type
interface RegisterResult {
  user: User;
  needsVerification: boolean;
  email: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  // Fetch current user
  const {
    data: user,
    isLoading,
    error: userError,
  } = useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await authApi.getMe();
      } catch (error) {
        // Return null for 401 (not authenticated) - this is expected
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation<LoginResult, Error, LoginRequest>({
    mutationFn: async (data) => {
      const user = await authApi.login(data);
      return {
        user,
        needsVerification: !user.isVerified,
        email: user.email,
      };
    },
    onSuccess: (result) => {
      // Update cached user data
      queryClient.setQueryData(USER_QUERY_KEY, result.user);
    },
  });

  // Register mutation
  const registerMutation = useMutation<RegisterResult, Error, RegisterRequest>({
    mutationFn: async (data) => {
      const response = await authApi.register(data);
      return {
        user: response.user,
        needsVerification: !response.user.isVerified,
        email: response.user.email,
      };
    },
    onSuccess: (result) => {
      // Update cached user data
      queryClient.setQueryData(USER_QUERY_KEY, result.user);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(USER_QUERY_KEY, null);
      // Clear all queries to reset app state
      queryClient.clear();
      // Redirect to home
      window.location.href = "/";
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation<void, Error, { otp: string; type?: VerifyEmailRequest["type"] }>({
    mutationFn: async ({ otp, type = "VERIFY_EMAIL" }) => {
      await authApi.verifyEmail({ otp, type });
    },
    onSuccess: () => {
      // Refetch user to get updated verification status
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: async (data) => {
      await authApi.forgotPassword(data);
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation<void, Error, ResetPasswordRequest>({
    mutationFn: async (data) => {
      await authApi.resetPassword(data);
    },
  });

  // Resend OTP mutation
  const resendOTPMutation = useMutation<void, Error, ResendOTPRequest>({
    mutationFn: async (data) => {
      await authApi.resendOTP(data);
    },
  });

  return {
    // User state
    user,
    isLoading,
    isAuthenticated: !!user,
    userError,

    // Login
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Register
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // Verify email
    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifying: verifyEmailMutation.isPending,
    verifyError: verifyEmailMutation.error,

    // Forgot password
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingReset: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    // Reset password
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // Resend OTP (renamed from resendVerification for clarity)
    resendOTP: resendOTPMutation.mutateAsync,
    resendVerification: resendOTPMutation.mutateAsync, // Keep old name for compatibility
    isResendingOTP: resendOTPMutation.isPending,
    isResendingVerification: resendOTPMutation.isPending, // Keep old name for compatibility
    resendOTPError: resendOTPMutation.error,
  };
}
