import { ProjectRows, SectionTitle } from '@/components/rows'
import { getProjects } from '@/lib/projects'

export const metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <section className='mx-auto max-w-5xl px-[clamp(1.25rem,4vw,3rem)] pb-24 pt-28 text-lg'>
      <SectionTitle as='h1' index={`ls ./projects · ${projects.length}`}>
        Everything I&rsquo;ve shipped
      </SectionTitle>
      <ProjectRows projects={projects} />
    </section>
  )
}
