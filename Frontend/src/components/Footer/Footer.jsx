import React from 'react'

function Footer() {
  return (
    <footer className='bg-gray-600 text-center py-4 text-sm text-gray-100 '>
        Desenvolvido por <span className='font-semibold'>PavSoftware</span> &copy; { new Date().getFullYear() }
    </footer>
  )
}

export default Footer