import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { submitContactForm } from "../../api/api";
import { toast } from 'sonner';

const ContactUsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const response = await submitContactForm(formData);
      toast.success(response.message || "Message sent successfully!");
      setFormData({ subject: "", message: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A3A2F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl relative z-10">
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#4A3A2F] transition-colors mb-8 font-medium"
        >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl shadow-amber-900/10 border border-gray-100 overflow-hidden"
        >
            <div className="p-8 md:p-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-sm transform rotate-3">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-[#4A3A2F] mb-3 tracking-tight">Get in Touch</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll be in touch.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subject</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What is this regarding?"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Write your message here..."
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-800 placeholder-gray-400 resize-none"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg shadow-amber-900/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 ${
                                isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#4A3A2F] hover:bg-[#3b2d24] hover:shadow-xl hover:-translate-y-0.5'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Sending...
                                </span>
                            ) : (
                                <>Send Message <Send className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUsPage;