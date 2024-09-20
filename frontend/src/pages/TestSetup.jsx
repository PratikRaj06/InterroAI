import React, { useEffect, useRef, useState, useContext } from 'react';
import * as faceapi from 'face-api.js';
import Header from '../components/Header';
import cameraBox from '../assets/images/camera-box.webp';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useNavigate } from 'react-router-dom';
import { PortraitContext } from '../contexts/portrait.jsx';
import Webcam from "react-webcam";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TestSetup = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [warn, setWarn] = useState(true);
    const intervalRef = useRef(null);
    const [mute, setMute] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const { isPortrait } = useContext(PortraitContext);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            alert("Your browser does not support speech recognition!");
        }
    }, [browserSupportsSpeechRecognition]);

    const loadModels = () => {
        Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("/models")])
            .then(() => {
                faceDetection();
            })
            .catch((error) => {
                alert("Error loading models:", error);
            });
    };

    const faceDetection = () => {
        intervalRef.current = setInterval(async () => {
            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                setWarn(detections.length === 0);
            }
        }, 1000);
    };

    useEffect(() => {
        loadModels();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startSpeaking = () => {
        resetTranscript()
        SpeechRecognition.startListening({continuous: true, language: 'en-In'})
    };

    useEffect(() => {
        const synthInstance = window.speechSynthesis;
        if (!synthInstance) {
            alert('Speech synthesis not supported in this browser');
            return;
        }
        if (!mute) {
            const sentence = 'Interro AI helps you ace your interviews. Start practicing today!';
            const utterance = new SpeechSynthesisUtterance(sentence);
            synthInstance.speak(utterance);
            utterance.onend = () => setMute(true);
        } else if (synthInstance.speaking) {
            synthInstance.cancel();
        }
    }, [mute]);

    return (
        <div className='w-screen h-full flex flex-col items-center'>
            <Header />
            <div className={` ${isPortrait ? 'md:w-10/12 w-11/12' : 'lg:w-1/2 w-2/3'} bg-pink-light flex flex-col items-center my-5 py-10 rounded-lg shadow-lg`}>
                <h1 className='lg:text-3xl md:text-3xl text-2xl text-center font-semibold pb-5 px-5 text-purple'>System Compatibility Check Up</h1>
                <div className='w-10/12 flex flex-col items-center bg-white rounded-lg p-5'>
                    <h2 className='w-full text-xl font-semibold py-3'>Camera Test</h2>
                    <div className='w-11/12 rounded-lg relative'>
                        {warn && (
                            <p className='text-center min-w-max absolute top-5 left-1/2 transform -translate-x-1/2 bg-opacity-80 backdrop-blur-lg bg-red text-white px-5 py-2 rounded-lg font-regular lg:text-xl text-lg z-10'>
                                NO FACE DETECTED
                            </p>
                        )}
                        <div className='w-full h-full absolute left-1/2 transform -translate-x-1/2 rounded-lg font-regular text-xl flex items-center justify-center z-10'>
                            <img src={cameraBox} className='w-1/2' alt="" />
                        </div>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            mirrored={true}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                width: 640,
                                height: 480,
                                facingMode: "user"
                            }}
                            className="rounded-lg w-full"
                        />
                    </div>
                </div>

                <div className='w-10/12 flex flex-col items-center my-5 bg-white rounded-lg p-5'>
                    <h2 className='w-full text-xl font-semibold'>Microphone Test</h2>
                    <div className='w-full my-5'>
                        <p className='italic font-medium'>Say something. Your words will appear right here!</p>
                        <p className='border-[1px] border-pink border-opacity-50 rounded-md min-h-8 p-1 my-3'>{transcript}</p>
                    </div>
                    <button onClick={listening ? SpeechRecognition.stopListening : startSpeaking} className='bg-pink px-10 text-white py-2 rounded-lg'>
                        {listening ? <span><MicOffIcon /> Stop</span> : <span><MicIcon /> Start</span>}
                    </button>
                </div>

                <div className='w-10/12 flex flex-col items-center my-5 bg-white rounded-lg p-5'>
                    <div className='w-full mb-5 flex items-center justify-between'>
                        <h2 className='w-full text-xl font-semibold'>Sound Test</h2>
                        <button onClick={() => setMute(!mute)} className='bg-pink text-2xl rounded-full text-white p-2 flex items-center justify-center'>
                            {mute ? <VolumeOffIcon fontSize='inherit' /> : <VolumeUpIcon fontSize='inherit' />}
                        </button>
                    </div>
                    <p className='italic font-medium pb-2'>Interro AI helps you ace your interviews. Start practicing today!</p>
                </div>

                <label htmlFor='check' className='w-10/12 flex items-center justify-center gap-3 cursor-pointer mt-10'>
                    <input id='check' onChange={() => setAccepted(prev => !prev)} type="checkbox" className='accent-pink h-4 w-4' />
                    <p>I accept that all components are operating properly</p>
                </label>

                <button onClick={() => { navigate('/home/interview-room') }} disabled={!accepted} className='w-10/12 bg-pink text-white py-2 my-5 rounded-lg text-center text-xl font-semibold'>Enter Virtual Room</button>
            </div>
        </div>
    );
};

export default TestSetup;
