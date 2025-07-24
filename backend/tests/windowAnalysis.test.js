import { describe, it, expect } from "vitest";
const { analyzeActivityWindows } = require('../services/windowAnalysis')

describe('analyzeActiveWindows', () => {
  it('should return most active window when user has morning activities', () => {
    const activities = [
      { created_at: '2024-01-01T06:00:00' }, // 6 AM
      { created_at: '2024-01-01T07:00:00' }, // 7 AM  
      { created_at: '2024-01-01T08:00:00' }, // 8 AM
    ];
    
    const result = analyzeActivityWindows(activities);
    expect(result.start).toBe(6);
    expect(result.end).toBe(9);
    expect(result.count).toBe(3);
  })



})