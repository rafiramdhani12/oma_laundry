import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { queryKeys } from "../lib/QueryKeys";
import type { Customer } from "../interface";

type CustomerPayload = { name: string; phone: string };

export const useCustomers = () =>
  useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: async () => (await api.get<Customer[]>("/customers")).data,
  });

export const useCustomer = (id: number) =>
  useQuery({
    queryKey: queryKeys.customers.detail(id),
    // service backend balikin array (db.select), jadi ambil index 0
    queryFn: async () => (await api.get<Customer[]>(`/customers/${id}`)).data,
    select: (data) => data[0],
    enabled: !!id,
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CustomerPayload) =>
      (await api.post("/customers", payload)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: CustomerPayload & { id: number }) =>
      (await api.put(`/customers/${id}`, payload)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/customers/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
  });
};