import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { MapPin, Calendar, Users, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// --- Configuration ---

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmTm_kyhaLqkfLgYvKCkwpYFvrnFPeVMI",
  authDomain: "iswc-2025-registration.firebaseapp.com",
  projectId: "iswc-2025-registration",
  storageBucket: "iswc-2025-registration.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Optional for this form
  appId: "YOUR_APP_ID" // Optional for this form
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Pabbly Webhook URL
const PABBLY_WEBHOOK_URL = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzZjA0M2Q1MjY4NTUzNTUxM2Ei_pc";

// --- Components ---

export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    twitter: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const submissionData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      source: 'web_registration'
    };

    try {
      // 1. Send to Firebase Firestore
      await addDoc(collection(db, "volunteers"), submissionData);

      // 2. Send to Pabbly Webhook
      // Note: verify Pabbly supports CORS or use no-cors if simple trigger is needed
      try {
        const formData = new FormData();
        Object.entries(submissionData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        
        await fetch(PABBLY_WEBHOOK_URL, {
          method: 'POST',
          body: formData,
        });
      } catch (webhookError) {
        console.error("Webhook trigger warning:", webhookError);
        // We don't fail the whole process if only the webhook fails, 
        // but ideally you might want to log this.
      }

      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        instagram: '',
        linkedin: '',
        facebook: '',
        twitter: ''
      });

    } catch (error: any) {
      console.error("Error submitting form: ", error);
      setStatus('error');
      setErrorMessage(error.message || "Failed to submit. Please try again.");
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Aboard!</h2>
          <p className="text-gray-300 mb-8">
            Thank you for joining the ISWC 2025 Volunteer Team. We have received your details and will connect with you soon.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all w-full"
          >
            Register Another Volunteer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black text-white font-sans selection:bg-red-500/30">
      
      {/* Header / Hero Section */}
      <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
        
        {/* Logo Placeholder - Replacing with Icon for reliability if image fails */}
        <div className="mb-6 relative group cursor-default">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-black/50 p-4 rounded-full border border-red-500/30">
             {/* Replace this SVG with your actual <img> tag for the Ashram logo */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-16 h-16 text-orange-500" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-orange-400 font-medium tracking-widest text-sm uppercase mb-2">Ankitgram Sewadham Ashram, Ujjain</h3>
        <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-red-100 to-red-200">
          ISWC 2025
        </h1>
        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1 mb-8">
          <Users className="w-4 h-4 text-red-300" />
          <span className="text-red-100 font-medium text-sm">Volunteer Team Connect</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm md:text-base text-gray-300 mb-12">
          <div className="flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span>20-21 December 2025</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span>Ujjain, India</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 text-left border-l-4 border-orange-500 pl-4">
            Join the Team Directory
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-300 ml-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Instagram */}
              <div className="space-y-2">
                <label htmlFor="instagram" className="text-sm font-medium text-gray-400 ml-1">Instagram Handle</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    name="instagram"
                    id="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="username"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label htmlFor="linkedin" className="text-sm font-medium text-gray-400 ml-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Facebook */}
              <div className="space-y-2">
                <label htmlFor="facebook" className="text-sm font-medium text-gray-400 ml-1">Facebook URL</label>
                <input
                  type="url"
                  name="facebook"
                  id="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all placeholder:text-gray-600"
                />
              </div>

              {/* X (Twitter) */}
              <div className="space-y-2">
                <label htmlFor="twitter" className="text-sm font-medium text-gray-400 ml-1">X (Twitter) Handle</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    name="twitter"
                    id="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="username"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding to Directory...
                </>
              ) : (
                <>
                  Add to Team Directory
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <footer className="mt-16 text-gray-500 text-sm">
          <p>© 2025 ISWC • Ankitgram Sewadham Ashram</p>
        </footer>
      </div>
    </div>
  );
}
