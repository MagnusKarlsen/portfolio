# Your projects live here

Keep each project's text and images together in one folder:

```text
projects/
  underwater-scooter/
    index.md
    image.png
  Tom1/
    index.md
  ...
  Tom10/
    index.md
```

To start another project:

1. Use one of `Tom1`–`Tom10`, or copy an existing draft folder.
2. Rename the folder to a short name such as `my-project`. Its name defines `/projects/my-project/`.
3. Open `index.md` and change the title, description and text.
4. Drop images into that same folder. Add a cover with `cover: "./image.jpg"` and fill in `coverAlt`.
5. Add more images to the text with `![Describe the image](./another-image.jpg)`.
6. Remove `placeholder: true` once you add your real project content. Keep `draft: false` to show it, or set `draft: true` to hide it while writing. Commit and push to GitHub to update the website.

The ten `Tom` folders are visible on the home page as **Coming soon** and each opens its own project page. They contain no project claims. Remove unused headings and placeholders as you write. Images can also live in a subfolder, for example `./photos/assembly.jpg`.
