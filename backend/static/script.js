/* =========================================================
   StreamVault — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll effect ─────────────────────────────── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run once on load
    }

    /* ── Hamburger menu toggle ────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a link is tapped
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });
    }

    /* ── Flash message auto-dismiss ──────────────────────── */
    const flashContainer = document.getElementById('flash-container');
    if (flashContainer) {
        setTimeout(() => {
            flashContainer.querySelectorAll('.flash').forEach(flash => {
                flash.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                flash.style.opacity = '0';
                flash.style.transform = 'translateX(16px)';
                setTimeout(() => flash.remove(), 400);
            });
        }, 4000);
    }

    /* ── Search input – clear on Escape ──────────────────── */
    const searchInputs = document.querySelectorAll('#search-input, .search-hero-input input');
    searchInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { input.value = ''; input.blur(); }
        });
    });

    /* ── Video card stagger animation on load ────────────── */
    const cards = document.querySelectorAll('.video-card');
    if (cards.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = `cardReveal 0.4s ease forwards`;
            card.style.animationDelay = `${i * 0.06}s`;
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }

    /* ── Hero strip hover ────────────────────────────────── */
    const heroStripItems = document.querySelectorAll('.hero-strip-item');
    heroStripItems.forEach(item => {
        item.addEventListener('mouseenter', () => item.style.borderColor = 'rgba(229,9,20,0.5)');
        item.addEventListener('mouseleave', () => item.style.borderColor = '');
    });

    /* ── Scroll-to-top on logo double-click ──────────────── */
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('dblclick', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── Horizontal row drag to scroll ───────────────────── */
    const rows = document.querySelectorAll('.cards-row');
    rows.forEach(row => {
        let isDown = false, startX, scrollLeft;

        row.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
            row.style.cursor = 'grabbing';
        });
        row.addEventListener('mouseleave', () => { isDown = false; row.style.cursor = ''; });
        row.addEventListener('mouseup', () => { isDown = false; row.style.cursor = ''; });
        row.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - row.offsetLeft;
            const walk = (x - startX) * 1.6;
            row.scrollLeft = scrollLeft - walk;
        });
    });

});

/* ── CSS animation injected via JS ───────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes cardReveal {
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);