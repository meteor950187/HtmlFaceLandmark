# HtmlFaceLandmark

這個頁面來自我過去專案中的手機端人臉動作檢測功能。前端負責取得攝影機畫面、引導使用者完成動作並側錄，影像再交由後端進行後續比對。

此儲存庫保留前端實作，整理成可以獨立操作的 Demo；完成後下載影片，取代原專案的影像交付流程。

## 原始實作

- 整合 Google MediaPipe Tasks Vision 的 WebAssembly 執行環境與 FaceLandmarker，取得人臉特徵及眼部動作分數。
- 以固定分數門檻引導使用者看向鏡頭、右側、左側與下方。
- 使用 MediaRecorder 錄製攝影機串流，依瀏覽器支援度選擇 MP4 或 WebM。
- 配合既有專案的驗證流程；後端真人／身份比對不包含在本儲存庫內。

## Demo 版本與 AI 協作

原始功能來自過去的實際作品。這次使用 AI 協助精簡介面、補上 PC 操作、整理 Blob 收尾與下載、加入測試及 CI/CD 設定，讓原有功能方便獨立展示。

原本的分數門檻、單次達標觸發、2 秒等待與 2.5 秒成功過場均保留。側錄只包含攝影機影像，不含頁面文字或音訊；影片僅暫存於分頁，重新整理前需先下載。

## 本機執行

```bash
python -m http.server 8080
```

開啟 [http://localhost:8080/face4.html](http://localhost:8080/face4.html)，按「開始測試」並允許攝影機。

需要可用的攝影機、支援 MediaRecorder 的瀏覽器，以及用來載入 MediaPipe WASM／模型的網路連線。遠端部署須使用 HTTPS。

## 測試與打包

使用 Node.js 24，不需要安裝 npm 套件：

```bash
node scripts/check-page.cjs
node --test
node scripts/build-static.cjs
```

打包結果在 `dist/`，只包含 Demo 的 `index.html` 與相容原網址的 `face4.html`。原始頁面仍只有一份 `face4.html`。

## GitHub Actions 與 Pages

[CI and Pages](.github/workflows/ci-pages.yml) 在 push、Pull Request 或手動執行時檢查 JavaScript 語法、執行測試並打包。只有 `main` 通過檢查後才可部署。

啟用部署：

1. 在儲存庫 **Settings → Pages**，將 Source 設為 **GitHub Actions**。
2. 在 **Settings → Secrets and variables → Actions → Variables** 新增 `PAGES_DEPLOY_ENABLED`，值設為 `true`。
3. 將這份設定推送至 `main`，或在 Actions 選擇 `main` 手動執行工作流程。

使用 GitHub 內建的部署權限，不需要額外部署金鑰。尚未開啟部署開關時，CI 仍會正常執行。

GitHub Free 的 Pages 需要公開儲存庫；若保持私有，須使用支援私有儲存庫 Pages 的方案。程式碼可以先推送到私有儲存庫，待確認方案或更改可見性後再啟用 Pages。

## 驗證狀態

- 20 項自動化測試通過，涵蓋錄影收尾、授權恢復、下載格式、步驟計時與靜態打包。
- 已確認實際 MediaPipe WASM／模型可載入；受控 Chromium 流程可錄製、播放及下載 WebM／MP4。
- 已檢查 PC、手機尺寸與短視窗；實體攝影機及 iOS／Android 實機仍待確認。
- 遠端 CI 結果可在儲存庫的 Actions 頁面查看；Pages 未啟用前，部署工作會略過。

完整操作驗收項目見 [demo-e2e-checklist.md](demo-e2e-checklist.md)。
