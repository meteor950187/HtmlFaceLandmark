# Standalone Demo Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Make the existing mobile single page usable on PC and show a success popup with a complete recording download.

**Architecture:** Keep face4.html and the existing MediaPipe/MediaRecorder pipeline. Confine the UI to a centered mobile-width stage and finalize the existing Blob on completion, then reuse its Object URL for preview and download.

**Tech Stack:** HTML, CSS, native JavaScript, @mediapipe/tasks-vision@0.10.3, MediaRecorder, Node built-in test runner.

**Spec:** ../specs/2026-10-28-standalone-demo-design.md, refined by the user's latest request: minimal completion popup, download instead of external close/transmission.

## Global Constraints

- Keep the existing thresholds, single-frame trigger, 2000ms qualification timer and 2500ms success transition.
- Keep Safari MP4-first and WebM fallback; no transcoding or backend integration.
- Keep all existing uncommitted user changes and core function names.
- Use Traditional Chinese UI, naming Google MediaPipe Tasks Vision WebAssembly and FaceLandmarker explicitly.

## Review Focus

- Final dataavailable must be collected before Blob creation, including recordings shorter than the timeslice.
- Reopening the completion popup must reuse the recording without a second stop call.
- Camera/model/recording errors must restore a usable start or show a clear completion error.
- Short PC viewports and mobile portrait must keep buttons within reachable scrollable content.
- Download extension must match the actual recorded MIME type and camera tracks must be released.

### Task 1: Recording completion and regression checks

**Files:** face4.html; tests/demo-flow.test.cjs

- [x] Add Node VM behavioral tests around the page's real module for final chunk collection, repeated completion, format selection, and unchanged timings; run and observe failures.
- [x] Correct recorderStop() to await stop and retain the final chunk; reuse one finalized URL.
- [x] Finalize on completion and release camera; populate the popup's preview/download from the same Blob.
- [x] Run node --test tests/demo-flow.test.cjs; require all tests to pass.

### Task 2: Desktop stage, introduction, and input

**Files:** face4.html; README.md; demo-e2e-checklist.md; pending-e2e-confirmation.md

- [x] Center a stage capped at 480px, with viewport-dependent height and black side areas; constrain all overlays to it.
- [x] Add the agreed introduction and explicit start button; prepare camera/model and start recording after the button is activated.
- [x] Use click handlers and semantic buttons; preserve progress after transitions; show automatic success popup and preview/download.
- [x] Check desktop, short viewport and mobile UI in a real browser, and exercise the flow with controlled media/model substitutes where needed.
- [x] Update documentation with actual results and distinguish controlled checks from physical-device verification.

## Execution record

- Work in the existing checkout on codex/standalone-demo to retain uncommitted UI changes; no worktree or commits are needed for this local reviewable change.
- Latest user request is the authority over earlier proposals about continuous qualification or shorter timing; both proposals are withdrawn.

## Verification result

- node --test: 11/11 passed; the final-chunk and early-recording-error regressions were observed failing before their fixes.
- Inline module syntax check and git diff --check passed.
- Native Chromium MediaRecorder produced playable/downloadable WebM and MP4 in controlled four-step runs; MP4 path selected using a Safari user agent. Both final runs had no page errors and released the camera.
- 1440×900, 390×844, 1024×420: centered stage widths 480, 390, 480 respectively; buttons reachable; no horizontal overflow.
- Actual MediaPipe WASM and model initialization verified separately with a synthetic camera; physical camera and iOS/Android remain unverified.
- Independent review found one P2 issue: errors before completion could expose a partial recording as success. Added a failing regression, retained recording errors from startup, and reran the complete suite and both browser format flows successfully.
- No commits, push, merge, or deployment performed. Existing uncommitted user content retained on codex/standalone-demo.

## Follow-up: camera permission recovery

- Current user tab returned NotFoundError (Requested device not found), not a timeout imposed by the page. Existing retries already called getUserMedia again.
- Split pending permission, denied permission, missing device, busy/unreadable device and model preparation messages.
- Preserve a pending request without timeout; observe camera permission changes where supported and retry a previously denied user request when permission becomes granted. Manual retry remains supported.
- Six permission-related regression checks added; full suite 17/17 passing. Real current-tab UI verified with NotFoundError; no browser/OS permission changes performed.

## Follow-up: concise UI and Pages configuration

- Removed the feature headings and long copy from the intro; retained one instruction and the MediaPipe WebAssembly name.
- Rewrote README around the original practical work and the scope of AI assistance.
- Added scripts/check-page.cjs, scripts/build-static.cjs and a gated GitHub Pages workflow. Static artifact contains only index.html and face4.html.
- Local suite 20/20 passing; module syntax check, static build and YAML structure validation passed. GitHub-hosted execution remains pending until push. Repository visibility remains private and deployment disabled.
