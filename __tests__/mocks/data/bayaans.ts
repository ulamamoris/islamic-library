/**
 * Mock bayaan (audio lecture) data for testing
 */

export const mockBayaan = {
  sys: {
    id: "bayaan-test-1",
    publishedAt: "2024-02-01T10:00:00Z",
  },
  title: "The Excellence of Dhikr",
  slug: "excellence-of-dhikr",
  description: "A comprehensive lecture on the virtues and methods of remembering Allah.",
  speaker: "Mufti Ismail Menk",
  date: "2024-02-01",
  duration: 3600, // 1 hour in seconds
  audioUrl: "https://example.com/audio/excellence-of-dhikr.mp3",
  category: "Spirituality",
  tags: ["Dhikr", "Remembrance", "Worship"],
  metaTitle: "The Excellence of Dhikr | Ulama Moris",
  metaDescription: "Listen to this enlightening lecture on the virtues of remembering Allah.",
  coverImage: {
    sys: { id: "bayaan-img-1" },
    title: "Dhikr Lecture",
    description: "Islamic lecture cover image",
    url: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&h=600&fit=crop",
    width: 800,
    height: 600,
  },
};

export const mockBayaans = [
  mockBayaan,
  {
    ...mockBayaan,
    sys: { id: "bayaan-test-2", publishedAt: "2024-01-25T10:00:00Z" },
    title: "Understanding Tawakkul",
    slug: "understanding-tawakkul",
    description: "What does it truly mean to put your trust in Allah?",
    speaker: "Sheikh Yasir Qadhi",
    duration: 2700,
    date: "2024-01-25",
  },
  {
    ...mockBayaan,
    sys: { id: "bayaan-test-3", publishedAt: "2024-01-20T10:00:00Z" },
    title: "The Night Journey",
    slug: "the-night-journey",
    description: "Exploring the miraculous journey of Isra and Mi'raj.",
    speaker: "Dr. Omar Suleiman",
    duration: 4500,
    date: "2024-01-20",
  },
];

export const mockBayaansPagination = {
  total: 25,
  skip: 0,
  limit: 10,
};

export const mockEmptyBayaansResponse = {
  data: {
    bayaanCollection: {
      total: 0,
      skip: 0,
      limit: 10,
      items: [],
    },
  },
};
