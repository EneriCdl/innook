# 部署指南 - 让任何设备都能访问

## 方法一：Vercel 部署（推荐，5分钟）

### 步骤 1：安装 Vercel CLI
```bash
npm install -g vercel
```

### 步骤 2：登录 Vercel
```bash
vercel login
```
会打开浏览器，用 GitHub/Google/Email 注册登录

### 步骤 3：部署
```bash
cd "d:/250913/code/learning house"
vercel
```

按提示操作：
- Set up and deploy? → Y
- Which scope? → 选你的账号
- Link to existing project? → N
- Project name? → innook（或直接回车）
- Directory? → 直接回车
- Override settings? → N

### 步骤 4：获得网址
部署成功后会显示：
```
✅  Production: https://innook-xxx.vercel.app
```

### 步骤 5：在 iPad 打开
iPad Safari 打开这个网址即可！

---

## 方法二：Netlify 部署

### 步骤 1：构建项目
```bash
npm run build
```

### 步骤 2：上传到 Netlify
1. 打开 https://app.netlify.com
2. 注册/登录
3. 把 `dist` 文件夹拖拽到页面上
4. 获得网址

---

## 方法三：GitHub Pages

### 步骤 1：创建 GitHub 仓库
1. 打开 https://github.com/new
2. 创建仓库 `innook`

### 步骤 2：上传代码
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/innook.git
git push -u origin main
```

### 步骤 3：配置 GitHub Pages
1. 进入仓库 → Settings → Pages
2. Source 选 `GitHub Actions`
3. 创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. 等待部署完成，访问 `https://你的用户名.github.io/innook`

---

## 推荐：Vercel 最简单

```bash
npm install -g vercel
vercel login
vercel
```

3 条命令，5 分钟搞定！
