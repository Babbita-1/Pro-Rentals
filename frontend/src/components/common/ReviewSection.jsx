import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    text: "Loved the services. Though it is rent services, but the quality is toup notch.",
    name: "Barsha Yadav",
    company: "Kuphal LLC",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "Took car for pokhara ride and damn loved the maintenance and also the sales team was good.",
    name: "Anil Shrstha",
    company: "Glover - Orn",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "Bike was great in shape and cost is soo good. Better then other in outt.",
    name: "Menuka",
    company: "Haag LLC",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const ReviewSection = () => (
  <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
    <h2 className="text-3xl font-extrabold text-center mb-12">Reviews from our customers</h2>
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
      {reviews.map((review, idx) => (
        <div
          key={idx}
          className="relative bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl min-h-[340px]"
        >
          <FaQuoteLeft className="text-4xl text-purple-400 absolute -top-6 left-6 bg-white rounded-full p-2 shadow" />
          <p className="text-lg text-gray-800 mb-6 text-center font-medium leading-relaxed mt-6">
            {review.text}
          </p>
          <div className="w-full border-t border-blue-100 my-4" />
          <div className="w-full flex flex-col items-center mt-2">
            <div className="relative -mt-16 mb-2">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
                style={{ position: 'relative', zIndex: 2 }}
              />
            </div>
            <div className="text-xs text-gray-500 mb-1">{review.company}</div>
            <div className="font-bold text-base text-blue-900">{review.name}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center">
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-md transition">Write a Review</button>
    </div>
  </section>
);

export default ReviewSection; 