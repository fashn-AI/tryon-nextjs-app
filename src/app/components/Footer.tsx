import React from 'react';

export default function Footer() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 p-6 gap-4 rounded-lg items-center mt-8">
      <div className="flex justify-center gap-2">
        <h1 className="text-2xl text-white m-0 font-sans">
          Additional Resources
        </h1>
      </div>
      <div className="max-w-[790px] text-center">
        <ul className="list-none p-0 m-0 leading-8 text-base text-white opacity-80">
          <li>
            <a 
              href="https://docs.fashn.ai/guides/api-parameters-guide"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sky-300 no-underline hover:underline"
            >
              API Parameters Guide
            </a>
          </li>
          <li>
            <a 
              href="https://docs.fashn.ai/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sky-300 no-underline hover:underline"
            >
              FASHN API Documentation
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
} 