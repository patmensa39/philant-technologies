# Deployment guide

Accounts you create yourself: GitHub, a hosting provider, Resend (contact email), and a domain registrar. Check each service's current pricing and terms before relying on a free plan.

## 0. Pick hosting (decide this first)

Vercel's free Hobby plan is limited to personal, non-commercial use, and Vercel defines commercial use as financial gain for anyone involved, including a paid consultant. A site that promotes consulting work under a company name is likely commercial, which needs Vercel Pro (about $20 per user per month; confirm on vercel.com/pricing). If that is not acceptable, other hosts can run Next.js; check their current terms before choosing.

## 1. Code on GitHub (done)

Repository: `patmensa39/philant-technologies`, branch `main`.

## 2. Deploy the site first, without the admin

1. Sign in to your host with GitHub and import the repository.
2. Add one environment variable: `NEXT_PUBLIC_SITE_URL` set to the site's full address, for example `https://philant-technologies.vercel.app`. Without it, page links and social previews can point to the wrong address.
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

## 6. Contact email (required for the contact form to deliver)

The form sends each message through Resend and delivers it to `patmensa39@gmail.com`, with the visitor's address as the reply-to. Until the API key is set, the form shows visitors a clear error and sends nothing.

1. Create a Resend account at resend.com **using `patmensa39@gmail.com`**. Without a verified domain, Resend only delivers to the email address of your own Resend account, which is why this address matters.
2. In Resend, go to **API Keys** and create a key with permission to send emails. Copy it once; it is shown only at creation.
3. In Vercel, open **Project Settings**, then **Environment Variables**, and add `RESEND_API_KEY` with that key. Do not add `NEXT_PUBLIC_` to the name.
4. Redeploy the project (Deployments tab, the latest deployment, Redeploy) so the key takes effect.
5. Open the live Contact page, send yourself a test message, and check the Gmail inbox and spam folder. Messages sent from `onboarding@resend.dev` can land in spam at first. Mark one as "Not spam".

To send to other addresses, or to look more trustworthy to mail providers, verify a domain you own in Resend, then set `CONTACT_FROM_EMAIL` to an address on it. Resend's free plan has limits, so check its current pricing page.

If the form shows an error after setup, open Vercel, then **Logs**, and look for lines starting with `[contact]`. They name the cause without showing secrets.

## 7. Verify the live site

Check the homepage, blog, a project, a resource, search, contact, `/sitemap.xml`, `/robots.txt`, and `/feed.xml`. Confirm `/keystatic` requires GitHub sign-in. Submit the sitemap in Google Search Console.

## 8. Monitor

Use the host's logs and analytics. Rankings are not guaranteed.

## 9. Publications feeds (optional)

The Publications page lists this site's articles automatically. To also show articles from another publication, add its RSS or Atom address in the admin under Profile and site settings, then External publication feeds. Items refresh about once an hour. Addresses on private networks are blocked, and a source that fails shows a friendly notice while the rest still appear.
