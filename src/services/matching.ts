import type { HelpRequest, User } from '@/types'

// ─── Matching engine ────────────────────────────────────────────────────────
// MVP matching: score requests against a user's skills / interests by
// category, tags and skills. The scoring interface is intentionally isolated
// so an AI-matching service can replace it without touching the UI.

export function matchScore(request: HelpRequest, user: User): number {
  let score = 0
  if (user.interests.includes(request.category)) score += 2
  const userSkills = user.skills.map((s) => s.toLowerCase())
  for (const tag of request.tags) {
    if (userSkills.some((s) => s.includes(tag.toLowerCase()) || tag.toLowerCase().includes(s))) score += 3
  }
  if (request.language && user.languages.includes(request.language)) score += 1
  return score
}

export function matchedRequests(requests: HelpRequest[], user: User): HelpRequest[] {
  return requests
    .filter((r) => r.status === 'open' && r.authorId !== user.id)
    .map((r) => ({ r, score: matchScore(r, user) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ r }) => r)
}

/** Recommend helpers for a request (used on the request detail page). */
export function matchedHelpers(request: HelpRequest, users: User[]): User[] {
  return users
    .filter((u) => u.id !== request.authorId)
    .map((u) => {
      let score = 0
      const skills = u.skills.map((s) => s.toLowerCase())
      if (u.interests.includes(request.category)) score += 2
      for (const tag of request.tags) {
        if (skills.some((s) => s.includes(tag.toLowerCase()) || tag.toLowerCase().includes(s))) score += 3
      }
      if (u.languages.includes(request.language)) score += 1
      score += u.rating / 10
      return { u, score }
    })
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score)
    .map(({ u }) => u)
    .slice(0, 4)
}
