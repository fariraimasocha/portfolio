import ProjectCard from '@/components/project-card'
import { ProjectMetadata } from '@/lib/projects'

export default function Projects({ projects }: { projects: ProjectMetadata[] }) {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {projects.map((project, i) => (
        <ProjectCard key={project.slug} project={project} index={i} />
      ))}
    </div>
  )
}
