import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Layout from "../components/Layout";
import Table, { type ColumnType } from "../components/Table";
import { useOrders } from "../hooks/useOrders";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const date = new Date();

  const {
    data: orders,
    isLoading,
    isError,
  } = useOrders();

  const tableColumns: ColumnType[] = [
    { header: "ID", accessor: "orderId" },
    { header: "Pelanggan", accessor: "customerName" },
    { header: "Layanan", accessor: "services" },
    { header: "Status", accessor: "status" },
    { header: "Berat", accessor: "berat" },
    { header: "Unit", accessor: "unit" },
    { header: "Total", accessor: "total" },
    {
      header: "Action",
      render: (row) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/orders/${row.orderId}`)}
        >
          Detail
        </button>
      ),
    },
  ];

  // Adaptasi response API ke format tabel dashboard.
  const tableData = (orders ?? []).map((order) => ({
    orderId: order.id,
    customerName: order.customerName,
    services: "-",
    status: order.status,
    berat: "-",
    unit: "-",
    total: formatRupiah(Number(order.totalPrice)),
  }));

  const cardList = [
    {
      id: 1,
      title: "Order Today",
      value: (orders ?? []).filter(
        (order) =>
          new Date(order.createdAt).toDateString() === date.toDateString()
      ).length,
  },
    {
      id: 2,
      title: "Revenue Today",
      value: formatRupiah(
        (orders ?? [])
          .filter(
            (order) =>
              new Date(order.createdAt).toDateString() ===
              date.toDateString()
          )
          .reduce(
            (total, order) => total + Number(order.totalPrice),
            0
          )
      ),
    },
    {
      id: 3,
      title: "Status (Processed)",
      value: (orders ?? []).filter(
        (order) => order.status === "diproses"
      ).length,
    },
    {
      id: 4,
      title: "Status (Pending)",
      value: (orders ?? []).filter(
        (order) => order.status === "diterima"
      ).length,
    },
    {
      id: 5,
      title: "Selesai (Done)",
      value: (orders ?? []).filter(
        (order) => order.status === "siap"
      ).length,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h5 className="mb-2 text-sm text-gray-500">
            Sistem internal Oma Laundry
          </h5>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <button
              type="button"
              className="btn btn-primary w-full rounded-2xl sm:w-auto"
              onClick={() => navigate("/orders/create")}
            >
              + Buat Order
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {formatDate(date.toISOString())}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cardList.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>

        {/* Orders table */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <span className="loading loading-spinner loading-md" />
              <p>Loading orders...</p>
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-error">
              Gagal memuat orders. Coba refresh halaman.
            </p>
          ) : (
            <Table
              title="Daftar Orders"
              columns={tableColumns}
              data={tableData}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
