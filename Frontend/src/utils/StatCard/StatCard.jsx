
function StatCard({ title, value }) {
  return (
    <div className='bg-[#1f2937] p-6 rounded-xl shadow-md flex flex-col items-center'>
        <h2 className="text-gray-400 text-lg text-left">{title}</h2>
        <p className='text-3xl font-bold text-white'>{ value }</p>
    </div>
  )
}

export default StatCard