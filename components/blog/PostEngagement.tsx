"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PostEngagementProps {
  slug: string;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: any;
}

export function PostEngagement({ slug }: PostEngagementProps) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Listen for likes
    const likesQuery = query(collection(db, 'post_likes'), where('slug', '==', slug));
    const unsubscribeLikes = onSnapshot(likesQuery, (snapshot) => {
      setLikes(snapshot.docs.length);
      // Check if current device liked it (simple local storage check for demo)
      const likedLocally = localStorage.getItem(`liked_${slug}`);
      if (likedLocally) setHasLiked(true);
    });

    // Listen for comments
    const commentsQuery = query(
      collection(db, 'post_comments'), 
      where('slug', '==', slug)
    );
    
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      // Sort in JS because Firestore requires a composite index for where + orderBy
      fetchedComments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setComments(fetchedComments);
    });

    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [slug]);

  const handleLike = async () => {
    if (hasLiked) return; // Prevent multiple likes from same user
    
    try {
      await addDoc(collection(db, 'post_likes'), {
        slug,
        createdAt: serverTimestamp()
      });
      setHasLiked(true);
      localStorage.setItem(`liked_${slug}`, 'true');
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'post_comments'), {
        slug,
        name: userName,
        text: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-12">
      {/* Action Bar */}
      <div className="flex items-center space-x-6 py-6 border-y border-slate-200 dark:border-slate-800">
        <button 
          onClick={handleLike}
          disabled={hasLiked}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
            hasLiked 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
          <span className="font-bold">{likes} Likes</span>
        </button>
        
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
          <MessageSquare className="w-5 h-5" />
          <span className="font-bold">{comments.length} Comments</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Discussion</h3>
        
        {/* Comment Form */}
        <form onSubmit={submitComment} className="bg-slate-50 dark:bg-[#111] p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 mb-10">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="What are your thoughts?"
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Comment List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold uppercase">
                  {comment.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{comment.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      • {comment.createdAt?.toDate ? formatDate(comment.createdAt.toDate().toISOString()) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
