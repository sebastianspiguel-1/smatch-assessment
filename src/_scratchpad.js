


Challenge menu css color azul
/* ============================================
   CHALLENGE MENU — DARK SaaS (Scoped)
   Matches: Linear / Vercel / Stripe vibe
   ============================================ */

.menu-scope {
  /* Typography */
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* Color tokens (from your spec) */
  --bg-deep: #020617;          /* Slate 950 */
  --surface: #0f172a;          /* Slate 900 */
  --elevated: #1e293b;         /* Slate 800 */
  --accent: #3b82f6;           /* Blue 500 */
  --accent-glow: rgba(59, 130, 246, 0.4);

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;

  --border-subtle: rgba(255, 255, 255, 0.08);

  /* Layout tokens */
  --radius-lg: 24px;
  --radius-xl: 32px;
  --gap-bento: clamp(20px, 3vw, 40px);

  /* Motion */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --t: 0.3s var(--ease);

  /* Shadows */
  --shadow-card: 0 14px 50px rgba(0, 0, 0, 0.45);
  --shadow-glow: 0 18px 60px rgba(59, 130, 246, 0.18);
}

/* PAGE */

.menu-scope .challenge-menu {
  min-height: 100vh;
  padding: 2.25rem;
  color: var(--text-primary);
  font-family: var(--font-sans);
  background: var(--bg-deep);

  /* Subtle background illumination */
  background-image:
    radial-gradient(900px 450px at 20% 10%, rgba(59, 130, 246, 0.16), transparent 55%),
    radial-gradient(700px 400px at 85% 20%, rgba(16, 185, 129, 0.10), transparent 60%),
    radial-gradient(900px 500px at 60% 110%, rgba(59, 130, 246, 0.10), transparent 55%);
}

/* HEADER */

.menu-scope .menu-header {
  text-align: center;
  margin-bottom: 4rem;
  padding: 2rem 0 1rem;
}

.menu-scope .menu-title {
  font-size: clamp(3rem, 10vw, 6rem); /* hero scale */
  font-weight: 800;
  letter-spacing: -0.04em;
  margin-bottom: 0.75rem;

  /* Gradient text: white -> accent */
  background: linear-gradient(135deg, #ffffff 0%, #dbeafe 35%, var(--accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu-scope .menu-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 58ch;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

/* LANGUAGE (Glass pills) */

.menu-scope .language-selector {
  display: flex;
  gap: 0.65rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.menu-scope .lang-btn {
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--t), border-color var(--t), background var(--t), box-shadow var(--t);

  /* Glass */
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(12px);
}

.menu-scope .lang-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14);
}

.menu-scope .lang-btn.active {
  background: rgba(59, 130, 246, 0.18);
  border-color: rgba(59, 130, 246, 0.55);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18), 0 12px 40px rgba(59, 130, 246, 0.12);
}

/* GRID (Bento) */

.menu-scope .challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--gap-bento);
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 0 2rem;
}

/* CARDS (Surface + subtle border) */

.menu-scope .challenge-card {
  position: relative;
  cursor: pointer;
  padding: 2rem;
  border-radius: var(--radius-xl);

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  background-color: var(--surface);

  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-card);

  transition: transform var(--t), border-color var(--t), box-shadow var(--t), background-color var(--t);
}

.menu-scope .challenge-card:hover {
  transform: translateY(-6px);
  background-color: var(--elevated);
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: var(--shadow-card), var(--shadow-glow);
}

/* Locked state */

.menu-scope .challenge-card.locked {
  opacity: 0.55;
  cursor: not-allowed;
}

.menu-scope .challenge-card.locked:hover {
  transform: none;
  border-color: var(--border-subtle);
  box-shadow: var(--shadow-card);
  background-color: var(--surface);
}

/* Card number (faint) */

.menu-scope .challenge-number {
  position: absolute;
  top: 1.2rem;
  right: 1.4rem;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgba(248, 250, 252, 0.06);
  user-select: none;
}

/* Icon */

.menu-scope .challenge-icon {
  font-size: 2.75rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,0.35));
}

/* Title & meta */

.menu-scope .challenge-card h3 {
  font-size: 1.55rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.menu-scope .challenge-skill {
  color: var(--text-secondary);
  font-size: 0.98rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* STATUS ROW */

.menu-scope .challenge-status {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

/* Badges */

.menu-scope .status-badge {
  padding: 0.42rem 0.95rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: -0.01em;

  /* default */
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);

  transition: box-shadow var(--t), border-color var(--t), transform var(--t);
}

.menu-scope .challenge-card:hover .status-badge {
  transform: translateY(-1px);
}

/* Available (success) */

.menu-scope .status-badge.available {
  background: rgba(16, 185, 129, 0.12);
  color: var(--success);
  border-color: rgba(16, 185, 129, 0.35);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08);
}

/* Locked (muted) */

.menu-scope .status-badge.locked {
  background: rgba(100, 116, 139, 0.14);
  color: var(--text-muted);
  border-color: rgba(148, 163, 184, 0.20);
}

/* Duration (mono) */

.menu-scope .duration {
  font-family: var(--font-mono);
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* FOOTER */

.menu-scope .menu-footer {
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
}

.menu-scope .total-time,
.menu-scope .progress-info {
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

/* INTRO MODAL (Glassmorphism) */

.menu-scope .intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  background: rgba(2, 6, 23, 0.84);
  backdrop-filter: blur(12px);
}

.menu-scope .intro-modal {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;

  border-radius: var(--radius-xl);
  border: 1px solid var(--border-subtle);

  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(12px);

  box-shadow: 0 25px 90px rgba(0, 0, 0, 0.55);
}

/* Primary CTA */

.menu-scope .btn-start-assessment {
  width: 100%;
  padding: 1.35rem 2rem;
  border: 1px solid rgba(59, 130, 246, 0.45);
  border-radius: 20px;

  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.02em;

  cursor: pointer;
  transition: transform var(--t), box-shadow var(--t), filter var(--t);

  background:
    radial-gradient(1200px 200px at 50% 0%, rgba(255,255,255,0.20), transparent 60%),
    linear-gradient(135deg, var(--accent), #2563eb);
  box-shadow:
    0 18px 55px rgba(59, 130, 246, 0.20),
    0 0 0 6px rgba(59, 130, 246, 0.10);
}

.menu-scope .btn-start-assessment:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow:
    0 22px 70px rgba(59, 130, 246, 0.28),
    0 0 0 8px rgba(59, 130, 246, 0.12);
}

