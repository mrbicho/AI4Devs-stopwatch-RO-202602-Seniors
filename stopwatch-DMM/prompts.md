# Prompts

## Chatbot used

Claude

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


### Prompt 2

The time display text is too large and gets cropped on both sides,                                                                                                             
  especially in fullscreen. Please adjust the CSS so the time always                                                                                                             
  fits within its container with comfortable padding on each side.                                                                                                               
                                                                                                                                                                                 
  Requirements:                                                                                                                                                                  
  - Add horizontal padding inside the display box so the text never                                                                                                              
    touches or overflows the edges
  - The font size should scale down if needed to always fit within                                                                                                               
    the display area (use fluid typography or clamp())
  - The fix must work on all screen sizes, including fullscreen
  - Do not change the layout or design, only fix the text overflow issue


### Prompt 3

The countdown timer has two bugs to fix:

1. **Pause/Resume is broken**:
  
     When the user pauses the countdown and
     clicks Start again, it restarts from the original input value instead
     of resuming from where it was paused. Fix the cdStart() function so
     that it resumes from the remaining time when paused, not from the input fields.

2. **Wrong button label after pause**:

     When the countdown is paused, the Start button resets to "START"
     instead of "RESUME", which is misleading.
     After pausing, the button label should show "RESUME"
     to indicate it will continue from where it stopped. It should only
     show "START" when the countdown has not been started yet or has
     been fully reset. Also, the reset button is failing in the countdown.
     It doesn't come back to the initial time selected.

  Do not change anything else — layout, design, and other functionality
  must remain exactly as they are.

 