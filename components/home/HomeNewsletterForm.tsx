"use client";

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function HomeNewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: serverTimestamp(),
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center space-x-2 text-white bg-white/20 backdrop-blur-md p-4 rounded-xl max-w-xl mx-auto">
        <CheckCircle2 className="w-6 h-6" />
        <span className="font-medium">Thanks for subscribing! Welcome to GenZBlogs.</span>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-xl mx-auto gap-4">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address" 
          className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm disabled:opacity-50"
          required
          disabled={status === 'loading'}
        />
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-full font-bold transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>
      {status === 'error' && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-red-200">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Something went wrong. Please try again.</span>
        </div>
      )}
    </div>
  );
}
