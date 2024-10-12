import path from 'path'
import matter from 'gray-matter'
import fsSync from 'fs'
import fs from 'fs/promises'



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

export async function getPosts(limit?: number): Promise<PostMetadata[]> {
    const files = await fs.readdir(rootDirectory)

    const posts = await Promise.all(files.map(async file => await getPostMetadata(file)))

    posts.sort((a, b) => {
        return new Date(b.publishedAt ?? '').getTime() - new Date(a.publishedAt ?? '').getTime()
    })

    return limit ? posts.slice(0, limit) : posts
}

export async function getPostMetadata(filepath: string): Promise<PostMetadata> {
    const slug = filepath.replace(/\.mdx$/, '')
    const filePath = path.join(rootDirectory, filepath)
    const fileContent = await fs.readFile(filePath, { encoding: 'utf8' })
    const { data } = matter(fileContent)
    return { ...data, slug }
}
