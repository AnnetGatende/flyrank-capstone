# WORKFLOW.md — Vague vs. Precise Prompting

## The Experiment
I built the same feature (a settings form with validation) twice: once with a single vague prompt ("Build a settings form with validation"), and once with a precise prompt specifying fields, constraints, exact error messages, accessibility requirements, and a request for tests to be written and run.

## Correctness
Both versions produced a working form with the same core fields (display name, email, username, bio, theme, checkbox) and functioning validation. The vague version worked — it wasn't broken — but its validation messages, error timing, and edge-case handling were entirely up to the AI's assumptions, not mine. The precise version matched my exact specified behavior: for example, an invalid email showed exactly "Please enter a valid email address." on blur, not on submit, because I specified that timing explicitly.

## Accessibility
This was the clearest gap. The vague version gave no indication of accessibility support — I didn't ask, so I don't know if `aria-invalid` or `aria-describedby` exist on those fields. The precise version explicitly required these attributes, and they're present and tested (`expect(emailInput).toHaveAttribute('aria-invalid', 'true')`). Without asking directly, accessibility is invisible — the AI won't volunteer it.

## Edge Cases
The precise prompt specified exact behavior for edge cases (invalid email format, disallowed username characters, bio over 200 characters) and verified each with a dedicated test. The vague prompt handled the "obvious" cases (empty fields) but I have no verified guarantee it handles messier inputs the same way, since nothing forced that verification.

## Review Effort
Counterintuitively, the precise prompt took more upfront effort to write (the prompt itself was ~15x longer) but required almost no manual verification afterward — the 4 automated tests confirmed correctness for me. The vague prompt took seconds to write, but left me solely responsible for manually clicking through every case in the browser to find out what it actually did, with no repeatable proof once I closed the tab.

## Takeaway
"Used AI to build it" tells you nothing about correctness, accessibility, or edge-case coverage — those all depend entirely on whether I specified them and asked for verification. The vague prompt produced something that *looked* done. The precise prompt produced something I could *prove* was done, with tests I can re-run any time the code changes.