import Projects from '@/components/projects'
import { getProjects } from '@/lib/projects'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <section className='mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-32'>
      <div className='mb-10 flex items-end justify-between gap-6'>
        <div className='flex flex-col gap-3'>
          <span className='label-mono'>projects</span>
          <h1 className='text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.03em]'>
            Everything I&rsquo;ve shipped
          </h1>
        </div>
        <span className='label-mono hidden shrink-0 sm:block'>
          tap a card — there&rsquo;s more inside
        </span>
      </div>

      <Projects projects={projects} />
    </section>
  )
}
