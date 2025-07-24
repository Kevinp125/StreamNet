import { describe, it, expect } from "vitest";
const { analyzeActivityWindows } = require("../services/windowAnalysis");

describe("analyzeActiveWindows", () => {
  it("should return most active window when user has morning activities", () => {
    const activities = [
      { created_at: "2024-01-01T06:00:00" }, // 6 AM
      { created_at: "2024-01-01T07:00:00" }, // 7 AM
      { created_at: "2024-01-01T08:00:00" }, // 8 AM
    ];

    const result = analyzeActivityWindows(activities);
    expect(result.start).toBe(6);
    expect(result.end).toBe(9);
    expect(result.count).toBe(3);
  });

  it("should return evening window when user has more evening activities than morning", () => {
    const activities = [
      { created_at: "2024-01-01T07:00:00" }, // 7 AM (6-9 window)
      { created_at: "2024-01-01T08:00:00" }, // 8 AM (6-9 window)
      { created_at: "2024-01-01T14:00:00" }, // 2 PM (12-15 window)
      { created_at: "2024-01-01T19:00:00" }, // 7 PM (18-21 window)
      { created_at: "2024-01-01T20:00:00" }, // 8 PM (18-21 window)
      { created_at: "2024-01-01T20:30:00" }, // 8:30 PM (18-21 window)
    ];

    const result = analyzeActivityWindows(activities);
    expect(result.start).toBe(18);
    expect(result.end).toBe(21);
    expect(result.count).toBe(3); // Most activities in evening window
  });
});
