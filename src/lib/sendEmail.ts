import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ to, subject, htmlContent }: EmailOptions): Promise<void> {
  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider (e.g., Gmail, Outlook)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Define email options
    const mailOptions = {
      from: `"Eventure Team" <${process.env.EMAIL_USER}>`, // Sender email
      to, // Recipient email
      subject, // Email subject
      html: htmlContent, // Email HTML content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
