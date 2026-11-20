import { notFound } from 'next/navigation'

import Article from '@/components/article'
import { getPostBySlug, getPosts } from '@/lib/posts'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug((await params).slug)
  return { title: post?.metadata.title, description: post?.metadata.summary }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug((await params).slug)
  if (!post) notFound()

  const all = await getPosts()
  const i = all.findIndex(p => p.slug === post.metadata.slug)
  const after = all.length > 1 ? all[(i + 1) % all.length] : undefined
  const next = after && { href: `/posts/${after.slug}`, title: after.title }

  return <Article kind='post' {...post.metadata} content={post.content} next={next} />
}
