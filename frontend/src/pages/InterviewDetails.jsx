import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { InterviewDataContext } from '../contexts/interview'
import { AuthContext } from '../contexts/auth'
import { PortraitContext } from '../contexts/portrait.jsx';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


const InterviewDetails = () => {

    const { isPortrait } = useContext(PortraitContext)
    const { interviewData, setInterviewData } = useContext(InterviewDataContext);
    const { accessToken } = useContext(AuthContext)
    const [company, setCompany] = useState("not provided")
    const [jobRole, setJobRole] = useState("not provided")
    const [experience, setExperience] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [resume, setResume] = useState("Resume details not given, please focus on job role, job description and skills.")
    const [selectedType, setselectedType] = useState('');
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")
    const [processing, setProcessing] = useState(false)

    const navigate = useNavigate()

    const filePickerRef = useRef(null)
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        if (interviewData && accessToken) {
            navigate('/home/interview-room/test-setup');
        }
    }, [interviewData, navigate, accessToken])


    const handleResumeProcessing = async () => {
        setError('');
        if (!jobRole || !experience || !jobDescription || !selectedType) {
            return setError("Fill all the required details");
        }
        if(selectedType === 'hr' && resume === 'Resume details not given, please focus on job role, job description and skills.'){
            setError("Resume is required for HR interviews")
        }
        setProcessing(true);

        if (file) {
            try {
                const fileRef = ref(storage, `uploads/${file.name}`);
                await uploadBytes(fileRef, file);
                const fileUrl = await getDownloadURL(fileRef);
                const response = await fetch(`${API_URL}/resume-details/summarize`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fileUrl })
                });
                const result = await response.json()

                await deleteObject(fileRef);
                if (response.status === 500) {
                    setError(result.message);
                    setProcessing(false);
                } else setResume(result.resumeContent)

            } catch (error) {
                setProcessing(false);
                setError(error.message);
            }
        }
        setInterviewData({
            company,
            jobRole,
            experience,
            jobDescription,
            resume,
            selectedType
        });
        setProcessing(false);
    };

    return (
        <>
            <div className='min-h-screen w-screen flex flex-col items-center bg-blue-light'>
                <Header />
                <div className='w-full flex justify-center lg:p-10 p-5'>
                    <div className={`${isPortrait ? 'md:w-10/12 w-11/12' : 'lg:w-1/2 w-8/12'} lg:p-5 md:p-3 p-1 rounded-lg shadow-lg flex flex-col items-center gap-3 bg-white text-blue-dark`}>
                        <h1 className='lg:text-4xl text-3xl  font-bold text-blue-medium text-center my-5'>Interview Details</h1>
                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Company</p>
                            <input onChange={(event) => {
                                setCompany(event.target.value)
                                setError('')
                            }} type="text" className='bg-blue-light bg-opacity-50 w-full py-2 px-3 rounded-lg focus:outline-none border-2 border-blue-regular  border-opacity-20' placeholder='ABC Ltd.' />
                        </label>

                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Job Role <span className='text-red'>*</span></p>
                            <input onChange={(event) => {
                                setJobRole(event.target.value)
                                setError('')
                            }} type="text" className='bg-blue-light bg-opacity-50 w-full py-2 px-3 rounded-lg focus:outline-none border-2 border-blue-regular  border-opacity-20' placeholder='Java Developer' />
                        </label>

                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Experience <span className='text-red'>*</span></p>
                            <input onChange={(event) => {
                                setExperience(event.target.value)
                                setError('')
                            }} type="text" className='bg-blue-light bg-opacity-50 w-full py-2 px-3 rounded-lg focus:outline-none border-2 border-blue-regular  border-opacity-20' placeholder='1 year' />
                        </label>

                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Job Description / Skills <span className='text-red'>*</span></p>
                            <textarea onChange={(event) => {
                                setJobDescription(event.target.value)
                                setError('')
                            }} rows={4} className='bg-blue-light bg-opacity-50 w-full py-2 px-3 rounded-lg focus:outline-none border-2 border-blue-regular border-opacity-20 resize-none' placeholder='Paste your job description or mention some relevant skills'></textarea>
                        </label>

                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Interview Type <span className='text-red'>*</span></p>

                            <div className='w-full flex items-center justify-between gap-5'>
                                <button
                                    className={`w-1/2 border-2 rounded-lg py-1 px-5 font-semibold ${selectedType === 'technical' ? 'bg-blue-regular text-white' : 'text-blue-regular bg-blue-light'
                                    } border-2 border-blue-regular border-opacity-20`}
                                    onClick={() => setselectedType('technical')}
                                >
                                    Technical
                                </button>
                                <button
                                    className={`w-1/2 border-2 rounded-lg py-1 px-5 font-medium ${selectedType === 'hr' ? 'bg-blue-regular text-white' : 'text-blue-regular bg-blue-light'
                                    } border-2 border-blue-regular border-opacity-20`}
                                    onClick={() => setselectedType('hr')}
                                >
                                    HR
                                </button>
                            </div>

                        </label>

                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Resume</p>
                            <div className={`bg-blue-light bg-opacity-50 w-full py-2 px-3 rounded-lg border-2 border-blue-regular border-opacity-20 flex ${isPortrait ? 'md:flex-row flex-col' : 'flex-row'} items-center justify-between`}>
                                <p className='p-1'>{file ? file.name : 'No file chosen'}</p>
                                <input ref={filePickerRef} type="file" accept='application/pdf' onChange={(event) => {
                                    setFile(event.target.files[0])
                                    setError('')
                                }} className='hidden' />
                                <button onClick={() => filePickerRef.current.click()} className='bg-blue-regular py-1 px-16 rounded-lg text-white'>Choose File</button>
                            </div>
                        </label>
                        {error && <p className='text-red py-2'>{error}</p>}

                        <button onClick={handleResumeProcessing} className='bg-blue-medium p-2 w-11/12 my-6 text-white font-bold text-xl rounded-lg'>Submit</button>

                    </div>
                </div>
            </div>

            {processing && <div className='h-screen w-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
                <div className='p-10 max-w-max flex flex-col items-center gap-5 bg-white rounded-lg border-[2px] border-pink border-opacity-25'>
                    <div className='h-20 w-20 border-8  rounded-full border-pink-light border-t-pink animate-spin'></div>
                    <p className='text-xl font-semibold text-blue-dark text-opacity-70 animate-pulse'>Processing</p>
                </div>
            </div>}
        </>
    )
}

export default InterviewDetails
