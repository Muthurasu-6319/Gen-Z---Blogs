import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for GenZBlog.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Last updated: June 21, 2026</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to GenZBlog. We respect your privacy and are committed to protecting your personal data.</p>
          
          <h2>2. Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
          <ul>
            <li>Identity Data (e.g., name, username)</li>
            <li>Contact Data (e.g., email address)</li>
            <li>Technical Data (e.g., IP address, browser type)</li>
            <li>Usage Data (e.g., how you use our website)</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Notify you about changes to our service</li>
            <li>Allow you to participate in interactive features</li>
            <li>Provide customer support</li>
          </ul>

          <h2>4. Third-Party Services</h2>
          <p>We use third-party services like Google AdSense to serve ads. These third parties may use cookies to serve ads based on your prior visits to our website.</p>

          <h2>5. Your Data Protection Rights (GDPR & CCPA)</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right of rectification (to fix incorrect information).</li>
            <li>The right to object or restrict our processing of your personal data.</li>
            <li>The right to data portability (requesting a copy of your data).</li>
          </ul>

          <h2>6. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

          <h2>7. Data Retention</h2>
          <p>We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>

          <h2>8. Children's Privacy</h2>
          <p>Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.</p>

          <h2>9. Changes to this Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at genzdevoff@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}
