import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d121d] text-slate-300 py-10 sm:py-12 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[160px]">
        {/* Top Row: Left Info, Quick Links & Right Contact Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 sm:mb-12">
          {/* Left Column: Title & Tagline */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg tracking-tight">
              Highland Medical Center
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Excellence in Healthcare, Committed to Your Well-being. Specialized consultations and modern clinical care.
            </p>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-white transition-colors">
                  Clinical Departments
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-white transition-colors">
                  Book Consultation
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Patient Profile & Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href="tel:5551234567" className="hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href="mailto:info@highland.med"
                  className="hover:text-white transition-colors"
                >
                  info@highland.med
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>123 Medical Center Dr, Highland, CA 92346</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Copyright Notice */}
        <div className="text-center text-xs sm:text-sm text-slate-400 pt-4">
          <p>© 2025 Highland Medical Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
