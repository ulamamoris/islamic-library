import { graphql, HttpResponse } from "msw";
import {
  mockArticles,
  mockArticle,
  mockArticlesPagination,
} from "./data/articles";
import { mockBayaans, mockBayaan, mockBayaansPagination } from "./data/bayaans";

// Contentful GraphQL endpoint
const contentfulGraphQL = graphql.link(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "test-space"}`
);

export const handlers = [
  // Articles Collection Query
  contentfulGraphQL.query("ArticlesCollection", ({ variables }) => {
    const { limit = 10, skip = 0 } = variables || {};

    return HttpResponse.json({
      data: {
        articleCollection: {
          total: mockArticlesPagination.total,
          skip,
          limit,
          items: mockArticles.slice(skip, skip + limit),
        },
      },
    });
  }),

  // Single Article Query
  contentfulGraphQL.query("ArticleBySlug", ({ variables }) => {
    const { slug } = variables || {};
    const article = mockArticles.find((a) => a.slug === slug) || mockArticle;

    return HttpResponse.json({
      data: {
        articleCollection: {
          items: [article],
        },
      },
    });
  }),

  // Bayaans Collection Query
  contentfulGraphQL.query("BayaansCollection", ({ variables }) => {
    const { limit = 10, skip = 0 } = variables || {};

    return HttpResponse.json({
      data: {
        bayaanCollection: {
          total: mockBayaansPagination.total,
          skip,
          limit,
          items: mockBayaans.slice(skip, skip + limit),
        },
      },
    });
  }),

  // Single Bayaan Query
  contentfulGraphQL.query("BayaanBySlug", ({ variables }) => {
    const { slug } = variables || {};
    const bayaan = mockBayaans.find((b) => b.slug === slug) || mockBayaan;

    return HttpResponse.json({
      data: {
        bayaanCollection: {
          items: [bayaan],
        },
      },
    });
  }),

  // Featured Content Query
  contentfulGraphQL.query("FeaturedContent", () => {
    return HttpResponse.json({
      data: {
        articleCollection: {
          items: mockArticles.slice(0, 3),
        },
        bayaanCollection: {
          items: mockBayaans.slice(0, 3),
        },
      },
    });
  }),
];

// Error handlers for testing error states
export const errorHandlers = {
  networkError: contentfulGraphQL.query("ArticlesCollection", () => {
    return HttpResponse.error();
  }),

  graphqlError: contentfulGraphQL.query("ArticlesCollection", () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Something went wrong",
          locations: [{ line: 1, column: 1 }],
          path: ["articleCollection"],
        },
      ],
    });
  }),

  emptyResponse: contentfulGraphQL.query("ArticlesCollection", () => {
    return HttpResponse.json({
      data: {
        articleCollection: {
          total: 0,
          skip: 0,
          limit: 10,
          items: [],
        },
      },
    });
  }),
};
