import React from 'react'
import { getPostBySlug, getPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import MDXContent from '@/components/mdx-content'

export async function generateStaticParams() {
    const posts = await getPosts()
    const slugs = posts.map(post => ({ slug: post.slug }))

    return slugs
}


export default async function Post({ params }: { params: { slug: string } }) {
    const { slug } = params
    const post = await getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    const { metadata, content } = post
    const { title, image, author, publishedAt } = metadata

    return (
        <section className='py-24'>
            <div className='container max-w-3xl'>
                {image && (
                    <div className='relative mb-6 h-96 w-full overflow-hidden rounded-lg ring-1 ring-black/5 dark:ring-white/5'>
                        <Image
                            src={image}
                            alt={title || ''}
                            className='object-cover'
                            fill
                        />
                    </div>
                )}

                <header>
                    <h1 className='title'>{title}</h1>
                    <p className='mt-3 text-xs tabular-nums text-muted-foreground'>
                        {author} / {formatDate(publishedAt ?? '')}
                    </p>
                </header>

                <main className='prose mt-16 dark:prose-invert'>
                    <MDXContent source={content} />
                </main>

            </div>
        </section>
    )
}
