# Your projects live here

Keep each project's text and images together in one folder:

```text
projects/
  underwater-scooter/
    index.md
    image.png
  tesla-coil/
    index.md
  robot-hand/
    index.md
```

To start another project:

1. Open the matching named project folder, or create a new folder and copy `templates/project.md` into it as `index.md`.
2. Use a short folder name such as `my-project`. Its name defines `/projects/my-project/`.
3. Open `index.md` and change the title, description and text.
4. Drop images into that same folder. Add a cover with `cover: "./image.jpg"` and fill in `coverAlt`.
5. Add more images to the text with `![Describe the image](./another-image.jpg)`.
6. Remove `placeholder: true` once you add your real project content. Keep `draft: false` to show it, or set `draft: true` to hide it while writing. Commit and push to GitHub to update the website.

The eight named folders below are visible on the home page with their titles and space for future photos, and each opens its own project page. Only their titles have been supplied; all other content is a template.

| Project title | Folder |
| --- | --- |
| Tesla coil | `tesla-coil/` |
| Tesla coil (spark gap) | `tesla-coil-spark-gap/` |
| Taser / spark stick | `taser-spark-stick/` |
| Robot hand | `robot-hand/` |
| Solar panel | `solar-panel/` |
| Fuel cell | `fuel-cell/` |
| Electrolysis | `electrolysis/` |
| Night vision | `night-vision/` |

Underwater scooter and the labelled example are also visible. Remove unused headings and placeholders as you write. Images can also live in a subfolder, for example `./photos/assembly.jpg`.
