import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useOrders } from "../../hooks/useOrders";

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Orders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, isError } = useOrders();

  return (
    <Layout>
      <section className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-sm opacity-60">
              Kelola semua pesanan laundry.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/orders/create")}
          >
            + Add Order
          </button>
        </div>

        {/* Orders table */}
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <span className="loading loading-spinner loading-md" />
                    <p className="mt-2">Loading orders...</p>
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-error">
                    Gagal memuat orders. Coba refresh halaman.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                (!orders || orders.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center opacity-60">
                      Belum ada order.
                    </td>
                  </tr>
                )}

              {!isLoading &&
                !isError &&
                orders?.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <span className="badge badge-outline">
                        {order.status}
                      </span>
                    </td>
                    <td>{formatRupiah(Number(order.totalPrice))}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() =>
                          navigate(`/orders/detail/${order.id}`)
                        }
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default Orders;

