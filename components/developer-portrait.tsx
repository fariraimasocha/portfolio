const outline = [
  ['Q', 168, 22, 151, 23],
  ['Q', 143, 7, 126, 13],
  ['Q', 113, 0, 99, 12],
  ['Q', 82, 4, 72, 20],
  ['Q', 54, 18, 50, 36],
  ['Q', 34, 43, 39, 60],
  ['Q', 34, 75, 48, 83],
  ['Q', 54, 88, 61, 88],
  ['Q', 63, 105, 72, 121],
  ['C', 75, 105, 70, 95, 78, 78],
  ['C', 94, 81, 108, 72, 119, 58],
  ['C', 126, 75, 141, 80, 155, 83],
  ['L', 154, 117],
  ['Q', 154, 130, 144, 139],
  ['L', 127, 152],
  ['Q', 117, 158, 105, 153],
  ['L', 85, 142],
  ['Q', 78, 137, 75, 128],
  ['Q', 80, 147, 93, 151],
  ['Q', 93, 169, 112, 182],
  ['Q', 135, 174, 134, 151],
  ['Q', 145, 142, 153, 130],
  ['Q', 163, 115, 164, 92],
  ['Q', 177, 90, 181, 76],
  ['Q', 192, 67, 184, 55],
  ['Q', 183, 45, 174, 45],
  ['C', 197, 38, 212, 59, 213, 86],
  ['C', 225, 130, 168, 160, 176, 178],
  ['Q', 194, 188, 198, 212]
] as const

export const portraitStart = { x: 174, y: 45 }
export const portraitEnd = { x: 198, y: 212 }

export function portraitStroke(left = 0, top = 0) {
  return outline.map(([command, ...coordinates]) =>
    `${command} ${coordinates.map((coordinate, index) => coordinate + (index % 2 ? top : left)).join(' ')}`
  ).join(' ')
}

export default function DeveloperPortrait() {
  return (
    <svg
      data-trace-portrait
      aria-hidden='true'
      viewBox='0 0 220 230'
      className='mx-auto h-[230px] w-[220px] text-[hsl(var(--ink-accent))]'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path
        d={`M ${portraitStart.x} ${portraitStart.y} ${portraitStroke()}`}
        className='opacity-25 motion-reduce:opacity-100'
      />
      <path
        d='M 86 97 l 15 -2 m 26 0 l 15 2 M 119 104 l -4 16 5 1 m -15 10 q 12 6 23 0 M 92 168 q -38 11 -53 38 m 96 -40 q 10 18 33 23'
        className='opacity-55 motion-reduce:opacity-100'
      />
      <path
        data-portrait-eyes
        d='M 89 104 q 6 -4 12 0 m 26 0 q 6 -4 12 0'
        className='origin-center [transform-box:fill-box] opacity-55 motion-reduce:opacity-100'
      />
    </svg>
  )
}
