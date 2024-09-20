import React, { useContext, useState } from 'react'
import logoName from '../assets/images/logoName.svg'
import login from '../assets/images/login.svg'
import google from '../assets/images/google.png'
import emailverification from '../assets/images/emailverification.svg';
import resetpassword from '../assets/images/resetpassword.svg';
import visible from '../assets/images/visible.png'
import notvisible from '../assets/images/not-visible.png'
import close from '../assets/images/close.png'
import { PortraitContext } from '../contexts/portrait.jsx';
import { Link, useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.jsx'


const SignIn = () => {
  const { isPortrait } = useContext(PortraitContext)
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const [mailSent, setMailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [resetMessage, setResetMessage] = useState("A password reset link will sent to your email.")
  const [processing, setProcessing] = useState()


  const signInWithGoogle = async () => {
    setProcessing(true)
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (error) {
      window.alert(`An error occurred: ${error.message}`);
    }
    setProcessing(false)
  };


  const signInWithEmailPassword = async () => {
    setProcessing(true)
    if (!email || !password) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setMailSent(true);
      }
      else {
        navigate('/home')
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          setEmailError('Invalid email format.');
          break;
        case 'auth/user-not-found':
          setEmailError('No user found with this email address.');
          break;
        case 'auth/wrong-password':
          setPasswordError('Incorrect password.');
          break;
        default:
          window.alert(`An unknown error occurred. Please try again. ${error}`);
          break;
      }
    }
    setProcessing(false)
  }

  const handleResetpassword = async () => {
    if (!resetEmail) {
      setResetEmailError("Email is required")
    }
    else {
      try {
        await sendPasswordResetEmail(auth, resetEmail)
        setResetMessage("Email sent, check your inbox")
      } catch (error) {
        window.alert(`An error occured! ${error}`)
      }
    }
  }
  return (
    <>
      <div className={`${mailSent || resetPassword ? "backdrop-blur-md opacity-20" : ""} w-full h-full bg-white text-blue-dark`} style={{ height: "100vh" }}>
        <div className='w-full py-3 px-10 bg-gradient-to-r from-purple to-pink flex items-center justify-between'>
          <img draggable={false} src={logoName} className='lg:h-6 h-4' alt="" />
          <h1 className='lg:text-xl text-md text-white font-bold tracking-wider'>Welcome Back</h1>
        </div>

        <div className={`w-full lg:p-10 p-5 flex ${isPortrait ? 'flex-col-reverse' : 'flex-row'} justify-center items-center gap-10`}>
          <img src={login} draggable={false} className={`${isPortrait ? 'w-full' : 'w-1/2'}`} />
          <div className={`${isPortrait ? 'w-full' : 'w-1/2'} flex items-center justify-center`}>
            <div className='bg-[#fae8ff] border-[2px] border-purple border-opacity-30 px-5 py-6 w-11/12 h-full shadow-2xl flex flex-col items-center justify-center gap-3 rounded-xl'>
              <h1 className='w-full text-center text-4xl font-extrabold text-purple'>Sign In</h1>

              <label className='w-11/12' htmlFor="">
                <p className='p-2 text-md font-semibold'>Email</p>
                <input
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                  }}
                  className='w-full bg-[#fdf4ff] py-2 px-3 focus:outline-none rounded-lg border-2 border-pink  border-opacity-25'
                  type="email"
                  required
                />
              </label>
              {emailError && <p className='w-11/12 text-red'>{emailError}</p>}
              <label className='w-11/12' htmlFor="">
                <p className='p-2 text-md font-semibold'>Password</p>
                <div className='w-full bg-[#fdf4ff] rounded-lg flex items-center justify-between border-2 border-pink border-opacity-25'>
                  <input
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError("");
                    }}
                    className='w-10/12 bg-[#fdf4ff] p-2 focus:outline-none rounded-lg '
                    type={passwordVisible ? "text" : "password"}
                  />
                  <img src={passwordVisible ? notvisible : visible} className='m-2 h-5 hover:cursor-pointer' onClick={() => { setPasswordVisible(!passwordVisible) }} alt="" />
                </div>
              </label>
              {passwordError && <p className='w-11/12 text-red'>{passwordError}</p>}

              <button onClick={signInWithEmailPassword} className='w-11/12 text-center text-lg font-bold text-white bg-pink p-2 rounded-lg mt-5 active:scale-95 transition-all ease-in-out'>Log In</button>

              <div className="w-11/12 relative flex py-1 items-center">
                <div className="w-1/2 border-opacity-25 flex-grow border-[1px] border-t border-blue-dark"></div>
                <span className="flex-shrink mx-4 border-blue-dark">OR</span>
                <div className="w-1/2 border-opacity-25 flex-grow border-[1px] border-t border-blue-dark"></div>
              </div>

              <button onClick={signInWithGoogle} className='w-11/12 bg-white p-2 flex items-center justify-center gap-5 rounded-lg border-2 border-pink  border-opacity-25 active:scale-95 transition-all ease-in-out'>
                <img src={google} className='h-6' alt="Google" />
                <p className='text-md font-semibold'>Continue with Google</p>
              </button>

              <button onClick={() => { setResetPassword(true) }} className='p-2 text-blue-medium font-semibold'>Forgot Password?</button>
              <Link className='py-3' to={'/sign-up'}>Don't have an account? <b className='text-pink'>Sign Up</b></Link>

            </div>
          </div>

        </div>
      </div>

      {mailSent &&
        <div className='w-screen h-screen fixed inset-0 flex items-center justify-center'>
          <div style={{ animation: "softLoad 0.3s ease" }} className='relative w-1/3 rounded-lg bg-[#fae8ff] p-10 text-blue-dark font-semibold tracking-wide flex flex-col items-center justify-center gap-3 border-[2px] border-pink border-opacity-25 '>
            <h1 className='text-pink text-3xl font-bold'>Email Verification</h1>
            <img src={emailverification} className='w-2/3 py-5' alt="Email Verification" />
            <p className='text-center'>Your email is not verified yet.</p>
            <p className='text-center'>A verification link has been sent to your email.</p>
            <p className='text-center'>Click the link in the email to verify your account.</p>
            <button onClick={() => setMailSent(false)} className='w-3/4 m-5 bg-pink text-white py-2 px-10 rounded-lg'>Understood</button>
          </div>
        </div>}

      {resetPassword &&
        <div className='w-screen h-screen fixed inset-0 flex items-center justify-center'>
          <div style={{ animation: "softLoad 0.3s ease" }} className='relative w-1/3 rounded-lg bg-[#fae8ff] p-10 text-blue-dark font-semibold tracking-wide flex flex-col items-center justify-center gap-3 border-[2px] border-pink border-opacity-25 '>
            <h1 className='text-pink text-3xl font-bold'>Reset Password</h1>
            <button onClick={() => { setResetPassword(false); setResetMessage("A password reset link will sent to your email.") }} className='w-11/12 flex items-center justify-end absolute top-5'><img src={close} className='h-5 opacity-50' alt="" /></button>
            <img src={resetpassword} className='w-2/3 py-5' alt="Email Verification" />
            <p className='text-center p-2 bg-purple bg-opacity-20 rounded-lg'>{resetMessage}</p>
            <label className='w-11/12' htmlFor="">
              <p className='p-2 text-md font-bold'>Registered Email</p>
              <input
                onChange={(event) => { setResetEmail(event.target.value) }}
                className='w-full bg-[#fdf4ff] py-2 px-3 focus:outline-none rounded-lg border-2 border-pink border-opacity-25'
                type="email"
              />
            </label>
            {resetEmailError && <p className='w-11/12 text-red'>{resetEmailError}</p>}
            <button onClick={handleResetpassword} className='w-11/12 m-5 bg-pink text-white py-2 px-10 rounded-lg'>Send Email</button>
          </div>
        </div>}

      {processing && <div className='max-w-max p-10 flex flex-col items-center gap-5 bg-white rounded-lg border-[2px] border-pink border-opacity-25  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='h-20 w-20 border-8  rounded-full border-pink-light border-t-pink animate-spin'></div>
      </div>}
    </>
  )

}


export default SignIn
