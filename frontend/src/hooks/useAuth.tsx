
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";

type LoginPayload = {
    name: string;
    password: string;
};

type LoginResponse = {
    token: string;
    user: {
        id: number;
        name: string;
        role: "admin" | "worker";
    };
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const { data } = await api.post<LoginResponse>(
                "/auth/login",
                payload
            );

            return data;
        },

        onSuccess: (data) => {
            localStorage.setItem("token", data.token);

            queryClient.setQueryData(
                ["auth", "user"],
                data.user
            );
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => (await api.post("/auth/logout")).data,
        onSettled: () => {
            localStorage.removeItem("token");
            queryClient.clear()
        },
    });
}