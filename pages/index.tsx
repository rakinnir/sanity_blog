import Head from "next/head"
import "slick-carousel/slick/slick.css"
import Banner from "../components/Banner"
import BannerBottom from "../components/BannerBottom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { sanityClient, urlFor } from "../sanity"
import { Post } from "../typing"
import Image from "next/image"
import Link from "next/link"

type Props = {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  console.log(posts)
  return (
    <div>
      <Head>
        <title>My Blog | Explore the new horizon</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      <main className="font-bodyFont">
        <Header />
        <Banner />
        <div className="relative mx-auto max-w-7xl h-60">
          <BannerBottom />
        </div>
        <div className="grid grid-cols-1 gap-3 px-4 py-6 mx-auto md:grid-cols-2 lg:grid-cols-3 md:gap-6 max-w-7xl ">
          {posts.map((post) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="border-[1px] border-secondaryColor border-opacity-40 h-[450px] group ">
                <div className="w-full overflow-hidden h-3/5 ">
                  <Image
                    width={300}
                    height={350}
                    src={urlFor(post.mainImage).url()!}
                    alt="image"
                    className="object-cover w-full h-full transition-all duration-300 brightness-75 group-hover:brightness-100 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center w-full h-2/5">
                  <div className="flex justify-between items-center px-4 py-1 border-b-[1px] border-b-gray-500">
                    <p>{post.title}</p>
                    <img
                      className="object-cover w-12 rounded-full h12"
                      src={urlFor(post.author.image).url()!}
                      alt="authorImg"
                    />
                  </div>
                  <p className="px-4 py-2 text-base">
                    {post.description.substring(0, 60)}...by -
                    <span className="font-semibold">{post.author.name}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Footer />
      </main>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type=="post"]{
  id,
    title,
    author -> {
      name,image
    },
       description,mainImage,slug
    
}`

  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
