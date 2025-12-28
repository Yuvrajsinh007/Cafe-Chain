// src/user/pages/ContactUsPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { submitContactForm } from "../api/api";
import { toast } from 'sonner';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Sending message...');

    try {
      // The backend now automatically gets user details from the token
      const response = await submitContactForm(formData);
      toast.success(response.message || "Message sent successfully!");
      setFormData({ subject: "", message: "" });
    } catch (error) {
      // The error message from the backend will be a string
      toast.error(error.toString() || "Failed to send message.", { id: toastId });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 
                 text-[#4a3a2f] px-4 sm:px-6 py-12 flex items-center justify-center
                 pt-[90px] pb-[100px] overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-stone-200"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-4"
        >
          Contact Us
        </motion.h1>
        <p className="text-center text-gray-600 mb-10 text-sm sm:text-base">
          Have any questions or feedback? 
          Fill out the form below and we’ll get
          back to you soon.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* REMOVED Name and Email fields */}

          {/* Subject */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-lg 
                         focus:ring-2 focus:ring-[#4a3a2f] focus:outline-none text-sm sm:text-base"
              placeholder="Subject of your message"
            />
          </motion.div>

          {/* Message */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-300 rounded-lg 
                         focus:ring-2 focus:ring-[#4a3a2f] focus:outline-none 
                         text-sm sm:text-base resize-none"
              placeholder="Write your message here..."
            />
          </motion.div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 
                       bg-[#4a3a2f] text-white py-3 rounded-lg font-semibold 
                       hover:bg-[#3b2f26] transition-all shadow-md text-sm sm:text-base
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactUsPage;
