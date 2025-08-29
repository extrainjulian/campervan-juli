export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          {/* Main Brand */}
          <h3 className="text-2xl font-bold text-[#D4A574]">wuecamper</h3>
          
          {/* Simple Description */}
          <p className="text-gray-300 max-w-2xl mx-auto">
            Community-Projekt ohne Gewinnabsicht • 50€/Tag • Eine kleine Gruppe, 1 Traum
          </p>
          
          {/* Contact */}
          <p className="text-sm text-gray-400">
            <a href="mailto:juliankraemer184@gmail.com" className="text-[#D4A574] hover:text-white transition-colors">
              juliankraemer184@gmail.com
            </a>
          </p>
          
          {/* Copyright */}
          <div className="border-t border-gray-700 pt-4 mt-6">
            <p className="text-xs text-gray-500">
              © 2025 wuecamper • Gemeinsam bauen, gemeinsam nutzen 🚐
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}