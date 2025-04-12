// src/utils/email-utils.js
import emailjs from '@emailjs/browser';

export const sendPasswordResetEmail = async (email) => {
  try {
    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0], // Use part of email as name
      reset_link: `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}&token=${generateResetToken()}`,
    };

    const result = await emailjs.send(
      'service_mg68vpj', // Service ID
      'template_6jpwb4g', // Template ID - replace with your actual template ID
      templateParams,
      'VNBpSifqgB6c_6CBT' // Replace with your EmailJS public key
    );

    return { success: true, result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Generate a simple reset token - in production, use a more secure method
const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};