import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for GenZBlog.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Disclaimer</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>Last updated: June 21, 2026</p>
          
          <h2>1. Information Purpose</h2>
          <p>
            The information provided by GenZBlog on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>
          
          <h2>2. No Professional Advice</h2>
          <p>
            The site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of professional advice.
          </p>

          <h2>3. External Links Disclaimer</h2>
          <p>
            The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
          </p>

          <h2>4. Earnings Disclaimer</h2>
          <p>
            We may discuss financial topics or earning strategies. These are for informational purposes only. We cannot guarantee that you will earn any money using the techniques and ideas in these materials.
          </p>

          <h2>5. Affiliate Disclaimer</h2>
          <p>
            The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. Our affiliates include but are not limited to, Amazon Associates and other affiliate programs.
          </p>

          <h2>6. Fair Use Notice</h2>
          <p>
            This website may contain copyrighted material, the use of which has not always been specifically authorized by the copyright owner. We are making such material available for criticism, comment, news reporting, teaching, scholarship, or research under the "fair use" doctrine.
          </p>

          <h2>7. Personal Responsibility</h2>
          <p>
            You acknowledge you are using our website voluntarily and that any choices, actions, and results now and in the future are solely your responsibility. We will not be liable to you or any other party for any decision made or action taken in reliance on the information given by our service.
          </p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this disclaimer, please contact us at <Link href="/contact" className="text-blue-600 hover:underline">our contact page</Link>.</p>
        </div>
      </div>
    </div>
  );
}
