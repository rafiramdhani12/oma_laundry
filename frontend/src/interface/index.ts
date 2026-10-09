export type Role = "admin" | "worker";
export type OrderStatus = "diterima" | "diproses" | "siap" | "diambil";
export type PaymentMethod = "cash" | "transfer";

export type User = {
  id: number;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: number;
  name: string;
  unit: string;
  price: number;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerId: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: number;
  orderId: number;
  serviceId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
};

export type OrderListItem = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  customerName: string;
  paymentMethod: PaymentMethod | null;
  paidAt: string | null;
};
 
export type OrderDetail = {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  customer: { id: number; name: string; phone: string };
  items: {
    id: number;
    serviceId: number;
    serviceName: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  payment: {
    id: number;
    amount: number;
    paymentMethod: PaymentMethod;
    paidAt: string;
  } | null;
};


export type Payment = {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
};