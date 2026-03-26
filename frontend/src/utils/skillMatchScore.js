/**
 * Calculate how well a user's skills match a job's required skills.
 * @param {string[]} userSkills - Array of skill names the user has
 * @param {string[]} jobSkills - Array of skill names required by the job
 * @returns {number} Match score 0-100
 */
export function calculateMatchScore(userSkills = [], jobSkills = []) {
  if (!jobSkills.length) return 0;
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));
  const matched = jobSkills.filter(s => userSet.has(s.toLowerCase()));
  return Math.round((matched.length / jobSkills.length) * 100);
}
