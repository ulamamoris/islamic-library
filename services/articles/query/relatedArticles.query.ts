import { gql } from "@apollo/client";

export default gql`query RelatedArticles($currentSlug: String, $category: String, $tags: [String], $limit: Int, $skip: Int) {
  category: articleCollection(where: { slug_not: $currentSlug, category_contains: $category }, limit: $limit) {
    total
    items {
      ...ArticleFields
    }
  }

  tags: articleCollection(where: { slug_not: $currentSlug, tags_contains_some: $tags }, limit: $limit) {
    total
    items {
      ...ArticleFields
    }
  }

  random: articleCollection(where: { slug_not: $currentSlug }, limit: $limit, skip: $skip) {
    total
    items {
      ...ArticleFields
    }
  }
}`
