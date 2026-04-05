import nodemailer from 'nodemailer'
import { Order } from './orders'

// Create email transporter
function createTransporter() {
  // Check if email is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.warn('Email not configured. Order confirmations will not be sent.')
    return null
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Send order confirmation email
export async function sendOrderConfirmation(order: Order): Promise<boolean> {
  const transporter = createTransporter()
  
  if (!transporter) {
    console.log('Email not configured, skipping order confirmation email')
    return false
  }

  const itemsList = order.items
    .map(
      item =>
        `- ${item.productName} (Size: ${item.size}) x ${item.quantity} - $${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join('\n')

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 30px; text-align: center; }
        .content { padding: 30px 20px; }
        .order-details { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ANTRO</h1>
        </div>
        <div class="content">
          <h2>Thank You for Your Order!</h2>
          <p>Hi ${order.customerInfo.name},</p>
          <p>We've received your order and will process it shortly. Here are your order details:</p>
          
          <div class="order-details">
            <h3>Order #${order.orderNumber}</h3>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            
            <h4>Items:</h4>
            <pre>${itemsList}</pre>
            
            <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            
            <h4>Shipping Address:</h4>
            <p>
              ${order.customerInfo.address.line1}<br>
              ${order.customerInfo.address.line2 ? order.customerInfo.address.line2 + '<br>' : ''}
              ${order.customerInfo.address.city}, ${order.customerInfo.address.state} ${order.customerInfo.address.postalCode}<br>
              ${order.customerInfo.address.country}
            </p>
          </div>
          
          <p>You'll receive a shipping confirmation email with tracking information once your order ships.</p>
          
          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Thank you for supporting ANTRO!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ANTRO. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'ANTRO <noreply@antro.com>',
      to: order.customerInfo.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailHtml,
    })
    
    console.log(`Order confirmation email sent to ${order.customerInfo.email}`)
    return true
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return false
  }
}

