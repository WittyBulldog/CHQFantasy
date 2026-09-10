# Yahoo history import

Source: signed-in Yahoo Fantasy league archive schedule pages, retrieved September 9, 2026. Original task: career and head-to-head records since inaugural 2020 season.

`yahoo-import.json` now contains all 498 regular-season games for 2020–2025 (78 in 2020, 84 in each subsequent season). Team IDs are one-based positions in each season's teams array, and must NOT be treated as stable person identifiers across seasons. All archive league URLs were discovered in the user's Fantasy profile History tab. The current 2026 league is named F*ck Future Picks; prior archives are named CHQ Fantasy Keeper League. The 2026 season had no completed games at retrieval.

Yahoo initially returned `Request denied`. Access subsequently returned and extraction completed through 2022. The user explicitly requested stopping Yahoo retrieval after 2022 and supplied screenshots for 2020 and 2021 instead. The new `career.html` displays the complete regular-season archive.

The commissioner supplied the complete 15-member identity mapping in `league-members.json`. Preserve those display names, including John B and John Y, rather than guessing full names from older website content. Each season has 12 participants. Missing season keys indicate nonparticipation, not losses or zero-game seasons.

Screenshots reviewed: `C:/Users/cardonta01/OneDrive - Jamestown Community College/Pictures/2020 results/` contains all 12 schedules, weeks 1–13 (78 unique games). The corresponding `2021 results/` folder contains weeks 1–14 (84 unique games). The user supplied a corrected `Untitled 5.png` showing West Coast after the original was a duplicate of DonkeyWoodDean. The corrected screenshot was used. `transcribe-seasons.cjs` preserves each team's own weekly scores and opponent order; reciprocal schedules were checked before deduplicating.

`build-career.cjs` validates all six season counts, exactly one game per participant per week, unique matchup keys, complete owner mappings, turnover totals, and head-to-head sums. It generates `career-data.js` for the page. Run `node build.cjs` for a complete static build. No Yahoo requests are made by the page; later seasons require a new data import. Postseason results are outside this version's scope and can be added separately when supplied.

Schedule navigation: open each archive home, use its league Standings > Schedule link, then follow the team links containing `scmid=`. Matchup score links contain `week`, `mid1`, and `mid2`. These schedules cover the regular season only. Deduplicate matches by season, week, and unordered team pair. Each complete imported season has 14 games per team. Source matchup URLs can be reconstructed from the recorded season archive URL plus `/matchup?week=W&mid1=A&mid2=B`.
