#!/usr/bin/env node
/**
 * PostToolUse hook: run only the Spock spec affected by the changed file.
 *
 * Wire into .claude/settings.json:
 *   "command": "node .claude/hooks/run-affected-spec.js \"$FILE_PATH\""
 *
 * Maps a changed grails-app source file to its conventionally-named Spock
 * spec class and runs only that test, using Grails' own layer naming
 * convention (Service/Controller suffix -> <Name>Spec). If no test with
 * that name exists yet, Gradle's --tests filter fails with "no tests
 * found" — that is intentional, not a bug: it enforces the SDD rule that
 * the failing test is written before the implementation (see
 * docs/standards/testing-methodology.md).
 */
'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const LAYER_ROOTS = [
  'grails-app/services/',
  'grails-app/controllers/',
  'grails-app/domain/',
];

function main() {
  const changedFile = process.argv[2];
  if (!changedFile) {
    console.log('[run-affected-spec] no file path given; skipping.');
    process.exit(0);
  }

  const normalized = changedFile.replace(/\\/g, '/');

  if (!normalized.endsWith('.groovy')) {
    console.log(`[run-affected-spec] ${normalized} is not a .groovy file; skipping.`);
    process.exit(0);
  }

  const matchedRoot = LAYER_ROOTS.find((root) => normalized.includes(root));
  if (!matchedRoot) {
    console.log(`[run-affected-spec] ${normalized} is not under a mapped layer; skipping.`);
    process.exit(0);
  }

  const relIndex = normalized.indexOf(matchedRoot) + matchedRoot.length;
  const relativePath = normalized.slice(relIndex);
  const className = path.basename(relativePath, '.groovy');
  const specClassName = `${className}Spec`;

  console.log(`[run-affected-spec] ${className} changed -> running ${specClassName}`);

  const result = spawnSync(
    './gradlew',
    ['test', '--tests', `*${specClassName}`, '--console=plain'],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  );

  if (result.status !== 0) {
    console.error(
      `[run-affected-spec] ${specClassName} failed, or does not exist yet. ` +
      'If this is a new BR, write the failing spec named "BR-n: ..." before implementing.'
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
