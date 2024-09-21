import React, { useContext, useEffect, useState } from 'react'
import logoName from '../assets/images/logoName.webp'
import { AuthContext } from '../contexts/auth'
import { signOut } from 'firebase/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { PortraitContext } from '../contexts/portrait';
import user from '../assets/images/user.webp'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Meter = ({ value, colour, fontSize, size }) => {
  return (
    <Gauge
      height={size}
      width={size}
      valueMax={10}
      value={value}
      innerRadius="75%"
      sx={() => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: fontSize,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: colour,
        }
      })}
    />
  );
}

const Profile = () => {
  const { data, loading, accessToken } = useContext(AuthContext)
  const [userData, setUserData] = useState()
  const [fetching, setFetching] = useState(true)
  const navigate = useNavigate()
  const { isPortrait } = useContext(PortraitContext)
  const [popup, setPopup] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/interview-data/get-data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.status == 404) return
      if (response.status !== 200) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }


      const responseData = await response.json();
      setUserData(responseData.data);
      setFetching(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (accessToken) fetchData();
  }, [accessToken])

  const signOutUser = async () => {
    try {
      await signOut(auth);
      navigate('/sign-in');
    } catch (error) {
      alert(`An error occurred while signing out ${error}`);
    }
  };

  function getColourCodes(value) {
    if (value >= 0 && value <= 3) return '#DB4437'
    else if (value >= 4 && value <= 7) return '#F4B400'
    else if (value >= 8 && value <= 10) return '#0F9D58'
  }

  function formatTimestamp(timestamp) {
    // Convert seconds to milliseconds
    const milliseconds = timestamp._seconds * 1000;

    // Convert nanoseconds to milliseconds
    const additionalMilliseconds = timestamp._nanoseconds / 1000000;

    // Create a Date object
    const date = new Date(milliseconds + additionalMilliseconds);

    // Options for formatting the date in Indian format
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };

    return date.toLocaleString('en-IN', options).replace(',', ' |');
  }
  return (
    <>
    <div className={`${popup && 'opacity-25'} w-screen min-h-screen flex flex-col items-center`}>
      <div className='w-full py-1 lg:px-10 px-5 bg-gradient-to-r from-blue-medium to-pink flex items-center justify-between'>
        <img onClick={() => navigate('/home')} draggable={false} src={logoName} className='lg:h-6 h-4 my-2 cursor-pointer' alt="" />
        <Tooltip onClick={() => setPopup(true)} className='text-white cursor-pointer' title="Sign Out">
          <LogoutIcon fontSize={isPortrait ? 'medium' : 'large'} />
        </Tooltip>
      </div>

      {!loading &&
        <div className={`${isPortrait ? 'w-11/12 flex-col' : 'w-10/12'} p-5 flex justify-center items-center gap-10`}>
          <img src={user} className='h-40 border-2 rounded-full border-pink' alt="" />
          <div className={`w-full flex flex-col ${isPortrait ? 'items-center' : 'items-start'}`}>
            <h1 className='text-5xl font-bold text-blue-medium py-3'>{data.displayName}</h1>
            <p className='text-xl font-medium text-blue-dark'>{data.email}</p>
          </div>
        </div>
      }
      <div className='w-11/12 border-[1px] border-blue-dark border-opacity-25'></div>

      {fetching &&  <div className='my-5 h-10 w-10 border-4  rounded-full border-pink-light border-t-pink animate-spin'></div>}
      {!fetching && <div className='w-full flex flex-col items-center my-10'>
        <h1 className='w-10/12 text-3xl font-bold text-purple'>Past Interviews</h1>

        <div className={`${isPortrait ? 'w-11/12' : 'w-10/12'} bg-blue-light grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 rounded-lg gap-5 p-5 m-5`}>
          {userData.map((item, index) => (
            <div onClick={() => navigate(`/home/profile/past-interview/${item.id}`)} key={index} className='p-5 rounded-lg bg-white flex flex-col items-center gap-5 cursor-pointer hover:scale-105 transition-all ease-in-out'>
              <h1 className='text-2xl font-semibold text-center'>{item.jobRole}</h1>
              <Meter size={200} colour={getColourCodes(item.score)} value={item.score} fontSize={40} />

              <p className='text-center text-lg font-normal'>{formatTimestamp(item.createdAt)}</p>
            </div>
          ))}
        </div>


      </div>}
    </div>

    {popup && <div className={`${isPortrait? 'md:w-1/2 w-10/12': 'lg:w-1/3 md:w-1/2 w-2/3'} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white flex flex-col items-center jus gap-10 p-10 rounded-lg shadow-lg border-2 border-pink
     border-opacity-25`}>
      <h1 className='lg:text-4xl md:text-3xl text-2xl  font-semibold text-pink'>Sign Out?</h1>
      <p className='text-lg text-center font-medium text-blue-dark'>Are you sure you want to sign out?</p>
      <div className='w-full flex flex-row items-center justify-center gap-5'>
        <button onClick={() => setPopup(false)} className='w-1/2 text-xl border-2 border-pink rounded-lg text-pink py-2 px-5 font-semibold'>No</button>
        <button onClick={signOutUser} className='w-1/2 text-xl bg-red text-white py-2 px-5 rounded-lg font-semibold'>Yes</button>
      </div>
    </div>}
    </>
  )
}

export default Profile
