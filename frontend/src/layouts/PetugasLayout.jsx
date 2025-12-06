import { MdFileUpload } from "react-icons/md";
import { FiHome, FiFileText } from "react-icons/fi";

import { BaseLayout } from "./BaseLayout";

export const PetugasLayout = () => {
  const menu = [
    { key: "/petugas", label: "Dashboard", icon: FiHome },
    { key: "/petugas/upload", label: "Unggah Barang", icon: MdFileUpload },
    { key: "/petugas/manage-reports", label: "Manajemen Barang", icon: FiFileText },
  ];

  return <BaseLayout menu={menu} />;
};
