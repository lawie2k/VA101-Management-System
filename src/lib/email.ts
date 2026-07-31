import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { checkRateLimit, RATE_LIMIT_PROFILES } from "./rate-limit";

// Initialize the SES Client
// In AWS environments (like EC2 or Elastic Beanstalk), credentials can be automatically fetched from IAM roles.
// For local development or non-AWS hosting, provide AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in .env
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

interface SendEmailParams {
  toAddress: string;
  subject: string;
  htmlBody: string;
  sourceEmail?: string;
}

/**
 * Sends an email using AWS SES.
 * If AWS credentials are not configured (e.g. local dev), it falls back to console logging.
 */
export async function sendEmail({ toAddress, subject, htmlBody, sourceEmail }: SendEmailParams) {
  // 1. Enforce strict rate limit for emails to prevent AWS SES quotas exhaustion
  // Using a generic identifier since this could be called from various background workers
  // In a real app you might want to pass the user's IP or ID down to this function.
  const rateLimit = checkRateLimit(`email_outbound`, RATE_LIMIT_PROFILES.EMAIL);
  if (!rateLimit.success) {
    console.warn(`[AWS SES RATE LIMIT EXCEEDED] Throttling email to ${toAddress}`);
    return { success: false, error: "Rate limit exceeded. Please try again later." };
  }

  // Use a verified domain or email in SES for the Source
  const defaultSource = process.env.AWS_SES_FROM_EMAIL || "noreply@va101.com";
  const source = sourceEmail || defaultSource;

  const params = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: source,
  };

  try {
    // If we're missing credentials, mock the send for local development.
    if (!process.env.AWS_ACCESS_KEY_ID && process.env.NODE_ENV !== "production") {
      console.log(`\n[AWS SES MOCK] Sending Email...`);
      console.log(`[To]: ${toAddress}`);
      console.log(`[Subject]: ${subject}`);
      console.log(`[Body]:\n${htmlBody}\n`);
      return { success: true, messageId: "mock-message-id" };
    }

    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error("AWS SES Error:", error);
    // Depending on your requirements, you could throw the error here
    return { success: false, error };
  }
}
