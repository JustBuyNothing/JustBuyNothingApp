import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequestJson } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { User } from "@shared/schema";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if we have a token
  const token = localStorage.getItem("authToken");

  // Get current user from token
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      return await apiRequestJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Welcome back!",
        description: `Good to see you again, ${data.user.firstName || data.user.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      return await apiRequestJson("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Welcome to BuyNothing!",
        description: `Account created successfully. Welcome, ${data.user.firstName || data.user.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      await apiRequestJson("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      localStorage.removeItem("authToken");
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/"] });
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
    },
    onError: (error) => {
      // Still clear local state even if server logout fails
      localStorage.removeItem("authToken");
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/"] });
    },
  });

  // Update user visit on mount
  useEffect(() => {
    if (user && !isLoading) {
      // Update user visit in the background
      apiRequestJson("/api/auth/visit", {
        method: "POST",
      }).catch(() => {
        // Silently fail - not critical
      });
    }
  }, [user, isLoading]);

  const logout = () => logoutMutation.mutate();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation,
    register: registerMutation,
    logout,
  };
}