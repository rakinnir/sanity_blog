import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@sanity/client"

const client = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "to7l78yw",
  useCdn: true,
  token:
    process.env.SANITY_API_TOKEN ||
    "skuQtDoLFBLJEQd7DrxdgQm0Voxc53Cb3wGorozpkrQi5oy9BxW0LPbu10Yi22vmzTUeuNwWIYch4VYMkthq8RQrqVuVmpGgyQlTMPGZKpmHpfNidkKxQvOIaMbQQ1MI9W0FB2IZuarnOKLcgNJOAGjzrann5AaNghI4a74qL9cnuPmnEQ1H",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2022-11-16",
})

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = JSON.parse(req.body)

  try {
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
    })
  } catch (err) {
    return res.status(500).json({ message: "Couldn't submit comment", err })
  }
  console.log("comment submitted")

  return res.status(200).json({ message: "Comment submitted" })
}
