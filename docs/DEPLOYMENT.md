# Deployment guide

Accounts you create yourself: GitHub, Vercel, Resend (for contact email), and a domain registrar. Check each service's current pricing and limits before relying on a free plan.

## 1. Put the code on GitHub

1. On GitHub, create an empty repository named `philant-technologies` under `patmensa39` (no README).
2. From the project folder:
   ```bash
   git remote add origin https://github.com/patmensa39/philant-technologies.git
   git branch -M main
   git push -u origin main
   ```
   If your repo name differs, change `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` to match.

## 2. Create the admin's GitHub App (one time)

Keystatic signs you in through a GitHub App, so only people with write access to the repo can edit.

1. In `.env.local`, set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=patmensa39/philant-technologies` and `KEYSTATIC_STORAGE=github`.
2. Run `npm run dev` and open `/keystatic`. Follow the prompt to create the GitHub App. It writes the client ID, client secret, and secret into `.env.local`.
3. Remove `KEYSTATIC_STORAGE` afterward to go back to local editing.

Follow Keystatic's current documentation if the prompts differ. This flow has not been run here.

## 3. Deploy on Vercel

1. Sign in to Vercel with GitHub and import the repository.
2. Add environment variables from `.env.local`: the Keystatic values, `NEXT_PUBLIC_SITE_URL`, and the contact variables.
3. Deploy. Every push to `main` now builds and deploys automatically.
4. In the GitHub App settings, add the callback URL `https://<your-domain>/api/keystatic/github/oauth/callback`.

## 4. Custom domain and HTTPS

Add the domain in Vercel, then set the DNS records Vercel shows at your registrar. Vercel issues HTTPS certificates automatically. Update `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.

## 5. Contact email

1. Create a Resend account and an API key. Verify your domain to send from your own address.
2. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (where messages arrive), and `CONTACT_FROM_EMAIL`.
3. Submit the form on the live site to confirm delivery. Until configured, the form tells visitors that delivery is unavailable.

## 6. Verify the live site

Check the homepage, blog, a project, a resource, search, contact, `/sitemap.xml`, `/robots.txt`, and `/feed.xml`. Confirm `/keystatic` asks you to sign in with GitHub. Submit the sitemap in Google Search Console.

## 7. Monitor

Use Vercel's logs and analytics. Rankings are not guaranteed. Recheck pages after launch.
