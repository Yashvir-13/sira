import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'motion/react';

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On desktop: 20deg tilt to 0deg flat.
  const rotateX = useTransform(scrollYProgress, [0, 0.7], [isMobile ? 0 : 20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [isMobile ? 0.95 : 0.9, 1.02]);
  const translateY = useTransform(scrollYProgress, [0, 0.7], [0, -40]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center pt-8 pb-20 sm:pb-36"
    >
      <div
        className="w-full relative"
        style={{
          perspective: isMobile ? 'none' : '1200px',
        }}
      >
        <Header translateY={translateY} titleComponent={titleComponent} />
        <Card rotateX={rotateX} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

const Header: React.FC<{
  translateY: MotionValue<number>;
  titleComponent: React.ReactNode;
}> = ({ translateY, titleComponent }) => {
  return (
    <motion.div
      style={{
        y: translateY,
      }}
      className="max-w-4xl mx-auto text-center px-4 mb-8 sm:mb-12"
    >
      {titleComponent}
    </motion.div>
  );
};

const Card: React.FC<{
  rotateX: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}> = ({ rotateX, scale, children }) => {
  return (
    <motion.div
      style={{
        rotateX,
        scale,
      }}
      className="max-w-5xl mx-auto w-full relative"
    >
      {/* Subtle Depth Shadow */}
      <div className="absolute -inset-1 bg-surface-raised/60 rounded-[28px] blur-xl opacity-50 pointer-events-none -z-10" />

      {/* Outer Card with Hairline Glass Border */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-2 sm:p-4 border border-border-subtle shadow-2xl">
        <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-surface-raised/50 backdrop-blur-md">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
