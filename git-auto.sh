#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/git-auto-push.sh "commit mesajı"        # mesajı sen ver
#   ./scripts/git-auto-push.sh                        # otomatik mesaj
#
# Env options:
#   BRANCH=main REMOTE=origin ./scripts/git-auto-push.sh "msg"
#   ALLOW_AUTOSTASH=1 ./scripts/git-auto-push.sh

REMOTE="${REMOTE:-origin}"
BRANCH="${BRANCH:-main}"
ALLOW_AUTOSTASH="${ALLOW_AUTOSTASH:-1}"

msg="${1:-}"

die() { echo "❌ $*" >&2; exit 1; }
info() { echo "ℹ️  $*"; }
ok() { echo "✅ $*"; }

# --- Preconditions ---
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Bu klasör git repo değil."

# merge/rebase in progress?
if git rev-parse -q --verify MERGE_HEAD >/dev/null 2>&1; then
  die "Merge devam ediyor (MERGE_HEAD var). Önce conflictleri çöz: git status"
fi
if [ -d "$(git rev-parse --git-path rebase-apply)" ] || [ -d "$(git rev-parse --git-path rebase-merge)" ]; then
  die "Rebase devam ediyor. Önce bitir: git rebase --continue / --abort"
fi
if [ -f "$(git rev-parse --git-path CHERRY_PICK_HEAD)" ]; then
  die "Cherry-pick devam ediyor. Önce bitir: git cherry-pick --continue / --abort"
fi

# detect detached HEAD
current_branch="$(git symbolic-ref -q --short HEAD || true)"
if [ -z "$current_branch" ]; then
  die "Detached HEAD durumundasın. Bir branch'e geç: git checkout ${BRANCH} (veya doğru branch)"
fi

# pick target branch (default BRANCH or current)
target_branch="$current_branch"
if [ "$current_branch" != "$BRANCH" ]; then
  # Eğer farklı branch'teysen, o branch'e push etmek daha güvenli
  target_branch="$current_branch"
fi

# ensure remote exists
git remote get-url "$REMOTE" >/dev/null 2>&1 || die "Remote '$REMOTE' yok. git remote -v kontrol et."

# --- Fetch and check divergence ---
info "Fetch: $REMOTE"
git fetch "$REMOTE" --prune || die "Fetch başarısız."

# ensure upstream set; if not, we'll set on first push
upstream_ref="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"

# If upstream exists and remote is ahead, try to rebase (safe) or fail if conflicts
if [ -n "$upstream_ref" ]; then
  ahead="$(git rev-list --count "${upstream_ref}..HEAD" || echo 0)"
  behind="$(git rev-list --count "HEAD..${upstream_ref}" || echo 0)"
  info "Upstream: ${upstream_ref} | ahead=${ahead} behind=${behind}"

  if [ "$behind" -gt 0 ]; then
    if [ "$ALLOW_AUTOSTASH" = "1" ]; then
      info "Remote önde. Rebase deniyorum (autostash)..."
      if ! git pull --rebase --autostash "$REMOTE" "$target_branch"; then
        die "Rebase sırasında sorun çıktı. Conflictleri çöz ve tekrar çalıştır."
      fi
    else
      die "Remote önde (behind=${behind}). Önce: git pull --rebase"
    fi
  fi
else
  info "Upstream ayarlı değil. İlk push'ta -u ile ayarlanacak."
fi

# --- Stage changes if any ---
# Detect any changes (unstaged/staged/untracked)
if git diff --quiet && git diff --cached --quiet; then
  # no staged/unstaged changes, but maybe untracked
  if [ -n "$(git ls-files --others --exclude-standard)" ]; then
    info "Untracked dosyalar var. Stage ediyorum..."
    git add -A
  else
    ok "Commitlenecek değişiklik yok. Push kontrolü yapacağım..."
  fi
else
  info "Değişiklikler var. Stage ediyorum..."
  git add -A
fi

# --- Commit if staged changes exist ---
if ! git diff --cached --quiet; then
  if [ -z "$msg" ]; then
    ts="$(date '+%Y-%m-%d %H:%M:%S')"
    msg="chore: auto-sync ${target_branch} (${ts})"
  fi
  info "Commit atıyorum: $msg"
  git commit -m "$msg" || die "Commit başarısız."
else
  info "Staged değişiklik yok, commit atlanıyor."
fi

# --- Push ---
info "Push: $REMOTE $target_branch"
if [ -n "$upstream_ref" ]; then
  git push "$REMOTE" "$target_branch" || die "Push başarısız."
else
  git push -u "$REMOTE" "$target_branch" || die "Push başarısız."
fi

ok "Bitti. Son durum:"
git status -sb
