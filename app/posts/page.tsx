import { getPosts } from '@/lib/posts'
import PostsWithSearch from '@/components/post-with-search'
import { SectionTitle } from '@/components/rows'

export const metadata = { title: 'Writing' }

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <section className='mx-auto max-w-5xl px-[clamp(1.25rem,4vw,3rem)] pb-24 pt-28 text-lg'>
      <SectionTitle as='h1' index={`cat ./posts · ${posts.length}`}>
        Things I wrote
      </SectionTitle>
      <PostsWithSearch posts={posts} />
    </section>
  )
}
