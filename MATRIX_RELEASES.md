# Traceability Matrix Releases

The large BL-001 traceability artifacts are stored as GitHub Release assets. The Git repository keeps lightweight governance metadata and SHA-256 verification values.

## Current release plan

| Tag | Status | Endpoint keys | Duplicates | Unresolved | Assets |
|---|---|---:|---:|---:|---|
| `bl001-traceability-20260828-134` | `PENDING_ASSET_UPLOAD` | 134 | 0 | 0 | `traceability-matrix.json`, `matrix-data.js`, `bl001-traceability-sha256.txt` |

### Expected SHA-256

- `traceability-matrix.json`: `0285af7d4d8aaf90c27005f42c6ca7a384ea03009501542c5233847003562331`
- `matrix-data.js`: `211af64b99d69fb95c889c236403ffc4b81327bdf4ba74b6ccf5c86d60e95613`

Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

The release must remain a draft until both assets and the checksum file are uploaded and verified. Publishing the release does not by itself close BL-001; repository/runtime reconciliation must still validate the release references and hashes.
