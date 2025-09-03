import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { SiteEmailTemplate } from '@/components/email-template'

const emailTo = process.env.SITE_EMAIL_TO || ''
const emailFrom = process.env.SITE_EMAIL_FROM || ''
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, company, email, phone, service_type, message } = body

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const { data } = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject: 'New lead received',
      react: SiteEmailTemplate({ name, company, email, phone, service_type, message }),
    })

    return NextResponse.json({ message: 'Lead registered successfully', data })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
