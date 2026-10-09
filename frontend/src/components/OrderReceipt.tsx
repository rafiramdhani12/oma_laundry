
import type { OrderDetail } from "../interface";
import type { Payment } from "../hooks/usePayment";
import "../styles/receipt.css";

type OrderReceiptProps = {
  order: OrderDetail;
  payments: Payment[];
};

const formatRupiah = (value: number) =>
  `Rp${value.toLocaleString("id-ID")}`;

const OrderReceipt = ({ order, payments }: OrderReceiptProps) => {
  const paidAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  const remainingAmount = Math.max(
    0,
    Number(order.totalPrice) - paidAmount,
  );

  const paymentStatus =
    remainingAmount === 0
      ? "LUNAS"
      : paidAmount > 0
        ? "DIBAYAR SEBAGIAN"
        : "BELUM DIBAYAR";

  return (
    <article className="receipt-print-area">
      <header className="receipt-header">
        <h1>OMA LAUNDRY</h1>
        <p>Nota Pesanan Laundry</p>
      </header>

      <hr />

      <section className="receipt-info">
        <div>
          <span>Nomor Order</span>
          <strong>{order.orderNumber}</strong>
        </div>

        <div>
          <span>Tanggal Order</span>
          <strong>
            {new Date(order.createdAt).toLocaleString("id-ID")}
          </strong>
        </div>

        <div>
          <span>Nama Pelanggan</span>
          <strong>{order.customer.name}</strong>
        </div>

        <div>
          <span>Telepon</span>
          <strong>{order.customer.phone || "-"}</strong>
        </div>
      </section>

      <hr />

      <table className="receipt-table">
        <thead>
          <tr>
            <th>Layanan</th>
            <th>Jumlah</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {order.items.map((item : any) => (
            <tr key={item.id}>
              <td>{item.serviceName}</td>
              <td>
                {item.quantity} {item.unit}
              </td>
              <td>{formatRupiah(Number(item.totalPrice))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <section className="receipt-totals">
        <div>
          <span>Total Tagihan</span>
          <strong>{formatRupiah(Number(order.totalPrice))}</strong>
        </div>

        <div>
          <span>Total Dibayar</span>
          <strong>{formatRupiah(paidAmount)}</strong>
        </div>

        <div>
          <span>Sisa Tagihan</span>
          <strong>{formatRupiah(remainingAmount)}</strong>
        </div>

        <div>
          <span>Status Pembayaran</span>
          <strong>{paymentStatus}</strong>
        </div>
      </section>

      <hr />

      <h2>Riwayat Pembayaran</h2>

      {payments.length === 0 ? (
        <p>Belum ada pembayaran.</p>
      ) : (
        <table className="receipt-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Metode</th>
              <th>Nominal</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  {new Date(payment.paidAt).toLocaleString("id-ID")}
                </td>
                <td>
                  {payment.paymentMethod === "cash" ? "Cash" : "Transfer"}
                </td>
                <td>{formatRupiah(Number(payment.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer className="receipt-footer">
        <p>Terima kasih telah menggunakan layanan Oma Laundry.</p>
        <p>Simpan nota ini sebagai bukti transaksi.</p>
      </footer>
    </article>
  );
};

export default OrderReceipt;