# Opsis AI — Conversation Transport File (2026-05-27)

## Project Overview
**Opsis AI** — Windows desktop screen analysis app + FastAPI backend + Vercel marketing site

| Component | Repo | Deploy |
|-----------|------|--------|
| Desktop app | `willkirch7/opsis-ai` (private) | Nuitka exe on website |
| Backend API | `willkirch7/opsis-backend` | Railway |
| Website | `willkirch7/opsis-website` | Vercel |

**Supabase:** `vzgapiiaqjgacodnmvvk.supabase.co`

## What Was Done This Session

### Website (account.html) — all pushed to Vercel
- Sidebar widened from 300px to 340px
- Promo timer: white font (#fff), 34px size, headline 28px
- Promo text changed to: "Get 10% off" / "Opsis Pro Yearly Package"
- Created free test account: `test@testopsis.com` / `TestOpsis123!`

### Desktop App (app.py) — rebuilt exe and pushed
**Security fixes (from CodeRabbit review):**
1. Removed plaintext password from `.session` file — only stores tokens + email now
2. Session file written with owner-only permissions (`stat.S_IRUSR | stat.S_IWUSR`)
3. Session moved from `__file__` dir to `%APPDATA%/Opsis AI/.session` (works with Nuitka)
4. Removed hardcoded Supabase URL fallback — all 3 env vars required from `.env`
5. Removed dead `b64_push` function

**Stability fixes:**
6. `toggle_window` uses Win32 `ShowWindow`/`SetWindowPos` instead of pywebview methods (thread-safe from hotkey thread)
7. Multi-monitor capture: `_get_active_monitor()` uses `MonitorFromWindow` to detect foreground window's monitor
8. Actionable error message when screen capture fails: "Could not capture your screen..."

**Previous local changes (also in this build):**
- Follow-up questions reuse original screenshot (`_last_screenshot`)
- Plan display fix: `planLabels` map instead of naive capitalize ("Pro Monthly" / "Pro Yearly")
- Keyboard shortcuts section in settings dropdown

### Repo Setup
- Created `willkirch7/opsis-ai` as a private GitHub repo
- Removed `.env` from git tracking, added to `.gitignore`
- Pushed batch scripts (build-and-deploy.bat, run.bat, setup.bat)

### Nuitka Build
- Rebuilt exe with all fixes, copied to `opsis-website/downloads/OpsisAI.exe`, pushed
- Build command: `py -m nuitka --onefile --output-dir=build --windows-console-mode=disable --windows-icon-from-ico=icon.ico --include-data-dir=ui=ui --include-data-file=.env=.env --include-data-file=icon.ico=icon.ico --disable-plugin=pywebview --include-package=webview --include-package=pythonnet --include-package=clr_loader --assume-yes-for-downloads app.py`
- Must use `py` not `python` on this machine (Python 3.14.2)

## Key Technical Notes
- PyWebView 6.2.1 does NOT support `icon=` on `create_window()` — use Win32 `WM_SETICON`
- Nuitka's built-in `pywebview` plugin excludes `webview.platforms.win32` — must use `--disable-plugin=pywebview` + manual includes
- Nuitka global cache at `AppData/Local/Nuitka/Nuitka/Cache` — purge if source changes aren't reflected
- `_set_icon()` callback on `window.events.shown` takes no args (closure over `window`)
- Supabase JWT caches `created_at` — must re-login to pick up changes
- Promo timer only shows for free-plan users, 24hr countdown from `created_at`

## Test Accounts
| Email | Password | Plan |
|-------|----------|------|
| `will@testopsis.com` | — | pro_monthly |
| `test@testopsis.com` | TestOpsis123! | free |
| `willkirch@icloud.com` | — | (main account) |

## Remaining TODO
- [ ] Change Stripe business name to "Opsis AI" (manual — Stripe dashboard)
- [ ] Run `migrations/001_usage_logs.sql` in Supabase SQL Editor (optional)
- [ ] Add admin user ID to `ADMIN_USER_IDS` in `app/usage.py` (optional)

## CodeRabbit Medium/Low Issues (not yet fixed)
- Race condition in follow-up state (rapid clicking)
- Welcome screen removed permanently on sign-out/sign-in (needs `display:none` instead of `remove()`)
- No message history limit (DOM grows unbounded)
- `_claim_pending_purchase` silently swallows errors
- Opacity/model selection don't persist across restarts
- Both upgrade buttons go to same page
- Custom window dragging is laggy vs native

## File Locations
- Desktop app: `C:\Users\willk\.claude\Claude apps\opsis-ai\`
- Backend: `C:\Users\willk\.claude\Claude apps\opsis-backend\`
- Website: `C:\Users\willk\.claude\Claude apps\opsis-website\`
- Built exe: `C:\Users\willk\.claude\Claude apps\opsis-ai\build\app.exe`
- Obsidian vault: `C:\Users\willk\OneDrive\Documents\Obsidian Vault\`
- Obsidian checklist: `Checklist - Opsis.md`
- Obsidian preferences: `Claude Preferences.md`

## User Preferences
- Will, Windows 11, prefers Opus model
- Always push opsis-website changes immediately without asking
- Save session notes to Obsidian vault
- Terse responses, no unnecessary summaries
