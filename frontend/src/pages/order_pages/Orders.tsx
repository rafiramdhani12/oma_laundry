import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import { useOrders } from "../../hooks/useOrders";
import { formatDate, formatRupiah } from "../../utils/format";

// No | Pelanggan | Tanggal | Status | Total | Aksi
// Satu template dipakai header & semua baris supaya kolom desktop sejajar.
const GRID = "md:grid-cols-[10rem_1fr_7rem_7.5rem_9rem_5.5rem]";

const PAYMENT_LABEL = { cash: "Cash", transfer: "Transfer" } as const;

const Orders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError, refetch } = useOrders();

  return (
    <Layout>
      <section className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">Orders</h1>
              {orders && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                  {orders.length} order
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">Kelola semua pesanan laundry.</p>
          </div>

          <button
            type="button"
            className="btn btn-primary w-full sm:w-auto"
            onClick={() => navigate("/orders/create")}
          >
            + Add Order
          </button>
        </div>

        {/* Daftar order */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          {isLoading ? (
            <ul className="divide-y divide-gray-100">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="space-y-3 px-4 py-4 md:px-5">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <p className="text-sm text-red-500">Gagal memuat orders.</p>
              <button type="button" className="btn btn-sm btn-outline" onClick={() => refetch()}>
                Coba lagi
              </button>
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
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
                className={`hidden gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid ${GRID}`}
              >
                <span>Order Number</span>
                <span>Customer</span>
                <span>Date</span>
                <span>Status</span>
                <span>Total</span>
                <span />
              </div>

              {/* Mobile: kartu 2 kolom (urutan lewat order-*). Desktop: md:order-none = baris tabel. */}
              <ul className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className={`grid grid-cols-2 items-center gap-x-3 gap-y-2 px-4 py-4 transition hover:bg-gray-50 md:gap-x-4 md:px-5 ${GRID}`}
                  >
                    <span className="order-1 min-w-0 truncate font-mono text-xs text-gray-400 md:order-none md:text-sm md:font-medium md:text-gray-700">
                      {order.orderNumber}
                    </span>

                    <span className="order-3 col-span-2 min-w-0 truncate font-semibold text-gray-900 md:order-none md:col-span-1">
                      {order.customerName}
                    </span>

                    <span className="order-4 col-span-2 text-sm text-gray-500 md:order-none md:col-span-1">
                      {formatDate(order.createdAt)}
                    </span>

                    <span className="order-2 justify-self-end md:order-none md:justify-self-start">
                      <StatusBadge status={order.status} />
                    </span>

                    <div className="order-5 min-w-0 md:order-none">
                      <p className="font-bold text-gray-900">{formatRupiah(order.totalPrice)}</p>
                      {order.paymentMethod ? (
                        <p className="text-xs font-medium text-emerald-600">
                          Lunas · {PAYMENT_LABEL[order.paymentMethod]}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-rose-500">Belum bayar</p>
                      )}
                    </div>

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
        </div>
      </section>
    </Layout>
  );
};

export default Orders;