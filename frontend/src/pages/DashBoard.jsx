import React, { useContext, useEffect, useState } from 'react'
import logoName from '../assets/images/logoName.svg'
import interview from '../assets/images/interview.svg'
import resume from '../assets/images/resume.svg'
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip';
import { AuthContext } from '../contexts/auth.jsx'
import { PortraitContext } from '../contexts/portrait.jsx';

const DashBoard = () => {

  const navigate = useNavigate();
  const { isPortrait } = useContext(PortraitContext)
  const { isAuthenticated, data, loading } = useContext(AuthContext);
  const [name, setName] = useState('')
  useEffect(() => {
    if (loading) return;
    if( data ) setName(data.displayName) 
    if (!isAuthenticated && !loading) navigate('/sign-in')
  }, [isAuthenticated, loading, data, navigate])

  return (
    <>
      <div className='w-screen min-h-screen bg-blue-light'>
        <div className='py-1 lg:px-10 px-5 bg-gradient-to-r from-blue-medium to-pink flex items-center justify-between'>
          <img draggable={false} src={logoName} className='lg:h-6 h-4 my-2' alt="" />
            <Link to={'/home/profile'} className='text-white lg:text-4xl text-3xl flex items-center justify-center gap-2'>
            <h1 className='lg:text-2xl text-lg text-white font-bold'>{name}</h1>
            <Tooltip title='Profile'><PersonIcon fontSize='inherit' /></Tooltip>  
            </Link>
        </div>

        <div className={`w-full h-full py-10 flex ${isPortrait && 'flex-col'} items-center justify-evenly lg:px-10 px-5 gap-5`}>

          <div className={`${isPortrait? 'w-full': 'w-5/12'} bg-white flex flex-col items-center gap-4 px-5 py-10 rounded-xl shadow-lg`}>
            <h1 className='lg:text-4xl text-center text-3xl font-bold tracking-wider text-blue-medium'>AI Mock Interview</h1>
            <img draggable={false} loading='lazy' src={interview} className='w-8/12' alt="AI Interview Practice"/>
            <p className='text-center tracking-wider text-lg'>
              Prepare for interviews with AI-driven sessions, real-time proctoring, and detailed analysis to enhance your skills.
            </p>
            <Link to={'/home/interview-details'} className='w-10/12 text-white py-2 text-center bg-pink rounded-lg text-xl font-semibold tracking-wider'>
              Start Interview Practice
            </Link>
          </div>

          <div className={`${isPortrait? 'w-full': 'w-5/12'} bg-white flex flex-col items-center gap-5 px-5 py-10 rounded-xl shadow-lg`}>
            <h1 className='lg:text-4xl text-center text-3xl font-bold tracking-wider text-blue-medium'>ATS Resume Checker</h1>
            <img draggable={false} loading='lazy' src={resume} className='w-8/12' alt="Resume Checker" />
            <p className='text-center tracking-wider text-lg'>
              Check your resume’s ATS compatibility and get insights to improve your chances of landing interviews.
            </p>
            <Link to={'/home/resume-ats-score'} className='w-10/12 text-white p-2 text-center bg-pink rounded-lg text-xl font-semibold tracking-wider'>
              Check My ATS Score
            </Link>
          </div>
        </div>
      </div>

    </>
  )
}

export default DashBoard