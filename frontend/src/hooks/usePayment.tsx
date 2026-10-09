import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { queryKeys } from "../lib/QueryKeys";

export type PaymentMethod = "cash" | "transfer";

export interface Payment {
id: number;
orderId: number;
amount: number;
paymentMethod: PaymentMethod;
paidAt: string;
}

export interface CreatePaymentPayload {
orderId: number;
amount: number;
paymentMethod: PaymentMethod;
}

// GET /payments/order/:orderId
export const usePayments = (orderId: number) =>
useQuery({
queryKey: ["payments", "order", orderId],
queryFn: async () =>
(await api.get<Payment[]>(`/payments/order/${orderId}`)).data,
enabled: Number.isInteger(orderId) && orderId > 0,
});

// POST /payments
export const useCreatePayment = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: async (payload: CreatePaymentPayload) =>
(await api.post<Payment[]>("/payments", payload)).data,

onSuccess: async (_data, variables) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["payments", "order", variables.orderId],
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.orders.all,
    }),
  ]);
},

});
};

// DELETE /payments/:id — gunakan hanya jika fitur hapus memang diperlukan
export const useDeletePayment = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: async ({
id,
orderId,
}: {
id: number;
orderId: number;
}) => (await api.delete(`/payments/${id}`)).data,


onSuccess: async (_data, variables) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["payments", "order", variables.orderId],
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.orders.all,
    }),
  ]);
},


});
};
