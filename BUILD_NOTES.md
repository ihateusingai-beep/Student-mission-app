# Build Notes — Student Mission App

## GitHub Pages (Legacy Build) — 2026-06-04

### ⚠️ 重要：Legacy Build = Source Files
GitHub Pages `build_type: legacy` 唔係 serving `dist/`，係 serving **整個 repo root**。
- 佢直接用 `index.html` (root) 而唔係 `dist/index.html`
- 所以 `index.html` 必須 commit上去

### ✅ 確認正常的配置

**vite.config.js** — 用於本地 `npm run dev` / `npm run preview`：
```js
base: '/Student-mission-app/',
```

**index.html (committed to repo)** — 發佈到 GitHub Pages 用：
```html
<link rel="icon" href="/Student-mission-app/dist/favicon.svg">
<link rel="manifest" href="/Student-mission-app/dist/manifest.json">
<script type="module" src="/Student-mission-app/dist/assets/index-DqcEv4pd.js"></script>
<link rel="stylesheet" href="/Student-mission-app/dist/assets/index-JywkKLxu.css">
```
所有 assets 路徑加 `dist/` prefix，因為 legacy build 會從 repo root serving。

### Build Workflow
```bash
npm run build          # generates dist/
npm run preview        # local preview at :4175
git add -A && git commit && git push  # trigger Pages rebuild
```

### 特別注意
- **唔好** 刪 `index.html` 或用 `dist/index.html` 覆寫佢，會搞亂 path
- **dist/ 全部野都 commit** 上去了（legacy build 需要）
- `vite.config.js` 的 `base` 唔需要改，佢只用於本地 preview
- GitHub Pages build 需要 ~90 秒，之後先睇到更新

### 以後有問題
如果 deploy 之後空白頁：
1. 檢查 `/Student-mission-app/dist/assets/*.js` 係咪 200
2. 如果 404，commit 的 `index.html` 路徑可能錯了
3. 對比 `dist/index.html` 的路徑，確保 committed `index.html` 有加 `dist/` prefix
