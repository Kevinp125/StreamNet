import { describe, it, expect } from "vitest";
const {
  calcAgeScore,
  calcGameScore,
  calcLanguageScore,
} = require("../services/calculateMatchScore.js");

describe("calcAgeScore", () => {
  it("should return 2 when ages are within 2 years (very close)", () => {
    const user1 = { date_of_birth: "2000-01-01" };
    const user2 = { date_of_birth: "2001-01-01" }; // 1 year difference

    expect(calcAgeScore(user1, user2)).toBe(2);
  });

  it("should return 1 when ages are within 5 years (close)", () => {
    const user1 = { date_of_birth: "2000-01-01" };
    const user2 = { date_of_birth: "2004-01-01" }; // 4 year difference

    expect(calcAgeScore(user1, user2)).toBe(1);
  });

  it("should return 0.5 when ages are within 10 years (somewhat close)", () => {
    const user1 = { date_of_birth: "2000-01-01" };
    const user2 = { date_of_birth: "2008-01-01" }; // 8 year difference

    expect(calcAgeScore(user1, user2)).toBe(0.5);
  });

  it("should return 0.25 when ages are more than 10 years apart", () => {
    const user1 = { date_of_birth: "2000-01-01" };
    const user2 = { date_of_birth: "2015-01-01" }; // 15 year difference

    expect(calcAgeScore(user1, user2)).toBe(0.25);
  });
});

describe("calcGameScore", () => {
  it("should return 2 when users play the same game", () => {
    const user1 = { twitch_game_name: "Fortnite" };
    const user2 = { twitch_game_name: "Fortnite" };

    expect(calcGameScore(user1, user2)).toBe(2);
  });

  it("should return 0.5 when users play different games", () => {
    const user1 = { twitch_game_name: "Fortnite" };
    const user2 = { twitch_game_name: "Minecraft" };

    expect(calcGameScore(user1, user2)).toBe(0.5);
  });

  it("should return 0.5 when user has no game data", () => {
    const user1 = { twitch_game_name: null };
    const user2 = { twitch_game_name: "Fortnite" };

    expect(calcGameScore(user1, user2)).toBe(0.5);
  });
});
