import React, { useState, useContext } from 'react';
import { auth } from '../firebase.jsx';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import logoName from '../assets/images/logoName.webp'
import register from '../assets/images/register.webp';
import google from '../assets/images/google.webp';
import emailverification from '../assets/images/emailverification.webp';
import { Link, useNavigate } from 'react-router-dom';
import { PortraitContext } from '../contexts/portrait.jsx';

const SignUp = () => {
    const { isPortrait } = useContext(PortraitContext)
    const [mailSent, setMailSent] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [processing , setProcessing] = useState()

    const navigate = useNavigate();

    const handleGoogleSignUp = async () => {
        setProcessing(true)
        const googleProvider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/home');
        } catch (error) {
            window.alert(`An error occured! ${error}`)
        };
        setProcessing(false)
    }

    const handleSignUpWithCredentials = async () => {
        setEmailError("");
        setPasswordError("");
        setMailSent(false);
        setProcessing(true)

        try {
            if (!email) {
                setEmailError("Please enter email")
                return
            }

            if (!name) {
                setNameError("Please enter name")
                return
            }

            if (password !== confirmPassword) {
                setPasswordError("Passwords do not match");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            await sendEmailVerification(user);
            setProcessing(false)
            setMailSent(true);
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setEmailError('Email already exists');
            } else if (error.code === 'auth/weak-password') {
                setPasswordError('Password should be at least 6 characters');
            } else {
                window.alert('Error registering user:', error.message);
            }
            setProcessing(false)
        }
    };

    return (
        <>

            
            <div className={`${mailSent && "backdrop-blur-md opacity-20"} w-full h-full bg-white text-blue-dark`} style={{ height: "100vh" }}>
                <div className='w-full py-3 lg:px-10 px-5 bg-gradient-to-r from-purple to-pink flex items-center justify-between'>
                    <img draggable={false} src={logoName} className='lg:h-6 h-4' alt="" />
                    <h1 className='lg:text-xl text-md text-white font-bold tracking-wider'>Join Us for Free</h1>
                </div>
                <div className={`w-full lg:p-10 p-5 flex ${isPortrait ? 'flex-col' : 'flex-row'} justify-center items-center gap-10`}>
                    <div className={`${isPortrait ? 'w-full' : 'w-1/2'} flex items-center justify-center`}>
                        <div className='bg-[#fae8ff] border-[2px] border-purple border-opacity-30 px-5 py-10 w-full h-full shadow-2xl flex flex-col items-center justify-center gap-3 rounded-xl'>
                            <h1 className='w-full text-center text-4xl font-extrabold text-purple'>Sign Up</h1>

                            <label className='w-11/12' htmlFor="">
                                <p className='p-2 text-md font-semibold'>Name</p>
                                <input value={name}
                                    onChange={(event) => {
                                        setName(event.target.value);
                                    }}
                                    className='w-full bg-[#fdf4ff] py-2 px-3 focus:outline-none rounded-lg border-2 border-pink  border-opacity-25'
                                    type="text"
                                />
                            </label>
                            {nameError && <p className='w-11/12 text-red'>{nameError}</p>}

                            <label className='w-11/12' htmlFor="">
                                <p className='p-2 text-md font-semibold'>Email</p>
                                <input value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setEmailError("");
                                    }}
                                    className='w-full bg-[#fdf4ff] py-2 px-3 focus:outline-none rounded-lg border-2 border-pink  border-opacity-25'
                                    type="email"
                                />
                            </label>
                            {emailError && <p className='w-11/12 text-red'>{emailError}</p>}
                            <label className='w-11/12' htmlFor="">
                                <p className='p-2 text-md font-semibold'>Password</p>
                                <input value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        setPasswordError("");
                                    }}
                                    className='w-full bg-[#fdf4ff] py-2 px-3 focus:outline-none rounded-lg border-2 border-pink border-opacity-25'
                                    type="password"
                                />
                            </label>

                            <label className='w-11/12' htmlFor="">
                                <p className='p-2 text-md font-semibold'>Confirm Password</p>
                                <input value={confirmPassword}
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        setPasswordError("");
                                    }}
                                    className='w-full bg-[#fdf4ff] py-2 px-3 focus:outline-none rounded-lg border-2 border-pink border-opacity-25'
                                    type="password"
                                />
                            </label>

                            {passwordError && <p className='w-11/12 text-red'>{passwordError}</p>}

                            <button disabled={processing} onClick={handleSignUpWithCredentials} className='w-11/12 text-center text-lg font-bold text-white bg-pink p-2 rounded-lg mt-5 active:scale-95 transition-all ease-in-out'>Register</button>

                            <div className="w-11/12 relative flex py-1 items-center">
                                <div className="w-1/2 border-opacity-25 flex-grow border-[1px] border-t border-blue-dark"></div>
                                <span className="flex-shrink mx-4 border-blue-dark">OR</span>
                                <div className="w-1/2 border-opacity-25 flex-grow border-[1px] border-t border-blue-dark"></div>
                            </div>

                            <button disabled={processing} onClick={handleGoogleSignUp} className='w-11/12 bg-white p-2 flex items-center justify-center gap-5 rounded-lg border-2 border-pink  border-opacity-25 active:scale-95 transition-all ease-in-out'>
                                <img src={google} className='h-6' alt="Google" />
                                <p className='text-md font-semibold'>Continue with Google</p>
                            </button>

                            <Link className='py-3' to={'/sign-in'}>Already have an account? <b className='text-pink'>Sign In</b></Link>

                        </div>
                    </div>
                    <img draggable={false} src={register} className={`${isPortrait ? 'w-full' : 'w-1/2'}`} alt="Register" />
                </div>
            </div>

            {mailSent &&
                <div className='w-screen h-screen fixed inset-0 flex items-center justify-center'>
                    <div style={{ animation: "softLoad 0.3s ease" }} className='relative w-1/3 rounded-lg bg-[#fae8ff] p-10 text-blue-dark font-semibold tracking-wide flex flex-col items-center justify-center gap-3 border-[2px] border-pink border-opacity-25 '>
                        <h1 className='text-pink text-3xl font-bold'>Email Verification</h1>
                        <img src={emailverification} className='w-2/3 py-5' alt="Email Verification" />
                        <p className='text-center'>A verification link has been sent to your email.</p>
                        <p className='text-center'>Click the link in the email to verify your account.</p>
                        <button onClick={() => setMailSent(false)} className='w-3/4 m-5 bg-pink text-white py-2 px-10 rounded-lg'>Understood</button>
                    </div>
                </div>}

                {processing && <div className='max-w-max p-10 flex flex-col items-center gap-5 bg-white rounded-lg border-[2px] border-pink border-opacity-25  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='h-20 w-20 border-8  rounded-full border-pink-light border-t-pink animate-spin'></div>
            </div>}
        </>
    );
}


export default SignUp;
