import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import bg from "../assets/bg.png";
import { FaCar, FaRegSmile, FaWallet, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import ReviewSection from "../components/common/ReviewSection";
import { getVehicles } from "../services/vehicles";
import { getItems } from "../services/items";
import { getMyBookings } from "../services/bookings";
import { useAuth } from "../contexts/AuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const Home = () => {
  const [mobilityVehicles, setMobilityVehicles] = useState([]);
  const [electronicsItems, setElectronicsItems] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getVehicles(1, 100).then(res => {
      // Filter for bikes and other vehicles
      const allVehicles = res?.data?.vehicles || [];
      setMobilityVehicles(allVehicles.filter(v => v.type === 'bike' || 'vehicles'));
    });
    if (user) {
      getMyBookings().then(res => setUserBookings(res.data || []));
    } else {
      setUserBookings([]);
    }
  }, [user]);
  useEffect(() => {
    getItems(1, 100).then(res => {
      setElectronicsItems(res?.data?.items || []);
    });
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative h-[420px] flex items-center justify-center">
        <img src={bg} alt="bg" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-sm z-20" />
        <div className="relative z-30 flex flex-col items-center justify-center w-full h-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Turn Clutter into Cash — Rent it Out!</h1>
          <p className="text-lg md:text-xl text-white mb-6 drop-shadow">Let your unused items find purpose</p>
          <Link to="/sales" className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-purple-700 transition">Explore Sales Deals</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <FaMapMarkerAlt className="mx-auto text-4xl mb-2" />
              <h3 className="font-bold text-lg mb-1">Availability</h3>
              <p className="text-gray-600">Access a wide range of rental products across major cities in Nepal. Book anytime, anywhere—hassle-free.</p>
            </div>
            <div>
              <FaCar className="mx-auto text-4xl mb-2" />
              <h3 className="font-bold text-lg mb-1">Comfort</h3>
              <p className="text-gray-600">Enjoy the convenience of pre-screened items, transparent pricing, and easy scheduling—all from your device.</p>
            </div>
            <div>
              <FaWallet className="mx-auto text-4xl mb-2" />
              <h3 className="font-bold text-lg mb-1">Savings</h3>
              <p className="text-gray-600">Why buy when you can rent? Save money on high-value tools and gear by paying only for the time you need them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobility Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Electronics</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="!pb-10"
        >
          {electronicsItems.map(item => {
            let displayStatus = 'Available';
            if (userBookings.some(b => b.item && b.item._id === item._id && b.status === 'confirmed')) {
              displayStatus = 'Rented';
            }
            return (
              <SwiperSlide key={item?._id}>
                <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center">
                  <img src={item?.imageUrl || ''} alt={(item?.brand || '') + ' ' + (item?.model || '')} className="w-40 h-32 object-cover rounded mb-4" />
                  <h3 className="font-bold text-xl text-blue-900 mb-2">{item?.brand || 'Unknown'} {item?.model || ''}</h3>
                  <hr className="w-full mb-2" />
                  <div className="w-full text-left mb-1 font-semibold">Year: <span className="font-normal">{item?.year || 'N/A'}</span></div>
                  <div className="w-full text-left mb-4 font-semibold">Price Per Day: NPR {item?.pricePerHour || 'N/A'}</div>
                  <span className={`mb-2 px-3 py-1 rounded-full text-xs font-semibold ${displayStatus === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{displayStatus}</span>
                  <Link to={`/items/${item?._id}`} className="w-full">
                    <button className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 transition">Rent Now</button>
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Mobility</h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="!pb-10"
        >
          {mobilityVehicles.map(vehicle => {
            let displayStatus = 'Available';
            if (userBookings.some(b => b.vehicle && b.vehicle._id === vehicle._id && b.status === 'confirmed')) {
              displayStatus = 'Rented';
            }
            return (
              <SwiperSlide key={vehicle?._id}>
                <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center">
                  <img src={vehicle?.imageUrl || ''} alt={(vehicle?.brand || '') + ' ' + (vehicle?.model || '')} className="w-40 h-32 object-cover rounded mb-4" />
                  <h3 className="font-bold text-xl text-blue-900 mb-2">{vehicle?.brand || 'Unknown'} {vehicle?.model || ''}</h3>
                  <hr className="w-full mb-2" />
                  <div className="w-full text-left mb-1 font-semibold">Status: <span className="font-normal">{vehicle?.status || 'N/A'}</span></div>
                  <div className="w-full text-left mb-4 font-semibold">Price: NPR {vehicle?.pricePerHour || 'N/A'}</div>
                  <span className={`mb-2 px-3 py-1 rounded-full text-xs font-semibold ${displayStatus === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{displayStatus}</span>
                  <Link to={`/vehicles/${vehicle?._id}`} className="w-full">
                    <button className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 transition">Rent Now</button>
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>

          {/* Reviews Section */}
          <ReviewSection />

    </div>
  );
};

export default Home;
