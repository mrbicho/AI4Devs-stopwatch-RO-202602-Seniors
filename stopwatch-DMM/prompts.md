# Prompts

## Chatbot used

Claude: 

## Prompts used

### Prompt 1

# Stopwatch & Countdown Timer — Web App

  Build a fully functional Stopwatch and Countdown Timer as a single-page web application.

  Reference design: https://www.online-stopwatch.com/

  The UI should include a large digital display (HH:MM:SS + milliseconds),
  a Start/Stop button and a Clear/Reset button.

  ## Tech Stack:
  - HTML5
  - CSS3
  - Vanilla JavaScript (no frameworks or libraries)

  ## Features

  ### Stopwatch:
  - Display format: HH:MM:SS with milliseconds (3 digits)
  - Start: begins counting up from 00:00:00.000
  - Stop: pauses the timer at the current time
  - Clear: resets the display to 00:00:00.000
  - Start/Stop button should toggle its label: shows "Start" when stopped, "Stop" when running

  ### Countdown:
  - User can set a custom time (hours, minutes, seconds) before starting
  - Display counts down to 00:00:00.000
  - When it reaches zero: show a visual alert and play an audio beep
  - Reset button restores the countdown to the last set time
  - Inputs should be disabled while the countdown is running

  ## UI / Design:
  - Both modes (Stopwatch and Countdown) accessible via tabs or a toggle
  - The display must be large and clearly readable
  - Green button for Start, Red button for Stop/Clear (as in the reference design)
  - Responsive layout — must work on both desktop and mobile

  ## Files:
  - index.html — structure and layout
  - styles.css — all styling
  - script.js — all logic

