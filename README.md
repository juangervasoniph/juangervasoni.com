# juangervasoni.com — Complete Site

## File structure
```
index.html          ← Main homepage
blog.html           ← Blog listing page
_redirects          ← Cloudflare Pages routing fix (DO NOT DELETE)
admin/
  index.html        ← CMS entry point
  config.yml        ← CMS config (UPDATE repo name here)
  seo-preview.js    ← Live SEO widget
blog/
  sample-post.md    ← Example post (delete when you have real ones)
_data/
  hero.json         ← Hero content
  about.json        ← About content
  services.json     ← Services content
images/             ← Add your images here
  juan-gervasoni-profile.jpg   ← Your profile photo
  icon-linkedin.svg
  icon-whatsapp.svg
  icon-email.svg
```

## Before uploading
1. Open admin/config.yml and replace:
   - YOUR_GITHUB_USERNAME
   - YOUR_REPO_NAME

## Images needed
Upload these to the images/ folder:
- juan-gervasoni-profile.jpg  (your photo, used in hero + about)
- icon-linkedin.svg
- icon-whatsapp.svg
- icon-email.svg

## Accessing the CMS
Visit https://juangervasoni.com/admin after setup is complete.
