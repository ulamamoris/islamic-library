import { gql } from "@apollo/client";

export default gql`fragment ArticleFields on Article {
  sys {
    id
    publishedAt
  }
  title
  slug
  excerpt
  author
  date
  body {
    json
    links {
      assets {
        block {
          ...AssetsFields
        }
      }
    }
  }
  category
  tags
  metaTitle
  metaDescription
  coverImage {
    ...AssetsFields
  }
}`
