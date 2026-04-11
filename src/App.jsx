import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/navbar'
import Editor from '@monaco-editor/react'; 
import Select from 'react-select'; 
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
// Keeping the named import fix to prevent the crash
import { HashLoader } from "react-spinners"; 

// 1. Newest SDK initialization
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDjObS0MIFLMBjDS0L9PkuOiOn3nRNXvSM" // Or leave as {} if using an environment variable
});

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'typescript', label: 'TypeScript' },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      color: 'white',
      borderColor: '#3f3f46',
      width: "100%"
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      color: 'white',
      width: "100%"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      width: "100%"
    }),
  };



async function reviewCode() {
  setLoading(true);
  setResponse("");
  
  try {
    // We are using 'gemini-3-flash-preview', which is the 2026 workhorse.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code} `,
    });

    // CRITICAL: In the new SDK, text is a property, not a function.
    const resultText = response.text; 
    
    setResponse(resultText);
  } catch (error) {
    console.error("AI Review Error:", error);
    setResponse("Error: " + error.message);
  }
  setLoading(false);
}

  return (
    <>
      <Navbar />
      <div className="main flex justify-between" style={{ height: "calc(100vh - 90px)" }}>
        
        {/* LEFT SIDE - RESTORED ORIGINAL STYLING */}
        <div className="left h-[87%] w-[50%]">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]">
            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={customStyles}
            />
            <button className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">Fix Code</button>
            <button 
              onClick={() => {
                if (code === "") {
                  alert("Please enter the code first")
                } else {
                  reviewCode()
                }
              }} 
              className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">
              Review
            </button>
          </div>
          <Editor height="100%" theme='vs-dark' language={selectedOption.value} value={code} onChange={(e) => { setCode(e) }} />
        </div>

        {/* RIGHT SIDE - RESTORED ORIGINAL STYLING */}
        <div className="right !p-[10px] bg-zinc-900 w-[50%] h-[100%] overflow-auto">
          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justify-between h-[60px]">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>
          
          {/* Layout for Loader and Response */}
          <div className="response-content !mt-4">
            {loading && (
              <div className="flex justify-center py-5">
                <HashLoader color='#9333ea' />
              </div>
            )}
            {/* Added a simple color fix for the markdown text */}
            <div className="text-white">
               <Markdown>{response}</Markdown>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default App