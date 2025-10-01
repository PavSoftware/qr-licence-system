// src/pages/DashBord.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import StatCard from "../utils/StatCard/StatCard";
import LicensesTable from "../components/LicenseTable/LicenseTable";
import { UserCircle } from "lucide-react";

function DashBord() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/license/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLicenses(data))
      .catch((err) => console.error("Error fetching licenses:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/license/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, [token]);

  if (!stats) return <p>Carregando estatísticas...</p>;

  return (
    <div className="flex min-h-screen bg-[#0f111a]">
      {/* Main Content */}
      <main className="flex-1 p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-6">DashBoard</h1>
          <UserCircle
            className="w-10 h-10 text-gray-400 hover:text-white cursor-pointer"
            onClick={() => navigate("/profile")}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <StatCard title="Total Licenças" value={stats.total} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Active" value={stats.active} />
            <StatCard title="Expired" value={stats.inactive} />
            <StatCard title="Revoked" value={stats.revoked} />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Licenças Recentes</h2>
        <LicensesTable licenses={licenses.slice(0, 5)} state={stats} />
      </main>
    </div>
  );
}

export default DashBord;
