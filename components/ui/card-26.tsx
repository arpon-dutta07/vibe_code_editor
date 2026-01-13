// file: components/ui/link-card.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

// Props interface for type safety and clarity
interface LinkCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
  onClick?: () => void;
}

const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ className, title, description, imageUrl, href = "#", onClick, ...props }, ref) => {
    // Animation variants for framer-motion
    const cardVariants = {
      initial: { scale: 1, y: 0 },
      hover: {
        scale: 1.03,
        y: -5,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 15,
        },
      },
    };

    return (
      <motion.a
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(
          'group relative flex h-80 w-full max-w-sm flex-col justify-between overflow-hidden',
          'rounded-2xl',
          'bg-linear-to-b from-white/90 via-gray-50/90 to-white/90 dark:from-zinc-600/80 dark:via-zinc-400/50 dark:to-zinc-400/98',
          'shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]',
          'backdrop-blur-md',
          'border border-[rgba(230,230,230,0.7)] dark:border-[rgba(70,70,70,0.7)]',
          'p-6 text-card-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'cursor-pointer',
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={`Card for ${title}`}
        {...props}
      >
        {/* Text content */}
        <div className="z-10">
          <h3 className="mb-2 font-serif text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="max-w-[80%] text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Image container with a subtle scale effect on hover */}
        <div className="absolute bottom-0 right-0 h-48 w-48 translate-x-1/4 translate-y-1/4 transform">
          <motion.img
            src={imageUrl}
            alt={`${title} illustration`}
            className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>
      </motion.a>
    );
  }
);

LinkCard.displayName = 'LinkCard';

export { LinkCard };
