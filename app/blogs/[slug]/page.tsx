import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const POSTS = [
  {
    slug: "fitness-blueprint-beginners",
    title: "Fitness Blueprint for Complete Beginners!",
    publishDate: "2019-04-06",
    readTime: "10",
    coverImage: "/placeholder.jpg",
    html: `
      <p>According to most of us, getting Fit means inclusion of one or more of the following. Read their lacunae: Leg Intensive Cardio, Dieting, and Gym workout.</p>
      <h2>Step-by-step process</h2>
      <ul>
        <li>Start with realistic goals</li>
        <li>Build consistency over intensity</li>
        <li>Prioritize recovery and sleep</li>
      </ul>
    `,
  },
  {
    slug: "icanbefitter-home",
    title: "ICANBEFITTER - It's Time to Love the Person in the Mirror",
    publishDate: "2019-03-01",
    readTime: "8",
    coverImage: "/placeholder.jpg",
    html: `
      <p>Becoming Fit is a consequence of our lifestyle. Small incremental changes can make you fitter, physically and mentally.</p>
      <p>Adopt sustainable habits and celebrate small wins.</p>
    `,
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) return notFound()

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link href="/blogs" className="text-[#1F509A] font-semibold">← Back to Blogs</Link>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {post.coverImage && (
          <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <div className="text-sm text-gray-600">
            {post.publishDate} · {post.readTime} min
          </div>
        </header>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </div>
  )
}