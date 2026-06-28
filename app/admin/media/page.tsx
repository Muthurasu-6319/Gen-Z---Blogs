import { Image as ImageIcon, Upload } from 'lucide-react';

export const metadata = {
  title: 'Media Library | GenZ Admin',
};

export default function AdminMedia() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Media Library</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your website images.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </button>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Media Library Empty</h3>
        <p className="text-slate-500 max-w-md mx-auto">Upload and manage images here once cloud storage (like AWS S3 or Firebase Storage) is configured.</p>
      </div>
    </div>
  );
}
