/* ── Scroll-reveal ──────────────────────────────────────────────────────── */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.feature-card, .pricing-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ── Smooth nav highlight ───────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${e.target.id}` ? '#f9fafb' : '';
        });
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach(s => sectionObserver.observe(s));

/* ── Stripe checkout for paid plans ────────────────────────────────────── */
const API_BASE = 'https://opsis-backend-production.up.railway.app';

async function checkout(planId, e) {
  const btn = (e || window.event).target.closest('a');
  const original = btn.textContent;
  btn.textContent = 'Redirecting…';
  btn.style.pointerEvents = 'none';

  try {
    const r = await fetch(`${API_BASE}/billing/website-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId }),
    });
    const data = await r.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.detail || 'Something went wrong. Please try again.');
      btn.textContent = original;
      btn.style.pointerEvents = '';
    }
  } catch (e) {
    alert('Could not connect to the server. Please try again.');
    btn.textContent = original;
    btn.style.pointerEvents = '';
  }
}
