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
  } = useCustomers();

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
    setModalOpen(false);
    setEditingCustomer(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            setFormError("Gagal memperbarui customer. Coba lagi.");
          },
        }
      );
    } else {
      createCustomer.mutate(payload, {
        onSuccess: closeModal,
        onError: () => {
          setFormError("Gagal menambahkan customer. Coba lagi.");
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deletingCustomer) return;

    deleteCustomer.mutate(deletingCustomer.id, {
      onSuccess: () => setDeletingCustomer(null),
    });
  };

  const tableColumns: ColumnType[] = [
    { header: "ID", accessor: "id" },
    { header: "Nama Customer", accessor: "name" },
    { header: "Nomor Telepon", accessor: "phone" },
    {
      header: "Aksi",
      render: (row) => {
        const customer = customers.find(
          (item) => item.id === row.id
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

            <button
              type="button"
              className="btn btn-error btn-sm text-white"
              onClick={() => setDeletingCustomer(customer)}
            >
              Hapus
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
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-sm text-gray-500">
              Kelola data pelanggan Oma Laundry.
            </p>
          </div>
        </div>

        {isLoading && (
          <p className="py-6 text-center">
            Memuat data customer...
          </p>
        )}

        {isError && (
          <div className="alert alert-error">
            <span>
              Gagal mengambil data customer.{" "}
              {error instanceof Error ? error.message : ""}
            </span>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="w-full overflow-x-auto rounded-lg border border-base-300 bg-base-100">
            <Table
              title="Customers"
              columns={tableColumns}
              data={customers}
            />
          </div>
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
            aria-labelledby="customer-modal-title"
            className="w-full max-w-md rounded-xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="customer-modal-title"
              className="text-xl font-bold"
            >
              {editingCustomer
                ? "Edit Customer"
                : "Tambah Customer"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-4"
            >
              <div className="form-control">
                <label
                  htmlFor="customer-name"
                  className="label"
                >
                  <span className="label-text">Nama lengkap</span>
                </label>

                <input
                  id="customer-name"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Masukkan nama customer"
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
                <label
                  htmlFor="customer-phone"
                  className="label"
                >
                  <span className="label-text">Nomor telepon</span>
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  className="input input-bordered w-full"
                  placeholder="Contoh: 081234567890"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  required
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-customer-title"
            className="w-full max-w-sm rounded-xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="delete-customer-title"
              className="text-lg font-bold"
            >
              Hapus Customer?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Data customer{" "}
              <strong>{deletingCustomer.name}</strong> akan
              dihapus. Pastikan tidak ada transaksi yang masih
              membutuhkan data pelanggan ini.
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
