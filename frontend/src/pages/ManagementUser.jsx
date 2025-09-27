import React, { useEffect, useMemo, useState } from "react";
import { FiMenu, FiHome, FiUsers, FiUserCheck, FiFileText, FiSettings, FiLogOut, FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AddUserModal, EditUserModal, DeleteUserModal, Pagination } from "@/components/user-management";
import UIN from "@/assets/UIN.png";

export default function ManagementUser() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("users");

  // data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  // dialog state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // dummy data fakultas dan prodi
  const faculties = ["FST", "FISIP", "FEB"];
  const programs = ["Informatika", "Sistem Informasi", "Teknik Komputer"];

  // dummy data
  useEffect(() => {
    const dummyUsers = [
      {
        id: 1,
        name: "Ahmad Rizki",
        username: "ahmad.rizki",
        email: "ahmad.rizki@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Informatika"
      },
      {
        id: 2,
        name: "Siti Aminah",
        username: "siti.aminah",
        email: "siti.aminah@student.uin-suka.ac.id",
        faculty: "FISIP",
        program: "Sistem Informasi"
      },
      {
        id: 3,
        name: "Muhammad Fauzan",
        username: "muhammad.fauzan",
        email: "muhammad.fauzan@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Teknik Komputer"
      },
      {
        id: 4,
        name: "Nur Hidayah",
        username: "nur.hidayah",
        email: "nur.hidayah@student.uin-suka.ac.id",
        faculty: "FEB",
        program: "Informatika"
      },
      {
        id: 5,
        name: "Abdul Rahman",
        username: "abdul.rahman",
        email: "abdul.rahman@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Sistem Informasi"
      },
      {
        id: 6,
        name: "Fatimah Zahra",
        username: "fatimah.zahra",
        email: "fatimah.zahra@student.uin-suka.ac.id",
        faculty: "FISIP",
        program: "Teknik Komputer"
      },
      {
        id: 7,
        name: "Yusuf Hakim",
        username: "yusuf.hakim",
        email: "yusuf.hakim@student.uin-suka.ac.id",
        faculty: "FEB",
        program: "Informatika"
      },
      {
        id: 8,
        name: "Khadijah Amara",
        username: "khadijah.amara",
        email: "khadijah.amara@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Sistem Informasi"
      },
      {
        id: 9,
        name: "Ibrahim Malik",
        username: "ibrahim.malik",
        email: "ibrahim.malik@student.uin-suka.ac.id",
        faculty: "FISIP",
        program: "Teknik Komputer"
      },
      {
        id: 10,
        name: "Maryam Salsabila",
        username: "maryam.salsabila",
        email: "maryam.salsabila@student.uin-suka.ac.id",
        faculty: "FEB",
        program: "Informatika"
      },
      {
        id: 11,
        name: "Omar Faruk",
        username: "omar.faruk",
        email: "omar.faruk@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Sistem Informasi"
      },
      {
        id: 12,
        name: "Aisha Putri",
        username: "aisha.putri",
        email: "aisha.putri@student.uin-suka.ac.id",
        faculty: "FISIP",
        program: "Teknik Komputer"
      },
      {
        id: 13,
        name: "Hamza Yusuf",
        username: "hamza.yusuf",
        email: "hamza.yusuf@student.uin-suka.ac.id",
        faculty: "FEB",
        program: "Informatika"
      },
      {
        id: 14,
        name: "Zainab Faris",
        username: "zainab.faris",
        email: "zainab.faris@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Sistem Informasi"
      },
      {
        id: 15,
        name: "Khalid Hassan",
        username: "khalid.hassan",
        email: "khalid.hassan@student.uin-suka.ac.id",
        faculty: "FISIP",
        program: "Teknik Komputer"
      },
      {
        id: 16,
        name: "Layla Nabila",
        username: "layla.nabila",
        email: "layla.nabila@student.uin-suka.ac.id",
        faculty: "FEB",
        program: "Informatika"
      },
      {
        id: 17,
        name: "Saad Qureshi",
        username: "saad.qureshi",
        email: "saad.qureshi@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Sistem Informasi"
      },
      {
        id: 18,
        name: "Hafsa Malik",
        username: "hafsa.malik",
        email: "hafsa.malik@student.uin-suka.ac.id",
        faculty: "FISIP",
        program: "Teknik Komputer"
      },
      {
        id: 19,
        name: "Tariq Aziz",
        username: "tariq.aziz",
        email: "tariq.aziz@student.uin-suka.ac.id",
        faculty: "FEB",
        program: "Informatika"
      },
      {
        id: 20,
        name: "Safiya Rahman",
        username: "safiya.rahman",
        email: "safiya.rahman@student.uin-suka.ac.id",
        faculty: "FST",
        program: "Sistem Informasi"
      }
    ];
    
    setUsers(dummyUsers);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.name + u.email + u.username + u.faculty + u.program).toLowerCase().includes(q));
  }, [users, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Modal handlers
  const handleAddUser = () => {
    setAddModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const handleAddSubmit = (data) => {
    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: data.name,
      username: data.username,
      email: data.email,
      faculty: data.faculty,
      program: data.program,
    };
    setUsers((prev) => [newUser, ...prev]);
    setAddModalOpen(false);
  };

  const handleEditSubmit = (data) => {
    setUsers((prev) => 
      prev.map((u) => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              name: data.name, 
              username: data.username, 
              email: data.email, 
              faculty: data.faculty, 
              program: data.program 
            } 
          : u
      )
    );
    setEditModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingUser) {
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
      setDeleteModalOpen(false);
    }
  };

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { key: "users", label: "Manajemen User", icon: <FiUsers /> },
    { key: "officers", label: "Manajemen Petugas", icon: <FiUserCheck /> },
    { key: "reports", label: "Laporan", icon: <FiFileText /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-white border-r transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img
                    src={UIN}
                    alt="UIN Sunan Kalijaga Logo"
                    className="mb-4 object-contain"
                    style={{ width: "40px", height: "40px", maxWidth: "40px", maxHeight: "40px" }}
                />
              </div>
              <div>
                <div className="text-sm font-semibold">SUKA KEHILANGAN</div>
              </div>
            </div>
          )}

          <button className="p-2 rounded hover:bg-gray-100" onClick={() => setCollapsed((c) => !c)} aria-label="toggle sidebar">
            <FiMenu />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {menu.map((m) => {
            const isActive = active === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActive(m.key)}
                className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 ${
                  isActive ? "bg-green-200 text-black" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                {!collapsed && <span className="font-medium">{m.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4">
          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-green-100">
            <FiSettings /> {!collapsed && <span>Settings</span>}
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-green-100 mt-2">
            <FiLogOut /> {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Manajemen User</h2>
            <div className="w-24 h-1 bg-green-700 rounded mt-2" />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">Nama Seorang Admin</div>
            <Avatar className="w-10 h-10 bg-gray-200 rounded-full" />
          </div>
        </header>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium">Daftar User</h3>
                <button onClick={handleAddUser} className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm hover:bg-green-100">
                  <FiPlus />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10 pr-4 py-2 rounded-md shadow-sm border w-64 focus:outline-none"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="p-3">Nama</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Fakultas</th>
                    <th className="p-3">Program Studi</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center">Loading...</td>
                    </tr>
                  ) : current.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center">No users found</td>
                    </tr>
                  ) : (
                    current.map((u) => (
                      <tr key={u.id} className="align-top">
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{u.username}</td>
                        <td className="p-3">{u.faculty}</td>
                        <td className="p-3">{u.program}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button onClick={() => handleEditUser(u)} className="p-2 rounded-md hover:bg-gray-100">
                              <FiEdit2 />
                            </button>
                            <button onClick={() => handleDeleteUser(u)} className="p-2 rounded-md hover:bg-red-100 text-red-600">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              total={total}
              currentCount={current.length}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>

        {/* Add User Modal */}
        <AddUserModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onSubmit={handleAddSubmit}
          faculties={faculties}
          programs={programs}
        />

        {/* Edit User Modal */}
        <EditUserModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSubmit={handleEditSubmit}
          editingUser={editingUser}
          faculties={faculties}
          programs={programs}
        />

        {/* Delete User Modal */}
        <DeleteUserModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleDeleteConfirm}
          deletingUser={deletingUser}
        />
      </main>
    </div>
  );
}
