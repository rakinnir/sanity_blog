import { GetStaticProps } from "next"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typing"

type Props = {
  post: Post
}

function Post({ post }: Props) {
  console.log(post)
  return (
    <div>
      <Header />
      <img src={urlFor(post.mainImage).url()!} alt="mainImage" />
      <div className="py-20"></div>
      <Footer />
    </div>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
      _id,
      slug{
        current
          }   
}`

  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    publishedAt,
    title,
    author ->{name,image,},
    description,
    mainImage,
    slug,
    body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
