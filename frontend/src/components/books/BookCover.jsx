function PatternDefs({ id, pattern }) {
  if (pattern === 'dots') {
    return (
      <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.1" fill="white" fillOpacity="0.18" />
      </pattern>
    )
  }
  if (pattern === 'waves') {
    return (
      <pattern id={id} width="20" height="10" patternUnits="userSpaceOnUse">
        <path d="M0 6c4-6 6 6 10 0s6 6 10 0" fill="none" stroke="white" strokeOpacity="0.16" />
      </pattern>
    )
  }
  if (pattern === 'lines') {
    return (
      <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 8L8 0" stroke="white" strokeOpacity="0.14" />
      </pattern>
    )
  }
  if (pattern === 'atoms') {
    return (
      <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="11" cy="11" r="2" fill="white" fillOpacity="0.18" />
        <ellipse cx="11" cy="11" rx="8" ry="3.5" fill="none" stroke="white" strokeOpacity="0.14" />
      </pattern>
    )
  }
  return (
    <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
      <path d="M12 0H0v12" fill="none" stroke="white" strokeOpacity="0.12" />
    </pattern>
  )
}

export default function BookCover({ book, className = '' }) {
  const uniqueId = `cover-${book.id}`
  const patternId = `${uniqueId}-pattern`
  const cover = book.cover || { from: '#111827', to: '#334155', pattern: 'grid' }

  if (book.coverImage) {
    return (
      <div className={`relative overflow-hidden rounded-2xl shadow-card ${className}`}>
        <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-card ${className}`}>
      <svg viewBox="0 0 240 320" className="h-full w-full" role="img" aria-label={book.title}>
        <defs>
          <linearGradient id={`${uniqueId}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={cover.from} />
            <stop offset="100%" stopColor={cover.to} />
          </linearGradient>
          <PatternDefs id={patternId} pattern={cover.pattern} />
        </defs>
        <rect width="240" height="320" fill={`url(#${uniqueId}-bg)`} />
        <rect width="240" height="320" fill={`url(#${patternId})`} />
        <rect x="0" y="0" width="10" height="320" fill="rgba(255,255,255,0.12)" />
        <text x="28" y="58" fill="#C4A35A" fontSize="12" fontFamily="Inter, sans-serif" letterSpacing="2">
          HSC BOARD
        </text>
        <foreignObject x="24" y="80" width="192" height="140">
          <div xmlns="http://www.w3.org/1999/xhtml" className="font-sans text-[22px] font-bold leading-7 text-white">
            {book.title}
          </div>
        </foreignObject>
        <text x="28" y="270" fill="white" fillOpacity="0.9" fontSize="14" fontFamily="Noto Sans Bengali, Inter, sans-serif">
          {book.author}
        </text>
        <text x="28" y="294" fill="white" fillOpacity="0.65" fontSize="11" fontFamily="Inter, sans-serif">
          {book.publisher}
        </text>
      </svg>
    </div>
  )
}
