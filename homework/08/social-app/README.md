# 社群平台 (Social App)

全程使用AI(OPENCODE)，
一個簡單的社群軟體專案，使用 Next.js App Router。

## 功能

- 發表貼文
- 按讚
- 留言

## 技術栈

- **前端**: Next.js 16 + React 19 + Tailwind CSS
- **後端**: Next.js API Routes (App Router)
- **資料儲存**: 記憶體儲存 (重新啟動會重置)

## 開始使用

```bash
# 安裝依賴
cd social-app
npm install

# 啟動開發伺服器
npm run dev
```

然後訪問 http://localhost:3000

## API 端點

- `GET /api/posts` - 取得所有貼文
- `POST /api/posts` - 發表新貼文
- `POST /api/posts/[id]/like` - 按讚
- `POST /api/posts/[id]/comment` - 發表留言

---

## 筆記與心得

### 專案架構
本專案採用 **Next.js 16 App Router** 架構，結合 React 19 和 Tailwind CSS 4。透過 Next.js 的 API Routes 功能實現後端 RESTful API，前後端整合在同一天專案中。

### 核心功能實作

1. **發文功能**
   - 使用 client-side 表單提交
   - 透過 `POST /api/posts` API 新增貼文
   - 發布成功後顯示動畫反饋

2. **按讚功能**
   - 支援單擊按讚鈕及雙擊圖片快速按讚
   - 雙擊時觸發愛心動畫效果 (愛心跳動動畫)
   - 使用 `likedPosts` Set 追蹤已按讚的貼文

3. **留言功能**
   - 支援展開/收起全部留言
   - Enter 鍵快速提交留言

4. **伺服器切換**
   - 設計可切換不同後端伺服器 (Next.js/Node.js/FastAPI/Rust)
   - 即時顯示各伺服器連線狀態

### 學習重點

- **Next.js App Router**: 學習使用 `src/app` 目錄結構和 API Routes
- **React 19**: 熟悉新的 use hook 和 concurrent features
- **Tailwind CSS 4**: 使用新版 CSS-first 設定方式 (不需 tailwind.config.js)
- **Client/Server Components**: 理解 `"use client"` 指令的使用場景

### 待改進事項

- 目前資料儲存於記憶體，重新啟動會重置 → 可考慮串接資料庫 (MongoDB/PostgreSQL)
- 缺乏使用者認證機制 → 可加入 NextAuth.js 或其他登入方案
- 圖片上傳功能僅有 UI，未實際串接 → 可實作圖片儲存至雲端儲存服務
- 缺少錯誤處理和 loading 狀態優化

### 心得

這個專案是學習現代 React 全端開發的良好起點。透過實作社群平台的核心功能 (發文、按讚、留言)，能夠掌握：
- 前後端分離的 API 設計
- React Hooks (useState, useEffect) 的使用
- Tailwind CSS 的響應式設計
- Next.js 的 SSR/CSR 混合模型

適合作為後續學習更複雜功能（如即時聊天、通知系統）的基礎。
