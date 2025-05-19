import React from 'react';
import Image from 'next/image';

export default function Banner() {
  return (
    <div className="flex flex-col justify-center items-center text-center rounded-lg p-6 gap-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex gap-2 items-center">
        <Image
          src="https://cilsrdpvqtgutxprdofn.supabase.co/storage/v1/object/public/assets/logo-enhanced_60x60.png"
          alt="FASHN AI Logo"
          width={60}
          height={60}
          unoptimized
        />
        <h1 className="text-4xl text-white m-0 font-sans">
          FASHN AI: Example App
        </h1>
      </div>
      <p className="m-0 leading-relaxed text-base text-white opacity-80">
        Welcome to this Next.js app example for the FASHN Virtual Try-On API!<br />
        This simple UI is designed as a starting point to help you explore and better understand how to interact with the
        API and its different parameters. <br />
      </p>
      <div className="flex justify-center items-center text-center gap-2 flex-wrap">
        <a href="https://fashn.ai" target="_blank" rel="noopener noreferrer">
          <Image 
            src="https://custom-icon-badges.demolab.com/badge/FASHN_AI-333333?style=for-the-badge&logo=fashn" 
            alt="FASHN AI" 
            width={100} 
            height={28}
            unoptimized
          />
        </a>
        <a href="https://github.com/fashn-AI" target="_blank" rel="noopener noreferrer">
          <Image 
            src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" 
            alt="Github" 
            width={100} 
            height={28}
            unoptimized
          />
        </a>
        <a href="https://www.linkedin.com/company/fashn" target="_blank" rel="noopener noreferrer">
          <Image 
            src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" 
            alt="LinkedIn" 
            width={100} 
            height={28}
            unoptimized
          />
        </a>
        <a href="https://x.com/fashn_ai" target="_blank" rel="noopener noreferrer">
          <Image 
            src="https://img.shields.io/badge/@fashn_ai-%23000000.svg?style=for-the-badge&logo=X&logoColor=white" 
            alt="X" 
            width={100} 
            height={28}
            unoptimized
          />
        </a>
        <a href="https://www.instagram.com/fashn.ai/" target="_blank" rel="noopener noreferrer">
          <Image 
            src="https://img.shields.io/badge/Fashn.ai-%23E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white" 
            alt="Instagram" 
            width={100} 
            height={28}
            unoptimized
          />
        </a>
        <a href="https://discord.gg/MCs39Gf4yn" target="_blank" rel="noopener noreferrer">
          <Image 
            src="https://img.shields.io/badge/fashn_ai-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white" 
            alt="Discord" 
            width={100} 
            height={28}
            unoptimized
          />
        </a>
      </div>
    </div>
  );
} 