# Restored files — Windows-incompatible filenames

These files exist in the Git repository (`HEAD`/origin) but **cannot be checked out on Windows** because their original names are illegal on Windows filesystems. Their contents were extracted from Git during the data restore and saved here under safe names so no data is lost.

| Safe name here | Original name in the repo |
| --- | --- |
| `AGENTS-uppercase.md` | `AGENTS.md` (case-collides with `agents.md` on Windows' case-insensitive filesystem; `agents.md` occupies the on-disk slot) |
| `bhubaneswar-puri-konark-tour-package.jpg` | `public/images/packages/index.php?startingPoint=Bhubaneswar&tourDur=4+Days+%2F+3+Nights&tourHotel=standard&tourHref=https%3A%2F%2Fwww.namasteindiatrip.com%2Fpuri-konark-tour-packages&tourId=137&tourName=Bhubaneswar+Puri+Konark+Tour+Package&tourPrice=13237.jpg` |
| `guwahati-temple-tour-with-meghalaya.jpg` | `public/images/packages/index.php?startingPoint=Guwahati&tourDur=3+Days+%2F+2+Nights&tourHotel=standard&tourHref=https%3A%2F%2Fwww.namasteindiatrip.com%2F3-days-guwahati-tour-package&tourId=103&tourName=Guwahati+Temple+Tour+With+Meghalaya&tourPrice=10695.jpg` |

Notes:

- The two `index.php?…jpg` files were saved by some script with URL query strings as filenames — they look like accidental scraping artifacts, not app assets. The app's real images use hashed names (`public/images/packages/<hash>.jpg`).
- **Recommended permanent fix:** delete these 2 files plus either `AGENTS.md` or `agents.md` from the repository (from GitHub's web UI, or on a case-sensitive OS such as Linux/macOS). Until then, `git pull`/`git checkout` on Windows may error on the two `?`-named paths. Deleting them is safe if the two images are unused.
- This folder is **untracked** — feel free to delete it once you've reviewed its contents.
