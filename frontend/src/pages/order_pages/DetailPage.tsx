import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useOrderDetail, useUpdateOrderStatus } from "../../hooks/useOrders";
import { usePayOrder, type PaymentMethod } from "../../hooks/usePayment";
import PrintReceiptButton from "../../components/PrintReceiptButton";
import OrderReceipt from "../../components/OrderReceipt";
import {
  STATUS_ACTION,
  STATUS_FLOW,
  STATUS_LABEL,
  getNextStatus,
} from "../../utils/status";

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  });

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const validOrderId = Number.isInteger(orderId) && orderId > 0;

  const { data: order, isLoading, isError } = useOrderDetail(orderId);

  const updateStatus = useUpdateOrderStatus();
  const payOrder = usePayOrder();

  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [payError, setPayError] = useState("");

  // Status diturunkan langsung dari data order, tidak perlu state sendiri.
  const currentIndex = order ? STATUS_FLOW.indexOf(order.status) : -1;
  const nextStatus = order ? getNextStatus(order.status) : null;
  const totalPrice = Number(order?.totalPrice ?? 0);

  // Preview kembalian saat mengetik (hanya untuk tampilan).
  // Angka resmi untuk nota dihitung backend dan datang lewat order.payment.change.
  const received = Number(amountReceived);
  const hasAmount = amountReceived !== "" && Number.isFinite(received);
  const enough = hasAmount && Number.isInteger(received) && received >= totalPrice;

  const handleAdvanceStatus = async () => {
    if (!validOrderId || !nextStatus) return;

    const confirmed = window.confirm(
      nextStatus === "diambil"
        ? "Konfirmasi bahwa cucian sudah diambil customer?"
        : `Ubah status order menjadi "${STATUS_LABEL[nextStatus]}"?`,
    );

    if (!confirmed) return;

    try {
      setMessage("");
      await updateStatus.mutateAsync({ id: orderId, status: nextStatus });
      setMessage("Status order berhasil diperbarui.");
    } catch {
      setMessage("Gagal memperbarui status order. Coba muat ulang halaman.");
    }
  };

  const handlePay = async () => {
    if (!order?.payment) return;

    if (!enough) {
      setPayError("Nominal kurang dari total tagihan.");
      return;
    }

    try {
      setPayError("");
      await payOrder.mutateAsync({
        id: order.payment.id,
        amount: received,
        paymentMethod,
      });
      setAmountReceived("");
    } catch (error: any) {
      // Tampilkan pesan dari backend kalau ada
      setPayError(
        error?.response?.data?.message ?? "Gagal mencatat pembayaran. Coba lagi.",
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
          <div className="alert alert-error">Gagal memuat detail order.</div>
        )}

        {!isLoading && !isError && !order && validOrderId && (
          <div className="alert alert-warning">Order tidak ditemukan.</div>
        )}

        {order && (
          <>
            <div className="flex justify-end print:hidden">
              <PrintReceiptButton />
            </div>

            {/* Komponen nota menerima array, jadi bungkus payment tunggal */}
            <OrderReceipt
              order={order}
              payments={order.payment?.status === "paid" ? [order.payment] : []}
            />

            {/* INFORMASI ORDER */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h2 className="card-title">{order.orderNumber}</h2>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm opacity-60">Customer</p>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm">{order.customer.phone}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-60">Tanggal Order</p>
                    <p>{formatDateTime(order.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-60">Estimasi Selesai</p>
                    <p>
                      {order.estimateDoneAt
                        ? formatDateTime(order.estimateDoneAt)
                        : "Belum ditentukan"}
                    </p>
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

            {/* STATUS LAUNDRY: sekali jalan, maju satu langkah */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Status Laundry</h2>

                <ul className="steps steps-vertical w-full lg:steps-horizontal">
                  {STATUS_FLOW.map((step, index) => (
                    <li
                      key={step}
                      className={`step ${index <= currentIndex ? "step-primary" : ""}`}
                    >
                      {STATUS_LABEL[step]}
                    </li>
                  ))}
                </ul>

                {message && (
                  <p
                    role="status"
                    className={
                      message.startsWith("Gagal") || message.startsWith("ID")
                        ? "text-sm text-error"
                        : "text-sm text-success"
                    }
                  >
                    {message}
                  </p>
                )}

                {nextStatus ? (
                  <div className="card-actions justify-end">
                    <button
                      type="button"
                      className="btn btn-primary w-full sm:w-auto"
                      onClick={handleAdvanceStatus}
                      disabled={updateStatus.isPending}
                    >
                      {updateStatus.isPending && (
                        <span className="loading loading-spinner loading-sm" />
                      )}
                      {STATUS_ACTION[nextStatus]}
                    </button>
                  </div>
                ) : (
                  <div className="alert alert-success">
                    Order sudah diambil. Status tidak bisa diubah lagi.
                  </div>
                )}
              </div>
            </div>

            {/* PEMBAYARAN: unpaid -> paid, statusnya dari database */}
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">Pembayaran</h2>
                  <span
                    className={`badge ${
                      order.payment?.status === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {order.payment?.status === "paid" ? "Lunas" : "Belum dibayar"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="opacity-60">Total Tagihan</span>
                  <span className="text-lg font-bold">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>

                {!order.payment ? (
                  <p className="text-sm opacity-60">
                    Data pembayaran belum tersedia.
                  </p>
                ) : order.payment.status === "paid" ? (
                  <div className="space-y-2 border-t border-base-300 pt-4 text-sm">
                    <p className="opacity-70">
                      Dibayar via{" "}
                      {order.payment.paymentMethod === "cash" ? "Cash" : "Transfer"}
                      {order.payment.paidAt &&
                        ` pada ${formatDateTime(order.payment.paidAt)}`}
                    </p>
                    <div className="flex justify-between">
                      <span className="opacity-60">Uang diterima</span>
                      <span className="font-medium">
                        {formatRupiah(order.payment.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Kembalian</span>
                      <span className="font-medium">
                        {formatRupiah(order.payment.change)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 border-t border-base-300 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="form-control w-full">
                        <span className="label-text mb-2">Metode Pembayaran</span>
                        <select
                          className="select select-bordered w-full"
                          value={paymentMethod}
                          onChange={(event) =>
                            setPaymentMethod(event.target.value as PaymentMethod)
                          }
                          disabled={payOrder.isPending}
                        >
                          <option value="cash">Cash</option>
                          <option value="transfer">Transfer</option>
                        </select>
                      </label>

                      <label className="form-control w-full">
                        <span className="label-text mb-2">
                          Uang diterima (rupiah)
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            inputMode="numeric"
                            className="input input-bordered w-full"
                            min={totalPrice}
                            step={1}
                            value={amountReceived}
                            onChange={(event) => setAmountReceived(event.target.value)}
                            placeholder={`Minimal ${totalPrice}`}
                            disabled={payOrder.isPending}
                          />
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setAmountReceived(String(totalPrice))}
                            disabled={payOrder.isPending}
                          >
                            Uang pas
                          </button>
                        </div>
                      </label>
                    </div>

                    {hasAmount && (
                      <div className="flex items-center justify-between rounded-box bg-base-200 p-4">
                        <span className="opacity-60">
                          {enough ? "Kembalian" : "Kurang"}
                        </span>
                        <span
                          className={`text-lg font-bold ${enough ? "" : "text-error"}`}
                        >
                          {formatRupiah(Math.abs(received - totalPrice))}
                        </span>
                      </div>
                    )}

                    {payError && <p className="text-sm text-error">{payError}</p>}

                    <div className="card-actions justify-end">
                      <button
                        type="button"
                        className="btn btn-primary w-full sm:w-auto"
                        onClick={handlePay}
                        disabled={payOrder.isPending || !enough}
                      >
                        {payOrder.isPending && (
                          <span className="loading loading-spinner loading-sm" />
                        )}
                        Tandai Lunas
                      </button>
                    </div>
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