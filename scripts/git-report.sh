#!/usr/bin/env bash
set -euo pipefail

REPORT_DIR="script"
REPORT_FILE="$REPORT_DIR/git-report.txt"
PROMPT_FILE=$(mktemp)

# Ensure the report directory exists
mkdir -p "$REPORT_DIR"

# Clear or create the report file
: > "$REPORT_FILE"

echo "===== GIT STATUS =====" >> "$REPORT_FILE"
git status >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "===== UNSTAGED DIFF =====" >> "$REPORT_FILE"
git diff >> "$REPORT_FILE"

echo "" >> "$REPORT_FILE"
echo "===== STAGED DIFF =====" >> "$REPORT_FILE"
git diff --cached >> "$REPORT_FILE"

# Write the AI prompt to a temporary file, then append it
cat > "$PROMPT_FILE" <<'EOF'

===== AI PROMPT =====
Below is the output of `git status`, `git diff`, and `git diff --cached` for a project.
Please generate two commit messages based on the changes shown, following the conventional commit format (e.g., feat:, fix:, chore:, refactor:, docs:, style:, test:, etc.).

1. First version: provide the full commands including staging and committing: git add . &&  git commit -m "type(scope): description"

2. Second version: provide only the commit message itself, without any commands: type(scope): description
Make sure the commit messages are descriptive, concise, and accurately reflect the changes.
EOF

cat "$PROMPT_FILE" >> "$REPORT_FILE"
rm "$PROMPT_FILE"

echo "Report generated: $REPORT_FILE"
