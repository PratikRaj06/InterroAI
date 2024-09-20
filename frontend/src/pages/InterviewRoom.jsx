import React, { useState, useEffect, useContext } from 'react'
import FaceDetection from '../components/FaceDetection'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import MicOffIcon from '@mui/icons-material/MicOff';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from 'react-router-dom'
import { InterviewDataContext } from '../contexts/interview.jsx'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { PortraitContext } from '../contexts/portrait';
import { AuthContext } from '../contexts/auth.jsx'
import logoName from '../assets/images/logoName.webp'

const InterviewRoom = () => {

  const { interviewData } = useContext(InterviewDataContext);
  const { accessToken } = useContext(AuthContext);
  // const numQuestions = Math.floor(Math.random() * (15 - 8 + 1)) + 8
  const [numQuestions, setNumQuestions] = useState(Math.floor(Math.random() * (15 - 8 + 1)) + 8)
  const { isPortrait } = useContext(PortraitContext)
  const [question, setQuestion] = useState()
  const [answer, setAnswer] = useState(null)
  const [mute, setMute] = useState(false)
  const [interviewChat, setInterviewChat] = useState(null)
  const [sentencesToSpeak, setSentencesToSpeak] = useState()
  const [readInstructions, setReadInstructions] = useState(false)
  const [showWarning, setShowWarning] = useState(false);
  const [testDone, setTestDone] = useState(false)
  const [questionCount, setQuestionCount] = useState(numQuestions)
  const [interviewResults, setInterviewResults] = useState()
  const [movedFromScreen, setMovedFromScreen] = useState(0)
  const [thinking, setThinking] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    transcript,
    listening,
    resetTranscript,
    finalTranscript
  } = useSpeechRecognition();

  useEffect(() => { scrollTo(0, 0) }, [])

  const navigate = useNavigate();

  useEffect(() => {
    if (interviewData) {
      setInterviewChat([
        {
          role: "user",
          parts: [{
            text: `
                Your role is to act as an interviewer for the comapny ${interviewData.company}, conducting an interview for the position of ${interviewData.jobRole}. The job description or relevant skills are as follows: ${interviewData.jobDescription}. The candidate's has experience of ${interviewData.experience} and the resume overview is: ${interviewData.resume}.

                Your task is to ask ${numQuestions} interview questions, one at a time. These questions should be based on:
                The job role and its responsibilities OR,
                Relevent skills based technical core questions OR,
                The candidate's resume details, such as skills, projects, and experience OR,
                The Responses given by the candidate to previous questions OR, HR and Managerial round based questions
                
                Instructions:

                Start the Interview: You may begin by asking the candidate to introduce themselves.
                Question Format: Ask one question at a time, keeping each question straightforward and relevant. Ensure that questions are concise, to the point, and cover a range of topics including technical skills, problem-solving, and behavioral aspects and others.
                If the candidate asks for clarification on a question, simplify the question without changing its core intent.
                Feedback: Do not provide immediate feedback on the candidate’s answers. Maintain a realistic interview environment by waiting until the end of the interview to provide a detailed analysis.
                Randomization: Ensure that questions are asked in a random order to simulate a real interview experience. Since answer is provided by microphone regognition, there may be some mistacke in capturing, so try to understand the context of the candidate's answer and consider it as an answer.
                Generate your responses in one or two lines of plain text format. After the interview is complete, a detailed analysis of the interview will be requested.
                `
          }
          ]
        }
      ]);

    }
    else navigate('/home/interview-details')
  }, [interviewData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowWarning(true);
        setMovedFromScreen(prev => prev + 1);
        setTimeout(() => setShowWarning(false), 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const synthInstance = window.speechSynthesis;
    if (!synthInstance) {
      window.alert('Speech synthesis not supported in this browser');
      return;
    }

    const speakText = (text) => {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      setSentencesToSpeak(sentences.length);
      sentences.forEach((sentence) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.onend = () => setSentencesToSpeak(prev => prev - 1);
        synthInstance.speak(utterance);
      });
    };

    if (question && !mute) {
      speakText(question);
    }

    if (question && mute) {
      synthInstance.cancel()
      startListening()
    }
    if (mute && synthInstance.speaking) {
      synthInstance.cancel();
    }
  }, [question, mute]);


  const prompt = `Now the interview is completed, and you have access to all the questions and answers. Since using webspeechapi so the answers are not captured porperly, so try to understand the context and then evaluate. Candidate switched tabs ${movedFromScreen} times, consider it as malpractice if moved away from screen more than once.  Based on this information, please provide a detailed performance evaluation in a structured JSON format. Your response should be in this format:
  {
    "jobRole": job Role for which interview was conducted.
    "overallPerformance: Describe overall performance of the candidate in one line. , 
    overallScore: A numerical value representing the candidate's overall performance during the interview, rated on a scale of 1 to 10,
    sectionScore: {
      communication: A numerical value rating the candidate's communication skills, on a scale of 1 to 10,
      behavior: A numerical value rating the candidate's behavior and attitude during the interview, on a scale of 1 to 10,
      skill: A numerical value for the candidate's technical or job-specific skills, on a scale of 1 to 10,
      domainKnowledge: A numerical value for the candidate's understanding of domain-specific knowledge, on a scale of 1 to 10
    },
    strengths: [An array of the candidate's key strengths, described in clear and concise sentences],
    areasOfImprovement: [Am array of areas where the candidate could improve, in clear and concise sentences],
    suggestions: [An array for any additional suggestions or advice for the candidate, provided in full sentences],
    q&a: [
      {
        question: The question asked during the interview,
        answer: The answer provided by the candidate,
        bestAnswer: A proper, ideal answer for the given question
      },
      { all other questions and answers in the same format }
    ]
  }
  `;

  const startListening = () => {
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
  };

  const stopListening = () => {
    SpeechRecognition.stopListening()
    if (questionCount === 0) setAnswer(`My answer: ${finalTranscript}. | ${prompt}`)
    else setAnswer(`My answer:  ${finalTranscript}.`)
  }

  useEffect(() => {
    if (sentencesToSpeak === 0) startListening();
  }, [sentencesToSpeak])

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: interviewChat
  });

  const processInterview = async (retryCount = 2) => {
    if (!interviewChat) return;
    try {
      setThinking(true)
      let result = await chat.sendMessage(answer);
      const response = result.response.text();
      const updatedChat = [...interviewChat];
      updatedChat.push(
        {
          role: "user",
          parts: [{ text: answer }],
        },
        {
          role: "model",
          parts: [{ text: response }],
        }
      );
      setInterviewChat(updatedChat);
      if (questionCount > 0) {
        setQuestion(response);
        setThinking(false)
        setQuestionCount(prev => prev - 1);
      } else {
        setInterviewResults(response);
        setTestDone(true);
      }
    } catch (error) {
      if (retryCount > 0) {
        setTimeout(() => processInterview(retryCount - 1), 2000);
        window.alert("Error occurred while processing the interview. Please try again later.");
      }
    }
  };


  useEffect(() => {
    if (answer && interviewChat) {
      processInterview();
    }
  }, [answer]);

  const cleanedData = (data) => {
    return data
      .replace(/```json|```|```/g, '')
      .trim();
  };

  const addData = async (resumeData, retry = 2) => {

    try {
      const jsonData = JSON.parse(resumeData)
      const jobRole = jsonData.jobRole;
      const overallScore = jsonData.overallScore;
      const response = await fetch(`${API_URL}/interview-data/add-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: jsonData,  // Just pass the whole object as `data`
          jobRole,
          score: overallScore
        })
      });

      // Check response status explicitly
      if (response.status === 401) {
        window.alert("Unauthorized: Please check your access token.");
        return;
      }
      if (response.status === 404) {
        window.alert("Unauthorized: please check data");
        return;
      }

      if (response.status !== 200) {
        window.alert(`Access Denied: Server responded with status ${response.status}`);
        return;
      }
      setTimeout(() => {
        navigate('/home/interview-results', { state: { data: resumeData } })
      }, 3000);

    } catch (error) {
      if (retry > 0) {
        await addData(resumeData, retry - 1);
      } else {
        window.alert(`Failed after retries. Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    let resumeData = '';
    if (interviewResults && accessToken && testDone) {
      resumeData = cleanedData(interviewResults);
      addData(resumeData)
    }
  }, [interviewResults])


  return (
    <>
      <div className='w-screen flex flex-col items-center'>
        <div className='w-full py-1 lg:px-10 px-5 bg-gradient-to-r from-blue-medium to-pink flex items-center justify-between'>
          <img draggable={false} src={logoName} className='lg:h-6 h-4 my-2' alt="" />
        </div>
        {showWarning && <p className='px-5 py-2 bg-red text-xl text-white font-medium rounded-md absolute top-20 z-10 text-center mx-5'>You have moved {movedFromScreen} times out of test window</p>}
        <div className={`w-full flex ${isPortrait ? 'flex-col-reverse items-center' : 'flex-row items-start'}  justify-center p-5 gap-5`}>
          <div className={`bg-blue-light ${isPortrait ? 'w-11/12' : 'w-1/2'} rounded-lg border-[2px] border-blue-medium border-opacity-25 flex flex-col items-center`}>
            <div className='w-full flex items-center justify-between px-5'>
              <p className='w-full font-bold text-blue-medium py-3 lg:text-3xl text-2xl'>Question</p>
              <button className='rounded-full bg-blue-medium bg-opacity-80 text-white p-1' onClick={() => { setMute(!mute) }}>{mute ? <span><VolumeOffIcon /></span> : <span><VolumeUpIcon /></span>}</button>
            </div>
            {question && <h1 className='w-full p-5 lg:text-2xl text-lg font-medium text-blue-dark'>{question}</h1>}
            {thinking && <div className='w-full px-2'><div className="loader"></div></div>}
          </div>
          <div className={`${isPortrait ? 'w-full' : 'w-1/2'} flex flex-col items-center gap-5`}>
            {!testDone && <FaceDetection />}
          </div>

        </div>

        <div className='w-full flex items-center justify-center pb-5'>
          <div className='bg-white w-10/12 rounded-lg border-[2px] border-pink border-opacity-25 flex flex-col items-end'>
            <div className={`w-full flex ${isPortrait ? 'md:flex-row flex-col' : 'flex-row '} items-center justify-between px-5`}>
              <span className='lg:text-3xl text-2xl font-bold text-pink py-3'>Your Response</span>
              <button disabled={!listening}
                className='rounded-full p-2 bg-red bg-opacity-80 text-white'
                onClick={stopListening}
              >
                {listening ? <span className='animate-pulse w-full flex items-center justify-center gap-2 px-2'><SettingsVoiceIcon /><p className='w-full text-lg'>Stop Recording</p></span> : <span><MicOffIcon /></span>}
              </button>
            </div>
            <h1 className='w-full p-5 text-lg font-regular'>{transcript}</h1>
          </div>
        </div>
      </div>

      {testDone &&
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10 max-w-max flex flex-col items-center gap-5 bg-white rounded-lg border-[2px] border-pink border-opacity-25'>
          <p className='text-3xl font-bold text-purple pb-10'>Interview Completed</p>
          <div className='h-20 w-20 border-8  rounded-full border-pink-light border-t-pink animate-spin'></div>
          <p className='text-xl font-semibold text-blue-dark text-opacity-70 animate-pulse p-5'>Processing Results</p>
        </div>
      }

      {!readInstructions && <div className='w-screen  flex min-h-max flex-col items-center absolute top-0 bg-[#000000] bg-opacity-50 z-50'>

        <div className={`${isPortrait ? 'w-11/12' : 'w-8/12'} bg-white flex flex-col gap-5 items-center shadow-lg lg:p-10 p-5`}>
          <h1 className='lg:text-4xl text-3xl text-center font-bold text-purple'>Interview Instructions</h1>

          <div className='w-11/12'>
            <h2 className='lg:text-2xl md:text-2xl text-xl text-blue-dark font-semibold py-5'>➤ Setup Requirements</h2>
            <ul className='lg:px-10 px-8 list-disc flex flex-col gap-2 text-lg font-normal text-blue-dark'>
              <li><b>Device</b>: Use a laptop or desktop with a working webcam and microphone.</li>
              <li><b>Internet</b>: Ensure a stable and fast internet connection.</li>
              <li><b>Browser</b>: Recommended browsers: Google Chrome</li>
              <li><b>Environment</b>: Choose a quiet and well-lit space with no distractions.</li>
            </ul>
          </div>

          <div className='w-11/12'>
            <h2 className='lg:text-2xl md:text-2xl text-xl text-blue-dark font-semibold py-5'>➤ Before Starting</h2>
            <ul className='lg:px-10 px-8 list-disc flex flex-col gap-2 text-lg font-normal text-blue-dark'>
              <li><b>Test</b> your webcam and microphone.</li>
              <li><b>Dress</b> professionally and ensure no interruptions.</li>
              <li>Make sure you have around <b>15-30 minutes</b> of uninterrupted time.</li>
            </ul>
          </div>

          <div className='w-11/12'>
            <h2 className='lg:text-2xl md:text-2xl text-xl text-blue-dark font-semibold py-5'>➤ Interview Process</h2>
            <ul className='lg:px-10 px-8  list-disc flex flex-col gap-2 text-lg font-normal text-blue-dark'>
              <li><b>Question Display</b>: Each question will appear one by one on the screen.</li>
              <li><b>Voice Synthesis</b>: The AI will read the question aloud. Wait for it to finish.</li>
              <li><b>Microphone Activation</b>: Once the question is fully read, the mic will turn on automatically</li>
            </ul>
          </div>

          <div className='w-11/12'>
            <h2 className='lg:text-2xl md:text-2xl text-xl text-blue-dark font-semibold py-5'>➤ Answering the Questions</h2>
            <ul className=' lg:px-10 px-8  list-disc flex flex-col gap-2 text-lg font-normal text-blue-dark'>
              <li><b>Speak clearly</b> and <b>loudly</b> into the microphone.</li>
              <li>Once done answering, click the<b> Stop Recording </b>button to stop recording and submit your answer.</li>
              <li>Repeat the process for each question until the interview is completed.</li>
            </ul>
          </div>


          <div className='w-11/12'>
            <h2 className='lg:text-2xl md:text-2xl text-xl text-blue-dark font-semibold py-5'> ➤ AI Proctoring</h2>
            <ul className='lg:px-10 px-8  list-disc flex flex-col gap-2 text-lg font-normal text-blue-dark'>
              <li>Your <b>webcam will be active</b> throughout the interview to monitor your behavior</li>
              <li>Stay <b>focused on the screen</b> at all times to avoid triggering alerts.</li>
              <li>Maintain <b>eye contact</b> with the screen and avoid looking away.</li>
            </ul>
          </div>

          <button onClick={() => {
            setReadInstructions(true)
            setAnswer('Now ask me the 1st question')
          }} className='w-10/12 bg-pink text-white text-xl py-2 my-5 font-semibold rounded-lg'>Start Interview</button>

        </div>

      </div>}
    </>
  )
}

export default InterviewRoom
