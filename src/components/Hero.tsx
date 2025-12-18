import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaPrimary?: { text: string; onClick: () => void };
  ctaSecondary?: { text: string; onClick: () => void };
  images?: string[];
}

const defaultImages = [
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=1600&q=80"
];

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  images = defaultImages,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-4">
        <motion.div
          key={currentIndex}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h1>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-6">{subtitle}</p>

          <div className="flex justify-center gap-4">
            {ctaPrimary && (
              <button
                onClick={ctaPrimary.onClick}
                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md"
              >
                {ctaPrimary.text}
              </button>
            )}
            {ctaSecondary && (
              <button
                onClick={ctaSecondary.onClick}
                className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded-full font-semibold transition-all"
              >
                {ctaSecondary.text}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
