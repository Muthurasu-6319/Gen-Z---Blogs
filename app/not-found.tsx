import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-slate-50 dark:bg-[#0a0a0a] min-h-[70vh] flex items-center justify-center py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 drop-shadow-sm">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto">
          Oops! The article or page you are looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/" 
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <button 
            className="px-8 py-4 bg-white dark:bg-[#111] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full font-bold transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
