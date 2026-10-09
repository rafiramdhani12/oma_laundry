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

type FormData = {
  name: string;
  password: string;
};

const initialForm: FormData = {
  name: "",
  password: "",
};

const Users = () => {
  const { data: users = [], isLoading, isError } = useUsers();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(initialForm);
  const [formError, setFormError] = useState("");

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
          onSuccess: closeModal,
          onError: () => {
            setFormError("Gagal memperbarui karyawan. Coba lagi.");
          },
        }
      );
    } else {
      createUser.mutate(
        {
          name,
          password: form.password,
          role: "worker",
        },
        {
          onSuccess: closeModal,
          onError: () => {
            setFormError("Gagal menambahkan karyawan. Coba lagi.");
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deletingUser) return;

    deleteUser.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    });
  };

  const tableColumns: ColumnType[] = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    {
      header: "Action",
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

            <button
              type="button"
              className="btn btn-error btn-sm text-white"
              onClick={() => setDeletingUser(user)}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">List Karyawan</h1>
            <p className="text-sm text-gray-500">
              Kelola akun karyawan Oma Laundry.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            + Tambah Karyawan
          </button>
        </div>

        {isLoading && <p>Memuat data karyawan...</p>}

        {isError && (
          <p className="text-error">
            Gagal mengambil data karyawan. Periksa koneksi ke backend.
          </p>
        )}

        {!isLoading && !isError && (
          <Table
            title="List Karyawan"
            columns={tableColumns}
            data={users}
          />
        )}
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
            className="w-full max-w-md rounded-xl bg-base-100 p-6 shadow-xl"
          >
            <h2 id="user-modal-title" className="text-xl font-bold">
              {editingUser ? "Edit Karyawan" : "Tambah Karyawan"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="form-control">
                <label htmlFor="name" className="label">
                  <span className="label-text">Nama karyawan</span>
                </label>
                <input
                  id="name"
                  className="input input-bordered w-full"
                  type="text"
                  autoComplete="off"
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
                <label htmlFor="password" className="label">
                  <span className="label-text">
                    Password
                    {editingUser ? " (opsional)" : ""}
                  </span>
                </label>
                <input
                  id="password"
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
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  value="Worker"
                  readOnly
                  aria-label="Role karyawan"
                />
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
                  {isSaving
                    ? "Menyimpan..."
                    : editingUser
                      ? "Simpan Perubahan"
                      : "Tambah Karyawan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {deletingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-sm rounded-xl bg-base-100 p-6 shadow-xl"
          >
            <h2 id="delete-modal-title" className="text-lg font-bold">
              Hapus Karyawan?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Akun <strong>{deletingUser.name}</strong> akan dihapus.
              Tindakan ini tidak bisa dibatalkan.
            </p>

            {deleteUser.isError && (
              <p role="alert" className="mt-3 text-sm text-error">
                Gagal menghapus karyawan. Coba lagi.
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
                {deleteUser.isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Users;
