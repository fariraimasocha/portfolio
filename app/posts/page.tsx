import React from 'react'
import { getPosts } from '@/lib/posts'
import PostsWithSearch from '@/components/post-with-search'


export default async function PostsPage() {
    const posts = await getPosts()

    return (
        <section className='py-24'>
            <div className='container max-w-3xl'>
                <PostsWithSearch posts={posts} />
            </div>
        </section>
    )
}
