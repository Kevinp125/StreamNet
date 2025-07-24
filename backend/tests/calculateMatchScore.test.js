import { describe, it, expect } from 'vitest'
const { calcAgeScore } = require('../services/calculateMatchScore.js')

describe('calcAgeScore', () => {
  it('should return 2 when ages are within 2 years (very close)', () => {
    const user1 = { date_of_birth: '2000-01-01' }
    const user2 = { date_of_birth: '2001-01-01' } // 1 year difference
    
    expect(calcAgeScore(user1, user2)).toBe(2)
  })
})