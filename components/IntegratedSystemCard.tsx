"use client";

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface IntegratedSystemCardProps {
  icon: LucideIcon;
  title: string;
  features: string[];
  gradient: string;
  delay?: number;
}

export function IntegratedSystemCard({ 
  icon: Icon, 
  title, 
  features, 
  gradient,
  delay = 0 
}: IntegratedSystemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full"
    >
      {/* Header with gradient */}
      <div className={`${gradient} p-6 flex items-center gap-4`}>
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <Icon className="text-white" size={24} strokeWidth={2} />
        </div>
        <h3 className="text-white text-xl font-bold">
          {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="bg-white p-6 flex-1 flex flex-col">
        <ul className="space-y-3 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-[#00A3E0] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#4B5563] flex-1 text-sm leading-relaxed">
                {feature}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
