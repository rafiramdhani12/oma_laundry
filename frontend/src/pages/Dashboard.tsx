import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import RecentOrders from "../components/RecentOrders";
import StatCard, { type StatCardProps, type Tone } from "../components/StatCard";
import { useOrderStats, useRecentOrders } from "../hooks/useOrders";
import type { OrderStatus } from "../interface";
import { formatDate, formatRupiah } from "../utils/format";
import { STATUS_LABEL } from "../utils/status";

// Status aktif yang dipantau di dashboard
const STATUS_CARDS: { status: OrderStatus; icon: string; tone: Tone }[] = [
  { status: "diterima", icon: "📥", tone: "amber" },
  { status: "diproses", icon: "🫧", tone: "sky" },
  { status: "siap", icon: "🛍️", tone: "emerald" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const recent = useRecentOrders();
  const stats = useOrderStats();

  // undefined = loading (skeleton), "-" = gagal
  const fallback = stats.isError ? "-" : undefined;
  const s = stats.data;

  const cards: StatCardProps[] = [
    {
      title: "Revenue Today",
      icon: "💰",
      tone: "indigo",
      value: s ? formatRupiah(s.todayRevenue) : fallback,
      className: "col-span-2 lg:col-span-1", // full width di HP
    },
    {
      title: "Order Today",
      icon: "🧺",
      tone: "indigo",
      value: s?.todayOrders ?? fallback,
    },
    ...STATUS_CARDS.map(({ status, icon, tone }) => ({
      title: STATUS_LABEL[status],
      icon,
      tone,
      value: s?.statusCount[status] ?? fallback,
    })),
  ];

  return (
    <Layout>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-6">
        {/* Banner */}
        <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg sm:p-6">
          <p className="text-sm text-indigo-100">Sistem internal Oma Laundry</p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
              <p className="mt-1 text-sm text-indigo-100">{formatDate(new Date())}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/orders/create")}
              className="btn w-full border-0 bg-white text-indigo-600 shadow hover:bg-indigo-50 sm:w-auto"
            >
              + Buat Order
            </button>
          </div>
        </section>

        {/* Statistik: 2 kolom di HP, 5 kolom di desktop */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </section>

        <RecentOrders
          orders={recent.data}
          isLoading={recent.isLoading}
          isError={recent.isError}
          onRetry={() => recent.refetch()}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;