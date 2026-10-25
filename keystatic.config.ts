import { config, fields, collection, singleton } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const status = fields.select({
  label: 'Status',
  description: 'Only "Published" items appear on the public site.',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
  defaultValue: 'draft',
});

export default config({
  storage:
    repo && (process.env.NODE_ENV === 'production' || process.env.KEYSTATIC_STORAGE === 'github')
      ? { kind: 'github', repo }
      : { kind: 'local' },

  ui: { brand: { name: 'Site admin' } },

  singletons: {
    about: singleton({
      label: 'About page',
      path: 'content/about',
      format: { data: 'json' },
      schema: {
        intro: fields.text({ label: 'Professional introduction', multiline: true }),
        background: fields.text({ label: 'Background and education', multiline: true }),
        interests: fields.text({ label: 'Technical interests', multiline: true }),
        journey: fields.text({ label: 'Professional journey', multiline: true }),
        philosophy: fields.text({ label: 'Career goals and philosophy', multiline: true }),
        learning: fields.text({ label: 'Currently learning', multiline: true }),
      },
    }),
    profile: singleton({
      label: 'Profile and site settings',
      path: 'content/profile',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({ label: 'Site name', defaultValue: 'Philant Technologies' }),
        name: fields.text({ label: 'Your name', defaultValue: '[Your Name]' }),
        photo: fields.image({ label: 'Portrait photo', directory: 'public/images/profile', publicPath: '/images/profile/' }),
        photoAlt: fields.text({ label: 'Portrait alt text' }),
        tagline: fields.text({ label: 'Tagline', defaultValue: '[Your professional tagline]' }),
        bio: fields.text({ label: 'Short bio', multiline: true, defaultValue: '[Short biography. Replace with your own text.]' }),
        email: fields.text({ label: 'Public contact email' }),
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            url: fields.url({ label: 'URL' }),
          }),
          { label: 'Professional profiles', itemLabel: (p) => p.fields.label.value },
        ),
        skillGroups: fields.array(
          fields.object({
            category: fields.text({ label: 'Category' }),
            skills: fields.array(fields.text({ label: 'Skill' }), { label: 'Skills', itemLabel: (t) => t.value }),
          }),
          { label: 'Skill groups', itemLabel: (g) => g.fields.category.value },
        ),
        experience: fields.array(
          fields.object({
            title: fields.text({ label: 'Job title' }),
            organization: fields.text({ label: 'Organization' }),
            period: fields.text({ label: 'Period (for example: Oct 2023 to May 2026)' }),
            highlights: fields.array(fields.text({ label: 'Highlight', multiline: true }), { label: 'Highlights', itemLabel: (h) => h.value.slice(0, 60) }),
          }),
          { label: 'Experience', itemLabel: (e) => `${e.fields.title.value} at ${e.fields.organization.value}` },
        ),
        education: fields.array(
          fields.object({
            degree: fields.text({ label: 'Degree' }),
            institution: fields.text({ label: 'Institution' }),
            completed: fields.text({ label: 'Completed (for example: May 2022)' }),
          }),
          { label: 'Education', itemLabel: (e) => e.fields.degree.value },
        ),
        certifications: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            issuer: fields.text({ label: 'Issuing organization', defaultValue: 'Microsoft' }),
            earned: fields.date({ label: 'Date earned' }),
            expires: fields.date({ label: 'Expiration (optional)' }),
            credentialId: fields.text({ label: 'Credential ID' }),
            credentialUrl: fields.url({ label: 'Credential URL' }),
          }),
          { label: 'Certifications', itemLabel: (c) => c.fields.name.value },
        ),
      },
    }),
  },

  collections: {
    categories: collection({
      label: 'Categories',
      slugField: 'name',
      path: 'content/categories/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
      },
    }),

    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'content/articles/*/',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ label: 'Subtitle' }),
        status,
        kind: fields.select({
          label: 'Type',
          options: [
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Publication', value: 'publication' },
            { label: 'Case study', value: 'case-study' },
            { label: 'Reflection', value: 'reflection' },
          ],
          defaultValue: 'publication',
        }),
        isDemo: fields.checkbox({ label: 'Demo content', description: 'Shows a "Demo content" label. Untick when replaced with real writing.', defaultValue: false }),
        publishedAt: fields.date({ label: 'Publication date' }),
        updatedAt: fields.date({ label: 'Last updated' }),
        summary: fields.text({ label: 'Summary (used in cards, search and SEO)', multiline: true, validation: { length: { max: 300 } } }),
        category: fields.relationship({ label: 'Category', collection: 'categories' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (t) => t.value }),
        featured: fields.checkbox({ label: 'Featured on homepage' }),
        coverImage: fields.image({ label: 'Cover image', directory: 'public/images/articles', publicPath: '/images/articles/' }),
        coverAlt: fields.text({ label: 'Cover image alt text' }),
        body: fields.markdoc({
          label: 'Body',
          components: {
            callout: block({
              label: 'Callout',
              schema: {
                type: fields.select({ label: 'Style', options: [{ label: 'Note', value: 'note' }, { label: 'Warning', value: 'warning' }], defaultValue: 'note' }),
                content: fields.child({ kind: 'block', placeholder: 'Callout text', formatting: 'inherit', links: 'inherit' }),
              },
            }),
          },
        }),
      },
    }),

    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*/',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        status,
        stage: fields.select({
          label: 'Project stage',
          options: [
            { label: 'In progress', value: 'in-progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Experimental', value: 'experimental' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'completed',
        }),
        isDemo: fields.checkbox({ label: 'Demo content', defaultValue: false }),
        featured: fields.checkbox({ label: 'Featured on homepage' }),
        summary: fields.text({ label: 'Short description', multiline: true }),
        role: fields.text({ label: 'My role' }),
        technologies: fields.array(fields.text({ label: 'Technology' }), { label: 'Technologies', itemLabel: (t) => t.value }),
        repoUrl: fields.url({ label: 'Repository URL' }),
        demoUrl: fields.url({ label: 'Demo URL' }),
        coverImage: fields.image({ label: 'Cover image', directory: 'public/images/projects', publicPath: '/images/projects/' }),
        coverAlt: fields.text({ label: 'Cover image alt text' }),
        body: fields.markdoc({ label: 'Case study (problem, approach, implementation, verified outcomes)' }),
      },
    }),

    resources: collection({
      label: 'Presentations and resources',
      slugField: 'title',
      path: 'content/resources/*/',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        status,
        isDemo: fields.checkbox({ label: 'Demo content', defaultValue: false }),
        type: fields.select({
          label: 'Resource type',
          options: [
            { label: 'Presentation', value: 'presentation' },
            { label: 'PDF document', value: 'pdf' },
            { label: 'Diagram', value: 'diagram' },
            { label: 'Template or checklist', value: 'template' },
            { label: 'Sample code', value: 'code' },
          ],
          defaultValue: 'presentation',
        }),
        collectionName: fields.text({ label: 'Collection (group name)' }),
        publishedAt: fields.date({ label: 'Publication date' }),
        summary: fields.text({ label: 'Short description', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (t) => t.value }),
        file: fields.file({ label: 'File (PDF recommended)', directory: 'public/files', publicPath: '/files/' }),
        thumbnail: fields.image({ label: 'Thumbnail', directory: 'public/images/resources', publicPath: '/images/resources/' }),
        body: fields.markdoc({ label: 'Written explanation' }),
      },
    }),
  },
});
