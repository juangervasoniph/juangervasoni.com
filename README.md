# juangervasoni.com — CMS Setup

## Folder structure added

```
admin/
  index.html        ← Decap CMS entry point
  config.yml        ← CMS configuration (collections, fields)
  seo-preview.js    ← Live SEO widget (Yoast-style sidebar)

blog/
  sample-post.md    ← Example post (delete after testing)

_data/
  hero.json         ← Hero section content
  about.json        ← About section content
  services.json     ← Services section content
```

## Setup steps

### 1. Edit config.yml
Open `admin/config.yml` and replace:
- `YOUR_GITHUB_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repo name

### 2. Push to GitHub
Upload all these files into your existing site repo.

### 3. Set up GitHub OAuth
1. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://juangervasoni.com`
3. Callback URL: `https://api.netlify.com/auth/done`
4. Save the Client ID and Client Secret

### 4. Add environment variables in Cloudflare Pages
Go to your Cloudflare Pages project → Settings → Environment Variables and add:
- `GITHUB_CLIENT_ID` = your GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` = your GitHub OAuth App Client Secret

### 5. Access the CMS
Visit `https://juangervasoni.com/admin` and log in with GitHub.

## Using the SEO widget
When writing a blog post in the CMS, click the **Preview** toggle in the top right.
You'll see a live sidebar with:
- SEO score (0–100)
- Real-time checks: title length, keyword usage, meta description, content length, keyword density
- Character counters with progress bars for title and description
- A live Google SERP snippet preview showing how your post will look in search results
