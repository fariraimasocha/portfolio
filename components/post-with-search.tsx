'use client'

import { useState } from 'react'

import { PostRows } from '@/components/rows'
import { PostMetadata } from '@/lib/posts'

export default function PostsWithSearch({ posts }: { posts: PostMetadata[] }) {
  const [query, setQuery] = useState('')
  const filtered = posts.filter(post =>
    post.title?.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div>
      {/* Terminal-prompt search */}
      <label className='mt-10 flex max-w-md items-center gap-3 border-b border-foreground/30 pb-2 font-mono text-sm transition-colors focus-within:border-[hsl(var(--ink-accent))]'>
        <span className='shrink-0 whitespace-nowrap text-[hsl(var(--ink-accent))]'>$ grep</span>
        <input
          type='search'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='search posts…'
          aria-label='Search posts'
          className='w-full bg-transparent outline-none placeholder:text-muted-foreground'
        />
      </label>

      {filtered.length > 0 ? (
        <PostRows posts={filtered} />
      ) : (
        <p className='mt-10 font-mono text-sm text-muted-foreground'>
          no matches for &ldquo;{query}&rdquo;.{' '}
          <button
            type='button'
            onClick={() => setQuery('')}
            className='text-foreground underline decoration-[hsl(var(--ink-accent))] underline-offset-4 hover:no-underline'
          >
            clear search
          </button>
        </p>
      )}
    </div>
  )
}
