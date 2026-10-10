import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  useOrderDetail,
  useUpdateOrderStatus,
} from "../../hooks/useOrders";
import {
  usePayments,
  useCreatePayment,
  type PaymentMethod,
} from "../../hooks/usePayment";
import PrintReceiptButton from "../../components/PrintReceiptButton";
import OrderReceipt from "../../components/OrderReceipt";

type OrderStatus = "diterima" | "diproses" | "siap" | "diambil";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "diterima", label: "Diterima" },
  { value: "diproses", label: "Diproses" },
  { value: "siap", label: "Siap diambil" },
  { value: "diambil", label: "Sudah diambil" },
];

const formatRupiah = (value: number) =>
  `Rp${value.toLocaleString("id-ID")}`;

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const validOrderId = Number.isInteger(orderId) && orderId > 0;

  const {
    data: order,
    isLoading,
    isError,
  } = useOrderDetail(orderId);

  const {
    data: payments = [],
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = usePayments(orderId);

  const updateStatus = useUpdateOrderStatus();
  const createPayment = useCreatePayment();

  const [status, setStatus] = useState<OrderStatus>("diterima");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");
  const [message, setMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status as OrderStatus);
    }
  }, [order?.status]);

  const totalPrice = Number(order?.totalPrice ?? 0);

  const paidAmount = payments.reduce(
    (total : any, payment : any) => total + Number(payment.amount),
    0,
  );

  const remainingAmount = Math.max(0, totalPrice - paidAmount);

  const paymentStatus =
    remainingAmount === 0
      ? "Lunas"
      : paidAmount > 0
        ? "Dibayar sebagian"
        : "Belum dibayar";

  const handleUpdateStatus = async () => {
    if (!validOrderId) {
      setMessage("ID order tidak valid.");
      return;
    }

    try {
      setMessage("");

      await updateStatus.mutateAsync({
        id: orderId,
        status,
      });

      setMessage("Status order berhasil diperbarui.");
    } catch {
      setMessage("Gagal memperbarui status order.");
    }
  };

  const handleCreatePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentMessage("");

    const amount = Number(paymentAmount);

    if (!validOrderId) {
      setPaymentMessage("ID order tidak valid.");
      return;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      setPaymentMessage("Nominal pembayaran harus bilangan bulat positif.");
      return;
    }

    if (amount > remainingAmount) {
      setPaymentMessage("Nominal melebihi sisa tagihan.");
      return;
    }

    try {
      await createPayment.mutateAsync({
        orderId,
        amount,
        paymentMethod,
      });

      setPaymentAmount("");
      setPaymentMessage("Pembayaran berhasil dicatat.");
    } catch {
      setPaymentMessage(
        "Pembayaran gagal disimpan. Periksa koneksi atau validasi backend.",
      );
    }
  };

  return (
    <Layout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Detail Order</h1>
          <p className="text-sm opacity-60">
            Informasi pesanan, status laundry, dan pembayaran.
          </p>
        </div>

        {!validOrderId && (
          <div className="alert alert-error">ID order tidak valid.</div>
        )}

        {isLoading && (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {isError && (
          <div className="alert alert-error">
            Gagal memuat detail order.
          </div>
        )}

        {!isLoading && !isError && !order && validOrderId && (
          <div className="alert alert-warning">Order tidak ditemukan.</div>
        )}

        {order && (
          <>
            <div className="flex justify-end print:hidden">
              <PrintReceiptButton />
            </div>

            <OrderReceipt order={order} payments={payments} />
            {/* INFORMASI ORDER */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h2 className="card-title">{order.orderNumber}</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm opacity-60">Customer</p>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm">{order.customer.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-60">Tanggal Order</p>
                    <p>{new Date(order.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DAFTAR LAYANAN */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Daftar Layanan</h2>

                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Layanan</th>
                        <th>Jumlah</th>
                        <th>Harga Satuan</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.serviceName}</td>
                          <td>
                            {item.quantity} {item.unit}
                          </td>
                          <td>{formatRupiah(Number(item.unitPrice))}</td>
                          <td>{formatRupiah(Number(item.totalPrice))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between border-t border-base-300 pt-4">
                  <span className="font-semibold">Total Order</span>
                  <span className="text-lg font-bold">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

           
            {/* STATUS LAUNDRY */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Update Status</h2>

                <label htmlFor="order-status" className="label">
                  Status Laundry
                </label>

                <select
                  id="order-status"
                  className="select select-bordered w-full"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as OrderStatus)
                  }
                  disabled={updateStatus.isPending}
                >
                  {statuses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                {message && (
                  <p
                    role="status"
                    className={
                      message.startsWith("Gagal") ||
                      message.startsWith("ID")
                        ? "text-sm text-error"
                        : "text-sm text-success"
                    }
                  >
                    {message}
                  </p>
                )}

                <div className="card-actions justify-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdateStatus}
                    disabled={
                      updateStatus.isPending || status === order.status
                    }
                  >
                    {updateStatus.isPending && (
                      <span className="loading loading-spinner loading-sm" />
                    )}
                    Simpan Status
                  </button>
                </div>
              </div>
            </div>

             {/* PEMBAYARAN */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body space-y-4">
                <h2 className="card-title">Pembayaran</h2>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-box bg-base-200 p-4">
                    <p className="text-sm opacity-60">Total Tagihan</p>
                    <p className="text-lg font-bold">
                      {formatRupiah(totalPrice)}
                    </p>
                  </div>

                  <div className="rounded-box bg-base-200 p-4">
                    <p className="text-sm opacity-60">Sudah Dibayar</p>
                    <p className="text-lg font-bold">
                      {formatRupiah(paidAmount)}
                    </p>
                  </div>

                  <div className="rounded-box bg-base-200 p-4">
                    <p className="text-sm opacity-60">Sisa Tagihan</p>
                    <p className="text-lg font-bold">
                      {formatRupiah(remainingAmount)}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm opacity-60">Status Pembayaran: </span>
                  <span
                    className={`badge ${
                      remainingAmount === 0
                        ? "badge-success"
                        : paidAmount > 0
                          ? "badge-warning"
                          : "badge-error"
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </div>

                {isPaymentsLoading && (
                  <p className="text-sm opacity-60">
                    Memuat riwayat pembayaran...
                  </p>
                )}

                {isPaymentsError && (
                  <div className="alert alert-error">
                    Gagal memuat riwayat pembayaran. Jangan mencatat pembayaran
                    sebelum riwayat berhasil dimuat.
                  </div>
                )}

                {!isPaymentsLoading && !isPaymentsError && (
                  <>
                    <h3 className="font-semibold">Riwayat Pembayaran</h3>

                    {payments.length === 0 ? (
                      <p className="text-sm opacity-60">
                        Belum ada pembayaran.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Waktu</th>
                              <th>Metode</th>
                              <th>Nominal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment : any) => (
                              <tr key={payment.id}>
                                <td>
                                  {new Date(payment.paidAt).toLocaleString(
                                    "id-ID",
                                  )}
                                </td>
                                <td>
                                  {payment.paymentMethod === "cash"
                                    ? "Cash"
                                    : "Transfer"}
                                </td>
                                <td>{formatRupiah(Number(payment.amount))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {remainingAmount > 0 && (
                  <form
                    className="space-y-4 border-t border-base-300 pt-4"
                    onSubmit={handleCreatePayment}
                  >
                    <h3 className="font-semibold">Catat Pembayaran</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="form-control w-full">
                        <span className="label-text mb-2">
                          Nominal Pembayaran (rupiah)
                        </span>
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          min={1}
                          max={remainingAmount}
                          step={1}
                          value={paymentAmount}
                          onChange={(event) =>
                            setPaymentAmount(event.target.value)
                          }
                          placeholder="Contoh: 30000"
                          required
                          disabled={
                            createPayment.isPending ||
                            isPaymentsLoading ||
                            isPaymentsError
                          }
                        />
                        <span className="label-text-alt mt-1 opacity-60">
                          Maksimal {formatRupiah(remainingAmount)}
                        </span>
                      </label>

                      <label className="form-control w-full">
                        <span className="label-text mb-2">
                          Metode Pembayaran
                        </span>
                        <select
                          className="select select-bordered w-full"
                          value={paymentMethod}
                          onChange={(event) =>
                            setPaymentMethod(
                              event.target.value as PaymentMethod,
                            )
                          }
                          disabled={createPayment.isPending}
                        >
                          <option value="cash">Cash</option>
                          <option value="transfer">Transfer</option>
                        </select>
                      </label>
                    </div>

                    {paymentMessage && (
                      <p
                        role="status"
                        className={
                          paymentMessage.startsWith("Pembayaran berhasil")
                            ? "text-sm text-success"
                            : "text-sm text-error"
                        }
                      >
                        {paymentMessage}
                      </p>
                    )}

                    <div className="card-actions justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                          createPayment.isPending ||
                          isPaymentsLoading ||
                          isPaymentsError ||
                          remainingAmount <= 0
                        }
                      >
                        {createPayment.isPending && (
                          <span className="loading loading-spinner loading-sm" />
                        )}
                        Catat Pembayaran
                      </button>
                    </div>
                  </form>
                )}

                {remainingAmount === 0 && !isPaymentsError && (
                  <div className="alert alert-success">
                    Tagihan order ini sudah lunas.
                  </div>
                )}
              </div>
            </div>

          </>
        )}
      </section>
    </Layout>
  );
};

export default DetailPage;