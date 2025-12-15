import { FiHome, FiUsers, FiUserCheck, FiTag } from "react-icons/fi";
import { BaseLayout } from "./BaseLayout";

export const AdminLayout = () => {
  const menu = [
    { key: "/admin", label: "Dashboard", icon: FiHome },
    { key: "/admin/manage-users", label: "Manajemen User", icon: FiUsers },
    {
      key: "/admin/manage-officers",
      label: "Manajemen Petugas",
      icon: FiUserCheck,
    },
    {
      key: "/admin/manage-categories",
      label: "Manajemen Kategori",
      icon: FiTag,
    },
  ];

  return <BaseLayout menu={menu} />;
};
