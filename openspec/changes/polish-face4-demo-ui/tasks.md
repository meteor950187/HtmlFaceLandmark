## 1. Demo UI polish

- [x] 1.1 Refine the start screen copy and presentation so the demo entry state reads as a clear face verification introduction without changing the start flow logic
- [x] 1.2 Add explicit progress feedback to the step instruction area, such as step numbering or progress indicators, while keeping the existing step sequencing logic intact
- [x] 1.3 Update the completion state so it more clearly communicates that validation is finished and that the side recording can be reviewed
- [x] 1.4 Polish the playback confirmation modal copy, waiting state, and error state without replacing the current completion or recorder architecture

## 2. Visual hierarchy and content consistency

- [x] 2.1 Normalize all visible demo-facing copy in `face4.html` to consistent Chinese wording across start, detection, completion, playback, loading, and error states
- [x] 2.2 Adjust typography and spacing choices to better support Chinese readability without introducing a large redesign
- [x] 2.3 Reduce the visual emphasis of the detection debug information area so it remains available but no longer competes with the primary demo guidance
- [x] 2.4 Review overlay layering to ensure the completion UI, playback modal, waiting state, and video playback do not visually conflict

## 3. Guardrails for core flow preservation

- [x] 3.1 Verify that UI changes do not rename, split, or redefine `recordedChunks`, `processingChunks`, `mediaRecorder`, `recorderStop()`, `setDetectProcess()`, `setNextStep()`, `setSuccessToTop()`, or `API_FaceValidateChecked()`
- [x] 3.2 Verify that the recorder, Blob generation, face detection, and playback handoff still use the existing core flow and are only wrapped with presentation-layer changes where needed

## 4. End-to-end demo validation

- [ ] 4.1 Create and execute a final e2e checklist that covers page load, start screen, camera startup, and step progression
- [ ] 4.2 Extend the e2e checklist to cover completion state, playback confirmation, waiting-for-recording readiness, successful Blob playback, and cancel behavior
- [ ] 4.3 Validate the demo in mobile portrait layout and record any UI issues that would reduce demo readiness
