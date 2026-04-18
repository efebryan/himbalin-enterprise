import { FiMapPin } from "react-icons/fi";

const ContactMap = () => {
  return (
    <section className="bg-himbalin-beige py-24 px-8 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        <div className="w-full aspect-[21/9] bg-gray-200 rounded-3xl overflow-hidden relative shadow-hover grayscale opacity-60">
          {/* Simple Grayscale Map Placeholder */}
          <div
            className="w-full h-full bg-cover bg-center mix-blend-multiply"
            style={{
              backgroundImage: "url('/images/contact_map_static_istanbul.png')",
            }}
          >
            {/* Fallback pattern */}
            <div className="w-full h-full bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:20px_20px] bg-white"></div>
          </div>

          {/* Marker Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-white rounded-full py-4 px-8 shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer border-2 border-himbalin-gold/20">
              <div className="w-4 h-4 rounded-full bg-himbalin-gold animate-pulse"></div>
              <span className="font-sans font-bold text-himbalin-dark text-sm tracking-wide">
                Our Istanbul Atelier
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
