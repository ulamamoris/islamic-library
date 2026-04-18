import { gql } from "@apollo/client";

export default gql`query GetArticles (
  $search: String, 
  $category: String,
  $limit: Int, 
  $skip: Int
) {
  articleCollection (
    where: {
      title_contains: $search,
      category_contains: $category
    },
    limit: $limit, 
    skip: $skip,
    order: date_DESC
  ) {
    total
    items {
      ...ArticleFields
    }
  }
}`
