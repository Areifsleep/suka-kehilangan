import { useState, useEffect } from "react";
import { FiPackage, FiClock, FiCheck, FiFileText, FiTrendingUp, FiMapPin, FiCalendar, FiUser, FiTag } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
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
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

// Enhanced StatCard component with trends and animations
function StatCard({ title, value, icon, bgColor = "bg-gray-100", iconColor = "text-gray-400", trend, trendValue }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 p-6 group">
      <div className="flex items-center justify-between">
        <div className="flex flex-col flex-1">
          <div className="text-sm text-gray-500 mb-1">{title}</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          {/* {trend && (
            <div className={`flex items-center text-sm ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
              <FiTrendingUp className={`mr-1 text-xs ${trend === "down" ? "rotate-180" : ""}`} />
              <span>{trendValue}</span>
            </div>
          )} */}
        </div>
        <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
          <div className={`text-2xl ${iconColor}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// Chart.js Bar Chart Component
function CategoryBarChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Jumlah Barang",
        data: data.map((item) => item.value),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // blue
          "rgba(139, 92, 246, 0.8)", // purple
          "rgba(236, 72, 153, 0.8)", // pink
          "rgba(34, 197, 94, 0.8)", // green
          "rgba(234, 179, 8, 0.8)", // yellow
          "rgba(249, 115, 22, 0.8)", // orange
        ],
        borderColor: ["rgb(59, 130, 246)", "rgb(139, 92, 246)", "rgb(236, 72, 153)", "rgb(34, 197, 94)", "rgb(234, 179, 8)", "rgb(249, 115, 22)"],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            return `Jumlah: ${context.parsed.y} item`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Barang Berdasarkan Kategori</h3>
        <div className="h-[300px]">
          <Bar
            data={chartData}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Chart.js Doughnut Chart Component
function LocationDoughnutChart({ locations }) {
  const chartData = {
    labels: locations.map((loc) => loc.name),
    datasets: [
      {
        data: locations.map((loc) => loc.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(139, 92, 246)",
          "rgb(249, 115, 22)",
          "rgb(236, 72, 153)",
          "rgb(234, 179, 8)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          color: "#374151",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribusi Lokasi Penemuan</h3>
        <div className="h-[300px]">
          <Doughnut
            data={chartData}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function TrendLineChart({ trendData }) {
  const chartData = {
    labels: trendData.map((item) => item.month),
    datasets: [
      {
        label: "Barang Ditemukan",
        data: trendData.map((item) => item.found),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Barang Diambil",
        data: trendData.map((item) => item.claimed),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          color: "#374151",
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Tren Bulanan</h3>
        <div className="h-[300px]">
          <Line
            data={chartData}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Component
function RecentActivity({ activities }) {
  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0"
            >
              <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                <div className="flex items-center text-xs text-gray-400 mt-2">
                  <FiCalendar
                    className="mr-1"
                    size={12}
                  />
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

export default function PetugasDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    unclaimed: 0,
    claimed: 0,
    reports: 0,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      // Enhanced dummy data dengan trend
      setStats({
        totalItems: 500,
        unclaimed: 200,
        claimed: 300,
        reports: 20,
      });

      // Data kategori untuk bar chart
      setCategoryData([
        { label: "Barang Pribadi", value: 150 },
        { label: "Elektronik", value: 120 },
        { label: "Aksesori", value: 80 },
        { label: "Kendaraan", value: 70 },
        { label: "Dokumen", value: 50 },
        { label: "Pakaian", value: 30 },
      ]);

      // Data lokasi untuk doughnut chart
      setLocationData([
        { name: "Perpustakaan", count: 85 },
        { name: "Masjid UIN", count: 75 },
        { name: "Tempat Parkir", count: 120 },
        { name: "Kantin", count: 60 },
        { name: "Ruang Kelas", count: 95 },
        { name: "Gedung A", count: 40 },
        { name: "Gedung B", count: 25 },
      ]);

      // Data tren untuk line chart
      setTrendData([
        { month: "Jul", found: 45, claimed: 38 },
        { month: "Agu", found: 52, claimed: 45 },
        { month: "Sep", found: 48, claimed: 42 },
        { month: "Okt", found: 65, claimed: 58 },
        { month: "Nov", found: 70, claimed: 62 },
        { month: "Des", found: 85, claimed: 55 },
      ]);

      // Recent activities
      setRecentActivities([
        {
          title: "Barang Baru Ditemukan",
          description: "Dompet coklat ditemukan di Masjid UIN",
          time: "2 jam yang lalu",
          icon: (
            <FiPackage
              className="text-blue-600"
              size={18}
            />
          ),
          bgColor: "bg-blue-100",
        },
        {
          title: "Barang Diambil",
          description: "Samsung Galaxy telah diambil pemiliknya",
          time: "5 jam yang lalu",
          icon: (
            <FiCheck
              className="text-green-600"
              size={18}
            />
          ),
          bgColor: "bg-green-100",
        },
        {
          title: "Laporan Baru",
          description: "Laporan kehilangan kunci motor",
          time: "1 hari yang lalu",
          icon: (
            <FiFileText
              className="text-purple-600"
              size={18}
            />
          ),
          bgColor: "bg-purple-100",
        },
        {
          title: "Barang Pending",
          description: "Verifikasi kunci motor Honda di parkiran",
          time: "1 hari yang lalu",
          icon: (
            <FiClock
              className="text-yellow-600"
              size={18}
            />
          ),
          bgColor: "bg-yellow-100",
        },
        {
          title: "Barang Baru Ditemukan",
          description: "Tas ransel hitam di Perpustakaan",
          time: "2 hari yang lalu",
          icon: (
            <FiPackage
              className="text-blue-600"
              size={18}
            />
          ),
          bgColor: "bg-blue-100",
        },
      ]);
    }, 100);
  }, []);

  return (
    <>
      {/* Stat cards dengan trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Barang"
          value={stats.totalItems}
          icon={<FiPackage />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
          trendValue="+12% dari minggu lalu"
        />
        <StatCard
          title="Belum Diambil"
          value={stats.unclaimed}
          icon={<FiClock />}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          trend="down"
          trendValue="-5% dari minggu lalu"
        />
        <StatCard
          title="Sudah Diambil"
          value={stats.claimed}
          icon={<FiCheck />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          trend="up"
          trendValue="+8% dari minggu lalu"
        />
      </div>

      {/* Charts Section - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CategoryBarChart data={categoryData} />
        <LocationDoughnutChart locations={locationData} />
      </div>

      {/* Charts Section - Bottom Row */}
      <div className="mb-6">
        <TrendLineChart trendData={trendData} />
      </div>
    </>
  );
}
