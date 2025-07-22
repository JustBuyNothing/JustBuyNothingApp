interface BuyNothingHeroLogoProps {
  className?: string;
}

export default function BuyNothingHeroLogo({ className = "" }: BuyNothingHeroLogoProps) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heroLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#52E5B8" />
          <stop offset="50%" stopColor="#00C4CC" />
          <stop offset="100%" stopColor="#52E5B8" />
        </linearGradient>
      </defs>
      
      {/* Navy blue circle background */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="#1a365d"
      />
      
      {/* Rounded square with gradient */}
      <rect
        x="50"
        y="50"
        width="100"
        height="100"
        rx="20"
        ry="20"
        fill="url(#heroLogoGradient)"
      />
      
      {/* White zigzag/chart line */}
      <path
        d="M 65 135 L 75 125 L 85 135 L 95 120 L 105 130 L 115 115 L 125 125 L 135 110"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Buy text */}
      <text
        x="100"
        y="95"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        fill="#1a365d"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Buy
      </text>
      
      {/* Nothing text */}
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontSize="16"
        fontWeight="bold"
        fill="#1a365d"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Nothing
      </text>
    </svg>
  );
}