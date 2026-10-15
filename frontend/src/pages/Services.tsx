
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
import { useAuth } from "../hooks/useAuth";
import { formatRupiah } from "../utils/format";

type ServiceForm = {
  name: string;
  unit: string;
  price: string;
  durationValue : string;
  durationUnit : "hours" | "days"
};

const initialForm: ServiceForm = {
  name: "",
  unit: "",
  price: "",
  durationValue : "",
  durationUnit : "hours"
};

const Services = () => {
  const {
    data: services = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useServices();

  const {isAdmin} = useAuth()

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
    const useDays = service.durationHours % 24 == 0

    setEditingService(service);
    setForm({
      name: service.name,
      unit: service.unit,
      price: String(service.price),
      durationValue : String(
        useDays ? service.durationHours / 24 : service.durationHours
      ),
      durationUnit : useDays ? "days" : "hours"
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setModalOpen(false);
    setEditingService(null);
    setForm(initialForm);
    setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const unit = form.unit.trim();
    const price = Number(form.price);
    const durationValue = Number(form.durationValue);

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

    const durationHours = form.durationUnit === "days" ? durationValue * 24 : durationValue;

    const payload = { name, unit, price , durationHours};

    if (editingService) {
      updateService.mutate(
        { id: editingService.id, ...payload },
        {
          onSuccess: closeModal,
          onError: () => {
            setFormError("Gagal memperbarui layanan. Coba lagi.");
          },
        },
      );
      return;
    }

    createService.mutate(payload, {
      onSuccess: closeModal,
      onError: () => {
        setFormError("Gagal menambahkan layanan. Coba lagi.");
      },
    });
  };

  const handleDelete = () => {
    if (!deletingService) return;

    deleteService.mutate(deletingService.id, {
      onSuccess: () => setDeletingService(null),
    });
  };

  const tableColumns: ColumnType[] = [
    {
      header: "Nama Layanan",
      accessor: "name",
    },
    {
      header: "Satuan",
      accessor: "unit",
    },
    {
      header: "Harga",
      accessor: "price",
      render: (row) => formatRupiah(Number(row.price)),
    },
    {
      header: "Durasi(jam)",
      accessor: "durationHours",
    },
    {
      header: "Aksi",
      render: (row) => {
        const service = services.find(
          (item) => item.id === row.id,
        );

        if (!service) return null;

        return (
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <>
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
              </>
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
                Services
              </h1>

              {!isLoading && !isError && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                  {services.length} layanan
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Kelola jenis layanan dan harga Oma Laundry.
            </p>
          </div>

          {isAdmin && (
          <button
            type="button"
            className="btn bg-purple-600 text-white w-full sm:w-auto rounded-2xl"
            onClick={openCreateModal}
          >
            + Tambah Layanan
          </button>
          )}

        </div>

        {/* Daftar layanan */}
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
                Gagal memuat data layanan.
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
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl">🧺</span>
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Belum ada layanan
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Tambahkan layanan pertama Oma Laundry.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm bg-purple-600 text-white"
                onClick={openCreateModal}
              >
                Tambah Layanan
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto p-1">
              <Table
                title="Daftar Layanan"
                columns={tableColumns}
                data={services}
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
            aria-labelledby="service-modal-title"
            className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="service-modal-title"
                  className="text-xl font-bold"
                >
                  {editingService
                    ? "Edit Layanan"
                    : "Tambah Layanan"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingService
                    ? "Perbarui informasi dan harga layanan."
                    : "Masukkan jenis layanan laundry yang tersedia."}
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
                <label htmlFor="service-name" className="label">
                  <span className="label-text font-medium">
                    Nama layanan
                  </span>
                </label>

                <input
                  id="service-name"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Contoh: Cuci Kering"
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
                <label htmlFor="service-unit" className="label">
                  <span className="label-text font-medium">
                    Satuan
                  </span>
                </label>

                <input
                  id="service-unit"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Contoh: kg atau pcs"
                  value={form.unit}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      unit: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="service-price" className="label">
                  <span className="label-text font-medium">
                    Harga per satuan (Rp)
                  </span>
                </label>

                <input
                  id="service-price"
                  type="number"
                  min="0"
                  step="1"
                  className="input input-bordered w-full"
                  placeholder="Contoh: 10000"
                  value={form.price}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }))
                  }
                  disabled={isSaving}
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="service-duration" className="label">
                  <span className="label-text font-medium">
                    Estimasi durasi layanan
                  </span>
                </label>

                <div className="flex gap-2">
                  <input
                    id="service-duration"
                    type="number"
                    min="1"
                    step="1"
                    className="input input-bordered min-w-0 flex-1"
                    value={form.durationValue}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        durationValue: event.target.value,
                      }))
                    }
                    disabled={isSaving}
                    required
                  />

                  <select
                    className="select select-bordered"
                    value={form.durationUnit}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        durationUnit: event.target.value as "hours" | "days",
                      }))
                    }
                    disabled={isSaving}
                  >
                    <option value="hours">Jam</option>
                    <option value="days">Hari</option>
                  </select>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Contoh: Cuci Reguler 3 hari, Cuci Express 4 jam.
                </p>
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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (!deleteService.isPending) {
                setDeletingService(null);
              }
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            className="w-full max-w-sm rounded-2xl bg-base-100 p-6 shadow-xl"
          >
            <h2
              id="delete-service-title"
              className="text-lg font-bold"
            >
              Hapus Layanan?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Layanan{" "}
              <strong className="text-base-content">
                {deletingService.name}
              </strong>{" "}
              akan dihapus. Pastikan layanan ini tidak masih
              digunakan oleh order.
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
                {deleteService.isPending && (
                  <span className="loading loading-spinner loading-sm" />
                )}

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