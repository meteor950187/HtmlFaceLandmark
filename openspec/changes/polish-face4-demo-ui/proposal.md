## Why

`face4.html` 的臉部驗證、側錄蒐集與播放銜接已經可用，現在的主要缺口不是功能，而是 demo 展示感與可理解性。需要用最小侵入的方式收尾 UI，讓使用者與旁觀者都能更清楚理解流程，同時定義最後的 e2e 驗收標準。

## What Changes

- 針對 `face4.html` 的開始畫面、步驟區、完成畫面與播放詢問彈窗做最小侵入的 UI polish。
- 統一 demo 的中文文案與字型策略，避免日文殘留與視覺不一致。
- 弱化或重新定位左上角檢測資訊區，使其偏向 debug 資訊而不是主視覺。
- 明確規範不可改動的核心邏輯與命名，避免 UI 收尾時誤觸錄影、Blob 建立與臉部偵測主流程。
- 建立完整的 demo e2e 驗收清單，涵蓋頁面載入、檢測步驟、完成狀態、播放詢問、等待轉換與影片播放。

## Capabilities

### New Capabilities
- `face4-demo-experience`: 定義 `face4.html` demo 的 UI 展示要求、不可變動的核心邊界，以及整條 demo 故事線的 e2e 驗收標準。

### Modified Capabilities
- None.

## Impact

- Affected code: `face4.html`
- Affected systems: 單頁 demo 的開始提示、步驟指示、完成狀態、播放詢問與側錄播放體驗
- Constraints: 不重構 `recordedChunks`、`processingChunks`、`mediaRecorder`、`recorderStop()`、`setDetectProcess()`、`setNextStep()`、`setSuccessToTop()`、`API_FaceValidateChecked()`，不重寫 recorder / blob / face detect 主流程，不做大型 redesign
