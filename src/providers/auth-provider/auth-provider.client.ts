"use client";

import type {AuthProvider} from "@refinedev/core";
import axios from "@libs/axios";

// Utility function to handle API responses
const handleApiResponse = async (apiCall: Promise<any>, successMessage: string) => {
    try {
        const response = await apiCall;
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: {
                message: error.response?.data?.message || `Error: ${successMessage} failed`,
                name: "ApiError",
            },
        };
    }
};

// Auth provider implementation
export const authProviderClient: AuthProvider = {
    login: async ({email, password, remember = false}) => {
        try {
            // Get CSRF token first
            await axios.get("/csrf-cookie");

            // Attempt login
            const response = await axios.post("/login", {
                email,
                password,
                remember
            });

            // Store user data if needed
            if (response.data.user) {
                localStorage.setItem("auth", JSON.stringify(response.data.user));
            }

            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error.response?.data?.message || "Login failed",
                    name: "LoginError",
                },
            };
        }
    },

    logout: async () => {
        try {
            await axios.get("/csrf-cookie");
            await axios.post("/logout");

            // Clear stored auth data
            localStorage.removeItem("auth");

            return {
                success: true,
                redirectTo: "/login",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error.response?.data?.message || "Logout failed",
                    name: "LogoutError",
                },
            };
        }
    },

    check: async () => {
        try {
            const {data} = await axios.get("/check");

            if (data) {
                // Update stored user data
                localStorage.setItem("auth", JSON.stringify(data));
                return {
                    authenticated: true,
                };
            }

            return {
                authenticated: false,
                redirectTo: "/login",
            };
        } catch (error) {
            return {
                authenticated: false,
                redirectTo: "/login",
            };
        }
    },

    getPermissions: async () => {
        try {
            const authData = localStorage.getItem("auth");
            if (!authData) return null;

            const user = JSON.parse(authData);
            return user.roles || null;
        } catch {
            return null;
        }
    },

    getIdentity: async () => {
        try {
            const authData = localStorage.getItem("auth");
            if (!authData) return null;

            return JSON.parse(authData);
        } catch {
            return null;
        }
    },

    onError: async (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            localStorage.removeItem("auth");
            return {
                logout: true,
                redirectTo: "/login",
            };
        }

        return {error};
    },
};