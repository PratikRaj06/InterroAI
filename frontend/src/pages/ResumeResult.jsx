import React, { useState, useEffect, useRef, useContext } from 'react'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Header from '../components/Header'
import { Link, useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PortraitContext } from '../contexts/portrait';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HomeIcon from '@mui/icons-material/Home';
const Meter = ({ value, colour, fontSize, height, width }) => {
    return (
        <Gauge
            height={height}
            width={width}
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


const ResumeResult = () => {
    const location = useLocation();
    const resumeData = location.state?.resumeData
    const [downloading, setDownloading] = useState(false)
    const [jsonData, setJsonData] = useState(JSON.parse(resumeData))
    const [filteredData, setFilteredData] = useState(null)
    const contentRef = useRef(null);
    const { isPortrait } = useContext(PortraitContext)

    useEffect(() => {
        if (resumeData) {
            try {
                const parsedData = JSON.parse(resumeData);
                setJsonData(parsedData);

                const selectedKeys = [
                    "Overall Impression",
                    "Formatting and Layout",
                    "Clarity and Precision",
                    "Alignment with Job Requirements",
                    "Impact of Achievements",
                    "Keywords and Industry Jargon",
                    "Consistency in Tone and Voice",
                    "Skill Representation",
                    "Professional Summary",
                ];
                const filtered = Object.keys(parsedData)
                    .filter(key => selectedKeys.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = parsedData[key];
                        return obj;
                    }, {});
                setFilteredData(filtered);
            } catch (error) {
                
            }
        }
    }, [resumeData]);


    function getColourCodes(value) {
        if (value >= 0 && value <= 3) return '#DB4437'
        else if (value >= 4 && value <= 7) return '#F4B400'
        else if (value >= 8 && value <= 10) return '#0F9D58'
    }

    function getReviewCodes(value) {
        if (value >= 0 && value <= 3) return 'Weak'
        else if (value >= 4 && value <= 6) return 'Moderate'
        else if (value >= 7 && value <= 8) return 'Strong'
        else if (value >= 9 && value <= 10) return 'very Strong'
    }

    const handleSavePdf = async () => {
    if (contentRef.current) {
        setDownloading(true)
        const canvas = await html2canvas(contentRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);

        const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // The number of pages needed
        let position = 0;
        let pageHeight = pdfHeight;

        while (position < imgHeight) {
            pdf.addImage(imgData, 'png', 0, -position, imgWidth, imgHeight);
            position += pageHeight;

            if (position < imgHeight) {
                pdf.addPage();
            }
        }

        pdf.save('resume-analysis-result.pdf');
        setDownloading(false)
    }
};


    return (
        <>
            <div ref={contentRef} className='w-full h-full flex flex-col items-center tracking-wide'>
                <Header />

                <div className='w-11/12 flex flex-col items-center gap-5 text-blue-dark'>
                    <h1 className='w-full py-5 lg:text-4xl md:text-3xl text-2xl font-bold text-blue-medium'>Resume Analysis Result</h1>
                    <div className='w-full h-full lg:p-5 p-3 rounded-lg bg-blue-light grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 grid-rows-1 lg:gap-5 gap-3 border-[2px] border-blue-regular border-opacity-25 place-items-center'>
                        <div className='bg-white w-full h-full rounded-lg p-5 flex flex-col items-center justify-center shadow-lg'>
                            <p className='text-2xl font-bold pb-5'>ATS Score</p>

                            <Meter value={jsonData.Score} colour={getColourCodes(jsonData.Score)} fontSize={70} height={200} width={200} />
                            <p className='text-2xl px-5 py-2 my-5  font-semibold rounded-lg text-center'>{getReviewCodes(jsonData.Score)}</p>
                            <p className='text-2xl font-bold rounded-lg pb-5'>{jsonData.Score} / 10</p>
                        </div>

                        <div className='lg:col-span-3'>
                            <h1 className='text-xl font-bold pb-5'>Section Ratings</h1>
                            <div className='grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-5'>
                                {Object.entries(jsonData.ScoreOfEachSection).map(([section, score], index) => (
                                    <div key={index} className='bg-white p-5 rounded-lg flex flex-col items-center justify-center shadow-md'>
                                        <Meter value={score} colour={getColourCodes(score)} fontSize={30} height={100} width={100} />
                                        <p className='text-lg font-semibold text-center'>{section}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='w-full flex flex-col items-center gap-5 py-5'>
                        <h1 className='w-full text-3xl font-bold text-pink'>Summary</h1>

                        {filteredData && Object.entries(filteredData).map(([key, value]) => (
                            <div key={key} className='w-full'>
                                <h3 className="text-xl p-2 font-bold">⮞ {key}</h3>
                                <p className="text-lg px-8">{value}</p>
                            </div>
                        ))}

                        <div className='w-full'>
                            <h3 className="text-xl p-2 font-bold">⮞ Strengths</h3>
                            <ul className='px-10'>
                                {jsonData.Strengths.map((item, index) => ( 
                                    <li key={index} className="list-disc text-lg px-2 py-1">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className='w-full'>
                            <h3 className="text-xl p-2 font-bold">⮞ Areas of Improvement</h3>
                            <ul className='px-10'>
                                {jsonData['Areas of Improvement'].map((item, index) => ( 
                                    <li key={index} className="list-disc text-lg px-2 py-1">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className='w-full'>
                            <h3 className="text-xl p-2 font-bold">⮞ Suggestions</h3>
                            <ul className='px-10'>
                                {jsonData.Suggestions.map((item, index) => ( 
                                    <li key={index} className="list-disc text-lg px-2 py-1">{item}</li>
                                ))}
                            </ul>
                        </div>


                    </div>

                </div>
            </div>

            <div className='w-full flex items-center justify-center lg:gap-10 gap-5 lg:p-10 p-5'>
            <Link to={'/home'} className='lg:w-1/4 w-1/2 text-center mt py-2 bg-blue-light text-blue-medium rounded-lg border-[2px] border-blue-medium'><HomeIcon/> Back to Home</Link>
            <button onClick={handleSavePdf} className='lg:w-1/4 w-1/2 py-2 text-center bg-blue-medium text-white rounded-lg'><PictureAsPdfIcon/> {downloading? 'Downloading...' : 'Save as PDF'}</button>
            </div>

        </>
    )
}

export default ResumeResult