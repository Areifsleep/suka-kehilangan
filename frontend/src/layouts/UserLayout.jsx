import { FiHome, FiSearch, FiPlusCircle, FiFileText } from "react-icons/fi";
import { BaseLayout } from "./BaseLayout";

export const UserLayout = () => {
  const menu = [
    { key: "/user", label: "Beranda", icon: FiHome },
    { key: "/user/search", label: "Cari Barang", icon: FiSearch },
    { key: "/user/report", label: "Laporkan Kehilangan", icon: FiPlusCircle },
    { key: "/user/my-reports", label: "Laporan Saya", icon: FiFileText },
  ];

  return <BaseLayout menu={menu} />;
};
