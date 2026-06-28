"use client";

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function NewsletterForm() {
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

  return (
    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-8 sm:p-12 my-12 border border-blue-100 dark:border-blue-800/30 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Join our World-Wide Community
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Get the latest insights, tech trends, and modern articles delivered straight to your inbox. No spam, just pure value.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium">Thanks for subscribing! Welcome to GenZ Articles.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-grow">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
        
        {status === 'error' && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Something went wrong. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  );
}
