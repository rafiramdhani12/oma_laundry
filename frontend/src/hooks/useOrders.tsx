import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { queryKeys } from "../lib/QueryKeys";
import type { OrderDetail, OrderListItem, OrderStatus } from "../interface";

type CreateOrderPayload = {
  customerId: number;
  items: { serviceId: number; quantity: number }[];
};

// GET /orders/summary
export const useOrders = () =>
  useQuery({
    queryKey: queryKeys.orders.list,
    queryFn: async () =>
      (await api.get<OrderListItem[]>("/orders/summary")).data,
  });

// GET /orders/today (bentuk datanya sama dengan summary)
export const useOrdersToday = () =>
  useQuery({
    queryKey: queryKeys.orders.today,
    queryFn: async () =>
      (await api.get<OrderListItem[]>("/orders/today")).data,
  });

// GET /orders/detail/:id (object, bukan array)
export const useOrderDetail = (id: number) =>
  useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () =>
      (await api.get<OrderDetail>(`/orders/detail/${id}`)).data,
    enabled: !!id,
  });

  // GET recent orders untuk dashboard
  export const useRecentOrders = () =>
  useQuery({
    queryKey: queryKeys.orders.recent,
    queryFn: async () =>
      (await api.get<OrderListItem[]>("/orders/recent")).data,
  })

// POST /orders
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) =>
      (await api.post("/orders", payload)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
  });
};

// PUT /orders/:id  body: { status }
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) =>
      (await api.put(`/orders/${id}`, { status })).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
  });
};

// DELETE /orders/:id
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/orders/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
  });
};