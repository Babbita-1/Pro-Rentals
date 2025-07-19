import React from "react";
// import aboutImg from "../assets/about.jpg";

const aboutImg = process.env.PUBLIC_URL + "/vehicle-images/lambo.jpg";

const About = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    {/* Hero Section with Background Image */}
    <section className="relative w-full h-72 md:h-96 flex items-center justify-center mb-0 overflow-hidden">
      <img src={aboutImg} alt="About Hero" className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-blue-900/40 to-white/10 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-4">About ProRentals</h1>
        <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow">Empowering Nepal with smarter, affordable rentals and purchases</p>
      </div>
    </section>

    {/* Main Content Card (Text Only) */}
    <section className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Who We Are</h2>
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          ProRentals is a modern digital platform created to streamline the short-term rental and purchase of high-value items such as cameras, bikes, travel gear, tents, and more. Recognizing the need in Nepal for affordable access to expensive tools and goods, especially for temporary use, ProRentals provides a trusted online space where users can browse items, check real-time availability, compare prices, and make secure bookings through <span className="font-semibold text-purple-700">cash on delivery</span>.
        </p>
        <p className="text-lg text-gray-800 mb-6 leading-relaxed">
          Whether you're a traveler, student, content creator, or city dweller needing quick access to quality items, ProRentals makes the process simple, transparent, and hassle-free. Our mission is to make smart renting easier, safer, and more reliable across Nepal.
        </p>
        <p className="text-lg text-gray-800 mb-8 leading-relaxed">
          Planning a weekend trip, organizing an event, or working on a personal project? ProRentals helps you access what you need—when you need it—without the burden of ownership. <span className="font-semibold text-blue-700">Rent smarter, live better.</span>
        </p>
        <div className="flex justify-center md:justify-start">
          <a href="/contact" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400">Get in Touch</a>
        </div>
      </div>
    </section>
  </div>
);

export default About; 