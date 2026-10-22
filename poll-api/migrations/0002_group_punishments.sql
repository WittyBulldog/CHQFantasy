-- Change the lineup only before voting begins. Refuse to erase or reinterpret ballots.
CREATE TRIGGER guard_punishment_lineup_update
BEFORE UPDATE OF revision ON polls
WHEN OLD.id='punishment-2026' AND (
  OLD.phase<>'draft' OR OLD.round<>1
  OR EXISTS(SELECT 1 FROM votes WHERE poll_id=OLD.id)
  OR EXISTS(SELECT 1 FROM matches WHERE poll_id=OLD.id AND (round<>1 OR winner IS NOT NULL))
)
BEGIN
  SELECT RAISE(ABORT,'Close and reset the bracket before changing the punishment lineup.');
END;

UPDATE polls SET revision=revision+1 WHERE id='punishment-2026';
UPDATE matches SET left_id='calendar',right_id='apology' WHERE poll_id='punishment-2026' AND id='qf1';
UPDATE matches SET left_id='sign',right_id='5k' WHERE poll_id='punishment-2026' AND id='qf2';
UPDATE matches SET left_id='bowling',right_id='pancakes' WHERE poll_id='punishment-2026' AND id='qf3';
UPDATE matches SET left_id='two-mile',right_id='plunge' WHERE poll_id='punishment-2026' AND id='qf4';

DROP TRIGGER guard_punishment_lineup_update;
