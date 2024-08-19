Resume Analysis Application
Resume Analysis Application is a web-based tool designed to analyze and evaluate resumes by extracting content from PDF files and generating insights such as scores, suggestions, and good points using an advanced AI model.

Table of Contents
Overview
Features
Technology Stack
Getting Started
Prerequisites
Installation
Running the Application
Usage
Contributing
License
Contact
Overview
The Resume Analysis Application leverages the power of AI to provide detailed insights into resumes uploaded in PDF format. The application extracts content from the resume and uses the microsoft/Phi-3-mini-4k-instruct model to generate contextually relevant scores, suggestions, and good points based on specific queries. This approach aligns with the principles of Retrieval-Augmented Generation (RAG), where the extracted document content is used as context to enhance the accuracy of the AI-generated responses.

Features
PDF Content Extraction: Automatically extract all text content from uploaded PDF resumes.
AI-Powered Analysis: Use the microsoft/Phi-3-mini-4k-instruct model to analyze the extracted content and generate:
Resume score
Key strengths (good points)
Areas for improvement (suggestions)
Responsive and Modern UI: Built with Tailwind CSS and Framer Motion for a sleek, responsive design.
Monospace Font Display: All results are displayed in a monospace font for enhanced readability.
Technology Stack
Frontend:
React.js
Tailwind CSS
Framer Motion
Heroicons v2
Backend:
Vercel (for hosting)
Hugging Face's microsoft/Phi-3-mini-4k-instruct model for AI processing
Getting Started
Prerequisites
Ensure you have the following installed:

Node.js
npm or yarn
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/resume-analysis-app.git
Navigate to the project directory:

bash
Copy code
cd resume-analysis-app
Install dependencies:

bash
Copy code
npm install
or

bash
Copy code
yarn install
Running the Application
To run the application locally, use:

bash
Copy code
npm run dev
or

bash
Copy code
yarn dev
This will start the development server, and you can view the application at http://localhost:3000.

Usage
Upload Resume: Use the upload feature to select a PDF resume from your device.
Analyze Content: The application will automatically extract text content from the PDF.
View Insights: The extracted content is sent to the AI model, which generates and displays a score, key strengths, and suggestions based on the content.
