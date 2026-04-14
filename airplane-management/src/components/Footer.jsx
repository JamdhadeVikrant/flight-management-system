import { MdFlight } from 'react-icons/md';
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <MdFlight className="text-blue-400 text-2xl rotate-45" />
            <span>SkyWings Airlines</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted partner for seamless air travel across India and beyond.
          </p>
          <div className="flex gap-4 mt-4 text-gray-400">
            <FiTwitter className="hover:text-blue-400 cursor-pointer transition-colors" size={18} />
            <FiFacebook className="hover:text-blue-400 cursor-pointer transition-colors" size={18} />
            <FiInstagram className="hover:text-blue-400 cursor-pointer transition-colors" size={18} />
            <FiLinkedin className="hover:text-blue-400 cursor-pointer transition-colors" size={18} />
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-blue-300">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">Book a Flight</li>
            <li className="hover:text-white cursor-pointer transition-colors">Check-in Online</li>
            <li className="hover:text-white cursor-pointer transition-colors">Flight Status</li>
            <li className="hover:text-white cursor-pointer transition-colors">Manage Booking</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-blue-300">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-white cursor-pointer transition-colors">Baggage Info</li>
            <li className="hover:text-white cursor-pointer transition-colors">Refund Policy</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-blue-300">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📞 1800-123-4567 (Toll Free)</li>
            <li>✉️ support@skywings.in</li>
            <li>🕐 24/7 Customer Support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} SkyWings Airlines. All rights reserved.
      </div>
    </footer>
  );
}
