import { FiHome, FiFileText } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { BaseLayout } from "./BaseLayout";

export const UserLayout = () => {
  const menu = [
    { key: "/user", label: "Beranda", icon: FiHome },
    { key: "/user/report", label: "Laporkan Kehilangan", icon: FaEdit },
    { key: "/user/my-reports", label: "Laporan Saya", icon: FiFileText },
  ];

  return <BaseLayout menu={menu} />;
};
