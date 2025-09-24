import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import StatCard from '../utils/StatCard/StatCard'
import LicensesTable from '../components/LicenseTable/LicenseTable'
import { UserCircle } from 'lucide-react'
function DashBord() {

    const licences = [
        { code: 'L-250006810', company: 'Empresa XPTO', validUntil: '2024-12-31', status: 'active' },
        { code: 'L-250006811', company: 'Empresa ABC', validUntil: '2023-11-30', status: 'expired' },
        { code: 'L-250006812', company: 'Empresa XYZ', validUntil: '2025-01-15', status: 'active' },
        { code: 'L-250006813', company: 'Empresa 123', validUntil: '2022-10-20', status: 'revoked' },
    ]

  return (
    <div className="flex min-h-screen bg-[#0f111a]">
        {/* Main Content */}
        <main className="flex-1 p-6 text-white">
           {/* Header */}
           <div className="flex items-center justify-between mb-6">
             <h1 className="text-2xl font-bold mb-6">DashBoard</h1>
             <UserCircle className="w-10 h-10 text-gray-400 hover:text-white cursor-pointer" />
           </div>

            {/*Stats Cards*/}
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <StatCard title="Total Licenças" value={265} />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <StatCard title="Active" value={100} />
                  <StatCard title="Expired" value={50} />
                  <StatCard title="Revoked" value={30} />
                </div>
               
            </div>
            {/* Licenses Table */}
            <LicensesTable licenses={licences} />
        </main>
    </div>
  )
}

export default DashBord