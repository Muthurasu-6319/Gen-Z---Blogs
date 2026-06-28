"use client";

import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Link as LinkIcon, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}/blog/${slug}`);
  }, [slug]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  if (!url) return null; // Don't render until URL is set to avoid hydration mismatch

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <span className="font-semibold text-slate-900 dark:text-white">Share this article:</span>
      <div className="flex flex-wrap items-center gap-3">
        {/* Twitter / X */}
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-900/40 text-blue-500 transition-colors"
          title="Share on Twitter"
        >
          <FaTwitter className="w-5 h-5" />
        </a>
        
        {/* LinkedIn */}
        <a 
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-500 transition-colors"
          title="Share on LinkedIn"
        >
          <FaLinkedin className="w-5 h-5" />
        </a>

        {/* Facebook */}
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-500 transition-colors"
          title="Share on Facebook"
        >
          <FaFacebook className="w-5 h-5" />
        </a>

        {/* WhatsApp */}
        <a 
          href={`https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-green-50 hover:bg-green-100 dark:bg-slate-800 dark:hover:bg-green-900/40 text-green-600 dark:text-green-500 transition-colors"
          title="Share on WhatsApp"
        >
          <FaWhatsapp className="w-5 h-5" />
        </a>

        {/* Copy Link */}
        <button 
          onClick={handleCopyLink}
          className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
          title="Copy Link"
        >
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
