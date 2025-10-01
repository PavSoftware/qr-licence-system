import React from 'react'

function NotFound() {
  return (
    <div>
      <header className="w-full flex items-center p-4 shadow-md bg-[#111E29] text-white">
         <h3 className="text-5xl text-left mt-2 font-extrabold">GPL - Solip </h3>
      </header>
      <div className='w-full h-screen flex flex-col justify-center items-center text-center -mb-5'>
        <h1 className='text-3xl font-bold ont-mono'>404</h1>
        <h2 className='text-2xl font-bold capitalize font-mono'>Page Not Found</h2>
        <p className='text-xl font-mono'>Sorry, the page you are looking for does not exist.</p>

        <a href='/' className='mt-4 text-blue-500 underline font-mono'>Go back to Home</a>
      </div>
    </div>
  ) 
}

export default NotFound