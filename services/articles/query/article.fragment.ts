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
  content {
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
  coverImage {
    ...AssetsFields
  }
}`
