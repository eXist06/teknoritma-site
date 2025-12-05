"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

interface VantaGlobeProps {
  color?: number;
  color2?: number;
  backgroundColor?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
}

export default function VantaGlobe({
  color = 0x1d14aa,
  color2 = 0xe31eb4,
  backgroundColor = 0xf5f5f5,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1,
  scaleMobile = 1,
}: VantaGlobeProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    // Load Vanta.js scripts dynamically
    const loadVanta = async () => {
      // Check if already initialized
      if (window.VANTA && window.VANTA.GLOBE && window.THREE) {
        if (vantaEffect.current) {
          vantaEffect.current.destroy();
        }
        vantaEffect.current = window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls,
          touchControls,
          gyroControls,
          minHeight,
          minWidth,
          scale,
          scaleMobile,
          color,
          color2,
          backgroundColor,
        });
        return;
      }

      // Helper to initialize Vanta after both scripts are loaded
      const initVanta = () => {
        if (vantaRef.current && window.VANTA && window.VANTA.GLOBE && window.THREE) {
          if (vantaEffect.current) {
            vantaEffect.current.destroy();
          }
          try {
            vantaEffect.current = window.VANTA.GLOBE({
              el: vantaRef.current,
              mouseControls,
              touchControls,
              gyroControls,
              minHeight,
              minWidth,
              scale,
              scaleMobile,
              color,
              color2,
              backgroundColor,
            });
          } catch (error) {
            console.error('Vanta Globe initialization error:', error);
          }
        }
      };

      // Load Three.js first if not already loaded
      if (!window.THREE && !document.querySelector('script[src*="three"]')) {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        threeScript.async = false; // Load synchronously to ensure order
        document.head.appendChild(threeScript);

        threeScript.onload = () => {
          // Wait a bit for THREE to be fully available
          setTimeout(() => {
            // Load Vanta Globe
            if (!window.VANTA || !window.VANTA.GLOBE) {
              const vantaScript = document.createElement('script');
              vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';
              vantaScript.async = false;
              document.head.appendChild(vantaScript);

              vantaScript.onload = () => {
                setTimeout(initVanta, 100);
              };
            } else {
              setTimeout(initVanta, 100);
            }
          }, 100);
        };
      } else if (window.THREE) {
        // Three.js already loaded, just load Vanta
        if (!window.VANTA || !window.VANTA.GLOBE) {
          const vantaScript = document.createElement('script');
          vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';
          vantaScript.async = false;
          document.head.appendChild(vantaScript);

          vantaScript.onload = () => {
            setTimeout(initVanta, 100);
          };
        } else {
          setTimeout(initVanta, 100);
        }
      } else {
        // Three.js script exists but not loaded yet, wait for it
        const checkThree = setInterval(() => {
          if (window.THREE) {
            clearInterval(checkThree);
            if (!window.VANTA || !window.VANTA.GLOBE) {
              const vantaScript = document.createElement('script');
              vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';
              vantaScript.async = false;
              document.head.appendChild(vantaScript);

              vantaScript.onload = () => {
                setTimeout(initVanta, 100);
              };
            } else {
              setTimeout(initVanta, 100);
            }
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => clearInterval(checkThree), 10000);
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [color, color2, backgroundColor, mouseControls, touchControls, gyroControls, minHeight, minWidth, scale, scaleMobile]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}


