import { vi } from "vitest";

/**
 * Creates a mock ExecuteQuery function for testing services
 */
export function createMockExecuteQuery<T>(
  mockResponse: T,
  options: { shouldError?: boolean; errorMessage?: string } = {}
) {
  const { shouldError = false, errorMessage = "GraphQL Error" } = options;

  return vi.fn().mockImplementation(async () => {
    if (shouldError) {
      throw new Error(errorMessage);
    }
    return mockResponse;
  });
}

/**
 * Mock the entire Apollo service module
 */
export function mockApolloService() {
  return {
    ExecuteQuery: vi.fn(),
  };
}

/**
 * Create mock GraphQL response for article collection
 */
export function createArticleCollectionResponse(
  items: unknown[],
  total: number = items.length,
  skip: number = 0,
  limit: number = 10
) {
  return {
    articleCollection: {
      total,
      skip,
      limit,
      items,
    },
  };
}

/**
 * Create mock GraphQL response for bayaan collection
 */
export function createBayaanCollectionResponse(
  items: unknown[],
  total: number = items.length,
  skip: number = 0,
  limit: number = 10
) {
  return {
    bayaanCollection: {
      total,
      skip,
      limit,
      items,
    },
  };
}

/**
 * Create mock GraphQL error response
 */
export function createGraphQLErrorResponse(message: string = "An error occurred") {
  return {
    errors: [
      {
        message,
        locations: [{ line: 1, column: 1 }],
        path: ["query"],
      },
    ],
    data: null,
  };
}
