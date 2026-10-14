import { useState, type FormEvent } from "react";
import Layout from "../components/Layout";
import Table, { type ColumnType } from "../components/Table";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../hooks/useUsers";
import type { User } from "../interface";
import { useAuth } from "../hooks/useAuth";

type FormData = {
  name: string;
  password: string;
};

const initialForm: FormData = {
  name: "",
  password: "",
};

const Users = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useUsers();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(initialForm);
  const [formError, setFormError] = useState("");
  const {user , isAdmin} = useAuth()

  console.log(user , isAdmin)

  const isSaving = createUser.isPending || updateUser.isPending;

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(initialForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      password: "",
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setModalOpen(false);
    setEditingUser(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const name = form.name.trim();

    if (!name) {
      setFormError("Nama karyawan wajib diisi.");
      return;
    }

    if (!editingUser && !form.password) {
      setFormError("Password wajib diisi untuk karyawan baru.");
      return;
    }

    if (editingUser) {
      updateUser.mutate(
        {
          id: editingUser.id,
          name,
          role: "worker",
          ...(form.password ? { password: form.password } : {}),
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingUser(null);
            setForm(initialForm);
            setFormError("");
          },
          onError: () => {
            setFormError("Gagal memperbarui karyawan. Coba lagi.");
          },
        }
      );

      return;
    }

    createUser.mutate(
      {
        name,
        password: form.password,
        role: "worker",
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          setEditingUser(null);
          setForm(initialForm);
          setFormError("");
        },
        onError: () => {
          setFormError("Gagal menambahkan karyawan. Coba lagi.");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deletingUser) return;

    deleteUser.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  };

  const tableColumns: ColumnType[] = [
    { header: "Nama Karyawan", accessor: "name" },
    {
      header: "Role",
      render: (row) => {
        const user = users.find((item) => item.id === row.id);

        if (!user) return null;

        return (
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
            {user.role === "admin" ? "Admin" : "Worker"}
          </span>
        );
      },
    },
    {
      header: "Aksi",
      render: (row) => {
        const user = users.find((item) => item.id === row.id);

        if (!user) return null;

        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openEditModal(user)}
            >
              Edit
            </button>
            {isAdmin && (
            <button
              type="button"w
              className="btn btn-error btn-sm text-white"
              onClick={() => setDeletingUser(user)}
            >
              Hapus
            </button>

            )}
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <section className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Karyawan
              </h1>

              {!isLoading && !isError && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                  {users.length} karyawan
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Kelola akun dan akses karyawan Oma Laundry.
            </p>
          </div>

          <button
            type="button"
            className="btn bg-purple-600 text-white w-full sm:w-auto rounded-2xl"
            onClick={openCreateModal}
          >
            + Tambah Karyawan
          </button>
        </div>

        {/* Daftar karyawan */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          {isLoading ? (
            <ul className="divide-y divide-gray-100">
              {[0, 1, 2, 3].map((item) => (
                <li
                  key={item}
                  className="space-y-3 px-4 py-4 md:px-5"
                >
                  <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <p className="text-sm text-red-500">
                Gagal memuat data karyawan.
              </p>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => refetch()}
              >
                Coba lagi
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <p className="text-sm text-gray-500">
                Belum ada data karyawan.
              </p>

              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={openCreateModal}
              >
                Tambah karyawan pertama
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table
                title="Daftar Karyawan"
                columns={tableColumns}
                data={users}
              />
            </div>
          )}
        </div>
      </section>

      {/* Modal tambah / edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="user-modal-title"
              className="text-xl font-bold"
            >
              {editingUser ? "Edit Karyawan" : "Tambah Karyawan"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingUser
                ? "Perbarui informasi akun karyawan."
                : "Buat akun baru untuk karyawan Oma Laundry."}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="form-control">
                <label htmlFor="user-name" className="label">
                  <span className="label-text">Nama karyawan</span>
                </label>

                <input
                  id="user-name"
                  className="input input-bordered w-full"
                  type="text"
                  autoComplete="off"
                  placeholder="Masukkan nama karyawan"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="user-password" className="label">
                  <span className="label-text">
                    Password{editingUser ? " (opsional)" : ""}
                  </span>
                </label>

                <input
                  id="user-password"
                  className="input input-bordered w-full"
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    editingUser
                      ? "Kosongkan jika tidak ingin mengganti"
                      : "Masukkan password"
                  }
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required={!editingUser}
                />

                {editingUser && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password lama tidak ditampilkan demi keamanan.
                  </p>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="user-role" className="label">
                  <span className="label-text">Role</span>
                </label>

                <input
                  id="user-role"
                  className="input input-bordered w-full"
                  value="Worker"
                  readOnly
                />

                <p className="mt-1 text-xs text-gray-500">
                  Akun yang dibuat dari halaman ini menggunakan role Worker.
                </p>
              </div>

              {formError && (
                <p role="alert" className="text-sm text-error">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Menyimpan...
                    </>
                  ) : editingUser ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah Karyawan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {deletingUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleteUser.isPending) {
              setDeletingUser(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-sm rounded-2xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="delete-user-title"
              className="text-lg font-bold"
            >
              Hapus Karyawan?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Akun <strong>{deletingUser.name}</strong> akan dihapus.
              Pastikan akun ini memang sudah tidak digunakan.
            </p>

            {deleteUser.isError && (
              <p role="alert" className="mt-3 text-sm text-error">
                Gagal menghapus karyawan. Periksa koneksi atau relasi data.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDeletingUser(null)}
                disabled={deleteUser.isPending}
              >
                Batal
              </button>

              <button
                type="button"
                className="btn btn-error text-white"
                onClick={handleDelete}
                disabled={deleteUser.isPending}
              >
                {deleteUser.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Users;
