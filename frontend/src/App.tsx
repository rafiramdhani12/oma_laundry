import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Services from "./pages/Services"
import Users from "./pages/Users"
import Customers from "./pages/Customers"
import Orders from "./pages/Orders"
import CreatePage from "./pages/order_pages/CreatePage"

function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/users" element={<Users />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/create" element={<CreatePage />} />
     </Routes>
    </>
  )
}

export default App
