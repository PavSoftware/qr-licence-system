import React from 'react'

function Footer() {
  return (
    <footer className='bg-gray-100 text-center py-4 text-sm text-gray-600 border-t'>
        Desenvolvido por <span className='font-semibold'>PavSoftware</span> &copy; { new Date().getFullYear() }
    </footer>
  )
}

export default Footer