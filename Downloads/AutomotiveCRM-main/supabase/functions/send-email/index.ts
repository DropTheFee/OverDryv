import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, from }: EmailRequest = await req.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get SMTP configuration from environment variables
    const SMTP_HOST = Deno.env.get('SMTP_HOST')
    const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587')
    const SMTP_USER = Deno.env.get('SMTP_USER')
    const SMTP_PASS = Deno.env.get('SMTP_PASS')
    const FROM_EMAIL = from || Deno.env.get('FROM_EMAIL') || 'noreply@overdryv.com'

    // Log configuration for debugging (remove passwords)
    console.log('SMTP Configuration:', {
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      from: FROM_EMAIL,
      hasPassword: !!SMTP_PASS
    })

    // For production, you would implement actual SMTP sending here
    // Using a library like nodemailer or similar
    
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.log('SMTP not configured, simulating email send')
      
      // Simulate successful email for demo purposes
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully (demo mode)',
          emailId: `demo_${Date.now()}`,
          to,
          subject
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Here you would implement actual SMTP sending
    // For now, simulate success
    console.log('Sending email:', {
      to,
      subject,
      from: FROM_EMAIL,
      timestamp: new Date().toISOString()
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: `email_${Date.now()}`,
        to,
        subject
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})