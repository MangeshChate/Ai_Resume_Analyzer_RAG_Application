import React, { useState, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
import * as pdfjsLib from 'pdfjs-dist';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CloudArrowUpIcon, DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';


const inference = new HfInference(import.meta.env.VITE_API_KEY);

const MODEL = import.meta.env.VITE_MODEL;

const RoboResumeAnalyzer = () => {
  const [pdfText, setPdfText] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [score, setScore] = useState(null);
  const [suggestions, setSuggestions] = useState('');
  const [goodPoints, setGoodPoints] = useState('');
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
        text += content.items.map(item => item.str).join(' ') + '\n';
      }

      return text;
    } catch (err) {
      setError(`Error extracting text from PDF: ${err.message}`);
      console.error("Error extracting text:", err);
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
    const messages = [
      { 
        role: 'user', 
        content: `Evaluate the following resume and provide a detailed assessment. Respond in the exact format below:
        
        Score: [numerical score out of 100]
        Suggestions:
         [first suggestion]
         [second suggestion]
         [additional suggestions if any]
        
        Good Points:
         [first good point]
         [second good point]
         [additional good points if any]
        
        Resume: ${context}`
      }
    ];

    let responseText = '';
    try {
      for await (const chunk of inference.chatCompletionStream({
        model: MODEL,
        messages,
        max_tokens: 200,
      })) {
        responseText += chunk.choices[0]?.delta?.content || '';
      }
      return responseText.trim();
    } catch (error) {
      setError(`Error generating response from Hugging Face API: ${error.message}`);
      console.error("Error generating response:", error);
      return "Error generating response.";
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
      const suggestionsMatch = generatedText.match(/Suggestions:\s*([\s\S]*?)(?=Good Points:|$)/i);
      const goodPointsMatch = generatedText.match(/Good Points:\s*([\s\S]*?)(?=$)/i);

      setScore(scoreMatch ? parseInt(scoreMatch[1], 10) : null);
      setSuggestions(suggestionsMatch ? suggestionsMatch[1].trim() : 'N/A');
      setGoodPoints(goodPointsMatch ? goodPointsMatch[1].trim() : 'N/A');

    } catch (error) {
      setError(`Error during response generation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const formatList = (text) => {
    return text.split('\n').map((item, index) => (
      item.trim() ? <li key={index} className="ml-4 mb-2">{item}</li> : null
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 grid-bg">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 text-indigo-800">
        AI Resume Analyzer
      </h1>
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
            <DocumentTextIcon className="h-8 w-8 mr-2 text-indigo-600" />
            Upload Resume
          </h2>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>
          <button 
            onClick={handleSubmit}
            className={`w-full mt-4 py-3 px-6 text-white rounded-md ${pdfText.trim() === '' || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200 ease-in-out font-semibold flex items-center justify-center`}
            disabled={pdfText.trim() === '' || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Analyze Resume
              </>
            )}
          </button>
          {error && (
            <div className="mt-4 text-red-600 text-center flex items-center justify-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
        </div>
        
        {score !== null && (
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Resume Score</h2>
            <div className="w-48 sm:w-56">
              <CircularProgressbar
                value={score}
                maxValue={100}
                text={`${score}%`}
                styles={buildStyles({
                  pathColor: score >= 70 ? '#10B981' : '#EF4444',
                  textColor: '#4338CA',
                  trailColor: '#E5E7EB',
                })}
              />
            </div>
          </div>
        )}
      </div>
      
      {score !== null && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
              <ExclamationTriangleIcon className="h-7 w-7 mr-2 text-yellow-500" />
              Improvement Suggestions
            </h3>
            <ul className="space-y-2 text-gray-700">
              {formatList(suggestions)}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center">
              <CheckCircleIcon className="h-7 w-7 mr-2 text-green-500" />
              Strengths
            </h3>
            <ul className="space-y-2 text-gray-700">
              {formatList(goodPoints)}
            </ul>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default RoboResumeAnalyzer;
