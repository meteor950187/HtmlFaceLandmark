# Pending E2E Confirmation

這份清單對應 `polish-face4-demo-ui` 尚未完成的 3 個 OpenSpec task，需要在實際瀏覽器與裝置環境中確認後才能勾選完成。

2026-10-28 更新：目前已改為獨立 Demo，完成後自動顯示成功彈窗，提供影片預覽、下載與「稍後下載」。原本「點擊完成後詢問是否立即播放」的故事線已被此流程取代。Chromium 的受控影像／動作測試結果請見 `demo-e2e-checklist.md`；下列清單保留為實體攝影機與實機待確認項目，不將模擬測試等同實機完成。

## Task 4.1

**Create and execute a final e2e checklist that covers page load, start screen, camera startup, and step progression**

確認項目：
- [ ] 頁面載入後沒有 script error
- [ ] 開始畫面顯示正常，文案與排版可閱讀
- [ ] 點擊開始後可正常進入流程
- [ ] 相機可正常啟動並取得畫面
- [ ] 每個步驟都能依序推進
- [ ] 步驟進度顯示與實際流程同步

## Task 4.2

**Extend the e2e checklist to cover completion state, playback confirmation, waiting-for-recording readiness, successful Blob playback, and cancel behavior**

確認項目：
- [ ] 完成畫面可正常顯示
- [ ] 完成後自動跳出成功彈窗，顯示側錄整理中的等待狀態
- [ ] 選擇「稍後下載」時，彈窗關閉且完成畫面保持正常，可再開啟
- [ ] 選擇「下載側錄影片」時，影片可儲存且格式與副檔名一致
- [ ] Blob 準備完成後，影片可在彈窗的預覽 `video` 元素中正常播放
- [ ] 若沒有可播放資料，錯誤提示顯示正常且不破版

## Task 4.3

**Validate the demo in mobile portrait layout and record any UI issues that would reduce demo readiness**

確認項目：
- [ ] 手機直式畫面下，開始畫面文案沒有截斷
- [ ] 手機直式畫面下，步驟區文字沒有溢出或被裁切
- [ ] 手機直式畫面下，完成畫面可正常點擊
- [ ] 手機直式畫面下，播放彈窗按鈕可正常點擊
- [ ] 手機直式畫面下，整體排版沒有明顯破版

## Notes

- 建議搭配 [demo-e2e-checklist.md](/C:/Users/meteo/Documents/CodexEvents/Demo/HtmlFaceLandmark/demo-e2e-checklist.md) 一起使用。
- 確認完成後，可回頭更新：
  - [openspec/changes/polish-face4-demo-ui/tasks.md](/C:/Users/meteo/Documents/CodexEvents/Demo/HtmlFaceLandmark/openspec/changes/polish-face4-demo-ui/tasks.md)
