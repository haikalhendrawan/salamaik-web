BEGIN;

UPDATE user_ref SET peraturan = 2 WHERE peraturan < 2;

COMMIT;