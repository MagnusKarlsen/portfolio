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
6. Keep `draft: true` while writing. Remove `placeholder: true` once you add your real project content and set `draft: false` to show it. Commit and push to GitHub to update the website.

The ten `Tom` folders and the example are hidden drafts. Their files remain here for you to fill in later. Remove unused headings and placeholders as you write. Images can also live in a subfolder, for example `./photos/assembly.jpg`.
