import Image from 'next/image'
import Link from 'next/link'

import { ProjectMetadata } from '@/lib/projects'
import { formatDate } from '@/lib/utils'

export default function Projects({
    projects
}: {
    projects: ProjectMetadata[]
}) {
    return (
        <ul className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
            {projects.map(project => (
                <li key={project.slug} className='group relative'>
                    <Link href={`/projects/${project.slug}`}>
                        {project.image && (
                            <div className='aspect-video w-full overflow-hidden rounded-lg bg-muted ring-1 ring-black/5 dark:ring-white/5'>
                                <Image
                                    src={project.image}
                                    alt={project.title || ''}
                                    fill
                                    className='object-contain object-top transition-transform duration-300 ease-out group-hover:scale-105'
                                />
                            </div>
                        )}

                        <div className='absolute inset-[1px] rounded-lg bg-background/70 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100' />

                        <div className='absolute inset-x-0 bottom-0 translate-y-2 px-6 py-5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100'>
                            <h2 className='line-clamp-1 font-mono text-lg'>
                                {project.title}
                            </h2>
                            <p className='line-clamp-1 text-sm text-muted-foreground'>
                                {project.summary}
                            </p>
                            <p className='text-xs font-light tabular-nums text-muted-foreground'>
                                {formatDate(project.publishedAt ?? '')}
                            </p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}