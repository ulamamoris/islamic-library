import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedCallback } from "@/hooks/use-debounce";

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should debounce function calls", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    // Call multiple times rapidly
    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });

    // Function should not have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should only have been called once with the last argument
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("c");
  });

  it("should use custom wait time", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 200));

    act(() => {
      result.current();
    });

    // Should not be called before wait time
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(callback).not.toHaveBeenCalled();

    // Should be called after wait time
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should provide cancel method", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current();
    });

    // Cancel before timeout
    act(() => {
      vi.advanceTimersByTime(250);
      result.current.cancel();
      vi.advanceTimersByTime(500);
    });

    // Should not have been called due to cancel
    expect(callback).not.toHaveBeenCalled();
  });

  it("should provide flush method to execute immediately", () => {
    const callback = vi.fn().mockReturnValue("result");
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("arg");
    });

    // Flush should execute immediately
    act(() => {
      result.current.flush();
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("arg");
  });

  it("should respect leading option", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, 500, [], { leading: true, trailing: false })
    );

    // First call should execute immediately with leading: true
    act(() => {
      result.current("first");
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first");

    // Subsequent calls within wait period should be ignored
    act(() => {
      result.current("second");
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cleanup on unmount", () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 500)
    );

    act(() => {
      result.current();
    });

    // Unmount before timeout
    unmount();

    // Advance timer after unmount
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Callback should not be called as debounce was cancelled on unmount
    expect(callback).not.toHaveBeenCalled();
  });

  it("should update when wait time changes", () => {
    const callback = vi.fn();
    let wait = 500;

    const { result, rerender } = renderHook(() =>
      useDebouncedCallback(callback, wait)
    );

    act(() => {
      result.current();
    });

    // Change wait time
    wait = 100;
    rerender();

    // Old timeout should be cancelled
    act(() => {
      result.current();
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should pass multiple arguments correctly", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current("arg1", "arg2", 123);
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  it("should maintain reference stability when dependencies unchanged", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(() =>
      useDebouncedCallback(callback, 500, [])
    );

    const firstRef = result.current;
    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });
});
