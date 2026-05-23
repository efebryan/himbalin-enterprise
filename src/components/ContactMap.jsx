import React from "react";
import { useSiteSettings } from "../context/SiteSettingsContext";

const ContactMap = () => {
  const { settings } = useSiteSettings();
  const address = settings?.store_address || "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria";

  return (
    <section className="bg-himbalin-beige py-24 px-8 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        <div className="w-full aspect-[21/9] bg-gray-200 rounded-3xl overflow-hidden relative shadow-hover">
          <iframe
            title="Store Location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0 grayscale opacity-80 contrast-125"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
