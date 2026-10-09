import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

import { useCreateOrder } from "../../hooks/useOrders";
import {
  useCustomers,
  useCreateCustomer,
} from "../../hooks/useCustomers";
import { useServices } from "../../hooks/useServices";

import type { Customer, Service } from "../../interface";

type CustomerMode = "existing" | "new";

type OrderItemForm = {
  serviceId: string;
  quantity: string;
};

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const CreatePage = () => {
  const navigate = useNavigate();

  const { data: customers = [], isLoading: customersLoading } =
    useCustomers();

  const { data: services = [], isLoading: servicesLoading } =
    useServices();

  const createOrder = useCreateOrder();
  const createCustomer = useCreateCustomer();

  const [customerMode, setCustomerMode] =
    useState<CustomerMode>("existing");

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
  });

  const [items, setItems] = useState<OrderItemForm[]>([
    { serviceId: "", quantity: "1" },
  ]);

  const [formError, setFormError] = useState("");

  const isSubmitting =
    createOrder.isPending || createCustomer.isPending;

  const filteredCustomers = useMemo(() => {
    const search = customerSearch.trim().toLowerCase();

    if (!search || selectedCustomer) return [];

    return customers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(search) ||
          customer.phone.includes(search),
      )
      .slice(0, 5);
  }, [customers, customerSearch, selectedCustomer]);

  const estimatedTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const service = services.find(
        (service) => service.id === Number(item.serviceId),
      );

      const quantity = Number(item.quantity);

      if (!service || !Number.isFinite(quantity) || quantity <= 0) {
        return total;
      }

      return total + Number(service.price) * quantity;
    }, 0);
  }, [items, services]);

  const updateItem = (
    index: number,
    field: keyof OrderItemForm,
    value: string,
  ) => {
    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (customerMode === "existing" && !selectedCustomer) {
      setFormError("Pilih customer dari daftar suggestion terlebih dahulu.");
      return;
    }

    if (
      customerMode === "new" &&
      (!newCustomer.name.trim() || !newCustomer.phone.trim())
    ) {
      setFormError("Nama dan nomor telepon customer wajib diisi.");
      return;
    }

    if (items.length === 0) {
      setFormError("Tambahkan minimal satu layanan.");
      return;
    }

    const invalidItem = items.some((item) => {
      const quantity = Number(item.quantity);

      return (
        !item.serviceId ||
        !Number.isFinite(quantity) ||
        quantity <= 0
      );
    });

    if (invalidItem) {
      setFormError("Pilih layanan dan masukkan jumlah yang valid.");
      return;
    }

    try {
      let customerId: number;

      if (customerMode === "existing") {
        customerId = selectedCustomer!.id;
      } else {
        const response = await createCustomer.mutateAsync({
          name: newCustomer.name.trim(),
          phone: newCustomer.phone.trim(),
        });

        // Sesuaikan jika API mengembalikan { customer: {...} }.
        const customer = response as Customer;

        if (!customer?.id) {
          throw new Error(
            "ID customer tidak ditemukan pada response API.",
          );
        }

        customerId = customer.id;
      }

      await createOrder.mutateAsync({
        customerId,
        items: items.map((item) => ({
          serviceId: Number(item.serviceId),
          quantity: Number(item.quantity),
        })),
      });

      // Kembali ke halaman daftar order setelah berhasil.
      navigate("/orders");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Gagal membuat order. Silakan coba lagi.",
      );
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-4xl space-y-6">
        <div>
          <button
            type="button"
            className="btn btn-ghost btn-sm mb-3"
            onClick={() => navigate("/orders")}
          >
            ← Kembali ke Orders
          </button>

          <h1 className="text-2xl font-bold">Create Order</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Masukkan informasi customer dan layanan laundry.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6"
        >
          {/* CUSTOMER */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">1. Data Customer</h2>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm ${
                  customerMode === "existing"
                    ? "btn-primary"
                    : "btn-outline"
                }`}
                onClick={() => {
                  setCustomerMode("existing");
                  setSelectedCustomer(null);
                  setCustomerSearch("");
                }}
              >
                Customer Terdaftar
              </button>

              <button
                type="button"
                className={`btn btn-sm ${
                  customerMode === "new"
                    ? "btn-primary"
                    : "btn-outline"
                }`}
                onClick={() => {
                  setCustomerMode("new");
                  setSelectedCustomer(null);
                  setCustomerSearch("");
                }}
              >
                Customer Baru
              </button>
            </div>

            {customerMode === "existing" ? (
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text">Cari customer</span>
                </label>

                <input
                  className="input input-bordered w-full"
                  placeholder="Nama atau nomor telepon..."
                  value={customerSearch}
                  onChange={(event) => {
                    setCustomerSearch(event.target.value);
                    setSelectedCustomer(null);
                  }}
                />

                {customersLoading && (
                  <p className="text-sm text-base-content/60">
                    Memuat customer...
                  </p>
                )}

                {filteredCustomers.length > 0 && (
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-base-300">
                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        className="flex w-full flex-col items-start p-3 text-left hover:bg-base-200"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerSearch(customer.name);
                        }}
                      >
                        <span className="font-medium">
                          {customer.name}
                        </span>
                        <span className="text-sm text-base-content/60">
                          {customer.phone}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {selectedCustomer && (
                  <div className="rounded-lg border border-success/40 bg-success/10 p-3">
                    <p className="font-medium">
                      {selectedCustomer.name}
                    </p>
                    <p className="text-sm">
                      {selectedCustomer.phone}
                    </p>
                    <p className="mt-1 text-xs text-success">
                      Customer dipilih
                    </p>
                  </div>
                )}

                {customerSearch.trim() &&
                  !selectedCustomer &&
                  !customersLoading &&
                  filteredCustomers.length === 0 && (
                    <p className="text-sm text-base-content/60">
                      Customer tidak ditemukan. Coba tab Customer Baru.
                    </p>
                  )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-control">
                  <span className="label">
                    <span className="label-text">Nama customer</span>
                  </span>
                  <input
                    className="input input-bordered"
                    placeholder="Contoh: Budi"
                    value={newCustomer.name}
                    onChange={(event) =>
                      setNewCustomer((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label className="form-control">
                  <span className="label">
                    <span className="label-text">Nomor telepon</span>
                  </span>
                  <input
                    className="input input-bordered"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={newCustomer.phone}
                    onChange={(event) =>
                      setNewCustomer((previous) => ({
                        ...previous,
                        phone: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>
            )}
          </section>

          <div className="divider" />

          {/* SERVICES */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">
                2. Layanan Laundry
              </h2>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setItems((previous) => [
                    ...previous,
                    { serviceId: "", quantity: "1" },
                  ])
                }
              >
                + Tambah Item
              </button>
            </div>

            {servicesLoading && (
              <p className="text-sm text-base-content/60">
                Memuat layanan...
              </p>
            )}

            {!servicesLoading && services.length === 0 && (
              <p className="text-sm text-warning">
                Belum ada layanan. Tambahkan layanan terlebih dahulu.
              </p>
            )}

            {items.map((item, index) => {
              const service = services.find(
                (entry: Service) => entry.id === Number(item.serviceId),
              );

              const quantity = Number(item.quantity);

              const subtotal =
                service && Number.isFinite(quantity) && quantity > 0
                  ? Number(service.price) * quantity
                  : 0;

              return (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border border-base-300 p-4 sm:grid-cols-[minmax(0,1fr)_120px_auto]"
                >
                  <label className="form-control">
                    <span className="label">
                      <span className="label-text">Layanan</span>
                    </span>

                    <select
                      className="select select-bordered w-full"
                      value={item.serviceId}
                      onChange={(event) =>
                        updateItem(index, "serviceId", event.target.value)
                      }
                      required
                    >
                      <option value="">Pilih layanan</option>

                      {services.map((entry: Service) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.name} —{" "}
                          {formatRupiah(Number(entry.price))}/{entry.unit}
                        </option>
                      ))}
                    </select>

                    <span className="mt-2 text-xs text-base-content/60">
                      Subtotal: {formatRupiah(subtotal)}
                    </span>
                  </label>

                  <label className="form-control">
                    <span className="label">
                      <span className="label-text">Jumlah</span>
                    </span>

                    <input
                      className="input input-bordered w-full"
                      type="number"
                      min="0.01"
                      step="any"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, "quantity", event.target.value)
                      }
                      required
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="button"
                      className="btn btn-outline btn-error btn-sm w-full"
                      disabled={items.length === 1}
                      onClick={() =>
                        setItems((previous) =>
                          previous.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* TOTAL */}
          <section className="space-y-2 rounded-lg bg-base-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">Estimasi Total</span>
              <span className="text-xl font-bold">
                {formatRupiah(estimatedTotal)}
              </span>
            </div>

            <p className="text-xs text-base-content/60">
              Total pada layar merupakan estimasi. Backend harus menghitung
              ulang harga berdasarkan data layanan di database.
            </p>
          </section>

          {formError && (
            <p role="alert" className="alert alert-error text-sm">
              {formError}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/orders")}
              disabled={isSubmitting}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                isSubmitting ||
                customersLoading ||
                servicesLoading ||
                services.length === 0
              }
            >
              {isSubmitting ? "Menyimpan..." : "Buat Order"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CreatePage;
