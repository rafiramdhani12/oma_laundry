export const queryKeys = {
  auth: { user: ["auth", "user"] as const },
  users: {
    all: ["users"] as const,
    detail: (id: number) => ["users", id] as const,
  },
  customers: {
    all: ["customers"] as const,
    detail: (id: number) => ["customers", id] as const,
  },
  services: {
    all: ["services"] as const,
    detail: (id: number) => ["services", id] as const,
  },
    orders: {
    all: ["orders"] as const,
    list: ["orders", "summary"] as const,
    today: ["orders", "today"] as const,
    detail: (id: number) => ["orders", "detail", id] as const,
  },
  orderItems: {
    detail: (id: number) => ["order-items", id] as const,
  },
  payments: {
    all: ["payments"] as const,
    detail: (id: number) => ["payments", id] as const,
    byOrder: (orderId: number) => ["payments", "order", orderId] as const,
  },
};