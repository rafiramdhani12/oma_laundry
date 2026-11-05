import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Services from "./pages/Services"
import Users from "./pages/Users"
import Customers from "./pages/Customers"
import Orders from "./pages/order_pages/Orders"
import CreatePage from "./pages/order_pages/CreatePage"
import DetailPage from "./pages/order_pages/DetailPage"
import Layout from "./components/Layout"
function App() {
  return (
    <Routes>
      {/* Route Publik (Tanpa Layout Sidebar/Navbar Utama) */}
      <Route path="/" element={<Login />} />

      {/* Route yang Menggunakan Layout (Dibungkus DashboardLayout) */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/users" element={<Users />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/create" element={<CreatePage />} />
        <Route path="/orders/detail/:id" element={<DetailPage />} />
      </Route>
    </Routes>
  )
}

export default App