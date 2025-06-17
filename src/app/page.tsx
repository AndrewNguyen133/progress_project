'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import SystemDesign from "./components/SystemDesign";

export default function Home() {
  const [notes, setNotes] = useState('');

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="grid grid-rows-[20px_1fr] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              href="/system-design"
            >
              Open System Design Editor
            </Link>
          </div>

          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-mono text-gray-300">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="bg-gray-800 px-1 py-0.5 rounded font-mono font-semibold text-gray-200">
                src/app/page.tsx
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">
              Save and see your changes instantly.
            </li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gray-800 text-gray-100 gap-2 hover:bg-gray-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className="rounded-full border border-solid border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-800 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </main>
      </div>

      <div className="w-full border-t border-gray-700">
        <div className="p-4 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-semibold mb-2 text-gray-200">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="w-full h-32 p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none resize-none"
            />
          </div>
        </div>
        <div className="h-[800px] bg-gray-900">
          <SystemDesign />
        </div>
      </div>
    </div>
  );
}
