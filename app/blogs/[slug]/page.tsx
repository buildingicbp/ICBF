import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react"
import { notFound } from "next/navigation"

// Blog post data - in a real app, this would come from a database or CMS
const blogPosts = [
  {
    slug: "fitness-blueprint-beginners",
    title: "Fitness Blueprint for Complete Beginners!",
    content: `
      <h2>Understanding Common Fitness Misconceptions</h2>
      <p>According to most of us, getting Fit means inclusion of one or more of the following. Read their lacunae.</p>
      
      <h3>Leg Intensive Cardio</h3>
      <p><strong>Post dinner walks, Jogging, Walking, Running, Cycling</strong> etc. primarily focuses only on utilizing your legs. Whereas, rest of the muscles are not activated. Assuming, our food pattern remains unaltered, soon we reach saturation in the above exercises and our fitness progress stalls.</p>
      
      <h3>Dieting</h3>
      <p><strong>Haphazard dieting, consuming very less fats daily, eating way too less or more, depending on green tea, lemon honey etc.</strong> Our dieting strategy should be decided after keeping goals in mind. Moreover science has proved that essential fatty acids and cholesterol are required by our body, obviously in limits. Problem occurs when we abuse fat, but that doesn't mean we should eliminate them from our diet! We should know the amount of fat we should be eating each day. 1 gm of fat provides 9 calories of energy. So, when we eliminate the fat, we are bound to feel more hungry, and <strong>we eat carbohydrates. We have a problem here!</strong>. From decreasing the overall calories ingested, we are back to the same place, only with a pathetic diet.</p>
      
      <h3>Gym workout</h3>
      <p>I would keep this separate. Because, with the help of lifting weights, we can activate most of our muscle groups.</p>
      <p>Anything else which comes to your mind? Do comment below so that I can list them here! (I am not including swimming as it is not feasible for the masses).</p>
      
      <h2>So, Where should I start?</h2>
      <h4>Step by Step process:</h4>
      <ol>
        <li><strong>Create a mental picture of your fitter version</strong>. Do you know anyone having the physique which you aspire for? If possible get in touch with them, and follow their fitness formula. Start reading about health and fitness. As, every 'body' is different, we have to go through a hit and trial phase before we find out the dieting strategy and the workouts which give us the best result.</li>
        <li>Track your <strong>Food Pattern</strong> for few days, using either pen paper or any app like myFitnessPal. Get a rough idea of how many calories you are eating. Eventually try to estimate amount of proteins, carbohydrates and fats you are eating everyday. This work can be done by apps like myFitnessPal, Fittr etc. or the best case would be if you can document your food in a paper and calculate the amount of macros (protein : fat : carb).</li>
        <li>Meanwhile, <strong>start working out.</strong> Working out can be anything like running, sports, gym, yoga etc. <strong>I would totally recommend lifting weights.</strong></li>
        <li>Once you are comfortable with the working out routine, its time to focus on the most important thing. Food preferences. In previous paras you read about tracking your food. Now I need you to analyze those data. What's your target? <strong>To gain weight, you need to increase food consumption. To lose weight you need to decrease.</strong> What percentage of total calories are coming from proteins, fats and carbohydrate. Is your diet protein or fat or carb deficient? <strong>Indian diet is by default carb heavy and protein deficient</strong>. As a starting point I want you to change the ratio of your diet to <strong>30% protein : 30% :fats, 40%carbohydrates</strong>.</li>
        <li><strong>Stick to this for three months.</strong> You might be required to adjust your diet depending upon the progress or setbacks.</li>
      </ol>
      
      <p>I hope you got a birds eye view of what and how to do. The will to do it is purely yours! For further reading and clarification <strong>check out our Starting Fitness Journey guide.</strong></p>
    `,
    author: "ICANBEFITTER",
    date: "April 6, 2019",
    readTime: "10 min read",
    category: "Beginner Guide",
    image: "/placeholder.jpg",
    tags: ["Beginner", "Blueprint", "Fitness"]
  },
  {
    slug: "icanbefitter-home",
    title: "ICANBEFITTER - It's Time to Love the Person in the Mirror",
    content: `
      <h2>Our Motto</h2>
      <p><strong>Becoming Fit is a Consequence of our Lifestyle</strong>!</p>
      
      <p>We see around us unfit people prone to lifestyle diseases, struggling to carry out their day to day activities. It's really a matter of concern! It's even more saddening that no one ever told them that they can be fit just by incorporating physical activity and subtle changes in their diet.</p>
      
      <p>We want you to enjoy the benefits of a better physical dimension! We want you to understand that just <strong>by bringing small incremental changes in our Lifestyle, we can be a lot more fitter, both physically and mentally</strong>!</p>
      
      <h2>Check out Dinesh's amazing Fat to Fit Journey!</h2>
      <h3>Rome was not build in a day, but they worked on it every single day!</h3>
      
      <p><strong>You do what it takes you to do to get what you want.</strong> I met Dinesh at Old Sports Complex Gym of IIT Kanpur. He had been lifting weights since a long time. Having a bad relationship with food; he was struggling to lose fat. We then introduced Quantified Goal Oriented Diet in his regimen, et Voila! The results were tremendous!</p>
      
      <p>To know more about Quantified Goal Oriented Diet Plans, read on.</p>
      
      <h2>ICANBEFITTER</h2>
      <p>Just like any skill you learn in your life to upgrade yourself, the skill of taking care of your body will be a very crucial upgrade which you cannot afford to delay. Welcome to <strong>ICANBEFITTER</strong> initiative of getting fitter together. I believe this site has all the information which you would require for starting out a fitness program.</p>
      
      <p>Start here to transform yourself!</p>
      
      <p>I am always here to share my experiences with you guys. Inbox me any time at icanbefitter@gmail.com. I will try to reply ASAP, and if you want me to write about any topics or clarify any sort of doubts, feel free to ask in mail.</p>
      
      <p><strong>All the Best! Stay Motivated!</strong></p>
      
      <h2>Do you think "Icanbefitter"?</h2>
      <p>I hope you are already moving forward in your path to fitness. We are here to help you align your lifestyle in accordance with your goals.</p>
      
      <p>See how can we help!</p>
    `,
    author: "ICANBEFITTER",
    date: "March 2019",
    readTime: "8 min read",
    category: "Motivation",
    image: "/placeholder.jpg",
    tags: ["Motivation", "Lifestyle", "Transformation"]
  }
]

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center pl-32">
          <Link href="/">
            <Image src="/logo.png" alt="ICBF Logo" width={80} height={40} className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-black hover:text-slate-700 font-semibold">
            Home
          </Link>
          <Link href="/blogs" className="text-black hover:text-slate-700 font-semibold">
            Blog
          </Link>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Services
          </a>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Work with Us
          </a>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Store
          </a>
          <a href="#" className="text-black hover:text-slate-700 font-semibold">
            Contact
          </a>
        </nav>

        <div className="flex items-center pr-32">
          <Link href="/signin">
            <Button className="bg-[#1F509A] hover:bg-[#1a4a8a] text-white px-6 py-2 rounded-full">Login</Button>
          </Link>
        </div>
      </header>

      {/* Back to Blogs */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/blogs">
          <Button variant="ghost" className="text-[#1F509A] hover:text-[#1a4a8a] p-0 h-auto font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Button>
        </Link>
      </div>

      {/* Blog Post Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Featured Image */}
        <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-[#1F509A] text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              Share on Facebook
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              Share on Twitter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              Copy Link
            </Button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter(p => p.slug !== params.slug)
              .slice(0, 3)
              .map((post) => (
                <Link key={post.slug} href={`/blogs/${post.slug}`}>
                  <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1F509A] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
} 