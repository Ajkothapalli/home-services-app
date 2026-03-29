import { Env } from '../config/env';

// Supports MSG91 or Twilio as SMS providers.
// Set SMS_PROVIDER env var to 'msg91' or 'twilio'.

export interface SendSmsInput {
  to: string;       // E.164 format, e.g. +919876543210
  body: string;
  templateId?: string; // MSG91 template ID for DLT compliance
}

export interface SendSmsResult {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  provider: string;
}

/**
 * Sends an SMS via MSG91 (India DLT compliant) or Twilio.
 * Switch provider by setting SMS_PROVIDER environment variable.
 */
export async function sendSms(input: SendSmsInput): Promise<SendSmsResult> {
  // TODO: if (process.env.SMS_PROVIDER === 'twilio') { ... Twilio client ... }
  // TODO: else { ... MSG91 API call with DLT template ... }
  // Both require Env.SMS_AUTH_TOKEN
  throw new Error(`sendSms not implemented. To: ${input.to}`);
}

/**
 * Sends an OTP verification code to a phone number.
 */
export async function sendOtp(phone: string): Promise<{ requestId: string }> {
  // TODO: Call MSG91 /otp endpoint or Twilio Verify API
  throw new Error(`sendOtp not implemented for phone: ${phone}`);
}

/**
 * Verifies an OTP code submitted by the user.
 */
export async function verifyOtp(phone: string, otp: string, requestId: string): Promise<boolean> {
  // TODO: Call MSG91 /otp/verify or Twilio Verify check endpoint
  throw new Error(`verifyOtp not implemented for phone: ${phone}`);
}
