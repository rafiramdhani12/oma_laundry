import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { queryKeys } from "../lib/QueryKeys";
import type {User} from "../interface";

type UserPayload = { name: string; password: string; role: "worker" };
type UpdateUserPayload = {
  id: number;
  name: string;
  role: "worker";
  password?: string;
};

export const useUsers = () =>
  useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => (await api.get<User[]>("/users")).data,
  });

export const useUser = (id: number) =>
  useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => (await api.get<User[]>(`/users/${id}`)).data,
    select: (data) => data[0],
    enabled: !!id,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserPayload) =>
      (await api.post("/users", payload)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateUserPayload) => {
      const body = {
        name: payload.name,
        role: payload.role,
        ...(payload.password ? { password: payload.password } : {}),
      };

      return (await api.put(`/users/${id}`, body)).data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/users/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};