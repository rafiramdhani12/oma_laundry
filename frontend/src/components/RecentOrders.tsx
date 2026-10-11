import { useNavigate } from "react-router-dom";
import type { OrderRecent } from "../interface";
import { formatRupiah } from "../utils/format";
import StatusBadge from "./StatusBadge";

type RecentOrdersProps = {
  orders?: OrderRecent[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

// Satu template kolom dipakai header & semua baris supaya desktop selalu sejajar.
// ID | Pelanggan | Layanan | Status | Total | Aksi
const GRID = "md:grid-cols-[9rem_1fr_2fr_7rem_8rem_5.5rem]";

// Mobile  : tiap order jadi kartu 2 kolom (urutan diatur lewat `order-*`).
// Desktop : `md:order-none` mengembalikan urutan DOM jadi baris tabel.
const RecentOrders = ({ orders, isLoading, isError, onRetry }: RecentOrdersProps) => {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <header className="flex items-center justify-between px-4 py-4 md:px-5">
        <h2 className="text-lg font-semibold text-gray-900">Order Terbaru</h2>
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Lihat semua →
        </button>
      </header>

      {isLoading ? (
        <ul className="divide-y divide-gray-100">
          {[0, 1, 2].map((i) => (
            <li key={i} className="space-y-3 px-4 py-4 md:px-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <p className="text-sm text-red-500">Gagal memuat order.</p>
          <button type="button" className="btn btn-sm btn-outline" onClick={onRetry}>
            Coba lagi
          </button>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <p className="text-sm text-gray-500">Belum ada order.</p>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => navigate("/orders/create")}
          >
            Buat order pertama
          </button>
        </div>
      ) : (
        <>
          {/* Header kolom: hanya desktop */}
          <div
            className={`hidden gap-4 border-y border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid ${GRID}`}
          >
            <span>ID</span>
            <span>Pelanggan</span>
            <span>Layanan</span>
            <span>Status</span>
            <span>Total</span>
            <span />
          </div>

          <ul className="divide-y divide-gray-100 border-t border-gray-100 md:border-t-0">
            {orders.map((order) => (
              <li
                key={order.id}
                className={`grid grid-cols-2 items-center gap-x-3 gap-y-2 px-4 py-4 md:gap-x-4 md:px-5 ${GRID}`}
              >
                <span className="order-1 min-w-0 truncate font-mono text-xs text-gray-400 md:order-none md:text-sm md:text-gray-600">
                  {order.orderNumber}
                </span>

                <span className="order-3 col-span-2 min-w-0 truncate font-semibold text-gray-900 md:order-none md:col-span-1">
                  {order.customerName}
                </span>

                <div className="order-4 col-span-2 flex min-w-0 flex-wrap gap-1.5 md:order-none md:col-span-1">
                  {order.items.map((item, i) => (
                    <span
                      key={`${item.serviceName}-${i}`}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {item.serviceName} · {item.quantity} {item.unit}
                    </span>
                  ))}
                </div>

                <span className="order-2 justify-self-end md:order-none md:justify-self-start">
                  <StatusBadge status={order.status} />
                </span>

                <span className="order-5 font-bold text-gray-900 md:order-none">
                  {formatRupiah(order.totalPrice)}
                </span>

                <button
                  type="button"
                  onClick={() => navigate(`/orders/detail/${order.id}`)}
                  className="btn btn-primary btn-sm order-6 justify-self-end md:order-none md:justify-self-stretch"
                >
                  Detail
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default RecentOrders;