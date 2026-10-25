# Philant Technologies: personal website, blog, and portfolio

Next.js 16 + TypeScript. Content lives as Markdown/JSON files in this repo and is edited through the Keystatic admin at `/keystatic`. There is no database.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000, admin at /keystatic
```

Other commands: `npm run typecheck`, `npm test`, `npm run build`.

## How content works

| Content | Folder | Edited in admin under |
| --- | --- | --- |
| Articles | `content/articles/<slug>/` | Articles |
| Projects | `content/projects/<slug>/` | Projects |
| Presentations and resources | `content/resources/<slug>/` | Presentations and resources |
| Categories | `content/categories/` | Categories |
| Site name, bio, links, skills, certifications | `content/profile.json` | Profile and site settings |
| About page sections | `content/about.json` | About page |

Status controls visibility: only **Published** items appear publicly. **Draft** and **Archived** items are excluded from pages, search, the sitemap, and the RSS feed. Items marked **Demo content** show a label. Untick it when you replace the text.

New categories and tags are data. Add a category in the admin, then pick it in an article. Tags are typed per article. No code change is needed.

## Publish your first article

1. Open `/keystatic` and choose **Articles**, then **Create entry**.
2. Fill in the title, summary, category, tags, and body. Set **Publication date**.
3. Set Status to **Published** and save. In production, saving commits to GitHub.
4. Vercel rebuilds automatically. The article is live in about a minute or two.

To preview before publishing, leave it as Draft and run the site locally (`npm run dev`), where drafts are still hidden publicly, so preview by temporarily setting Published on a branch. A true draft preview mode is not built yet.

## Environment variables

See `.env.example`. Never commit `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your live URL, used for canonical links, sitemap, and feed |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` | `owner/repo` the admin commits to |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` | Created by the Keystatic GitHub App setup |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form delivery |

The admin and its API return 404 in production unless `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` is set.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Backup and export

All content is in Git, so every GitHub clone is a full backup. To export, copy the `content/`, `public/images/`, and `public/files/` folders. Files are Markdown (`.mdoc`) and JSON, so they migrate to another system easily.

## Updating dependencies

```bash
npm outdated
npm update
npm audit
npm run typecheck && npm test && npm run build
```

Commit only if all pass.

## Known limitations

- Scheduled publishing is not built.
- The contact form rate limit is in-memory per server instance. It has no bot challenge yet.
- No newsletter, social preview images, or favicon yet.
- Automated tests cover form validation and the rate limiter only.
