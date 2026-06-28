import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { title, slug, description } = await request.json();

    if (!title || !slug) {
      return NextResponse.json({ error: 'Missing title or slug' }, { status: 400 });
    }

    // 1. Fetch all subscribers from Firebase
    const subscribersRef = collection(db, 'subscribers');
    const snapshot = await getDocs(subscribersRef);
    const emails: string[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });

    if (emails.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' }, { status: 200 });
    }

    // 2. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Create Email Content
    const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${slug}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: [], // We use BCC for privacy
      bcc: emails,
      subject: `New Article: ${title} | GenZBlogs`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #2563eb;">GenZBlogs</h2>
          <p>Hi there,</p>
          <p>We just published a new article that you might find interesting!</p>
          <h3 style="color: #0f172a;">${title}</h3>
          <p style="color: #475569;">${description || ''}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${articleUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Read Full Article
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            You received this email because you subscribed to GenZBlogs.<br>
            If you wish to unsubscribe, please reply to this email.
          </p>
        </div>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Newsletter sent successfully to ' + emails.length + ' subscribers' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json({ error: error.message || 'Failed to send newsletter' }, { status: 500 });
  }
}
