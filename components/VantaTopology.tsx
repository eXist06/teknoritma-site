"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    p5: any;
  }
}

interface VantaTopologyProps {
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

export default function VantaTopology({
  color = 0x0066FF,
  backgroundColor = 0xf8fafc,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  minHeight = 200,
  minWidth = 200,
  scale = 1,
  scaleMobile = 1,
}: VantaTopologyProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    let checkP5Interval: NodeJS.Timeout | null = null;

    // Load Vanta.js scripts dynamically
    const loadVanta = async () => {
      // Check if already initialized
      if (window.VANTA && typeof window.VANTA.TOPOLOGY === 'function' && window.p5) {
        if (vantaEffect.current) {
          try {
            vantaEffect.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
        try {
          // Ensure VANTA.TOPOLOGY is a function before calling
          if (typeof window.VANTA.TOPOLOGY !== 'function') {
            console.error('VANTA.TOPOLOGY is not a function');
            return;
          }
          
          vantaEffect.current = window.VANTA.TOPOLOGY({
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
          // Ensure canvas has low z-index so overlay can appear above it
          if (vantaRef.current) {
            const canvas = vantaRef.current.querySelector('canvas');
            if (canvas) {
              canvas.style.zIndex = '0';
              canvas.style.position = 'absolute';
            }
          }
        } catch (error) {
          console.error('Vanta Topology direct initialization error:', error);
        }
        return;
      }

      // Helper to initialize Vanta after both scripts are loaded
      const initVanta = () => {
        if (!vantaRef.current) return;
        
        // Wait for VANTA.TOPOLOGY to be available
        if (!window.VANTA || typeof window.VANTA.TOPOLOGY !== 'function') {
          setTimeout(initVanta, 100);
          return;
        }
        
        if (!window.p5) {
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
          // Ensure VANTA.TOPOLOGY is a function before calling
          if (typeof window.VANTA.TOPOLOGY !== 'function') {
            console.error('VANTA.TOPOLOGY is not a function');
            return;
          }
          
          vantaEffect.current = window.VANTA.TOPOLOGY({
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
          // Ensure canvas has low z-index so overlay can appear above it
          if (vantaRef.current) {
            const canvas = vantaRef.current.querySelector('canvas');
            if (canvas) {
              canvas.style.zIndex = '0';
              canvas.style.position = 'absolute';
            }
          }
        } catch (error) {
          console.error('Vanta Topology initialization error:', error);
        }
      };

      // Load p5.js first if not already loaded (TOPOLOGY uses p5.js, not Three.js)
      if (!window.p5 && !document.querySelector('script[src*="p5"]')) {
        const p5Script = document.createElement('script');
        p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js';
        p5Script.async = false;
        document.head.appendChild(p5Script);

        p5Script.onload = () => {
          setTimeout(() => {
            // Load Vanta Topology
            if (!window.VANTA || typeof window.VANTA.TOPOLOGY !== 'function') {
              // Check if script already exists
              const existingScript = document.querySelector('script[src*="vanta.topology"]');
              if (existingScript) {
                // Script exists, wait for it to load
                const checkVanta = setInterval(() => {
                  if (window.VANTA && typeof window.VANTA.TOPOLOGY === 'function') {
                    clearInterval(checkVanta);
                    setTimeout(initVanta, 200);
                  }
                }, 100);
                setTimeout(() => clearInterval(checkVanta), 10000);
              } else {
                const vantaScript = document.createElement('script');
                vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js';
                vantaScript.async = false;
                document.head.appendChild(vantaScript);

                vantaScript.onload = () => {
                  setTimeout(initVanta, 300);
                };
                vantaScript.onerror = () => {
                  console.error('Failed to load Vanta Topology script');
                };
              }
            } else {
              setTimeout(initVanta, 200);
            }
          }, 200);
        };
        p5Script.onerror = () => {
          console.error('Failed to load p5.js script');
        };
      } else if (window.p5) {
        // p5.js already loaded, just load Vanta
        if (!window.VANTA || typeof window.VANTA.TOPOLOGY !== 'function') {
          // Check if script already exists
          const existingScript = document.querySelector('script[src*="vanta.topology"]');
          if (existingScript) {
            // Script exists, wait for it to load
            const checkVanta = setInterval(() => {
              if (window.VANTA && typeof window.VANTA.TOPOLOGY === 'function') {
                clearInterval(checkVanta);
                setTimeout(initVanta, 200);
              }
            }, 100);
            setTimeout(() => clearInterval(checkVanta), 10000);
          } else {
            const vantaScript = document.createElement('script');
            vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js';
            vantaScript.async = false;
            document.head.appendChild(vantaScript);

            vantaScript.onload = () => {
              setTimeout(initVanta, 300);
            };
            vantaScript.onerror = () => {
              console.error('Failed to load Vanta Topology script');
            };
          }
        } else {
          setTimeout(initVanta, 200);
        }
      } else {
        // p5.js script exists but not loaded yet, wait for it
        checkP5Interval = setInterval(() => {
          if (window.p5) {
            if (checkP5Interval) {
              clearInterval(checkP5Interval);
              checkP5Interval = null;
            }
            if (!window.VANTA || typeof window.VANTA.TOPOLOGY !== 'function') {
              // Check if script already exists
              const existingScript = document.querySelector('script[src*="vanta.topology"]');
              if (existingScript) {
                // Script exists, wait for it to load
                const checkVanta = setInterval(() => {
                  if (window.VANTA && typeof window.VANTA.TOPOLOGY === 'function') {
                    clearInterval(checkVanta);
                    setTimeout(initVanta, 200);
                  }
                }, 100);
                setTimeout(() => clearInterval(checkVanta), 10000);
              } else {
                const vantaScript = document.createElement('script');
                vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js';
                vantaScript.async = false;
                document.head.appendChild(vantaScript);

                vantaScript.onload = () => {
                  setTimeout(initVanta, 300);
                };
                vantaScript.onerror = () => {
                  console.error('Failed to load Vanta Topology script');
                };
              }
            } else {
              setTimeout(initVanta, 200);
            }
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          if (checkP5Interval) {
            clearInterval(checkP5Interval);
            checkP5Interval = null;
          }
        }, 10000);
      }
    };

    loadVanta();

    return () => {
      // Clean up interval if component unmounts
      if (checkP5Interval) {
        clearInterval(checkP5Interval);
        checkP5Interval = null;
      }
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [color, backgroundColor, mouseControls, touchControls, gyroControls, minHeight, minWidth, scale, scaleMobile]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ zIndex: 0 }}
    />
  );
}

