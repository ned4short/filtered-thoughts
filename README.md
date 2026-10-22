# Filtered Thoughts

Ned's blog about games, cleaner air, web projects and side ideas.
Live address (once set up): https://blog.nedworldwide.com

## Publishing on GitHub Pages
1. Create a new public repository on github.com (for example `filtered-thoughts`).
2. Upload every file and folder from this zip to the repository (drag and drop on the repository page, then "Commit changes").
3. In the repository, go to **Settings → Pages**, set the source to the `main` branch and the `/ (root)` folder, and save.
4. Point the subdomain at GitHub: in your domain settings for nedworldwide.com, add a **CNAME** record with the name `blog` pointing to `<your-github-username>.github.io`.
5. Back in **Settings → Pages**, check that the custom domain shows `blog.nedworldwide.com`, then tick **Enforce HTTPS** once it's available.
6. Add the site in Google Search Console and submit `https://blog.nedworldwide.com/sitemap.xml`.

## Files
- `index.html` – home page with the latest posts
- `posts/` – one file per blog post
- `category/` – Games, Home & Air, Web Projects, Ideas & Hobbies
- `about.html` – about Ned
- `sitemap.xml`, `robots.txt` – help Google find every page
- `CNAME` – tells GitHub to serve the site at blog.nedworldwide.com
