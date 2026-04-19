import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { AudioProvider } from "@/contexts/audio-context";

/**
 * Custom render function that wraps components with common providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  withAudioProvider?: boolean;
}

function createWrapper({ withAudioProvider = false }: CustomRenderOptions) {
  return function Wrapper({ children }: { children: ReactNode }) {
    if (withAudioProvider) {
      return <AudioProvider>{children}</AudioProvider>;
    }
    return <>{children}</>;
  };
}

function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): ReturnType<typeof render> {
  const { withAudioProvider, ...renderOptions } = options;

  return render(ui, {
    wrapper: createWrapper({ withAudioProvider }),
    ...renderOptions,
  });
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };

/**
 * Mock for Next.js router
 */
export const createMockRouter = (overrides = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: "/",
  query: {},
  asPath: "/",
  ...overrides,
});

/**
 * Mock for Next.js searchParams
 */
export const createMockSearchParams = (params: Record<string, string> = {}) => {
  return new URLSearchParams(params);
};

/**
 * Wait for async operations in tests
 */
export const waitForAsync = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create a mock audio track for testing
 */
export const createMockAudioTrack = (overrides = {}) => ({
  id: "test-track-1",
  src: "https://example.com/audio/test.mp3",
  title: "Test Track",
  author: "Test Author",
  ...overrides,
});
