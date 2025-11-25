import whatsappIcon from "@/assets/whatsapp-icon.png";

export const WhatsAppFloat = () => {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=919150002241&text=Hello%20Arqonz%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-300 shadow-lg rounded-full"
      aria-label="Chat on WhatsApp"
    >
      <img 
        src={whatsappIcon} 
        alt="WhatsApp" 
        className="w-14 h-14 md:w-16 md:h-16"
      />
    </a>
  );
};
