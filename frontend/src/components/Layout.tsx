import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";

type LayoutProps = {
    children: ReactNode;
};

// FAKTA 1: Di TypeScript, kalau bentuk objeknya berubah, kita harus buat Tipe (Type/Interface) baru.
// Kita buat NavItemType agar TypeScript tahu bahwa sebuah menu bisa punya 'path' atau 'children' (sub-menu).
type NavItemType = {
    name: string;
    path?: string; // Tanda '?' berarti optional (boleh tidak ada) karena menu dropdown utama kadang tidak punya link
    children?: { name: string; path: string }[]; // Array berisi sub-menu
};

// FAKTA 2: Menambahkan "flag" berupa array `children` pada menu Orders dan Customers.
const navigation: NavItemType[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Orders", path: "/orders" },
    { name: "Customers", path: "/customers" },
    { name: "Services", path: "/services" },
    { name: "Employees", path: "/users" },
];

// FAKTA 3: Kita buat komponen kecil untuk menangani logika per item menu.
// Ini penting agar state 'isOpen' (buka/tutup) hanya berlaku untuk menu yang diklik, bukan membuka semua dropdown sekaligus.
const MenuItem = ({ 
    item, 
    closeSidebar 
}: { 
    item: NavItemType; 
    closeSidebar: () => void;
}) => {
    // State lokal untuk melacak apakah dropdown ini sedang terbuka atau tertutup
    // const [isOpen, setIsOpen] = useState(false);

    // // Cek apakah item ini memiliki children (dropdown)
    // const hasChildren = item.children && item.children.length > 0;

    // if (hasChildren) {
    //     return (
    //         <div className="flex flex-col gap-1">
    //             {/* Tombol utama untuk membuka/menutup dropdown */}
    //             <button
    //                 type="button"
    //                 onClick={() => setIsOpen(!isOpen)}
    //                 className="flex items-center justify-between rounded-lg px-4 py-3 text-gray-300 hover:bg-gray-800 transition"
    //             >
    //                 <span>{item.name}</span>
    //                 {/* Indikator panah sederhana */}
    //                 <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
    //             </button>

    //             {/* FAKTA 4: Conditional Rendering. Sub-menu hanya muncul JIKA isOpen bernilai true */}
    //             {isOpen && (
    //                 <div className="ml-4 flex flex-col gap-1 border-l border-gray-700 pl-2 mt-1">
    //                     {item.children!.map((child) => (
    //                         <NavLink
    //                             key={child.path}
    //                             to={child.path}
    //                             onClick={closeSidebar}
    //                             className={({ isActive }) =>
    //                                 `rounded-lg px-4 py-2 transition text-sm ${
    //                                     isActive
    //                                         ? "bg-blue-600 text-white"
    //                                         : "text-gray-400 hover:bg-gray-800 hover:text-white"
    //                                 }`
    //                             }
    //                         >
    //                             {child.name}
    //                         </NavLink>
    //                     ))}
    //                 </div>
    //             )}
    //         </div>
    //     );
    // }

    // Jika tidak punya children, render NavLink biasa seperti sebelumnya
    return (
        <NavLink
            to={item.path!}
            onClick={closeSidebar}
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
    );
};

const Layout = ({ children }: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const {mutate : logout , isPending} = useLogout();
    const handleLogout = () => {
        try {
            logout(undefined , {
                onSettled: () => {
                    navigate("/")
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

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
                        bg-gray-900 p-5 text-white flex flex-col
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

                    {/* FAKTA 5: Area navigasi utama di-map ke komponen MenuItem yang baru kita buat */}
                    <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <MenuItem 
                                key={item.name} 
                                item={item} 
                                closeSidebar={() => setSidebarOpen(false)} 
                            />
                        ))}
                    </nav>
                    
                    <div className="mt-auto pt-4">
                        <button onClick={() => handleLogout()} className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 w-full text-white transition">
                            {isPending ? "Loading..." : "Logout"}
                        </button>
                    </div>
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