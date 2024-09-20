import React from 'react'
import logoName from '../assets/images/logoName.webp'
const Header = () => {
    return (
        <div className='w-full py-1 lg:px-10 px-5 bg-gradient-to-r from-blue-medium to-pink flex items-center justify-between'>
            <img onClick={() => window.location.href='/home'} draggable={false} src={logoName} className='lg:h-6 h-4 my-2 cursor-pointer' alt="" />
        </div>
    )
}

export default Header