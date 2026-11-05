## ADDED Requirements

### Requirement: Demo screens SHALL emphasize the primary user journey
The `face4.html` demo SHALL present the start screen, step instruction area, completion state, and playback prompt as a single understandable user journey. These changes MUST be limited to UI copy, styling, and minimal DOM structure updates, and MUST NOT change the responsibility or naming of the existing face detection, recording, Blob generation, and completion handlers.

#### Scenario: Start screen presents a clear entry point
- **WHEN** the page finishes loading
- **THEN** the user SHALL see a clear start-state message that explains the face verification demo and any immediate preparation guidance

#### Scenario: Step area communicates progress
- **WHEN** the demo advances through validation steps
- **THEN** the step instruction area SHALL show the current step with explicit progress feedback such as step numbering or progress indicators

#### Scenario: Completion state clearly invites playback review
- **WHEN** the demo reaches the completion state
- **THEN** the UI SHALL clearly communicate that validation is complete and that the user can review the side recording

### Requirement: Playback prompt SHALL remain a presentation-layer enhancement
The playback confirmation modal SHALL provide a product-like playback decision flow without replacing the current playback architecture. The playback prompt, waiting state, and failure state MUST reuse the existing completion entry point and recorder output path rather than introducing a separate recorder or playback workflow.

#### Scenario: User chooses to review the recording
- **WHEN** the user activates the completion action and chooses playback
- **THEN** the UI SHALL show a waiting state until the existing recording output is ready and SHALL begin playback using the current video element once the recording is available

#### Scenario: User declines playback
- **WHEN** the user activates the completion action and chooses cancel
- **THEN** the playback prompt SHALL close and the completion state SHALL remain usable without layout breakage

#### Scenario: Recording is unavailable
- **WHEN** the user requests playback and no playable recording is available
- **THEN** the playback prompt SHALL show a clear error state without breaking the rest of the demo flow

### Requirement: Debug information SHALL be visually secondary
Technical inspection data such as detection item and score information SHALL remain available for debugging, but MUST be visually secondary to the main demo guidance and MUST NOT dominate the primary user path.

#### Scenario: Debug data is present during detection
- **WHEN** the detection info area is displayed
- **THEN** it SHALL appear as secondary debug information through reduced emphasis, placement, or visual weight compared with the main step instruction

### Requirement: Demo copy and typography SHALL be consistent for Chinese presentation
All user-facing demo copy in `face4.html` SHALL be presented consistently in Chinese, and the typography strategy SHALL support Chinese readability across the start screen, step area, completion state, playback prompt, and loading or error messaging.

#### Scenario: No mixed-language UI remains in the demo path
- **WHEN** a user traverses the start, detection, completion, and playback flows
- **THEN** all visible product-facing copy in those flows SHALL be Chinese and SHALL not revert to leftover Japanese interface strings

### Requirement: The demo SHALL define an end-to-end acceptance journey
The change SHALL include an end-to-end validation checklist that treats the page as a demo story rather than as isolated functions. The acceptance journey MUST cover page load, start state, camera activation, step progression, completion state, playback prompt, waiting for recording readiness, successful playback, cancel behavior, and mobile portrait usability.

#### Scenario: Demo is accepted against the full flow
- **WHEN** the final e2e validation is executed
- **THEN** the checklist SHALL verify page load, start screen, camera startup, step progression, completion UI, playback confirmation, waiting state, Blob playback success, cancel-without-breakage, and mobile portrait usability
