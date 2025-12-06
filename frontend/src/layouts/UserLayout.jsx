import { FiHome } from "react-icons/fi";
import { BaseLayout } from "./BaseLayout";

export const UserLayout = () => {
  const menu = [{ key: "/user", label: "Beranda", icon: FiHome }];

  return <BaseLayout menu={menu} />;
};
