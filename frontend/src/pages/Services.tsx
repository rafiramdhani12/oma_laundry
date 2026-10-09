import { useState, type FormEvent } from "react";
import Layout from "../components/Layout";
import Table, { type ColumnType } from "../components/Table";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "../hooks/useServices";
import type { Service } from "../interface";

type ServiceForm = {
  name: string;
  unit: string;
  price: string;
};

const initialForm: ServiceForm = {
  name: "",
  unit: "",
  price: "",
};

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const Services = () => {
  const {
    data: services = [],
    isLoading,
    isError,
    error,
  } = useServices();

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<Service | null>(null);
  const [deletingService, setDeletingService] =
    useState<Service | null>(null);

  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [formError, setFormError] = useState("");

  const isSaving =
    createService.isPending || updateService.isPending;

  const openCreateModal = () => {
    setEditingService(null);
    setForm(initialForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      unit: service.unit,
      price: String(service.price),
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const unit = form.unit.trim();
    const price = Number(form.price);

    if (!name || !unit) {
      setFormError("Nama layanan dan satuan wajib diisi.");
      return;
    }

    if (
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setFormError("Harga harus berupa angka yang valid.");
      return;
    }

    const payload = { name, unit, price };

    if (editingService) {
      updateService.mutate(
        { id: editingService.id, ...payload },
        {
          onSuccess: closeModal,
          onError: () => {
            setFormError("Gagal memperbarui layanan. Coba lagi.");
          },
        }
      );
    } else {
      createService.mutate(payload, {
        onSuccess: closeModal,
        onError: () => {
          setFormError("Gagal menambahkan layanan. Coba lagi.");
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deletingService) return;

    deleteService.mutate(deletingService.id, {
      onSuccess: () => setDeletingService(null),
    });
  };

  const tableColumns: ColumnType[] = [
    { header: "ID", accessor: "id" },
    { header: "Nama Layanan", accessor: "name" },
    { header: "Satuan", accessor: "unit" },
    {
      header: "Harga",
      accessor: "price",
      render: (row) => formatRupiah(Number(row.price)),
    },
    {
      header: "Aksi",
      render: (row) => {
        const service = services.find(
          (item) => item.id === row.id
        );

        if (!service) return null;

        return (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openEditModal(service)}
            >
              Edit
            </button>

            <button
              type="button"
              className="btn btn-error btn-sm text-white"
              onClick={() => setDeletingService(service)}
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
            <h1 className="text-2xl font-bold">
              Layanan Laundry
            </h1>
            <p className="text-sm text-gray-500">
              Kelola jenis layanan dan harga laundry.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            + Tambah Layanan
          </button>
        </div>

        {isLoading && (
          <p className="py-6 text-center">
            Memuat data layanan...
          </p>
        )}

        {isError && (
          <div className="alert alert-error">
            <span>
              Gagal mengambil data layanan.{" "}
              {error instanceof Error ? error.message : ""}
            </span>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="w-full overflow-x-auto rounded-lg border border-base-300 bg-base-100">
            <Table
              title="Daftar Layanan"
              columns={tableColumns}
              data={services}
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
            aria-labelledby="service-modal-title"
            className="w-full max-w-md rounded-xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="service-modal-title"
              className="text-xl font-bold"
            >
              {editingService
                ? "Edit Layanan"
                : "Tambah Layanan"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-4"
            >
              <div className="form-control">
                <label htmlFor="service-name" className="label">
                  <span className="label-text">
                    Nama layanan
                  </span>
                </label>
                <input
                  id="service-name"
                  className="input input-bordered w-full"
                  placeholder="Contoh: Cuci Kering"
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
                <label htmlFor="service-unit" className="label">
                  <span className="label-text">Satuan</span>
                </label>
                <input
                  id="service-unit"
                  className="input input-bordered w-full"
                  placeholder="Contoh: kg, pcs"
                  value={form.unit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      unit: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="service-price" className="label">
                  <span className="label-text">
                    Harga per satuan (Rp)
                  </span>
                </label>
                <input
                  id="service-price"
                  className="input input-bordered w-full"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Contoh: 10000"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price: e.target.value,
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
                    : editingService
                      ? "Simpan Perubahan"
                      : "Tambah Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {deletingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            className="w-full max-w-sm rounded-xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="delete-service-title"
              className="text-lg font-bold"
            >
              Hapus Layanan?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Layanan <strong>{deletingService.name}</strong>{" "}
              akan dihapus. Pastikan layanan ini tidak sedang
              digunakan oleh transaksi.
            </p>

            {deleteService.isError && (
              <p role="alert" className="mt-3 text-sm text-error">
                Gagal menghapus layanan. Layanan mungkin masih
                digunakan oleh order.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDeletingService(null)}
                disabled={deleteService.isPending}
              >
                Batal
              </button>

              <button
                type="button"
                className="btn btn-error text-white"
                onClick={handleDelete}
                disabled={deleteService.isPending}
              >
                {deleteService.isPending
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

export default Services;
