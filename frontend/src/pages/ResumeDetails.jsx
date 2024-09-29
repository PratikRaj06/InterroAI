import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import Header from '../components/Header'
import { PortraitContext } from '../contexts/portrait';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const ResumeDetails = () => {
    const { accessToken } = useContext(AuthContext)
    const [jobDescription, setJobDescription] = useState("not provided")
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")
    const [processing, setProcessing] = useState(false)
    const [resumeResult, setResumeResult] = useState(null)
    const { isPortrait } = useContext(PortraitContext)

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate()
    useEffect(() => {
        if (resumeResult) navigate('/home/resume-ats-score/analysis-results', { state: { resumeData: resumeResult } })
    }, [resumeResult, navigate])

    const filePickerRef = useRef(null)

    const handleResumeProcessing = async () => {
        setError('');

        if (!file) {
            return setError("Please select a resume file");
        }

        setProcessing(true);

        try {
            const filename = file.name;
            const fileRef = ref(storage, `uploads/${filename}`);
            await uploadBytes(fileRef, file);
            const fileUrl = await getDownloadURL(fileRef);


            const response = await fetch(`${API_URL}/resume-content/analyse`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jobDescription, filename, fileUrl })
            });
            const result = await response.json()
            
            await deleteObject(fileRef);
            if (!response.ok) {
                setError(result.message || "An error occurred");
            } else {
                setResumeResult(result.resumeResult);
            }
        } catch (error) {
            setError(`Upload failed: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };


    return (
        <>
            <div className='min-h-screen w-screen flex flex-col items-center bg-blue-light'>
                <Header />
                <div className={`${processing && 'opacity-20'} w-full flex justify-center lg:p-10 p-5`}>
                    <div className={`${isPortrait ? 'md:w-11/2 w-full' : 'lg:w-1/2 w-10/12'} bg-white lg:p-5 md:p-3 p-1 rounded-lg shadow-lg flex flex-col items-center gap-3`}>
                        <h1 className='lg:text-4xl text-3xl font-bold text-blue-medium text-center my-5'>ATS Score Checker</h1>
                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Job Description</p>
                            <textarea onChange={(event) => {
                                setJobDescription(event.target.value)
                                setError('')
                            }} rows={10} className='bg-blue-light bg-opacity-50 w-full py-2 px-3 rounded-lg focus:outline-none border-2 border-blue-regular border-opacity-25 resize-none' placeholder='Add job decription to analyse your resume for a particular application'></textarea>
                        </label>

                        <label htmlFor="" className='w-11/12 flex flex-col items-start'>
                            <p className='text-md font-semibold text-blue-dark p-2'>Resume<span className='text-red'>*</span></p>
                            <div className={`bg-blue-light bg-opacity-50 w-full py-2 px-3 rounded-lg border-2 border-blue-regular border-opacity-25 flex ${isPortrait ? 'flex-col' : 'flex-row'} items-center justify-between gap-2`}>
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
                <div className='p-10 max-w-max flex flex-col items-center gap-5 bg-white rounded-lg border-[2px] border-blue-medium border-opacity-50'>
                    <div className='h-20 w-20 border-8  rounded-full border-blue-light border-t-blue-medium animate-spin'></div>
                    <p className='text-xl font-semibold text-blue-dark animate-pulse text-center'>Analysing your Resume</p>
                </div>
            </div>}
        </>
    )
}

export default ResumeDetails
