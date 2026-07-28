/** Hero claim — exact copy requested by the user. */
export default function HeroHeadline() {
  // Anton is already condensed — heavy negative tracking makes the caps collide.
  return (
    <h1 className='font-display text-[clamp(3.25rem,12.5vw,10rem)] uppercase leading-[0.95] tracking-[-0.015em]'>
      <span className='block text-muted-foreground'>I turn ideas</span>
      {/* Anton's period is a large square slab — a round dot reads as punctuation
          at display size. em units keep it locked to the clamped headline. */}
      <span className='block'>
        into products
        <span
          aria-hidden='true'
          className='ml-[0.05em] inline-block size-[0.115em] rounded-full bg-[hsl(var(--ink-accent))] align-baseline'
        />
        <span className='sr-only'>.</span>
      </span>
    </h1>
  )
}
