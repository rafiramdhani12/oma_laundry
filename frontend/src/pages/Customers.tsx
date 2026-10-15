
import { useState, type FormEvent } from "react";
import Layout from "../components/Layout";
import Table, { type ColumnType } from "../components/Table";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../hooks/useCustomers";
import type { Customer } from "../interface";
import { useAuth } from "../hooks/useAuth";

type CustomerForm = {
  name: string;
  phone: string;
};

const initialForm: CustomerForm = {
  name: "",
  phone: "",
};

const Customers = () => {
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCustomers();

  const {user , isAdmin} = useAuth()

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] =
    useState<Customer | null>(null);

  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [formError, setFormError] = useState("");
  

  const isSaving =
    createCustomer.isPending || updateCustomer.isPending;

  const openCreateModal = () => {
    setEditingCustomer(null);
    setForm(initialForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setModalOpen(false);
    setEditingCustomer(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name || !phone) {
      setFormError("Nama dan nomor telepon wajib diisi.");
      return;
    }

    const payload = { name, phone };

    if (editingCustomer) {
      updateCustomer.mutate(
        {
          id: editingCustomer.id,
          ...payload,
        },
        {
          onSuccess: closeModal,
          onError: () => {
            setFormError(
              "Gagal memperbarui customer. Silakan coba lagi.",
            );
          },
        },
      );

      return;
    }

    createCustomer.mutate(payload, {
      onSuccess: closeModal,
      onError: () => {
        setFormError(
          "Gagal menambahkan customer. Silakan coba lagi.",
        );
      },
    });
  };

  const handleDelete = () => {
    if (!deletingCustomer) return;

    deleteCustomer.mutate(deletingCustomer.id, {
      onSuccess: () => setDeletingCustomer(null),
    });
  };

  const tableColumns: ColumnType[] = [
    {
      header: "Nama Customer",
      accessor: "name",
    },
    {
      header: "Nomor Telepon",
      accessor: "phone",
    },
    {
      header: "Aksi",
      render: (row) => {
        const customer = customers.find(
          (item) => item.id === row.id,
        );

        if (!customer) return null;

        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openEditModal(customer)}
            >
              Edit
            </button>
            {isAdmin && (
              <button
                type="button"
                className="btn btn-error btn-sm text-white"
                onClick={() => setDeletingCustomer(customer)}
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
                Customers
              </h1>

              {!isLoading && !isError && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                  {customers.length} customer
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Kelola data pelanggan Oma Laundry.
            </p>
          </div>

          {/* <button
            type="button"
            className="btn bg-purple-600 text-white w-full sm:w-auto rounded-2xl"
            onClick={openCreateModal}
          >
            + Tambah Customer
          </button> */}
        </div>

        {/* Daftar customer */}
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
                Gagal memuat data customer.
                {error instanceof Error ? ` ${error.message}` : ""}
              </p>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => refetch()}
              >
                Coba lagi
              </button>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl">👤</span>
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Belum ada customer
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Tambahkan pelanggan pertama Oma Laundry.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm bg-purple-600 text-white"
                onClick={openCreateModal}
              >
                Tambah Customer
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto p-1">
              <Table
                title="Daftar Customer"
                columns={tableColumns}
                data={customers}
              />
            </div>
          )}
        </div>
      </section>

      {/* Modal tambah / edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
            className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="customer-modal-title"
                  className="text-xl font-bold"
                >
                  {editingCustomer
                    ? "Edit Customer"
                    : "Tambah Customer"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingCustomer
                    ? "Perbarui informasi pelanggan."
                    : "Masukkan informasi pelanggan baru."}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={closeModal}
                disabled={isSaving}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div className="form-control">
                <label
                  htmlFor="customer-name"
                  className="label"
                >
                  <span className="label-text font-medium">
                    Nama lengkap
                  </span>
                </label>

                <input
                  id="customer-name"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Masukkan nama customer"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                  required
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor="customer-phone"
                  className="label"
                >
                  <span className="label-text font-medium">
                    Nomor telepon
                  </span>
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  className="input input-bordered w-full"
                  placeholder="Contoh: 081234567890"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                  required
                />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-base-200 pt-4">
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
                  {isSaving && (
                    <span className="loading loading-spinner loading-sm" />
                  )}

                  {isSaving
                    ? "Menyimpan..."
                    : editingCustomer
                      ? "Simpan Perubahan"
                      : "Tambah Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {deletingCustomer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (!deleteCustomer.isPending) {
                setDeletingCustomer(null);
              }
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-customer-title"
            className="w-full max-w-sm rounded-2xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="delete-customer-title"
              className="text-lg font-bold"
            >
              Hapus Customer?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Data customer{" "}
              <strong className="text-base-content">
                {deletingCustomer.name}
              </strong>{" "}
              akan dihapus. Pastikan customer ini tidak masih
              dibutuhkan oleh transaksi.
            </p>

            {deleteCustomer.isError && (
              <p role="alert" className="mt-3 text-sm text-error">
                Gagal menghapus customer. Periksa apakah customer
                masih terhubung dengan order.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDeletingCustomer(null)}
                disabled={deleteCustomer.isPending}
              >
                Batal
              </button>

              <button
                type="button"
                className="btn btn-error text-white"
                onClick={handleDelete}
                disabled={deleteCustomer.isPending}
              >
                {deleteCustomer.isPending && (
                  <span className="loading loading-spinner loading-sm" />
                )}

                {deleteCustomer.isPending
                  ? "Menghapus..."
                  : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Customers;