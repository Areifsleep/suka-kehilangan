import { FiHome, FiUsers, FiUserCheck, FiFileText } from "react-icons/fi";
import { BaseLayout } from "./BaseLayout";

export const AdminLayout = () => {
  const menu = [
    { key: "/admin", label: "Dashboard", icon: FiHome },
    { key: "/admin/manage-users", label: "Manajemen User", icon: FiUsers },
    { key: "/admin/manage-officers", label: "Manajemen Petugas", icon: FiUserCheck },
    { key: "/admin/audit-reports", label: "Audit", icon: FiFileText },
  ];

  return <BaseLayout menu={menu} />;
};
