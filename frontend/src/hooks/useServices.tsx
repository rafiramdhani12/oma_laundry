import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { queryKeys } from "../lib/QueryKeys";
import type { Service } from "../interface";

type ServicePayload = { name: string; unit: string; price: number };

export const useServices = () =>
  useQuery({
    queryKey: queryKeys.services.all,
    queryFn: async () => (await api.get<Service[]>("/services")).data,
  });

export const useService = (id: number) =>
  useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: async () => (await api.get<Service[]>(`/services/${id}`)).data,
    select: (data) => data[0],
    enabled: !!id,
  });

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ServicePayload) =>
      (await api.post("/services", payload)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: ServicePayload & { id: number }) =>
      (await api.put(`/services/${id}`, payload)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/services/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
};