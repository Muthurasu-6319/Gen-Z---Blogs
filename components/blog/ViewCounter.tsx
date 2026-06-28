"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchAndIncrementViews = async () => {
      try {
        const viewRef = doc(db, 'page_views', slug);
        
        // Check if we already viewed this page in this session
        const hasViewed = sessionStorage.getItem(`viewed_${slug}`);
        
        if (!hasViewed) {
          // Increment the view counter
          await setDoc(viewRef, { count: increment(1) }, { merge: true });
          sessionStorage.setItem(`viewed_${slug}`, 'true');
        }

        // Fetch the latest count
        const viewDoc = await getDoc(viewRef);
        if (viewDoc.exists()) {
          setViews(viewDoc.data().count);
        } else {
          setViews(hasViewed ? 0 : 1);
        }
      } catch (error) {
        console.error("Error with view counter:", error);
      }
    };

    fetchAndIncrementViews();
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
      <Eye className="w-4 h-4 mr-2" />
      {views.toLocaleString()} views
    </span>
  );
}
