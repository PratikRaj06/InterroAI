import React, { useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';


const FaceDetection = () => {
    const webcamRef = useRef(null);
    const [warn, setWarn] = useState(true);
    const intervalRef = useRef(null);

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

    return (
        <div className='w-full flex flex-col items-center border-opacity-50'>
            <div className='w-11/12 rounded-lg relative'>
                {warn && (
                    <p className='text-center min-w-max absolute top-5 left-1/2 transform -translate-x-1/2 bg-opacity-80 backdrop-blur-lg bg-red text-white px-5 py-2 rounded-lg font-regular lg:text-xl text-lg z-10'>
                        NO FACE DETECTED
                    </p>
                )}
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
    );
};
export default FaceDetection;