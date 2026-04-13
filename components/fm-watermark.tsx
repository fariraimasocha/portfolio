'use client'

export default function FMWatermark() {
  return (
    <div
      aria-hidden='true'
      className='fixed inset-0 overflow-hidden pointer-events-none select-none'
      style={{ zIndex: -1 }}
    >
      <div className='absolute top-1/2 -left-10 -translate-y-1/2 -rotate-90'>
        <svg
          width='500'
          height='320'
          viewBox='0 0 500 320'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <filter id='fm-glow'>
              <feGaussianBlur stdDeviation='5' result='blur' />
              <feMerge>
                <feMergeNode in='blur' />
                <feMergeNode in='blur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>

          {/* Base subtle fill */}
          <text
            x='50%'
            y='55%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='fm-watermark-text'
            fill='currentColor'
            opacity='0.04'
            stroke='none'
            fontSize='280'
            fontWeight='bold'
          >
            FM
          </text>

          {/* Static faint outline */}
          <text
            x='50%'
            y='55%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='fm-watermark-text'
            fill='none'
            stroke='currentColor'
            strokeWidth='0.5'
            opacity='0.05'
            fontSize='280'
            fontWeight='bold'
          >
            FM
          </text>

          {/* Moving light 1 */}
          <text
            x='50%'
            y='55%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='fm-watermark-text fm-light-1'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            fontSize='280'
            fontWeight='bold'
            filter='url(#fm-glow)'
          >
            FM
          </text>

          {/* Moving light 2 — offset timing */}
          <text
            x='50%'
            y='55%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='fm-watermark-text fm-light-2'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            fontSize='280'
            fontWeight='bold'
            filter='url(#fm-glow)'
          >
            FM
          </text>

          {/* Moving light 3 — bright point */}
          <text
            x='50%'
            y='55%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='fm-watermark-text fm-light-3'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            fontSize='280'
            fontWeight='bold'
            filter='url(#fm-glow)'
          >
            FM
          </text>
        </svg>
      </div>
    </div>
  )
}
