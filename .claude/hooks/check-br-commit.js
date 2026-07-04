#!/usr/bin/env node
/**
 * PreToolUse hook: require a BR-ID in commit messages that touch
 * service/domain code.
 *
 * Wire into .claude/settings.json as a PreToolUse hook matching Bash.
 * Claude Code passes the tool call as JSON on stdin
 * ({ tool_input: { command: "..." }, ... }); this script reads that,
 * checks whether the command is a `git commit`, and — if the commit
 * touches grails-app/services or grails-app/domain — requires the
 * message to cite a BR-ID.
 *
 * Exit code 2 blocks the tool call in Claude Code's PreToolUse contract;
 * adjust if your harness uses a different blocking convention.
 */
'use strict';

const { execSync } = require('child_process');

function extractCommitMessage(command) {
  const doubleQuoted = command.match(/-m\s+"([^"]*)"/);
  if (doubleQuoted) return doubleQuoted[1];
  const singleQuoted = command.match(/-m\s+'([^']*)'/);
  if (singleQuoted) return singleQuoted[1];
  return '';
}

function main() {
  let raw = '';
  process.stdin.on('data', (chunk) => { raw += chunk; });
  process.stdin.on('end', () => {
    let input;
    try {
      input = JSON.parse(raw);
    } catch (err) {
      // Not JSON on stdin — don't block on a parse failure we don't understand.
      process.exit(0);
    }

    const command = input.tool_input && input.tool_input.command;
    if (!command || !/\bgit\s+commit\b/.test(command)) {
      process.exit(0);
    }

    let stagedFiles = '';
    try {
      stagedFiles = execSync('git diff --cached --name-only').toString();
    } catch (err) {
      // Not a git repo, or nothing staged — nothing to gate on.
      process.exit(0);
    }

    const touchesBrLayer = /grails-app\/(services|domain)\/.*\.groovy$/m.test(stagedFiles);
    if (!touchesBrLayer) {
      process.exit(0);
    }

    const commitMsg = extractCommitMessage(command);
    if (/BR-\d+/.test(commitMsg)) {
      process.exit(0);
    }

    console.error('[check-br-commit] Staged changes touch service/domain files, but the commit');
    console.error('message does not cite a BR-ID. Staged files:');
    console.error(stagedFiles.trim());
    console.error('Add the BR-ID this change serves (e.g. "BR-6: add condition rating on return"),');
    console.error('or state explicitly in the message why no BR applies (e.g. a pure refactor).');
    process.exit(2);
  });
}

main();
