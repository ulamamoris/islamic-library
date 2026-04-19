import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  toISODuration,
  toTitleCase,
  formatTime,
  getWhatsAppLink,
  cleanDescription,
  createQueryString,
  sleep,
  arrayify,
} from "@/lib/utils";

describe("lib/utils", () => {
  // ==========================================================================
  // cn (className merge utility)
  // ==========================================================================
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional");
      expect(cn("base", false && "conditional")).toBe("base");
    });

    it("should merge Tailwind classes and resolve conflicts", () => {
      expect(cn("p-4", "p-6")).toBe("p-6");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("should handle arrays of classes", () => {
      expect(cn(["foo", "bar"])).toBe("foo bar");
    });

    it("should handle undefined and null values", () => {
      expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
    });

    it("should handle empty inputs", () => {
      expect(cn()).toBe("");
      expect(cn("")).toBe("");
    });
  });

  // ==========================================================================
  // toISODuration
  // ==========================================================================
  describe("toISODuration", () => {
    it("should convert HH:MM:SS format to ISO duration", () => {
      expect(toISODuration("01:30:45")).toBe("PT1H30M45S");
      expect(toISODuration("02:00:00")).toBe("PT2H0M0S");
    });

    it("should convert MM:SS format to ISO duration", () => {
      expect(toISODuration("30:45")).toBe("PT30M45S");
      expect(toISODuration("05:30")).toBe("PT5M30S");
    });

    it("should handle zero values", () => {
      expect(toISODuration("00:00:00")).toBe("PT0M0S");
      expect(toISODuration("00:00")).toBe("PT0M0S");
    });

    it("should return undefined for empty input", () => {
      expect(toISODuration("")).toBeUndefined();
    });

    it("should throw error for invalid format", () => {
      expect(() => toISODuration("invalid")).toThrow("Invalid time format");
      expect(() => toISODuration("1:2:3:4")).toThrow("Invalid time format");
    });
  });

  // ==========================================================================
  // toTitleCase
  // ==========================================================================
  describe("toTitleCase", () => {
    it("should convert string to title case", () => {
      expect(toTitleCase("hello world")).toBe("Hello World");
      expect(toTitleCase("HELLO WORLD")).toBe("Hello World");
    });

    it("should handle single word", () => {
      expect(toTitleCase("hello")).toBe("Hello");
    });

    it("should handle mixed case input", () => {
      expect(toTitleCase("hELLo WoRLd")).toBe("Hello World");
    });

    it("should return empty string as-is", () => {
      expect(toTitleCase("")).toBe("");
    });

    it("should handle non-string input gracefully", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(toTitleCase(null as any)).toBe(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(toTitleCase(undefined as any)).toBe(undefined);
    });
  });

  // ==========================================================================
  // formatTime
  // ==========================================================================
  describe("formatTime", () => {
    it("should format seconds to MM:SS", () => {
      expect(formatTime(0)).toBe("0:00");
      expect(formatTime(65)).toBe("1:05");
      expect(formatTime(125)).toBe("2:05");
    });

    it("should format to HH:MM:SS when over an hour", () => {
      expect(formatTime(3600)).toBe("1:00:00");
      expect(formatTime(3661)).toBe("1:01:01");
      expect(formatTime(7323)).toBe("2:02:03");
    });

    it("should handle decimal seconds", () => {
      expect(formatTime(65.7)).toBe("1:05");
      expect(formatTime(59.9)).toBe("0:59");
    });

    it("should handle invalid input", () => {
      expect(formatTime(NaN)).toBe("0:00");
      expect(formatTime(Infinity)).toBe("0:00");
      expect(formatTime(-Infinity)).toBe("0:00");
    });

    it("should pad seconds correctly", () => {
      expect(formatTime(9)).toBe("0:09");
      expect(formatTime(60)).toBe("1:00");
    });
  });

  // ==========================================================================
  // getWhatsAppLink
  // ==========================================================================
  describe("getWhatsAppLink", () => {
    const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://test-site.com";
    });

    afterEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    });

    it("should generate encoded WhatsApp link", () => {
      const result = getWhatsAppLink("/articles/test", "category=news");
      expect(result).toBe(
        encodeURIComponent("https://test-site.com/articles/test?category=news&reset=1")
      );
    });

    it("should include reset=1 parameter", () => {
      const result = getWhatsAppLink("/audio/lecture", "speaker=imam");
      expect(result).toContain(encodeURIComponent("reset=1"));
    });

    it("should return undefined for empty inputs", () => {
      expect(getWhatsAppLink("", "")).toBeUndefined();
    });

    it("should use default URL when env not set", () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      const result = getWhatsAppLink("/test", "q=1");
      expect(result).toContain(encodeURIComponent("ulama-moris.org"));
    });
  });

  // ==========================================================================
  // cleanDescription
  // ==========================================================================
  describe("cleanDescription", () => {
    it("should return empty string for empty paragraphs", () => {
      expect(cleanDescription("<p><br></p>")).toBe("");
      expect(cleanDescription("<p></p>")).toBe("");
    });

    it("should return the HTML for valid content", () => {
      expect(cleanDescription("<p>Hello World</p>")).toBe("<p>Hello World</p>");
    });

    it("should handle undefined input", () => {
      expect(cleanDescription(undefined)).toBe("");
    });

    it("should handle null-like input", () => {
      expect(cleanDescription("")).toBe("");
    });
  });

  // ==========================================================================
  // createQueryString
  // ==========================================================================
  describe("createQueryString", () => {
    it("should add new parameters", () => {
      const searchParams = new URLSearchParams("existing=value");
      const result = createQueryString(searchParams, { new: "param" });
      expect(result).toContain("existing=value");
      expect(result).toContain("new=param");
    });

    it("should update existing parameters", () => {
      const searchParams = new URLSearchParams("key=old");
      const result = createQueryString(searchParams, { key: "new" });
      expect(result).toBe("key=new");
    });

    it("should remove parameters when value is null", () => {
      const searchParams = new URLSearchParams("keep=yes&remove=me");
      const result = createQueryString(searchParams, { remove: null });
      expect(result).toBe("keep=yes");
      expect(result).not.toContain("remove");
    });

    it("should handle multiple updates", () => {
      const searchParams = new URLSearchParams("a=1");
      const result = createQueryString(searchParams, {
        b: "2",
        c: "3",
        a: null,
      });
      expect(result).toContain("b=2");
      expect(result).toContain("c=3");
      expect(result).not.toContain("a=1");
    });

    it("should handle empty searchParams", () => {
      const searchParams = new URLSearchParams("");
      const result = createQueryString(searchParams, { new: "value" });
      expect(result).toBe("new=value");
    });
  });

  // ==========================================================================
  // sleep
  // ==========================================================================
  describe("sleep", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should resolve after specified milliseconds", async () => {
      const promise = sleep(1000);
      vi.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
    });

    it("should not resolve before time elapses", async () => {
      let resolved = false;
      sleep(1000).then(() => {
        resolved = true;
      });

      vi.advanceTimersByTime(500);
      expect(resolved).toBe(false);

      vi.advanceTimersByTime(500);
      await Promise.resolve();
      expect(resolved).toBe(true);
    });
  });

  // ==========================================================================
  // arrayify
  // ==========================================================================
  describe("arrayify", () => {
    it("should return array as-is", () => {
      expect(arrayify(["a", "b"])).toEqual(["a", "b"]);
    });

    it("should wrap string in array", () => {
      expect(arrayify("single")).toEqual(["single"]);
    });

    it("should return empty array for undefined", () => {
      expect(arrayify(undefined)).toEqual([]);
    });

    it("should filter non-string items from array", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(arrayify(["valid", 123 as any, "also-valid"])).toEqual([
        "valid",
        "also-valid",
      ]);
    });

    it("should return empty array for empty string array", () => {
      expect(arrayify([])).toEqual([]);
    });
  });
});
