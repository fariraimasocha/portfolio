
import path from 'path'
import matter from 'gray-matter'
import fsSync from 'fs'


const rootDirectory = path.join(process.cwd(), 'content', 'posts')

export type Post = {
    metadata: PostMetadata
    content: string
}

export type PostMetadata = {
    title?: string
    summary?: string
    image?: string
    author?: string
    publishedAt?: string
    slug?: string
}


export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const filePath = path.join(rootDirectory, `${slug}.mdx`)
        const fileContent = fsSync.readFileSync(filePath, { encoding: 'utf-8' })
        const { data, content } = matter(fileContent)

        return { metadata: { ...data, slug }, content }
    } catch (error) {
        console.error(error)
        return null
    }
} 