# Deployment guide

Accounts you create yourself: GitHub, a hosting provider, Resend (contact email), and a domain registrar. Check each service's current pricing and terms before relying on a free plan.

## 0. Pick hosting (decide this first)

Vercel's free Hobby plan is limited to personal, non-commercial use, and Vercel defines commercial use as financial gain for anyone involved, including a paid consultant. A site that promotes consulting work under a company name is likely commercial, which needs Vercel Pro (about $20 per user per month; confirm on vercel.com/pricing). If that is not acceptable, other hosts can run Next.js; check their current terms before choosing.

## 1. Code on GitHub (done)

Repository: `patmensa39/philant-technologies`, branch `main`.

## 2. Deploy the site first, without the admin

1. Sign in to your host with GitHub and import the repository.
2. Add one environment variable: `NEXT_PUBLIC_SITE_URL` set to the site's address (use the temporary address the host gives you for now).
3. Deploy. The public site works. The admin stays switched off, which is intended, because the GitHub variables are not set yet.

## 3. Create the admin's GitHub App

Keystatic signs you in through a GitHub App, so only people with write access to the repo can edit.

1. On your computer, in the project folder, create a file named `.env.local` containing:
   ```
   NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=patmensa39/philant-technologies
   KEYSTATIC_STORAGE=github
   ```
2. Run `npm run dev`, open `http://localhost:3000/keystatic`, and follow the prompt to create a GitHub App. When it asks for the deployed site address, enter your live address from step 2.
3. Keystatic writes the generated values into a local `.env` file. That file is ignored by Git, so it is never committed.
4. Install the app on your repository when GitHub offers. Choosing only `philant-technologies` is safer than all repositories.

If the prompts differ from this, follow Keystatic's GitHub mode documentation. Do not paste secrets into chat or commit them.

## 4. Give the live site the admin settings

In your host's project settings, add these five variables, copying the values from the generated `.env`:

- `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` (`patmensa39/philant-technologies`)
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

Redeploy. Then open `/keystatic` on the live site and sign in with GitHub. Edit a Draft item and save to confirm it commits to GitHub and the site rebuilds.

## 5. Custom domain and HTTPS

Add your domain in the host, then set the DNS records it shows at your registrar. HTTPS certificates are issued automatically. Afterward:
- Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.
- Update the GitHub App's homepage and callback URLs to the final domain (GitHub App settings).

## 6. Contact email

1. Create a Resend account and an API key. Verify your domain to send from your own address.
2. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`, then redeploy.
3. Submit the form on the live site to confirm delivery. Until configured, the form tells visitors delivery is unavailable.

## 7. Verify the live site

Check the homepage, blog, a project, a resource, search, contact, `/sitemap.xml`, `/robots.txt`, and `/feed.xml`. Confirm `/keystatic` requires GitHub sign-in. Submit the sitemap in Google Search Console.

## 8. Monitor

Use the host's logs and analytics. Rankings are not guaranteed.
