import type { OrderDetail } from "../interface";
import "../styles/receipt.css";

// Nota membaca langsung dari order.payment (1 order = 1 pembayaran),
// jadi tidak perlu prop `payments` lagi.
type OrderReceiptProps = {
  order: OrderDetail;
};

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "short",
    timeStyle: "medium",
  });

const OrderReceipt = ({ order }: OrderReceiptProps) => {
  // Hanya dianggap lunas kalau status di database "paid"
  const payment = order.payment?.status === "paid" ? order.payment : null;

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
          <strong>{formatDateTime(order.createdAt)}</strong>
        </div>

        <div>
          <span>Estimasi Selesai</span>
          <strong>
            {order.estimateDoneAt ? formatDateTime(order.estimateDoneAt) : "-"}
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
          {order.items.map((item) => (
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
          <span>Status Pembayaran</span>
          <strong>{payment ? "LUNAS" : "BELUM DIBAYAR"}</strong>
        </div>

        {payment && (
          <>
            <div>
              <span>Metode</span>
              <strong>
                {payment.paymentMethod === "cash" ? "Cash" : "Transfer"}
              </strong>
            </div>

            <div>
              <span>Bayar</span>
              <strong>{formatRupiah(payment.amount)}</strong>
            </div>

            <div>
              <span>Kembalian</span>
              <strong>{formatRupiah(payment.change)}</strong>
            </div>

            {payment.paidAt && (
              <div>
                <span>Waktu Bayar</span>
                <strong>{formatDateTime(payment.paidAt)}</strong>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="receipt-footer">
        <p>Terima kasih telah menggunakan layanan Oma Laundry.</p>
        <p>Simpan nota ini sebagai bukti transaksi.</p>
      </footer>
    </article>
  );
};

export default OrderReceipt;