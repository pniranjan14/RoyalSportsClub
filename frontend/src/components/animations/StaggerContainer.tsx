'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export default function StaggerContainer({ 
  children, 
  className = '' 
}: StaggerContainerProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={className}
    >
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div key={index} variants={itemVariants} className="h-full">
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
