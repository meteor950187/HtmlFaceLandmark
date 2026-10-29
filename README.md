# HtmlFaceLandmark

純 HTML／JavaScript 單頁，無後端服務、無影片上傳，也不需要安裝其他開發工具。

## 使用

直接用瀏覽器開啟 `face4.html`，允許攝影機權限，依提示完成四個動作後下載側錄影片。

- MediaPipe FaceLandmarker 的 WebAssembly 與模型由網路載入，因此需要網路連線。
- 部分瀏覽器對 `file://` 的模組載入或攝影機存取有限制，可能無法完成測試；可改用支援的瀏覽器或已發布的網站版本。
- 影片僅暫存在分頁內，離開或重新整理前請先下載。

## 作品背景

原始功能來自我過去專案中的手機端人臉動作檢測頁面：整合 MediaPipe 特徵分析、分數門檻、步驟引導與 MediaRecorder 側錄。

這次使用 AI 協助精簡介面、支援 PC 操作、修正錄影收尾，並改為完成後直接下載 Blob 影片。原本的動作門檻、2 秒等待及 2.5 秒過場均保留。

## GitHub Pages

可直接發布靜態檔案，不需建置。`index.html` 只負責導向 `face4.html`。

[GitHub Actions 設定](.github/workflows/ci-pages.yml) 會確認 HTML 檔案存在；啟用 `PAGES_DEPLOY_ENABLED=true` 後，`main` 更新時發布這兩份 HTML。Pages 來源需設為 GitHub Actions；免費方案的儲存庫需為 public。
