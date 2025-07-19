import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaTiktok , FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', rentFor: '', phone: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.message) return 'Please fill in all required fields.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!/^\d{7,}$/.test(form.phone.replace(/\D/g, ''))) return 'Please enter a valid phone number.';
    return '';
  };

  const handleSubmit = e => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    // Simulate successful submission
    setSuccess('Thank you for contacting us! We will get back to you soon.');
    setForm({ name: '', email: '', rentFor: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left: Contact Info */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-2">Location & Contact</h2>
        <div className="flex items-start gap-3 text-lg">
          <FaMapMarkerAlt className="mt-1 text-2xl" />
          <div>
            Jhamsikhel<br />Kathmandu, Nepal
          </div>
        </div>
        <div className="flex items-start gap-3 text-lg">
          <FaPhoneAlt className="mt-1 text-2xl" />
          <div>
            015589281<br />+977 9849876713
          </div>
        </div>
        <div className="flex items-start gap-3 text-lg">
          <FaEnvelope className="mt-1 text-2xl" />
          <div>info@prorentals.com</div>
        </div>
        <div className="mt-6">
          <div className="font-semibold mb-2">Get Connect with us</div>
          <div className="flex gap-4 text-2xl">
            <a href="https://www.facebook.com" className="text-blue-900 hover:text-blue-700"><FaFacebook /></a>
            <a href="https://www.tiktok.com/" className="text-blue-900 hover:text-blue-700"><FaTiktok /></a>
            <a href="https://www.instagram.com" className="text-blue-900 hover:text-blue-700"><FaInstagram /></a>
            <a href="https://www.linkedin.com" className="text-blue-900 hover:text-blue-700"><FaLinkedin /></a>
            <a href="https://x.com" className="text-blue-900 hover:text-blue-700"><FaTwitter /></a>
          </div>
        </div>
      </div>
      {/* Right: Contact Form */}
      <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg mb-8 text-lg font-semibold text-gray-700 shadow-sm text-center">
          Fill in the form below for your enquiry, message.
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm text-base bg-gray-50 placeholder-gray-400"
              placeholder="Your Full Name"
              autoComplete="off"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm text-base bg-gray-50 placeholder-gray-400"
              placeholder="Your Email"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="rentFor"
              value={form.rentFor}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm text-base bg-gray-50 placeholder-gray-400"
              placeholder="Rent For"
              autoComplete="off"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm text-base bg-gray-50 placeholder-gray-400"
              placeholder="Phone number"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Your enquiry/message/feedback</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-5 py-3 w-full min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm text-base bg-gray-50 placeholder-gray-400 resize-none"
              placeholder="Enter your message here"
            />
          </div>
          {error && <div className="text-red-500 text-center mt-2 font-medium">{error}</div>}
          {success && <div className="text-green-600 text-center mt-2 font-medium">{success}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 rounded-lg shadow-md hover:from-purple-700 hover:to-blue-600 transition text-lg tracking-wide mt-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
