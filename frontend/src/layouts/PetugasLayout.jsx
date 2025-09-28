import { FiHome, FiSearch, FiFileText, FiUsers, FiBarChart } from "react-icons/fi";
import { BaseLayout } from "./BaseLayout";

export const PetugasLayout = () => {
  const menu = [
    { key: "/petugas", label: "Dashboard", icon: FiHome },
    { key: "/petugas/search-items", label: "Cari Barang", icon: FiSearch },
    { key: "/petugas/reports", label: "Kelola Laporan", icon: FiFileText },
    { key: "/petugas/users", label: "Data User", icon: FiUsers },
    { key: "/petugas/statistics", label: "Statistik", icon: FiBarChart },
  ];

  return <BaseLayout menu={menu} />;
};
