"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

interface VantaNetProps {
  color?: number;
  backgroundColor?: number;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
}

export default function VantaNet({
  color = 0xf5f5f5,
  backgroundColor = 0x6e,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1,
  scaleMobile = 1,
}: VantaNetProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current || typeof window === 'undefined') return;

    let checkThreeInterval: NodeJS.Timeout | null = null;

    // Load Vanta.js scripts dynamically
    const loadVanta = async () => {
      // Check if already initialized
      if (window.VANTA && typeof window.VANTA.NET === 'function' && window.THREE) {
        if (vantaEffect.current) {
          try {
            vantaEffect.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
        try {
          if (typeof window.VANTA.NET !== 'function') {
            console.error('VANTA.NET is not a function');
            return;
          }
          
          vantaEffect.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls,
            touchControls,
            gyroControls,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            color,
            backgroundColor,
          });
          if (vantaRef.current) {
            const canvas = vantaRef.current.querySelector('canvas');
            if (canvas) {
              canvas.style.zIndex = '0';
              canvas.style.position = 'absolute';
            }
          }
        } catch (error) {
          console.error('Vanta Net direct initialization error:', error);
        }
        return;
      }

      // Helper to initialize Vanta after both scripts are loaded
      const initVanta = () => {
        if (!vantaRef.current) return;
        
        if (!window.VANTA || typeof window.VANTA.NET !== 'function') {
          setTimeout(initVanta, 100);
          return;
        }
        
        if (!window.THREE) {
          setTimeout(initVanta, 100);
          return;
        }
        
        if (vantaEffect.current) {
          try {
            vantaEffect.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
        
        try {
          if (typeof window.VANTA.NET !== 'function') {
            console.error('VANTA.NET is not a function');
            return;
          }
          
          vantaEffect.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls,
            touchControls,
            gyroControls,
            minHeight,
            minWidth,
            scale,
            scaleMobile,
            color,
            backgroundColor,
          });
          if (vantaRef.current) {
            const canvas = vantaRef.current.querySelector('canvas');
            if (canvas) {
              canvas.style.zIndex = '0';
              canvas.style.position = 'absolute';
            }
          }
        } catch (error) {
          console.error('Vanta Net initialization error:', error);
        }
      };

      // Load Three.js first if not already loaded
      if (!window.THREE && !document.querySelector('script[src*="three"]')) {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js';
        threeScript.async = false;
        document.head.appendChild(threeScript);

        threeScript.onload = () => {
          setTimeout(() => {
            // Load Vanta Net
            if (!window.VANTA || typeof window.VANTA.NET !== 'function') {
              const existingScript = document.querySelector('script[src*="vanta.net"]');
              if (existingScript) {
                const checkVanta = setInterval(() => {
                  if (window.VANTA && typeof window.VANTA.NET === 'function') {
                    clearInterval(checkVanta);
                    setTimeout(initVanta, 200);
                  }
                }, 100);
                setTimeout(() => clearInterval(checkVanta), 10000);
              } else {
                const vantaScript = document.createElement('script');
                vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
                vantaScript.async = false;
                document.head.appendChild(vantaScript);

                vantaScript.onload = () => {
                  setTimeout(initVanta, 300);
                };
                vantaScript.onerror = () => {
                  console.error('Failed to load Vanta Net script');
                };
              }
            } else {
              setTimeout(initVanta, 200);
            }
          }, 200);
        };
        threeScript.onerror = () => {
          console.error('Failed to load Three.js script');
        };
      } else if (window.THREE) {
        // Three.js already loaded, just load Vanta
        if (!window.VANTA || typeof window.VANTA.NET !== 'function') {
          const existingScript = document.querySelector('script[src*="vanta.net"]');
          if (existingScript) {
            const checkVanta = setInterval(() => {
              if (window.VANTA && typeof window.VANTA.NET === 'function') {
                clearInterval(checkVanta);
                setTimeout(initVanta, 200);
              }
            }, 100);
            setTimeout(() => clearInterval(checkVanta), 10000);
          } else {
            const vantaScript = document.createElement('script');
            vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
            vantaScript.async = false;
            document.head.appendChild(vantaScript);

            vantaScript.onload = () => {
              setTimeout(initVanta, 300);
            };
            vantaScript.onerror = () => {
              console.error('Failed to load Vanta Net script');
            };
          }
        } else {
          setTimeout(initVanta, 200);
        }
      } else {
        // Three.js script exists but not loaded yet, wait for it
        checkThreeInterval = setInterval(() => {
          if (window.THREE) {
            if (checkThreeInterval) {
              clearInterval(checkThreeInterval);
              checkThreeInterval = null;
            }
            if (!window.VANTA || typeof window.VANTA.NET !== 'function') {
              const existingScript = document.querySelector('script[src*="vanta.net"]');
              if (existingScript) {
                const checkVanta = setInterval(() => {
                  if (window.VANTA && typeof window.VANTA.NET === 'function') {
                    clearInterval(checkVanta);
                    setTimeout(initVanta, 200);
                  }
                }, 100);
                setTimeout(() => clearInterval(checkVanta), 10000);
              } else {
                const vantaScript = document.createElement('script');
                vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
                vantaScript.async = false;
                document.head.appendChild(vantaScript);

                vantaScript.onload = () => {
                  setTimeout(initVanta, 300);
                };
                vantaScript.onerror = () => {
                  console.error('Failed to load Vanta Net script');
                };
              }
            } else {
              setTimeout(initVanta, 200);
            }
          }
        }, 100);

        setTimeout(() => {
          if (checkThreeInterval) {
            clearInterval(checkThreeInterval);
            checkThreeInterval = null;
          }
        }, 10000);
      }
    };

    loadVanta();

    return () => {
      if (checkThreeInterval) {
        clearInterval(checkThreeInterval);
        checkThreeInterval = null;
      }
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [color, backgroundColor, mouseControls, touchControls, gyroControls, minHeight, minWidth, scale, scaleMobile]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

