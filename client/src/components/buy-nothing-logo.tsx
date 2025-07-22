interface BuyNothingLogoProps {
  className?: string;
}

export default function BuyNothingLogo({ className = "" }: BuyNothingLogoProps) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#52E5B8" />
          <stop offset="50%" stopColor="#00C4CC" />
          <stop offset="100%" stopColor="#52E5B8" />
        </linearGradient>
      </defs>
      
      {/* Rounded square background */}
      <rect
        x="10"
        y="10"
        width="100"
        height="100"
        rx="20"
        ry="20"
        fill="url(#logoGradient)"
      />
      
      {/* White zigzag/chart line */}
      <path
        d="M 25 85 L 35 75 L 45 85 L 55 70 L 65 80 L 75 65 L 85 75 L 95 60"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Buy text */}
      <text
        x="60"
        y="45"
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
        x="60"
        y="68"
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