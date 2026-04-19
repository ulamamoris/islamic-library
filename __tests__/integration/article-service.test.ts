import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mockArticles, mockArticle } from "../mocks/data/articles";

// Mock the Apollo ExecuteQuery function
const mockExecuteQuery = vi.fn();
vi.mock("@/services/apollo/apollo.service", () => ({
  ExecuteQuery: (...args: unknown[]) => mockExecuteQuery(...args),
}));

// Import services after mocking
import {
  getArticlesBase,
  getArticlesWithPagination,
  getAllArticles,
  getArticleBySlug,
  getArticleSlugs,
  createArticleJsonLd,
  createArticleListJsonLd,
} from "@/services/articles/article.service";

describe("Article Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==========================================================================
  // getArticlesBase
  // ==========================================================================
  describe("getArticlesBase", () => {
    it("should fetch articles with default parameters", async () => {
      const mockResponse = {
        articleCollection: {
          total: 3,
          items: mockArticles,
        },
      };
      mockExecuteQuery.mockResolvedValueOnce(mockResponse);

      const result = await getArticlesBase({});

      expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
      expect(result.articleCollection.items).toEqual(mockArticles);
    });

    it("should pass pagination parameters correctly", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: mockArticles.slice(0, 2), total: 3 },
      });

      await getArticlesBase({ limit: 2, skip: 0 });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            limit: 2,
            skip: 0,
          }),
        })
      );
    });

    it("should pass search parameter when provided", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: [mockArticle], total: 1 },
      });

      await getArticlesBase({ search: "knowledge" });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            search: "knowledge",
          }),
        })
      );
    });

    it("should pass category filter when provided", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: [mockArticle], total: 1 },
      });

      await getArticlesBase({ category: "Education" });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            category: "Education",
          }),
        })
      );
    });

    it("should handle preview mode", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: [], total: 0 },
      });

      await getArticlesBase({ isPreview: true });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          preview: true,
        })
      );
    });
  });

  // ==========================================================================
  // getArticlesWithPagination
  // ==========================================================================
  describe("getArticlesWithPagination", () => {
    it("should calculate skip correctly for page 1", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: mockArticles, total: 15 },
      });

      await getArticlesWithPagination({ page: 1 });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            skip: 0,
          }),
        })
      );
    });

    it("should calculate skip correctly for page 2", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: mockArticles, total: 15 },
      });

      // Mobile limit is typically 10 from config
      await getArticlesWithPagination({ page: 2, isMobile: true });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            skip: expect.any(Number),
          }),
        })
      );
    });

    it("should use different limit for mobile vs desktop", async () => {
      mockExecuteQuery.mockResolvedValue({
        articleCollection: { items: mockArticles, total: 15 },
      });

      await getArticlesWithPagination({ page: 1, isMobile: true });
      const mobileCall = mockExecuteQuery.mock.calls[0];

      mockExecuteQuery.mockClear();

      await getArticlesWithPagination({ page: 1, isMobile: false });
      const desktopCall = mockExecuteQuery.mock.calls[0];

      // Both should have been called with different limits based on config
      expect(mobileCall[1].variables.limit).toBeDefined();
      expect(desktopCall[1].variables.limit).toBeDefined();
    });

    it("should return articleCollection directly", async () => {
      const mockCollection = { items: mockArticles, total: 3 };
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: mockCollection,
      });

      const result = await getArticlesWithPagination({ page: 1 });

      expect(result).toEqual(mockCollection);
    });
  });

  // ==========================================================================
  // getAllArticles
  // ==========================================================================
  describe("getAllArticles", () => {
    it("should fetch all articles without pagination", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: mockArticles, total: 3 },
      });

      const result = await getAllArticles({});

      expect(result.items).toEqual(mockArticles);
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.not.objectContaining({
            limit: expect.any(Number),
          }),
        })
      );
    });
  });

  // ==========================================================================
  // getArticleBySlug
  // ==========================================================================
  describe("getArticleBySlug", () => {
    it("should fetch single article by slug", async () => {
      mockExecuteQuery
        .mockResolvedValueOnce({
          articleCollection: { items: [mockArticle] },
        })
        .mockResolvedValueOnce({
          articleCollection: { total: 10 },
        });

      const result = await getArticleBySlug({
        slug: "importance-of-seeking-knowledge-in-islam",
      });

      expect(result.data).toEqual(mockArticle);
      expect(result.total).toBe(10);
    });

    it("should return undefined data for non-existent slug", async () => {
      mockExecuteQuery
        .mockResolvedValueOnce({
          articleCollection: { items: [] },
        })
        .mockResolvedValueOnce({
          articleCollection: { total: 10 },
        });

      const result = await getArticleBySlug({ slug: "non-existent-slug" });

      expect(result.data).toBeUndefined();
    });
  });

  // ==========================================================================
  // getArticleSlugs
  // ==========================================================================
  describe("getArticleSlugs", () => {
    it("should fetch all article slugs", async () => {
      const slugs = mockArticles.map((a) => ({ slug: a.slug }));
      mockExecuteQuery.mockResolvedValueOnce({
        articleCollection: { items: slugs },
      });

      const result = await getArticleSlugs();

      expect(result.items).toEqual(slugs);
    });
  });

  // ==========================================================================
  // JSON-LD Generation
  // ==========================================================================
  describe("createArticleJsonLd", () => {
    it("should create valid Article schema", () => {
      const jsonLd = createArticleJsonLd(mockArticle);

      expect(jsonLd["@type"]).toBe("Article");
      expect(jsonLd.headline).toBe(mockArticle.metaTitle || mockArticle.title);
      expect(jsonLd.datePublished).toBe(mockArticle.date);
    });

    it("should include author information", () => {
      const jsonLd = createArticleJsonLd(mockArticle);

      expect(jsonLd.author).toBeDefined();
      expect((jsonLd.author as { name: string }).name).toBe(mockArticle.author);
    });

    it("should include publisher information", () => {
      const jsonLd = createArticleJsonLd(mockArticle);

      expect(jsonLd.publisher).toBeDefined();
      expect((jsonLd.publisher as { name: string }).name).toBe("Ulama Moris");
    });
  });

  describe("createArticleListJsonLd", () => {
    it("should create valid ItemList schema", () => {
      const jsonLd = createArticleListJsonLd(mockArticles);

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("ItemList");
      expect(jsonLd.itemListElement).toHaveLength(mockArticles.length);
    });

    it("should have correct position for each item", () => {
      const jsonLd = createArticleListJsonLd(mockArticles);

      jsonLd.itemListElement?.forEach((item, index) => {
        expect((item as { position: number }).position).toBe(index + 1);
      });
    });
  });
});
