import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
 {/* Base Background */}
 <rect width="120" height="120" rx="30" fill="#E63560" />
 
 {/* ==== Pixel Grid (3x3 Layout, Size: 24, Space: 4) ==== */}
 
 {/* Top Row */}
 <rect x="20" y="20" width="24" height="24" rx="3" fill="white" />
 <rect x="48" y="20" width="52" height="24" rx="3" fill="white" />
 
 {/* Middle Row */}
 <rect x="48" y="48" width="24" height="24" rx="3" fill="white" />
 <rect x="76" y="48" width="24" height="24" rx="3" fill="#FFC2D4" />
 
 {/* Bottom Row */}
 <rect x="48" y="76" width="24" height="24" rx="3" fill="white" />
 </svg>
);

