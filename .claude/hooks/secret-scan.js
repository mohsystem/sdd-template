#!/usr/bin/env node
/**
 * PostToolUse hook: block edits that introduce hardcoded credentials.
 *
 * Wire into .claude/settings.json:
 *   "command": "node .claude/hooks/secret-scan.js \"$FILE_PATH\""
 *
 * Mechanizes docs/standards/security-standard.md §3. Heuristic
 * pattern-matching, not a full entropy scanner — false positives are
 * possible (e.g. a variable literally named "password" with no value).
 * Tune PATTERNS to your codebase rather than trusting it blindly, and
 * never treat "the hook didn't flag it" as proof a file has no secret.
 */
'use strict';

const fs = require('fs');

const PATTERNS = [
  { pattern: /AKIA[0-9A-Z]{16}/, label: 'AWS access key ID' },
  { pattern: /-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----/, label: 'private key block' },
  { pattern: /\b(password|passwd|secret|api[_-]?key)\s*[:=]\s*['"][^'"$][^'"]{7,}['"]/i, label: 'hardcoded credential-like literal' },
  { pattern: /ghp_[A-Za-z0-9]{36}/, label: 'GitHub personal access token' },
];

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    process.exit(0);
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    process.exit(0);
  }

  const hits = PATTERNS
    .filter(({ pattern }) => pattern.test(content))
    .map(({ label }) => label);

  if (hits.length > 0) {
    console.error(`[secret-scan] ${filePath} looks like it contains a hardcoded secret:`);
    hits.forEach((label) => console.error(`  - ${label}`));
    console.error(
      'Externalize via an environment variable or secrets manager — see ' +
      'docs/standards/security-standard.md §3. If this is a false positive ' +
      '(e.g. a test fixture using an obviously fake value), adjust PATTERNS ' +
      'in this script rather than bypassing the hook.'
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
