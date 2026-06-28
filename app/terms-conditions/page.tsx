import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for GenZBlog.',
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Terms & Conditions</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Last updated: June 21, 2026</p>
          
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, then you may not access the website.</p>
          
          <h2>2. Intellectual Property Rights</h2>
          <p>Other than the content you own, under these Terms, GenZBlog and/or its licensors own all the intellectual property rights and materials contained in this website.</p>

          <h2>3. Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul>
            <li>Publishing any website material in any other media without credit</li>
            <li>Selling, sublicensing, and/or otherwise commercializing any website material</li>
            <li>Publicly performing and/or showing any website material</li>
            <li>Using this website in any way that is or may be damaging to this website</li>
          </ul>

          <h2>4. User Content</h2>
          <p>In these Terms and Conditions, "User Content" shall mean any audio, video text, images, or other material you choose to display on this website. By displaying Your Content, you grant GenZBlog a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate, and distribute it.</p>

          <h2>5. Accounts and Registration</h2>
          <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>

          <h2>6. Links to Other Websites</h2>
          <p>Our service may contain links to third-party web sites or services that are not owned or controlled by GenZBlog. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>

          <h2>7. Limitation of Liability</h2>
          <p>In no event shall GenZBlog, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

          <h2>8. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.</p>

          <h2>9. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at genzdevoff@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}
