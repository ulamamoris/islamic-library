/**
 * Mock article data for testing
 */

export const mockArticle = {
  sys: {
    id: "article-test-1",
    publishedAt: "2024-01-15T10:00:00Z",
  },
  title: "The Importance of Seeking Knowledge in Islam",
  slug: "importance-of-seeking-knowledge-in-islam",
  excerpt:
    "Islam places great emphasis on the pursuit of knowledge. The Prophet Muhammad (peace be upon him) said, 'Seeking knowledge is an obligation upon every Muslim.'",
  author: "Maulana Ahmad",
  date: "2024-01-15",
  body: {
    json: {
      nodeType: "document",
      data: {},
      content: [
        {
          nodeType: "heading-2",
          data: {},
          content: [
            {
              nodeType: "text",
              value: "The Obligation of Seeking Knowledge",
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: "paragraph",
          data: {},
          content: [
            {
              nodeType: "text",
              value:
                "Islam is unique among world religions in its emphasis on knowledge.",
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
    links: {
      assets: {
        block: [],
      },
    },
  },
  category: "Education",
  tags: ["Knowledge", "Islam", "Learning", "Hadith"],
  metaTitle: "The Importance of Seeking Knowledge in Islam | Ulama Moris",
  metaDescription:
    "Discover why Islam places such great emphasis on seeking knowledge.",
  coverImage: {
    sys: { id: "img-1" },
    title: "Islamic Knowledge",
    description: "Books and Quran representing Islamic knowledge",
    url: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&h=600&fit=crop",
    width: 800,
    height: 600,
  },
};

export const mockArticles = [
  mockArticle,
  {
    ...mockArticle,
    sys: { id: "article-test-2", publishedAt: "2024-01-10T10:00:00Z" },
    title: "Understanding the Five Pillars of Islam",
    slug: "understanding-five-pillars-of-islam",
    excerpt: "The Five Pillars of Islam form the foundation of Muslim life.",
    category: "Fundamentals",
    date: "2024-01-10",
  },
  {
    ...mockArticle,
    sys: { id: "article-test-3", publishedAt: "2024-01-05T10:00:00Z" },
    title: "The Beautiful Names of Allah",
    slug: "beautiful-names-of-allah",
    excerpt: "Allah has revealed 99 beautiful names (Asma ul Husna).",
    category: "Aqeedah",
    date: "2024-01-05",
  },
];

export const mockArticlesPagination = {
  total: 15,
  skip: 0,
  limit: 10,
};

export const mockEmptyArticlesResponse = {
  data: {
    articleCollection: {
      total: 0,
      skip: 0,
      limit: 10,
      items: [],
    },
  },
};
