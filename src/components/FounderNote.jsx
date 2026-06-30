import { FaQuoteLeft } from "react-icons/fa";

const FounderNote = () => {
  return (
    <section className="py-24 px-8 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-16">
        {/* Left Side: Image */}
        <div className="w-full lg:w-5/12 relative">
          <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-hover relative z-10 border-4 border-white">
            <img
              src="/images/portrait_elias_himbalin.png"
              alt="Founder Elias Himbalin"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative outline matching design */}
          <div className="absolute top-4 -left-4 w-full h-full border-2 border-himbalin-gold rounded-3xl z-0 rounded-bl-[4rem]"></div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-7/12">
          <FaQuoteLeft className="text-5xl text-himbalin-gold mb-8 shadow-sm rounded-full p-2 bg-himbalin-gold/10" />

          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-himbalin-dark mb-8">
            Founder's Note
          </h2>

          <blockquote className="font-serif text-2xl lg:text-3xl text-himbalin-dark/80 italic leading-relaxed mb-10 border-l-4 border-himbalin-gold pl-6 py-2">
            "Furniture is not merely utility; it is the silent companion to our
            lives. When we design a table, we are designing the place where
            families will gather for decades. That responsibility is what drives
            our excellence every single day."
          </blockquote>

          <div>
            <h4 className="font-sans font-bold text-lg text-himbalin-dark tracing-wide">
              Illione Anthony Ekene
            </h4>
            <p className="font-sans text-himbalin-gold font-semibold text-sm tracking-wider uppercase mt-1">
              Chief Executive Officer (CEO)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderNote;
