
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

type LayoutProps = {
    children: ReactNode;
};

const navigation = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Orders", path: "/orders" },
    { name: "Customers", path: "/customers" },
    { name: "Services", path: "/services" },
    { name: "Payments", path: "/payments" },
];

const Layout = ({ children }: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile header */}
            <header className="flex items-center gap-4 bg-white p-4 shadow-sm md:hidden">
                <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open sidebar"
                    aria-expanded={sidebarOpen}
                    className="rounded-md p-2 hover:bg-gray-100"
                >
                    ☰
                </button>

                <h1 className="text-lg font-bold text-gray-900">
                    Oma Laundry
                </h1>
            </header>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                />
            )}

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 w-64
                        bg-gray-900 p-5 text-white
                        transition-transform duration-200
                        md:sticky md:top-0 md:z-auto
                        md:h-screen md:translate-x-0
                        ${
                            sidebarOpen
                                ? "translate-x-0"
                                : "-translate-x-full"
                        }
                    `}
                >
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Oma Laundry
                        </h2>

                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                            className="rounded p-2 hover:bg-gray-800 md:hidden"
                        >
                            ✕
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-lg px-4 py-3 transition ${
                                        isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-300 hover:bg-gray-800"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                    <button className="btn w-full">Logout</button>
                </aside>

                {/* Main content */}
                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;