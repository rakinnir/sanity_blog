export type Post = {
  _id: Atring
  publishedAt: String
  title: String
  author: {
    name: string
    image: String
  }
  description: String
  mainImage: {
    asset: {
      url: String
    }
  }
  slug: {
    current: string
  }
  body: [boject]
}
