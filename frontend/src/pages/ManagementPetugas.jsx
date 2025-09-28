import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/user-management";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { AddPetugasModal, EditPetugasModal, DeletePetugasModal } from "@/components/petugas-management";

export default function ManagementPetugas() {
  // data state
  const [petugas, setPetugas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  // dialog state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingPetugas, setEditingPetugas] = useState(null);
  const [deletingPetugas, setDeletingPetugas] = useState(null);

  // dummy data pos
  const posOptions = ["Gerbang Utama", "Masjid", "Perpustakaan", "Rektorat", "Fakultas FST", "Fakultas FISIP", "Fakultas FEB", "Asrama"];

  // dummy data petugas
  useEffect(() => {
    const dummyPetugas = [
      {
        id: 1,
        name: "Budi Santoso",
        username: "budi.santoso",
        email: "budi.santoso@uin-suka.ac.id",
        pos: "Gerbang Utama",
      },
      {
        id: 2,
        name: "Andi Wijaya",
        username: "andi.wijaya",
        email: "andi.wijaya@uin-suka.ac.id",
        pos: "Masjid",
      },
      {
        id: 3,
        name: "Deni Pratama",
        username: "deni.pratama",
        email: "deni.pratama@uin-suka.ac.id",
        pos: "Perpustakaan",
      },
      {
        id: 4,
        name: "Eko Susanto",
        username: "eko.susanto",
        email: "eko.susanto@uin-suka.ac.id",
        pos: "Rektorat",
      },
      {
        id: 5,
        name: "Farid Ahmad",
        username: "farid.ahmad",
        email: "farid.ahmad@uin-suka.ac.id",
        pos: "Fakultas FST",
      },
      {
        id: 6,
        name: "Gunawan Saputra",
        username: "gunawan.saputra",
        email: "gunawan.saputra@uin-suka.ac.id",
        pos: "Fakultas FISIP",
      },
      {
        id: 7,
        name: "Hadi Nugroho",
        username: "hadi.nugroho",
        email: "hadi.nugroho@uin-suka.ac.id",
        pos: "Fakultas FEB",
      },
      {
        id: 8,
        name: "Indra Kusuma",
        username: "indra.kusuma",
        email: "indra.kusuma@uin-suka.ac.id",
        pos: "Asrama",
      },
      {
        id: 9,
        name: "Joko Widodo",
        username: "joko.widodo",
        email: "joko.widodo@uin-suka.ac.id",
        pos: "Gerbang Utama",
      },
      {
        id: 10,
        name: "Karno Sutrisno",
        username: "karno.sutrisno",
        email: "karno.sutrisno@uin-suka.ac.id",
        pos: "Masjid",
      },
      {
        id: 11,
        name: "Lukman Hakim",
        username: "lukman.hakim",
        email: "lukman.hakim@uin-suka.ac.id",
        pos: "Perpustakaan",
      },
      {
        id: 12,
        name: "Made Suwarta",
        username: "made.suwarta",
        email: "made.suwarta@uin-suka.ac.id",
        pos: "Rektorat",
      },
      {
        id: 13,
        name: "Nanda Pratomo",
        username: "nanda.pratomo",
        email: "nanda.pratomo@uin-suka.ac.id",
        pos: "Fakultas FST",
      },
      {
        id: 14,
        name: "Omar Bakri",
        username: "omar.bakri",
        email: "omar.bakri@uin-suka.ac.id",
        pos: "Fakultas FISIP",
      },
      {
        id: 15,
        name: "Purnomo Adi",
        username: "purnomo.adi",
        email: "purnomo.adi@uin-suka.ac.id",
        pos: "Fakultas FEB",
      },
      {
        id: 16,
        name: "Qasim Ridwan",
        username: "qasim.ridwan",
        email: "qasim.ridwan@uin-suka.ac.id",
        pos: "Asrama",
      },
      {
        id: 17,
        name: "Rizal Effendi",
        username: "rizal.effendi",
        email: "rizal.effendi@uin-suka.ac.id",
        pos: "Gerbang Utama",
      },
      {
        id: 18,
        name: "Suryadi Hasan",
        username: "suryadi.hasan",
        email: "suryadi.hasan@uin-suka.ac.id",
        pos: "Masjid",
      },
      {
        id: 19,
        name: "Taufik Hidayat",
        username: "taufik.hidayat",
        email: "taufik.hidayat@uin-suka.ac.id",
        pos: "Perpustakaan",
      },
      {
        id: 20,
        name: "Usman Ismail",
        username: "usman.ismail",
        email: "usman.ismail@uin-suka.ac.id",
        pos: "Rektorat",
      },
    ];

    setPetugas(dummyPetugas);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return petugas;
    return petugas.filter((p) => (p.name + p.email + p.username + p.pos).toLowerCase().includes(q));
  }, [petugas, search]);

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
  const handleAddPetugas = () => {
    setAddModalOpen(true);
  };

  const handleEditPetugas = (petugas) => {
    setEditingPetugas(petugas);
    setEditModalOpen(true);
  };

  const handleDeletePetugas = (petugas) => {
    setDeletingPetugas(petugas);
    setDeleteModalOpen(true);
  };

  const handleAddSubmit = (data) => {
    const newPetugas = {
      id: petugas.length ? Math.max(...petugas.map((p) => p.id)) + 1 : 1,
      name: data.name,
      username: data.username,
      email: data.email,
      pos: data.pos,
    };
    setPetugas((prev) => [newPetugas, ...prev]);
    setAddModalOpen(false);
  };

  const handleEditSubmit = (data) => {
    setPetugas((prev) =>
      prev.map((p) =>
        p.id === editingPetugas.id
          ? {
              ...p,
              name: data.name,
              username: data.username,
              email: data.email,
              pos: data.pos,
            }
          : p
      )
    );
    setEditModalOpen(false);
    setEditingPetugas(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingPetugas) {
      setPetugas((prev) => prev.filter((p) => p.id !== deletingPetugas.id));
      setDeletingPetugas(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <HeaderDashboard title="Manajemen Petugas" />
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">Daftar Petugas</h3>
              <button
                onClick={handleAddPetugas}
                className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm hover:bg-green-100"
              >
                <FiPlus />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
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
                  <th className="p-3">Pos</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : current.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center"
                    >
                      No petugas found
                    </td>
                  </tr>
                ) : (
                  current.map((p) => (
                    <tr
                      key={p.id}
                      className="align-top"
                    >
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.email}</td>
                      <td className="p-3">{p.username}</td>
                      <td className="p-3">{p.pos}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleEditPetugas(p)}
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeletePetugas(p)}
                            className="p-2 rounded-md hover:bg-red-100 text-red-600"
                          >
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

      {/* Add Petugas Modal */}
      <AddPetugasModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddSubmit}
        posOptions={posOptions}
      />

      {/* Edit Petugas Modal */}
      <EditPetugasModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSubmit={handleEditSubmit}
        editingPetugas={editingPetugas}
        posOptions={posOptions}
      />

      {/* Delete Petugas Modal */}
      <DeletePetugasModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        deletingPetugas={deletingPetugas}
      />
    </>
  );
}
