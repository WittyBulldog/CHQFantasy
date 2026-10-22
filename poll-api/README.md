# CHQ punishment bracket

The public website stays on GitHub Pages. This Cloudflare Worker stores shared votes in D1. It starts with voting closed (draft); the commissioner opens the quarterfinals when ready.

## Deploy

Use Node.js and Cloudflare's Wrangler CLI. Run the following from `poll-api/`:

1. `npx wrangler login` — sign in to the intended Cloudflare account.
2. `npx wrangler d1 create chq-punishment-poll` — copy the returned database ID into `wrangler.jsonc` (`database_id`).
3. `npx wrangler d1 migrations apply DB --remote` — initialize the poll and four quarterfinals. Do not manually re-run the SQL file against a live poll.
4. `node generate-codes.cjs` — create 12 random owner codes and a separate commissioner key. The script refuses to replace existing codes. Keep `.private/` backed up privately.
5. `npx wrangler deploy --secrets-file .private/secrets.json` — deploy the Worker and its secrets.
6. Set `window.CHQ_POLL_API` in the website's `punishment-poll-config.js` to the HTTPS Worker URL (no trailing slash). Run the website build and publish the updated site to GitHub.
7. Open `/punishment-poll-admin.html`, enter the commissioner key, and open quarterfinal voting. Give each owner only their own code from `.private/voting-codes.json`; distribute codes yourself. Never send owners the complete file or the commissioner key.

The website and API must use HTTPS in production. `ALLOWED_ORIGINS` is limited to the CHQFantasy domains; add a preview origin explicitly if needed. No Cloudflare API token belongs in the website or repository.

## Run the bracket

- Each owner has one vote in each active matchup and may change it until the commissioner closes voting. The code works across devices; reusing a code changes the same ballot rather than adding votes. Anyone holding a code can use that owner's ballot, so keep it private.
- Open → collect votes → close → review results and ties → advance. Advancing opens the next round. Results remain visible for completed rounds.
- A matchup needs at least one vote before advancing. All 12 owners do not have to vote. Close rounds only when the league has had its agreed voting window.
- Close voting before resolving a tie. The commissioner can choose either tied entry, but cannot override a non-tied result. Reopen the current closed round if more voting is needed.
- Final confirmation locks the champion. To start over, unlock commissioner controls, select **Reset bracket…**, type **RESET**, and confirm. This permanently deletes all votes and results, restores the original quarterfinals, and closes voting. Owner codes and the commissioner key stay valid. Reset is commissioner-only and rejects stale requests; it cannot be undone.
- Entry details and themed opening pairings are in `punishment-poll-data.mjs`. Apply migration `0002_group_punishments.sql` to update an existing empty draft bracket before deploying the revised website and Worker. It refuses to change an open bracket or one with votes/results; it does not erase ballots. The migration also runs for new databases after the original seed. Do not change IDs or pairings during a live tournament.
- Credentials are held in browser memory only and are sent to the API in the Authorization header, not in URLs. Public responses omit voter identities and hide per-entry totals while voting is open. The commissioner can see those totals.

## Local verification

From the website root run `node data/test-punishment-poll.mjs`. This exercises the actual SQL with an in-memory SQLite database, vote replacement, closed-round enforcement, ties, round advancement, replay protection, and the Worker HTTP authorization/CORS routes.

For an end-to-end local Worker preview, use Wrangler's local D1 database, apply migrations with `--local`, and configure local secrets in `.dev.vars`. Permit the localhost preview origin in `ALLOWED_ORIGINS` for that local session only. Do not point local tests at the live database.

Official references:
- https://developers.cloudflare.com/workers/wrangler/commands/d1/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/wrangler/configuration/
