import { MdFileUpload } from "react-icons/md";
import { FiHome, FiFileText } from "react-icons/fi";
import { FaCheckDouble } from "react-icons/fa";
import { TbReport } from "react-icons/tb";

import { BaseLayout } from "./BaseLayout";

export const PetugasLayout = () => {
  const menu = [
    { key: "/petugas", label: "Dashboard", icon: FiHome },
    { key: "/petugas/upload", label: "Unggah Barang", icon: MdFileUpload },
    { key: "/petugas/manage-reports", label: "Manajemen Barang", icon: FiFileText },
    { key: "/petugas/verify-reports", label: "Verifikasi Barang", icon: FaCheckDouble },
    { key: "/petugas/reports", label: "Laporan Kehilangan", icon: TbReport },
  ];

  return <BaseLayout menu={menu} />;
};
