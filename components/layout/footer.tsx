export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">CampervanJuli</h3>
            <p className="text-gray-400 mb-4">
              Den Van-Life Traum teilen. Dein Abenteuer für €80/Tag.
            </p>
            <p className="text-sm text-gray-500">
              Gebaut mit ♡ für Abenteurer
            </p>
          </div>

          {/* Seitenübersicht */}
          <div>
            <h4 className="font-semibold mb-4">Seitenübersicht</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Start</a></li>
              <li><a href="#availability" className="hover:text-white transition-colors">Verfügbarkeit</a></li>
              <li><a href="#interior" className="hover:text-white transition-colors">Innenraum</a></li>
              <li><a href="#projekt" className="hover:text-white transition-colors">Über das Projekt</a></li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-gray-400">
              <li>juliankraemer184@gmail.com</li>
              <li>Deutschland</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          {/* SEO Keywords */}
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">
              <span className="text-[#D4A574]">Campervan mieten</span> • 
              <span className="mx-2">Vanlife Deutschland</span> • 
              <span className="text-[#D4A574]">Wohnmobil teilen</span> • 
              <span className="mx-2">Peugeot Boxer Camper</span>
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 CampervanJuli. Gemeinsam nutzen statt einsam besitzen.
              <br />
              <span className="text-xs">
                ⛰️🚐🌊
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}