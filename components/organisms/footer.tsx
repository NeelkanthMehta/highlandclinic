import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d121d] text-slate-300 py-12 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[160px]">
        {/* Top Row: Left Info & Right Contact Us */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          {/* Left Column: Title & Tagline */}
          <div className="space-y-2 max-w-md">
            <h3 className="text-white font-semibold text-lg tracking-tight">
              Highland Medical Center
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Excellence in Healthcare, Committed to Your Well-being
            </p>
          </div>

          {/* Right Column: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-base">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>(555) 123-4567</span>
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
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
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
