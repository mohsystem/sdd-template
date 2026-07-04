#!/usr/bin/env node
/**
 * PostToolUse hook: block controllers that mutate GORM state directly.
 *
 * Wire into .claude/settings.json:
 *   "command": "node .claude/hooks/controller-mutation-guard.js \"$FILE_PATH\""
 *
 * Mechanizes the layering rule in docs/standards/code-style.md: business
 * logic and state mutation belong in an @Transactional service method,
 * never in a *Controller.groovy action. This is a heuristic (grep-based),
 * not a full parse — it will have false positives on legitimate edge
 * cases (e.g. a controller test fixture). Treat a failure as "a human
 * should look at this," and adjust exit code / patterns to your team's
 * tolerance rather than assuming it's always correct.
 */
'use strict';

const fs = require('fs');

const VIOLATION_PATTERNS = [
  { pattern: /\.save\s*\(/, label: '.save( ) called directly' },
  { pattern: /\.delete\s*\(/, label: '.delete( ) called directly' },
  { pattern: /\bstatus\s*=\s*['"]/, label: 'direct assignment to a status-like field' },
];

function main() {
  const filePath = process.argv[2];
  if (!filePath || !/Controller\.groovy$/.test(filePath.replace(/\\/g, '/'))) {
    process.exit(0);
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    // File may have been deleted/moved since the tool call; nothing to check.
    process.exit(0);
  }

  const hits = VIOLATION_PATTERNS
    .filter(({ pattern }) => pattern.test(content))
    .map(({ label }) => label);

  if (hits.length > 0) {
    console.error(`[controller-mutation-guard] ${filePath} looks like it mutates domain state directly:`);
    hits.forEach((label) => console.error(`  - ${label}`));
    console.error(
      'Business-rule mutation belongs in an @Transactional service method — ' +
      'see docs/standards/code-style.md. If this is a false positive (e.g. a ' +
      'command object or test fixture), adjust VIOLATION_PATTERNS in this script.'
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
