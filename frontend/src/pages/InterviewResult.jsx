import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header'
import { Link, useLocation } from 'react-router-dom'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PortraitContext } from '../contexts/portrait';
import { InterviewDataContext } from '../contexts/interview'
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

const InterviewResult = () => {

    const { setInterviewData } = useContext(InterviewDataContext);

    const location = useLocation()
    const data = location.state?.data
    const [result, setResult] = useState(JSON.parse(data))
    const { isPortrait } = useContext(PortraitContext)
    function getColourCodes(value) {
        if (value >= 0 && value <= 3) return '#DB4437'
        else if (value >= 4 && value <= 7) return '#F4B400'
        else if (value >= 8 && value <= 10) return '#0F9D58'
    }
    useEffect(() => {
        setInterviewData(null)
    },[])
    return (

        <div className='w-screen flex flex-col items-center'>
            <Header />
            <div className='w-full p-10 flex flex-col items-center'>

                <h1 className='lg:text-4xl text-3xl text-center font-bold text-blue-medium pb-10'>Interview Result Analysis</h1>

                <div className={`w-full lg:px-10 px-5 py-2 mb-5 flex ${isPortrait? 'flex-col': 'flex-row justify-between'} gap-3 bg-blue-light rounded-lg items-center`}>
                    <h1 className='lg:text-2xl text-xl font-bold text-blue-dark py-3 text-center'>Job Role: <span className='font-medium'>{result.jobRole}</span></h1>
                    <h1 className='lg:text-2xl text-xl font-bold text-blue-dark py-3 text-center'>Interview Type: <span className='font-medium'>{result.interviewType}</span></h1>    
                </div>
                

                <div className='w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 bg-blue-light p-5 rounded-lg shadow-lg'>
                    <div className={`w-full flex ${isPortrait? 'lg:flex-row md:flex-row flex-col col-span-2': 'flex-col col-span-1'} items-center justify-center gap-5`}>
                        <div className='w-full bg-white rounded-lg flex flex-col items-center p-5'>
                            <Meter size={200} fontSize={50} value={result.sectionScore.skill} colour={getColourCodes(result.sectionScore.skill)} />
                            <p className='font-medium text-xl pt-5'>Skills</p>
                        </div>

                        <div className='w-full bg-white rounded-lg flex flex-col items-center p-5'>
                            <Meter size={200} fontSize={50} value={result.sectionScore.domainKnowledge} colour={getColourCodes(result.sectionScore.domainKnowledge)} />
                            <p className='font-medium text-xl pt-5'>Knowledge</p>
                        </div>

                    </div>

                    <div className={`col-span-2 w-full h-full ${isPortrait? 'py-5': 'px-5'}`}>
                        <div className='w-full h-full bg-white rounded-lg flex flex-col items-center justify-between p-5 gap-5'>
                        <p className='w-full text-center font-bold lg:text-2xl text-xl'>Overall Performance</p>
                            <Meter size={window.innerWidth <= 600 ? 250 : window.innerWidth <= 1024 ? 250 : 300} fontSize={window.innerWidth <= 600 ? 80 : 100} value={result.overallScore} colour={getColourCodes(result.overallScore)} />
                            
                            <p className='w-full text-lg text-center font-normal'>{result.overallPerformance}</p>
                        </div>
                    </div>

                    <div className={`w-full flex ${isPortrait? 'lg:flex-row md:flex-row flex-col col-span-2': 'flex-col col-span-1'} items-center justify-center gap-5`}>
                        <div className='w-full bg-white rounded-lg flex flex-col items-center p-5'>
                            <Meter size={200} fontSize={50} value={result.sectionScore.communication} colour={getColourCodes(result.sectionScore.communication)} />
                            <p className='font-medium text-xl pt-5'>Communication</p>
                        </div>
                        <div className='w-full bg-white rounded-lg flex flex-col items-center p-5'>
                            <Meter size={200} fontSize={50} value={result.sectionScore.behavior} colour={getColourCodes(result.sectionScore.behavior)} />
                            <p className='font-medium text-xl pt-5'>Behaviour</p>
                        </div>
                    </div>
                </div>

                <div className='w-11/12 flex flex-col items-center py-10'>
                    <div className='border-[1px] border-blue-dark w-full m-10 border-opacity-25'></div>
                    <h1 className='w-full text-3xl font-bold text-blue-medium'>Result Summary</h1>

                    {result.strengths.length > 0 && <div className='w-full lg:p-5 py-5 text-blue-dark'>
                        <h2 className='font-semibold text-2xl'>⮞ Strengths</h2>
                        <ul className='list-disc lg:pl-10 pl-8 py-2 text-lg'>
                            {result.strengths.map((item, index) => (
                                <li className='py-2' key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>}

                    <div className='w-full lg:p-5 py-5 text-blue-dark'>
                        <h2 className='font-semibold text-2xl'>⮞ Areas Of Improvement</h2>
                        <ul className='list-disc lg:pl-10 pl-8 py-2 text-lg'>
                            {result.areasOfImprovement.map((item, index) => (
                                <li className='py-2' key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className='w-full lg:p-5 py-5 text-blue-dark'>
                        <h2 className='font-semibold text-2xl'>⮞ Suggestions</h2>
                        <ul className='list-disc lg:pl-10 pl-8 py-2 text-lg'>
                            {result.suggestions.map((item, index) => (
                                <li className='py-2' key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className='border-[1px] border-blue-dark w-full m-10 border-opacity-25'></div>

                    <h1 className='w-full text-3xl font-bold text-blue-medium'>Question Answers</h1>

                    <div className='w-full lg:p-5 py-5 text-blue-dark'>
                        {result['q&a'].map((item, index) => (
                            <div key={index} className='shadow-lg border-[2px] border-blue-regular border-opacity-25 p-5 rounded-lg my-5'>
                                <p className='text-lg py-2'>
                                    <b>Question: </b>
                                    {item.question}
                                </p>

                                <p className='text-lg py-2'>
                                    <b>Your Answer: </b>
                                    {item.answer}
                                </p>

                                <p className='text-lg py-2'>
                                    <b>Optimal Response: </b>
                                    {item.bestAnswer}
                                </p>

                            </div>
                        ))}
                    </div>

                </div>

                <Link to={'/home'} className='text-xl text-center border-2 border-blue-medium text-blue-medium py-2 px-5 rounded-lg'>🡨 Back to Home</Link>
            </div>

            
        </div>
    )
}
export default InterviewResult
