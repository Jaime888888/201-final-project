import React from 'react';

function RatingStars({ rating = 0, max = 5, size = 16 }) {
  const value = Math.max(0, Math.min(Number(rating) || 0, max));
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  const starStyle = { color: '#f5b50a', fontSize: `${size}px`, lineHeight: 1 };
  const emptyStyle = { color: '#d1d5db', fontSize: `${size}px`, lineHeight: 1 };

  return (
    <span aria-label={`Rating: ${value} out of ${max} stars`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} style={starStyle}>★</span>
      ))}
      {hasHalf && <span key={`half`} style={starStyle}>☆</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} style={emptyStyle}>★</span>
      ))}
    </span>
  );
}

export default RatingStars;
