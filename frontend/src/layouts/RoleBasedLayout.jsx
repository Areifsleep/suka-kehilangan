import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "./AdminLayout";
import { UserLayout } from "./UserLayout";
import { PetugasLayout } from "./PetugasLayout";

export const RoleBasedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case "ADMIN":
      return <AdminLayout />;
    case "PETUGAS":
      return <PetugasLayout />;
    case "USER":
    default:
      return <UserLayout />;
  }
};
