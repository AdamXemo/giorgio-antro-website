import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/** Escapes user-supplied strings before embedding them in HTML to prevent XSS. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // If email is configured, forward the message
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })

      // All user-supplied values are escaped before being placed in HTML.
      const safeName    = escapeHtml(String(name))
      const safeEmail   = escapeHtml(String(email))
      const safeSubject = escapeHtml(String(subject))
      const safeMessage = escapeHtml(String(message)).replace(/\n/g, '<br>')

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'ANTRO <noreply@antro.com>',
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `[ANTRO Contact] ${safeSubject}`,
        html: `
          <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p>${safeMessage}</p>
        `,
      })
    } else {
      // Log to console when email is not configured (development fallback).
      // Do not log the full message body to avoid PII in logs.
      console.log('Contact form submission (email not configured):', { name, email, subject })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
