import React, { useContext } from 'react'
import landingBackground from '../assets/images/landingBackground.webp'
import logoName from '../assets/images/logoName.webp'
import landingName from '../assets/images/landingName.webp'
import landingHero from '../assets/images/landingHero.webp'
import rocket from '../assets/images/rocket.webp'
import { Link } from 'react-router-dom'
import { PortraitContext } from '../contexts/portrait'

const LandingPage = () => {

    const { isPortrait } = useContext(PortraitContext)
    return (
        <div style={{
            backgroundImage: `url(${landingBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
        }}
            className='flex flex-col items-center min-h-svh w-screen'
        >
            <div className='w-full py-3 lg:px-10 px-5 bg-gradient-to-r from-blue-medium to-pink flex items-center justify-between'>
                <img src={logoName} className='lg:h-6 h-4' alt="" />
                <Link to={'/sign-in'} className='bg-blue-medium border-[1px] border-white text-white py-1 px-8 rounded-full'>Sign In</Link>
            </div>

            <div className='w-full h-full flex flex-col items-center justify-evenly'>
                <div className='w-full px-10 pt-5 tracking-wide'>
                    <p className='text-xl font-semibold px-2'>Welcome to</p>
                    <img src={landingName} className={`${isPortrait? 'w-full': 'w-1/2'} my-5`} alt="" />
                    <h1 className='lg:text-3xl text-2xl font-bold px-2'>Your AI Interview Buddy</h1>
                </div>
                <div className={`w-full flex ${isPortrait? 'flex-col items-center': 'flex-row items-start'}  justify-center`}>
                    <div className={`${isPortrait? 'w-10/12': 'w-4/12'} items-start h-full py-5 flex flex-col justify-start`}>

                        <p className='text-lg p-2 font-medium'>Struggling to stand out in interviews and with your resume?</p>
                        <p className='text-lg p-2 font-medium'>Our AI-powered tool offers personalized practice and resume upgrades.</p>
                        <p className='text-lg p-2 font-medium'>Get started now and make your career shine!</p>

                        <Link to={'/home'} className='bg-gradient-to-r from-pink to-purple my-5 mx-2 py-2 px-10 rounded-lg text-white font-semibold text-xl flex items-center justify-center gap-3 border-2 max-w-max'>
                            <p>Get Started</p>
                            <img src={rocket} className='h-5' alt="" />
                        </Link>
                    </div>
                    <img src={landingHero} loading='lazy' className={`${isPortrait? 'w-11/12': 'w-7/12'}`} alt="" />
                </div>
            </div>
        </div>
    )
}

export default LandingPage