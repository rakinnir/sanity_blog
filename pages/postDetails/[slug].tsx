"use client"
import { GetStaticProps } from "next"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typing"
import PortableText from "react-portable-text"
import { SubmitHandler, useForm } from "react-hook-form"
import { useState } from "react"

type Props = {
  post: Post
}

type Input = {
  _id: string
  name: string
  email: string
  comment: string
}

const PostDetails = ({ post }: Props) => {
  console.log(post.comments)
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>()

  const onSubmit: SubmitHandler<Input> = (data) => {
    fetch("/api/createComment", {
      method: "Post",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
      })
      .catch((err) => {
        setSubmitted(false)
      })
  }

  return (
    <div>
      <Header />
      <img
        className="object-cover w-full h-96"
        src={urlFor(post.mainImage).url()!}
        alt="mainImage"
      />

      <div className="max-w-3xl mx-auto">
        <article className="w-full p-5 mx-auto bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primaryColor border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>
          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center gap-2">
            <img
              className="object-cover w-12 h-12 bg-red-400 bg-cover rounded-full"
              src={urlFor(post.author.image).url()!}
              alt="authorImg"
            />
            <p className="text-base font-bodyFont">
              Blog post by{" "}
              <span className="font-bold text-secondaryColor">
                {post.author.name} - Published at{" "}
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            </p>
          </div>
          <div className="mt-10 ">
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
              projectId={
                process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "to7l78yw"
              }
              content={post.body}
              serializers={{
                h1: ({ children }: any) => (
                  <h1 className="my-5 text-3xl font-bold font-titleFont">
                    {children}
                  </h1>
                ),
                h2: ({ children }: any) => (
                  <h1 className="my-5 text-2xl font-bold font-titleFont">
                    {children}
                  </h1>
                ),
                h3: ({ children }: any) => (
                  <h1 className="my-5 text-2xl font-bold font-titleFont">
                    {children}
                  </h1>
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc ">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-cyan-500 hover:underline">
                    {children}
                  </a>
                ),
                normal: ({ children }: any) => (
                  <p className="my-5">{children}</p>
                ),
              }}
            />
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border-[1px] border-secondaryColor" />
        <div>
          <p className="text-xs font-bold uppercase text-secondaryColor font-titleFont">
            Enjoyed this article?
          </p>
          <h3 className="text-3xl font-bold font-titleFont">
            Leave a Comment below!
          </h3>
          <hr className="py-3 mt-2" />
          <input
            type="hidden"
            {...register("_id")}
            name="_id"
            value={post._id}
          />

          <form
            className="flex flex-col gap-6 my-7"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="flex flex-col">
              <span className="text-base font-semibold font-titleFont">
                Name
              </span>
              <input
                {...register("name", { required: true })}
                type="text"
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                placeholder="Enter your name"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-base font-semibold font-titleFont">
                Email
              </span>
              <input
                {...register("email", { required: true })}
                type="email"
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                placeholder="Enter your email"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-base font-semibold font-titleFont">
                Comment
              </span>
              <textarea
                {...register("comment", { required: true })}
                className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor mb-5"
                placeholder="Enter your comments"
                rows={6}
              />
            </label>
            <button
              type="submit"
              className="w-full py-2 text-base font-semibold tracking-wider text-white uppercase duration-300 rounded-sm bg-bgColor font-titleFont hover:bg-secondaryColor"
            >
              submit
            </button>
          </form>
          <div>
            <h3 className="text-3xl font-semibold font-titleFont">Comments</h3>
            <hr />
            {post.comments.map((comment) => (
              <div key={comment._id}>
                <p>
                  <span className="text-secondaryColor">{comment.name}</span>{" "}
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PostDetails

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
    "comments":*[_type == "comment" && post._ref == ^._id && approved == true],
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
