import { notFound } from 'next/navigation'

import Article from '@/components/article'
import { getProjectBySlug, getProjects } from '@/lib/projects'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map(project => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProjectBySlug((await params).slug)
  return { title: project?.metadata.title, description: project?.metadata.summary }
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProjectBySlug((await params).slug)
  if (!project) notFound()

  const all = await getProjects()
  const i = all.findIndex(p => p.slug === project.metadata.slug)
  const after = all.length > 1 ? all[(i + 1) % all.length] : undefined
  const next = after && { href: `/projects/${after.slug}`, title: after.title }

  return <Article kind='project' {...project.metadata} content={project.content} next={next} />
}
