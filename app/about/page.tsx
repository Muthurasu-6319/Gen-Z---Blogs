import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about GenZBlog and our mission.',
};

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">About GenZBlog</h1>
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <p className="lead text-xl text-slate-600 dark:text-slate-400 text-center mb-12">
            We are a collective of forward-thinking individuals dedicated to bringing you the best insights on technology, lifestyle, finance, and career development.
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p>
                Our mission is to empower the next generation with actionable knowledge. We believe in providing high-quality, researched, and easy-to-read content that helps you navigate the modern world.
              </p>
              <p>
                Whether you're looking to break into the tech industry, manage your personal finances better, or just stay updated on the latest trends, GenZBlog is your go-to resource.
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 h-64 rounded-2xl flex items-center justify-center">
               {/* Placeholder for an image */}
               <span className="text-slate-400">Team Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
