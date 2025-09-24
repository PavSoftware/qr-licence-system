import { useNavigate } from "react-router-dom";

import React from 'react'

function Sidebar() {
    const navigate = useNavigate();
  return (
   <aside className="bg-[#1f2937] text-gray-200 w-64 min-h-screen flex flex-col p-6 rounded-r-2xl">
    <h1 className="text-xl font-bold mb-8">License Manager</h1>

    <nav className="flex flex-col gap-2">
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700" onClick={() => navigate("/dashboard")}>DashBord</button>
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700" onClick={() => navigate("/licenses")}>Licenses</button>
         <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700" onClick={() => navigate("/validate")}>Validate</button>
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700" onClick={() => navigate("/login")}>Logout</button>
    </nav>
   </aside>
  )
}

export default Sidebar