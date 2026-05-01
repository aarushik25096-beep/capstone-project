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

    /* ================================================================
       ADMIN – Toggle Add Video Form
       ================================================================ */
    const toggleAddFormBtn = document.getElementById('toggle-add-form-btn');
    const addFormWrapper = document.getElementById('admin-add-form');
    const closeAddFormBtn = document.getElementById('close-add-form-btn');
    const cancelAddFormBtn = document.getElementById('cancel-add-form-btn');

    function showAddForm() {
        if (addFormWrapper) {
            addFormWrapper.style.display = 'block';
            toggleAddFormBtn.style.display = 'none';
            addFormWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function hideAddForm() {
        if (addFormWrapper) {
            addFormWrapper.style.display = 'none';
            toggleAddFormBtn.style.display = '';
        }
    }

    if (toggleAddFormBtn) toggleAddFormBtn.addEventListener('click', showAddForm);
    if (closeAddFormBtn) closeAddFormBtn.addEventListener('click', hideAddForm);
    if (cancelAddFormBtn) cancelAddFormBtn.addEventListener('click', hideAddForm);

    /* ================================================================
       ADMIN – Delete Confirmation Modal
       ================================================================ */
    const deleteModal = document.getElementById('delete-modal');
    const deleteVideoName = document.getElementById('delete-video-name');
    const deleteCancelBtn = document.getElementById('delete-cancel-btn');
    const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
    let pendingDeleteForm = null;

    function openDeleteModal(videoTitle, form) {
        if (!deleteModal) return;
        pendingDeleteForm = form;
        deleteVideoName.textContent = `"${videoTitle}"`;
        deleteModal.classList.add('active');
        deleteModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDeleteModal() {
        if (!deleteModal) return;
        deleteModal.classList.remove('active');
        deleteModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        pendingDeleteForm = null;
    }

    // Intercept all delete form submissions
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Get video title from the button's data attribute
            const btn = form.querySelector('[data-video-title]');
            const title = btn ? btn.dataset.videoTitle : 'this video';
            openDeleteModal(title, form);
        });
    });

    // Modal cancel
    if (deleteCancelBtn) {
        deleteCancelBtn.addEventListener('click', closeDeleteModal);
    }

    // Modal confirm – submit the stored form
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', () => {
            if (pendingDeleteForm) {
                pendingDeleteForm.submit();
            }
            closeDeleteModal();
        });
    }

    // Close modal on backdrop click
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && deleteModal && deleteModal.classList.contains('active')) {
            closeDeleteModal();
        }
    });

    /* ================================================================
       ADMIN – Form Validation
       ================================================================ */
    function validateVideoForm(form) {
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
        form.querySelectorAll('.form-input.error, .form-textarea.error').forEach(el => {
            el.classList.remove('error');
        });

        // Title validation
        const titleInput = form.querySelector('[name="title"]');
        if (titleInput) {
            const titleVal = titleInput.value.trim();
            const titleError = titleInput.closest('.form-group').querySelector('.form-error');
            if (!titleVal) {
                isValid = false;
                titleInput.classList.add('error');
                if (titleError) titleError.textContent = 'Title is required.';
            } else if (titleVal.length < 3) {
                isValid = false;
                titleInput.classList.add('error');
                if (titleError) titleError.textContent = 'Title must be at least 3 characters.';
            }
        }

        // Video URL validation
        const urlInput = form.querySelector('[name="video_url"]');
        if (urlInput) {
            const urlVal = urlInput.value.trim();
            const urlError = urlInput.closest('.form-group').querySelector('.form-error');
            if (!urlVal) {
                isValid = false;
                urlInput.classList.add('error');
                if (urlError) urlError.textContent = 'Video URL is required.';
            } else if (!/^https?:\/\/.+/i.test(urlVal)) {
                isValid = false;
                urlInput.classList.add('error');
                if (urlError) urlError.textContent = 'Please enter a valid URL (http:// or https://).';
            }
        }

        // Thumbnail URL – optional but validate format if filled
        const thumbInput = form.querySelector('[name="thumbnail"]');
        if (thumbInput && thumbInput.value.trim()) {
            if (!/^https?:\/\/.+/i.test(thumbInput.value.trim())) {
                isValid = false;
                thumbInput.classList.add('error');
            }
        }

        return isValid;
    }

    // Attach validation to all video forms (add form on admin page, edit form on edit page)
    document.querySelectorAll('#add-video-form, #video-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateVideoForm(form)) {
                e.preventDefault();
                // Scroll to first error
                const firstError = form.querySelector('.form-input.error, .form-textarea.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    });

    // Real-time error clearing on input
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorSpan = input.closest('.form-group')?.querySelector('.form-error');
            if (errorSpan) errorSpan.textContent = '';
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