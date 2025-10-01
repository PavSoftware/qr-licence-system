import React from 'react'

function LicenseTable({  licenses, state }) {

    const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#1f2937] rounded-xl shadow-md p-6 mt-8">
        <table className="bg-[#1f2937] w-full text-left text-gray-300">
            <thead>
                <tr className='border-b border-gray-700'> 
                    <th className="py-3">License Code</th>
                    <th className="py-3">Company</th>
                    <th className="py-3">valid Until</th>
                    <th className="py-3">Status</th>
                </tr>
            </thead>
            <tbody>
             { licenses.map((l, i)=> (
                 <tr key={i} className='border-b border-gray-700'>
                    <td className="py-3">{l.code}</td>
                    <td className="py-3">{l.company}</td>
                    <td className="py-3">{formatDate(l.validUntil)}</td>
                    <td className="py-3">
                        { state && <span className={`px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer ${
                            state.active !== 0
                            ? "bg-green-600/30 text-green-400" : state.inactive >= 0
                            ? "bg-yellow-600/30 text-yellow-400" : "bg-red-600/30 text-red-400"
                        }`}>
                            { state.active !== 0
                            ? "Active" : state.inactive >= 0
                            ? "Inactive" : "Expired"
                            }
                        </span> }
                    </td>
                 </tr>
            ))}
             </tbody>
        </table>
    </div>
  )
}

export default LicenseTable