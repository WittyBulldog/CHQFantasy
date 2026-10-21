CREATE TABLE polls (
  id TEXT PRIMARY KEY,
  round INTEGER NOT NULL CHECK (round BETWEEN 1 AND 3),
  phase TEXT NOT NULL CHECK (phase IN ('draft','open','closed','complete')),
  revision INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE matches (
  poll_id TEXT NOT NULL REFERENCES polls(id),
  id TEXT NOT NULL,
  round INTEGER NOT NULL CHECK (round BETWEEN 1 AND 3),
  left_id TEXT NOT NULL,
  right_id TEXT NOT NULL,
  winner TEXT,
  PRIMARY KEY (poll_id,id),
  CHECK (left_id <> right_id),
  CHECK (winner IS NULL OR winner IN (left_id,right_id))
);
CREATE TABLE votes (
  poll_id TEXT NOT NULL,
  match_id TEXT NOT NULL,
  voter_id TEXT NOT NULL,
  choice TEXT NOT NULL,
  PRIMARY KEY (poll_id,match_id,voter_id),
  FOREIGN KEY (poll_id,match_id) REFERENCES matches(poll_id,id)
);
INSERT INTO polls(id,round,phase) VALUES ('punishment-2026',1,'draft');
INSERT INTO matches(poll_id,id,round,left_id,right_id) VALUES
  ('punishment-2026','qf1',1,'calendar','bowling'),
  ('punishment-2026','qf2',1,'5k','dinner'),
  ('punishment-2026','qf3',1,'sat','pancakes'),
  ('punishment-2026','qf4',1,'chip','plunge');
