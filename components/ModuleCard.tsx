"use client";

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  gradient: string;
  delay?: number;
  image?: string;
  visualIcon?: LucideIcon;
  healthIconUrl?: string;
}

// HealthIcon Image component with fallback
function HealthIconImage({ 
  src, 
  alt, 
  fallbackIcon: FallbackIcon 
}: { 
  src: string; 
  alt: string; 
  fallbackIcon: LucideIcon;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <FallbackIcon 
        className="text-white opacity-90 group-hover/visual:opacity-100" 
        size={64} 
        strokeWidth={1.5} 
      />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className="w-16 h-16 opacity-90 group-hover/visual:opacity-100 filter brightness-0 invert"
      onError={() => {
        console.warn(`Failed to load healthicon: ${src}`);
        setHasError(true);
      }}
      loading="lazy"
    />
  );
}

export function ModuleCard({ 
  icon: Icon, 
  title, 
  description,
  gradient,
  delay = 0,
  image,
  visualIcon,
  healthIconUrl
}: ModuleCardProps) {
  const VisualIconComponent = visualIcon || Icon;
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    
    checkMobile();
    checkReducedMotion();
    window.addEventListener('resize', checkMobile);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile || prefersReducedMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ 
        delay: prefersReducedMotion ? 0 : (isMobile ? 0 : delay),
        duration: prefersReducedMotion ? 0 : (isMobile ? 0.25 : 0.4),
        ease: "easeOut"
      }}
      whileHover={isMobile || prefersReducedMotion ? {} : { y: -6, scale: 1.02, transition: { duration: 0.2 } }}
      style={{ 
        willChange: isMobile ? "opacity" : "opacity, transform",
        transform: "translateZ(0)"
      }}
      className="rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full bg-white border border-gray-200 hover:border-blue-300 group"
    >
      {/* Visual Section - Image or Large Icon */}
      {image ? (
        <div className="relative w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group/image">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-90 group-hover/image:opacity-100 group-hover/image:scale-105 transition-all duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className={`absolute inset-0 ${gradient} opacity-15 group-hover:opacity-25 transition-opacity duration-300`}></div>
          {/* Icon overlay */}
          <div className="absolute top-3 right-3 w-9 h-9 bg-white bg-opacity-30 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg group-hover:bg-opacity-40 transition-all duration-300">
            <Icon className="text-white" size={18} strokeWidth={2.5} />
          </div>
        </div>
      ) : healthIconUrl ? (
        // Healthicon SVG gösterimi
        <div className={`relative w-full h-36 ${gradient} flex items-center justify-center overflow-hidden group/visual`}>
          {/* Gradient background pattern */}
          <div className="absolute inset-0 bg-black/5"></div>
          {/* Large healthicon SVG */}
          <div className="relative z-10 transform group-hover/visual:scale-110 transition-transform duration-300">
            <HealthIconImage 
              src={healthIconUrl} 
              alt={title}
              fallbackIcon={VisualIconComponent}
            />
          </div>
        </div>
      ) : (
        // Lucide icon gösterimi (fallback)
        <div className={`relative w-full h-36 ${gradient} flex items-center justify-center overflow-hidden group/visual`}>
          {/* Gradient background pattern */}
          <div className="absolute inset-0 bg-black/5"></div>
          {/* Large visual icon */}
          <div className="relative z-10 transform group-hover/visual:scale-110 transition-transform duration-300">
            <VisualIconComponent className="text-white opacity-90 group-hover/visual:opacity-100" size={64} strokeWidth={1.5} />
          </div>
        </div>
      )}
      
      {/* Header with gradient */}
      <div className={`${gradient} p-5 flex items-center gap-3 ${image ? '' : ''}`}>
        {!image && (
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Icon className="text-white" size={20} strokeWidth={2} />
          </div>
        )}
        <h3 className="text-white text-base font-bold leading-tight flex-1">
          {title}
        </h3>
      </div>
      
      {/* Content */}
      {description && (
        <div className="bg-white p-4 flex-1 flex flex-col">
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </motion.div>
  );
}
