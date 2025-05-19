import React from 'react';

export default function Tips() {
  return (
    <div className="p-4 border border-gray-700 rounded-lg text-center flex flex-col gap-2 my-4">
      <b className="text-lg">❣️ Tips for successful try-on generations</b>
      <ul className="flex gap-3 justify-center list-none p-0 m-0 flex-wrap">
        <li>2:3 aspect ratio</li>
        <li>One person per image</li>
        <li>Focus/Zoom on subject</li>
        <li>Similar poses between images</li>
        <li>High-quality images</li>
      </ul>
    </div>
  );
} 