import { TbActivity } from "react-icons/tb";
import { FiUsers, FiUserCheck, FiCalendar, FiSearch } from "react-icons/fi";
import { AdminDashboardSkeleton } from "../components/AdminDashboardSkeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { Card, CardContent } from "@/components/ui/card";

import { useDashboardStats } from "../mutations/adminManagementMutations";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function StatCard({ title, value, icon, isLoading }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="mt-4 text-2xl font-bold">
        {isLoading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function RecentActivity({ activities }) {
  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Aktivitas Terbaru
        </h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <TbActivity />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-2">
                  <FiCalendar className="mr-1" size={12} />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: statsResponse, isLoading: statsLoading } = useDashboardStats();

  // Extract stats from backend response
  const stats = {
    found: statsResponse?.data?.statistik?.total_barang || 0,
    claimed: statsResponse?.data?.statistik?.sudah_diambil || 0,
    officers:
      statsResponse?.data?.users?.by_role?.find((r) => r.role === "PETUGAS")
        ?.count || 0,
  };

  // Extract activities from backend response
  const backendActivities = statsResponse?.data?.aktivitas_terbaru || [];
  const recentActivities =
    backendActivities.length > 0
      ? backendActivities.map((item) => ({
          title:
            item.aksi === "Dicatat"
              ? "Barang Baru Dicatat"
              : "Barang Diserahkan",
          description: `${item.nama_barang} - ${item.kategori}`,
          time: new Date(item.waktu).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      : [
          {
            title: "Sistem Dashboard",
            description: "Belum ada aktivitas terbaru",
            time: new Date().toLocaleString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];

  // Get chart data from backend
  const chartKategori = statsResponse?.data?.charts?.kategori || [];
  const chartTrend = statsResponse?.data?.charts?.trend || [];

  // Format data untuk Chart.js
  const categoryData = {
    labels: chartKategori.map((k) => k.label),
    datasets: [
      {
        label: "Jumlah Barang per Kategori",
        data: chartKategori.map((k) => k.value),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(234, 179, 8, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(249, 115, 22, 0.7)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(249, 115, 22, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const monthlyTrendData = {
    labels: chartTrend.map((t) => t.bulan),
    datasets: [
      {
        label: "Barang Ditemukan",
        data: chartTrend.map((t) => t.ditemukan),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Barang Diambil",
        data: chartTrend.map((t) => t.diambil),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const statusDistributionData = {
    labels: ["Belum Diambil", "Sudah Diambil"],
    datasets: [
      {
        data: [
          statsResponse?.data?.statistik?.belum_diambil || 0,
          statsResponse?.data?.statistik?.sudah_diambil || 0,
        ],
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(34, 197, 94, 0.8)"],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(34, 197, 94, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default") {
          delay = context.dataIndex * 100;
        }
        return delay;
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
      x: {
        type: "number",
        easing: "easeInOutQuart",
        duration: 2000,
        from: 0,
      },
      y: {
        type: "number",
        easing: "easeInOutQuart",
        duration: 2000,
        from: 0,
      },
    },
  };

  if (statsLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Barang Ditemukan"
          value={stats?.found || 0}
          icon={<FiSearch />}
          isLoading={statsLoading}
        />
        <StatCard
          title="Barang Diambil"
          value={stats?.claimed || 0}
          icon={<FiUserCheck />}
          isLoading={statsLoading}
        />
        <StatCard
          title="Petugas Aktif"
          value={stats?.officers || 0}
          icon={<FiUsers />}
          isLoading={statsLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Trend Bulanan - Line Chart */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 text-gray-700">
              Tren Bulanan Barang Temuan
            </h3>
            <div className="h-72">
              <Line data={monthlyTrendData} options={lineChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution - Doughnut Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 text-gray-700">
              Distribusi Status
            </h3>
            <div className="h-72 flex items-center justify-center">
              <Doughnut
                data={statusDistributionData}
                options={doughnutOptions}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution - Bar Chart */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 text-gray-700">
            Distribusi Barang per Kategori
          </h3>
          <div className="h-80">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <RecentActivity activities={recentActivities} />
    </>
  );
}
