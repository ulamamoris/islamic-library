import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mockBayaans, mockBayaan } from "../mocks/data/bayaans";

// Mock the Apollo ExecuteQuery function
const mockExecuteQuery = vi.fn();
vi.mock("@/services/apollo/apollo.service", () => ({
  ExecuteQuery: (...args: unknown[]) => mockExecuteQuery(...args),
}));

// Import services after mocking
import {
  getBayaansBase,
  getBayaansWithPagination,
  getAllBayaans,
  getBayaanBySlug,
  getBayaanSlug,
  GetBayaanById,
  createAudioJsonLd,
  createAudioListJsonLd,
} from "@/services/bayaans/bayaan.service";

describe("Bayaan Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ==========================================================================
  // getBayaansBase
  // ==========================================================================
  describe("getBayaansBase", () => {
    it("should fetch bayaans with default parameters", async () => {
      const mockResponse = {
        bayaanCollection: {
          total: 3,
          items: mockBayaans,
        },
      };
      mockExecuteQuery.mockResolvedValueOnce(mockResponse);

      const result = await getBayaansBase({});

      expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
      expect(result.bayaanCollection.items).toEqual(mockBayaans);
    });

    it("should pass pagination parameters correctly", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: mockBayaans.slice(0, 2), total: 3 },
      });

      await getBayaansBase({ limit: 2, skip: 0 });

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
        bayaanCollection: { items: [mockBayaan], total: 1 },
      });

      await getBayaansBase({ search: "dhikr" });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            search: "dhikr",
          }),
        })
      );
    });

    it("should handle date range filters", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: mockBayaans, total: 3 },
      });

      await getBayaansBase({
        startDate: "2024-01-01",
        endDate: "2024-02-01",
      });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            startDate: "2024-01-01",
          }),
        })
      );
    });

    it("should filter by type (local/international)", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: mockBayaans, total: 3 },
      });

      await getBayaansBase({ type: "local" });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            local: "local",
          }),
        })
      );
    });

    it("should handle preview mode", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: [], total: 0 },
      });

      await getBayaansBase({ isPreview: true });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          preview: true,
        })
      );
    });
  });

  // ==========================================================================
  // getBayaansWithPagination
  // ==========================================================================
  describe("getBayaansWithPagination", () => {
    it("should calculate skip correctly for page 1", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: mockBayaans, total: 25 },
      });

      await getBayaansWithPagination({ page: 1 });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            skip: 0,
          }),
        })
      );
    });

    it("should calculate skip correctly for subsequent pages", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: mockBayaans, total: 25 },
      });

      await getBayaansWithPagination({ page: 3, isMobile: true });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            skip: expect.any(Number),
          }),
        })
      );
    });

    it("should return bayaanCollection directly", async () => {
      const mockCollection = { items: mockBayaans, total: 3 };
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: mockCollection,
      });

      const result = await getBayaansWithPagination({ page: 1 });

      expect(result).toEqual(mockCollection);
    });
  });

  // ==========================================================================
  // getAllBayaans
  // ==========================================================================
  describe("getAllBayaans", () => {
    it("should fetch all bayaans without pagination", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: mockBayaans, total: 3 },
      });

      const result = await getAllBayaans({});

      expect(result.items).toEqual(mockBayaans);
    });

    it("should support type filtering", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: mockBayaans, total: 3 },
      });

      await getAllBayaans({ type: "international" });

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            local: "international",
          }),
        })
      );
    });
  });

  // ==========================================================================
  // getBayaanBySlug
  // ==========================================================================
  describe("getBayaanBySlug", () => {
    it("should fetch single bayaan by slug", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: {
          items: [mockBayaan],
          total: 10,
        },
      });

      const result = await getBayaanBySlug({ slug: "excellence-of-dhikr" });

      expect(result.data).toEqual(mockBayaan);
      expect(result.total).toBe(10);
    });

    it("should return undefined data for non-existent slug", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: [], total: 0 },
      });

      const result = await getBayaanBySlug({ slug: "non-existent-slug" });

      expect(result.data).toBeUndefined();
    });
  });

  // ==========================================================================
  // getBayaanSlug
  // ==========================================================================
  describe("getBayaanSlug", () => {
    it("should fetch all bayaan slugs", async () => {
      const slugs = mockBayaans.map((b) => ({ slug: b.slug }));
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: slugs },
      });

      const result = await getBayaanSlug();

      expect(result.items).toEqual(slugs);
    });

    it("should support type filtering for slugs", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaanCollection: { items: [] },
      });

      await getBayaanSlug(false, "local");

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            local: "local",
          }),
        })
      );
    });
  });

  // ==========================================================================
  // GetBayaanById
  // ==========================================================================
  describe("GetBayaanById", () => {
    it("should fetch bayaan by ID", async () => {
      mockExecuteQuery.mockResolvedValueOnce({
        bayaan: mockBayaan,
      });

      const result = await GetBayaanById("bayaan-test-1");

      expect(result).toEqual(mockBayaan);
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          variables: expect.objectContaining({
            id: "bayaan-test-1",
          }),
        })
      );
    });
  });

  // ==========================================================================
  // JSON-LD Generation
  // ==========================================================================
  describe("createAudioJsonLd", () => {
    const mockBayaanWithDetails = {
      ...mockBayaan,
      metaTitle: "Test Lecture Title",
      metaDescription: "Test description",
      audio: { url: "https://example.com/audio.mp3" },
      duration: "01:30:00",
      author: "Mufti Test Author",
      event: "Friday Lecture",
      date: "2024-02-01",
      masjid: {
        title: "Test Masjid, Port Louis",
        geoLink: "https://maps.google.com/test",
      },
    };

    it("should create valid AudioObject schema", () => {
      const jsonLd = createAudioJsonLd(mockBayaanWithDetails);

      expect(jsonLd["@type"]).toBe("AudioObject");
      expect(jsonLd.name).toBe(mockBayaanWithDetails.metaTitle);
      expect(jsonLd.contentUrl).toBe(mockBayaanWithDetails.audio.url);
    });

    it("should include author information without title prefix", () => {
      const jsonLd = createAudioJsonLd(mockBayaanWithDetails);

      expect(jsonLd.author).toBeDefined();
      // Should strip "Mufti" or "Mawlana" prefix
      expect((jsonLd.author as { name: string }).name).not.toContain("Mufti");
    });

    it("should include event information when available", () => {
      const jsonLd = createAudioJsonLd(mockBayaanWithDetails);

      expect(jsonLd.subjectOf).toBeDefined();
      expect((jsonLd.subjectOf as { "@type": string })["@type"]).toBe("Event");
    });

    it("should handle missing event gracefully", () => {
      const bayaanWithoutEvent = { ...mockBayaanWithDetails, event: null };
      const jsonLd = createAudioJsonLd(bayaanWithoutEvent);

      expect(jsonLd.subjectOf).toBeUndefined();
    });
  });

  describe("createAudioListJsonLd", () => {
    it("should create valid ItemList schema", () => {
      const jsonLd = createAudioListJsonLd(mockBayaans);

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("ItemList");
      expect(jsonLd.name).toBe("Latest Islamic lectures");
    });

    it("should include all items with positions", () => {
      const jsonLd = createAudioListJsonLd(mockBayaans);

      expect(jsonLd.itemListElement).toHaveLength(mockBayaans.length);
      jsonLd.itemListElement?.forEach((item, index) => {
        expect((item as { position: number }).position).toBe(index);
      });
    });
  });
});
