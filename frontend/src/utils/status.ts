import type { OrderStatus } from "../interface";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  diterima: "Diterima",
  diproses: "Diproses",
  siap: "Siap Diambil",
  diambil: "Selesai",
};

// Pakai kelas Tailwind biasa (bukan kelas badge DaisyUI) supaya warna & teks
// pasti terbaca dan nggak tergantung versi DaisyUI.
export const STATUS_STYLE: Record<OrderStatus, string> = {
  diterima: "bg-amber-100 text-amber-700",
  diproses: "bg-sky-100 text-sky-700",
  siap: "bg-emerald-100 text-emerald-700",
  diambil: "bg-gray-100 text-gray-600",
};

// Urutan status: sekali jalan, maju satu langkah, tidak bisa mundur / loncat.
export const STATUS_FLOW: OrderStatus[] = [
  "diterima",
  "diproses",
  "siap",
  "diambil",
];

export const getNextStatus = (status: OrderStatus): OrderStatus | null =>
  STATUS_FLOW[STATUS_FLOW.indexOf(status) + 1] ?? null;

// Teks tombol untuk pindah KE status tersebut
export const STATUS_ACTION: Record<OrderStatus, string> = {
  diterima: "",
  diproses: "Mulai Proses",
  siap: "Tandai Siap Diambil",
  diambil: "Tandai Sudah Diambil",
};