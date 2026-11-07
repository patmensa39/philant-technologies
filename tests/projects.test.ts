import { describe, expect, it } from 'vitest';
import { reader } from '../lib/content';

/** Every existing project file must still load with the current admin schema (including the case-study fields). */
describe('projects content', () => {
  it('reads every project, including those saved before the case-study fields existed', async () => {
    const all = await reader.collections.projects.all();
    expect(all.length).toBeGreaterThan(0);
    for (const p of all) {
      expect(typeof p.entry.title).toBe('string');
      expect(typeof p.entry.caseStudy.problem).toBe('string');
      expect(Array.isArray(p.entry.caseStudy.outcomes)).toBe(true);
    }
  });
});
