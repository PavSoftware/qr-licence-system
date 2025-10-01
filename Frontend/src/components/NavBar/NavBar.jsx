// src/components/Navbar.jsx (trecho)
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="bg-[#111827] text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold">QR License System</h1>
      <div className="flex items-center gap-4">
        {user && <div className="text-sm text-gray-300">{user.name ?? user.email}</div>}
        <button className="text-sm px-3 py-1 rounded bg-red-600" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
