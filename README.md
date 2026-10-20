# Gau Maitry (गौ मैत्री) – Store Setup Guide (Windows 11)

## Folder structure
```
gau-maitry/
├── index.html        (page content)
├── css/style.css     (design)
├── js/config.js      (YOUR SETTINGS: prices, WhatsApp, contact)
├── js/app.js         (cart + WhatsApp logic – no need to edit)
└── assets/
    ├── loban-sambrani.jpg   <- put your Loban photo here
    └── guggul-sambrani.jpg  <- put your Guggul photo here
```

## 1. Put your photos in place
Copy your two real package photos into the `assets` folder and rename them EXACTLY:
`loban-sambrani.jpg` and `guggul-sambrani.jpg` (lowercase). If your files are .png or .jpeg, either convert/rename to .jpg or change the `image:` line in `js/config.js`. Until then, the site shows a "Add photo" box. Square photos look best; under 500 KB keeps the site fast.

## 2. Open in Visual Studio Code
1. Install VS Code (free) from code.visualstudio.com if needed.
2. Copy the `gau-maitry` folder to e.g. `C:\Users\YourName\Documents`.
3. VS Code → File → Open Folder → choose `gau-maitry`.

## 3. Run locally
Easiest: install the free **Live Server** extension (Extensions icon → search "Live Server" → Install), then right-click `index.html` → **Open with Live Server**. (Double-clicking index.html also works.)

## 4. Edit settings (only js/config.js)
- **WhatsApp number:** change `"91XXXXXXXXXX"` to 91 + your 10-digit number, digits only (no + or spaces).
- **Price:** change `price: null` to e.g. `price: 120` for that product only. Each product is independent. `null` = "Price to be confirmed".
- **Delivery charge:** leave `null` until confirmed, then enter a number (0 for free delivery).
- **Phone/email:** fill `phoneDisplay` and `email`. Leave "" to show placeholders.
Save the file (Ctrl+S) and refresh the browser.

## 5. Test checklist
- [ ] Both photos show (no "Add photo" boxes)
- [ ] Mobile menu opens (narrow the browser window)
- [ ] Add each product, add both, change quantities, remove, cart count updates
- [ ] Refresh the page: cart is still there
- [ ] Empty cart shows the empty message; Continue Shopping works
- [ ] With null prices: cart warns "price to be confirmed", no total shown
- [ ] With a price set: subtotal appears; total only if delivery charge is set and all prices are set
- [ ] Checkout with empty fields shows error messages; valid details open WhatsApp
- [ ] WhatsApp opens the right number with message filled in; check it before pressing Send
- [ ] Buy Now, card "Order on WhatsApp", header WhatsApp, enquiry form all work
- [ ] Footer links all jump to sections

## 6. Publish free (GitHub Pages)
1. Create a free account at github.com.
2. Click **+ → New repository**, name it `gau-maitry`, set **Public**, Create.
3. Click "uploading an existing file", drag in everything INSIDE the `gau-maitry` folder (index.html, css, js, assets), then **Commit changes**.
4. Repository **Settings → Pages** → Source: "Deploy from a branch" → Branch: `main`, folder `/ (root)` → Save.
5. After 1–2 minutes the page shows your link: `https://YOUR-USERNAME.github.io/gau-maitry/`.
(Cloudflare Pages and Netlify also offer free static hosting.)

**Update later:** edit files, then in the repository click the file → pencil icon → Commit, or upload again with "Add file → Upload files". Changes go live in about a minute.

## Free hosting limits
- No backend: orders are NOT stored anywhere and no online payment is possible. Every order is finalised by the customer pressing Send in WhatsApp.
- Prices and settings are visible in the website code (normal for static sites). Never put private information in these files.
- Free address is `github.io`. A custom domain (e.g. gaumaitry.in) needs buying separately from a registrar; connecting it to GitHub Pages is free.
- Cart is saved only in each customer's own browser.
