import { MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Contact Messages | GenZ Admin',
};

export default function AdminMessages() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Messages</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View messages from your readers.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Inbox Empty</h3>
        <p className="text-slate-500 max-w-md mx-auto">You have no new messages. Once the contact form is linked to the database, messages will appear here.</p>
      </div>
    </div>
  );
}
