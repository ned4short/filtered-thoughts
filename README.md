# Filtered Thoughts

Ned's blog about games, cleaner air, web projects and side ideas.
Live address: https://filteredthoughts.nedwebservices.com

## Publishing on GitHub Pages
1. Create a new public repository on github.com (for example `filtered-thoughts`).
2. Upload every file and folder from this zip to the repository (drag and drop on the repository page, then "Commit changes").
3. In the repository, go to **Settings → Pages**, set the source to the `main` branch and the `/ (root)` folder, and save.
4. Point the subdomain at GitHub: in your domain settings for nedwebservices.com, add a **CNAME** record with the name `filteredthoughts` pointing to `<your-github-username>.github.io`.
5. Back in **Settings → Pages**, check that the custom domain shows `filteredthoughts.nedwebservices.com`, then tick **Enforce HTTPS** once it's available.
6. Add the site in Google Search Console and submit `https://filteredthoughts.nedwebservices.com/sitemap.xml`.

## Files
- `index.html` – home page with the latest posts
- `posts/` – one file per blog post
- `category/` – Games, Home Care, Web Projects, Ideas & Opinions
- `about.html` – about Ned
- `sitemap.xml`, `robots.txt` – help Google find every page
- `CNAME` – tells GitHub to serve the site at filteredthoughts.nedwebservices.com
