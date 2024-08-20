import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiUpload, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { MdOutlineCheckCircle, MdOutlineError } from 'react-icons/md';

// Google API key and URL
const apiKey = import.meta.env.VITE_MODEL;
const apiUrl = import.meta.env.VITE_GOOGLE_API_URL;

const RoboResumeAnalyzer = () => {
  const [pdfText, setPdfText] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [goodPoints, setGoodPoints] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [chancesOfHiring, setChancesOfHiring] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setupWorker = async () => {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    };
    setupWorker();
  }, []);

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ') + '\n';
      }

      return text;
    } catch (err) {
      setError(`Error extracting text from PDF: ${err.message}`);
      console.error('Error extracting text:', err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await extractTextFromPDF(file);
      if (text) {
        setPdfText(text);
        setError('');
      }
    }
  };

  const generateResponse = async (context) => {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Evaluate the following resume and provide a detailed assessment. Respond in the exact format below without markup:

              Score: [numerical score out of 100]

              Suggestions:
               [first suggestion]
               [second suggestion]
               [additional suggestions if any]

              Good Points:
               [first good point]
               [second good point]
               [additional good points if any]

              Strengths:
               [first strength]
               [second strength]
               [additional strengths if any]

              Weaknesses:
               [first weakness]
               [second weakness]
               [additional weaknesses if any]

              Chances of Hiring: [estimated percentage]

              Resume: ${context}`,
            },
          ],
        },
      ],
    };

    try {
      const result = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: apiKey,
        },
      });

      const responseText = result.data.candidates[0].content.parts[0].text;
      return responseText.trim();
    } catch (error) {
      setError(`Error generating response from Gemini API: ${error.message}`);
      console.error('Error generating response:', error);
      return 'Error generating response.';
    }
  };

  const handleSubmit = async () => {
    if (pdfText.trim() === '') {
      setError('Please provide a PDF file');
      return;
    }

    setIsLoading(true);
    try {
      const generatedText = await generateResponse(pdfText);
      setResponse(generatedText);

      const scoreMatch = generatedText.match(/Score:\s*(\d+)/i);
      const suggestionsMatch = generatedText.match(/Suggestions:\s*([\s\S]*?)(?=Good Points:|Strengths:|Weaknesses:|Chances of Hiring:|$)/i);
      const goodPointsMatch = generatedText.match(/Good Points:\s*([\s\S]*?)(?=Strengths:|Weaknesses:|Chances of Hiring:|$)/i);
      const strengthsMatch = generatedText.match(/Strengths:\s*([\s\S]*?)(?=Weaknesses:|Chances of Hiring:|$)/i);
      const weaknessesMatch = generatedText.match(/Weaknesses:\s*([\s\S]*?)(?=Chances of Hiring:|$)/i);
      const hiringMatch = generatedText.match(/Chances of Hiring:\s*(\d+)/i);

      setScore(scoreMatch ? parseInt(scoreMatch[1], 10) : null);
      setSuggestions(suggestionsMatch ? suggestionsMatch[1].trim().split('\n') : []);
      setGoodPoints(goodPointsMatch ? goodPointsMatch[1].trim().split('\n') : []);
      setStrengths(strengthsMatch ? strengthsMatch[1].trim().split('\n') : []);
      setWeaknesses(weaknessesMatch ? weaknessesMatch[1].trim().split('\n') : []);
      setChancesOfHiring(hiringMatch ? parseInt(hiringMatch[1], 10) : null);
    } catch (error) {
      setError(`Error during response generation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="bg-grid flex flex-col items-center  ">
  <div className="max-w-screen-xl w-full mx-auto p-4">
    {/* Upload Section */}
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-6 md:mb-8 flex flex-col items-center">
  <div className="flex flex-col md:flex-row items-center justify-between w-full mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 flex items-center mb-4 md:mb-0">
      <FiFileText className="h-6 md:h-8 w-6 md:w-8 mr-2 md:mr-3 text-indigo-600" />
      Upload Your Resume
    </h2>
    
  </div>
  <label
    htmlFor="dropzone-file"
    className="flex flex-col items-center justify-center w-full h-48 md:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
  >
    <div className="flex flex-col items-center justify-center py-4 md:py-6">
      <FiUpload className="w-10 md:w-12 h-10 md:h-12 mb-2 md:mb-3 text-gray-400" />
      <p className="mb-2 text-xs md:text-sm text-gray-600 text-center">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
    </div>
    <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
  </label>
  <button
      className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 mt-3 w-full  px-4 md:py-3 md:px-6 rounded-md transition-transform transform hover:scale-105 flex items-center justify-center ${
        pdfText.trim() === '' || isLoading ? 'cursor-not-allowed opacity-70' : ''
      }`}
      disabled={pdfText.trim() === '' || isLoading}
      onClick={handleSubmit}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 md:mr-3 h-4 md:h-5 w-4 md:w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Analyzing...
        </>
      ) : (
        <>
          <FiCheckCircle className="h-4 md:h-5 w-4 md:w-5 mr-1 md:mr-2" />
          Analyze Resume
        </>
      )}
    </button>
</div>

    {/* Analysis Results Section */}
    {response && (
      <div className="bg-white p-5  rounded-lg shadow-lg">
        <h2 className="text-3xl  font-bold mb-6 text-indigo-800 flex items-center">
          <FiCheckCircle className="h-8 w-8 mr-3 text-indigo-600" />
          Analysis Results
        </h2>

        <div className="flex flex-wrap justify-around gap-8 mb-8">
          {score !== null && (
            <div className="flex flex-col items-center text-center w-full sm:w-1/2 lg:w-1/4">
              <div className="w-32 h-32 mb-4">
                <CircularProgressbar
                  value={score}
                  text={`${score}%`}
                  styles={buildStyles({
                    pathColor: score > 70 ? '#22c55e' : score > 40 ? '#f59e0b' : '#ef4444',
                    textColor: score > 70 ? '#22c55e' : score > 40 ? '#f59e0b' : '#ef4444',
                    trailColor: '#e5e7eb',
                  })}
                />
              </div>
              <p className="text-xl font-semibold">Score: <strong>{score}%</strong></p>
              <p className="text-gray-600 mt-2">The overall score of the resume out of 100.</p>
            </div>
          )}

          {chancesOfHiring !== null && (
            <div className="flex flex-col items-center text-center w-full sm:w-1/2 lg:w-1/4">
              <div className="w-32 h-32 mb-4">
                <CircularProgressbar
                  value={chancesOfHiring}
                  text={`${chancesOfHiring}%`}
                  styles={buildStyles({
                    pathColor: '#34d399', // Green color for chances of hiring
                    textColor: '#34d399',
                    trailColor: '#e5e7eb',
                  })}
                />
              </div>
              <p className="text-xl font-semibold">Chances of Hiring: <strong>{chancesOfHiring}%</strong></p>
              <p className="text-gray-600 mt-2">The estimated chances of getting hired based on this resume.</p>
            </div>
          )}
        </div>

        {/* Suggestions, Good Points, Strengths, Weaknesses */}
        <div className="space-y-8">
          {suggestions.length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                Suggestions
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {suggestions.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {goodPoints.length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
                <FaCheckCircle className="text-blue-500 mr-3" />
                Good Points
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {goodPoints.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {strengths.length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
                <FaCheckCircle className="text-purple-500 mr-3" />
                Strengths
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {strengths.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {weaknesses.length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
                <FaCheckCircle className="text-red-500 mr-3" />
                Weaknesses
              </h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {weaknesses.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Error Message */}
    {error && (
      <div className="mt-4 text-red-600 font-semibold text-center">
        {error}
      </div>
    )}
  </div>
</div>

  );
};

export default RoboResumeAnalyzer;

