/* ===== VIDEO ADMIN PANEL — script.js ===== */

// --- Storage helpers ---
function getVideos() {
    return JSON.parse(localStorage.getItem('admin_videos') || '[]');
}
function saveVideos(videos) {
    localStorage.setItem('admin_videos', JSON.stringify(videos));
}
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// --- Flash messages ---
function showFlash(message, type) {
    var container = document.getElementById('flash-container');
    if (!container) return;
    var msg = document.createElement('div');
    msg.className = 'flash-msg ' + type;
    msg.innerHTML =
        '<span>' + message + '</span>' +
        '<button class="flash-close" aria-label="Close">&times;</button>';
    container.appendChild(msg);
    msg.querySelector('.flash-close').addEventListener('click', function () {
        dismissFlash(msg);
    });
    setTimeout(function () { dismissFlash(msg); }, 4000);
}
function dismissFlash(el) {
    if (!el || el.classList.contains('flash-out')) return;
    el.classList.add('flash-out');
    setTimeout(function () { el.remove(); }, 300);
}

// --- Form validation ---
function validateField(input, errorId, rules) {
    var val = input.value.trim();
    var errEl = document.getElementById(errorId);
    var group = input.closest('.form-group');
    var msg = '';
    if (rules.required && !val) msg = 'This field is required';
    else if (rules.minLength && val.length < rules.minLength) msg = 'Minimum ' + rules.minLength + ' characters';
    else if (rules.isUrl && val && !/^https?:\/\/.+/i.test(val)) msg = 'Enter a valid URL (https://...)';
    if (msg) {
        if (errEl) errEl.textContent = msg;
        if (group) group.classList.add('has-error');
        return false;
    }
    if (errEl) errEl.textContent = '';
    if (group) group.classList.remove('has-error');
    return true;
}

function validateForm(prefix) {
    var p = prefix || '';
    var valid = true;
    valid = validateField(document.getElementById(p + 'video-title') || document.getElementById(p + 'title'),
        p + 'error-title', { required: true, minLength: 3 }) && valid;
    valid = validateField(document.getElementById(p + 'video-category') || document.getElementById(p + 'category'),
        p + 'error-category', { required: true }) && valid;
    valid = validateField(document.getElementById(p + 'video-description') || document.getElementById(p + 'description'),
        p + 'error-description', { required: true, minLength: 10 }) && valid;
    valid = validateField(document.getElementById(p + 'video-thumbnail') || document.getElementById(p + 'thumbnail'),
        p + 'error-thumbnail', { required: true, isUrl: true }) && valid;
    valid = validateField(document.getElementById(p + 'video-embed') || document.getElementById(p + 'embed'),
        p + 'error-embed', { required: true, isUrl: true }) && valid;
    return valid;
}

// --- Update stats & badge ---
function updateStats() {
    var videos = getVideos();
    var totalEl = document.querySelector('#stat-total .stat-number');
    var featEl = document.querySelector('#stat-featured .stat-number');
    var catEl = document.querySelector('#stat-categories .stat-number');
    var badge = document.getElementById('video-count-badge');
    if (totalEl) totalEl.textContent = videos.length;
    if (featEl) featEl.textContent = videos.filter(function (v) { return v.featured; }).length;
    if (catEl) {
        var cats = {};
        videos.forEach(function (v) { if (v.category) cats[v.category] = true; });
        catEl.textContent = Object.keys(cats).length;
    }
    if (badge) badge.textContent = videos.length + ' Video' + (videos.length !== 1 ? 's' : '');
}

// --- Render table ---
function renderTable(filter) {
    var tbody = document.getElementById('video-table-body');
    var empty = document.getElementById('empty-state');
    var table = document.getElementById('video-table');
    if (!tbody) return;
    var videos = getVideos();
    if (filter) {
        var q = filter.toLowerCase();
        videos = videos.filter(function (v) {
            return v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) ||
                v.description.toLowerCase().includes(q);
        });
    }
    tbody.innerHTML = '';
    if (videos.length === 0) {
        if (table) table.classList.add('hidden');
        if (empty) empty.classList.remove('hidden');
        return;
    }
    if (table) table.classList.remove('hidden');
    if (empty) empty.classList.add('hidden');
    videos.forEach(function (v) {
        var tr = document.createElement('tr');
        var dateStr = v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
        tr.innerHTML =
            '<td class="td-thumb"><img src="' + escHtml(v.thumbnail) + '" alt="' + escHtml(v.title) + '" onerror="this.src=\'data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;80&quot; height=&quot;48&quot;><rect fill=&quot;%231a1d2e&quot; width=&quot;80&quot; height=&quot;48&quot;/><text x=&quot;40&quot; y=&quot;28&quot; fill=&quot;%238b8fa8&quot; font-size=&quot;10&quot; text-anchor=&quot;middle&quot;>No img</text></svg>\'"></td>' +
            '<td class="td-title">' + escHtml(v.title) + '<div class="td-desc">' + escHtml(v.description) + '</div></td>' +
            '<td class="td-category"><span>' + escHtml(v.category) + '</span></td>' +
            '<td class="td-featured"><span class="badge-featured ' + (v.featured ? 'badge-yes' : 'badge-no') + '">' + (v.featured ? '★ Yes' : 'No') + '</span></td>' +
            '<td class="td-date">' + dateStr + '</td>' +
            '<td class="td-actions">' +
            '<a href="./edit.html?id=' + v.id + '" class="btn-edit">Edit</a>' +
            '<button class="btn-delete" data-id="' + v.id + '" data-title="' + escHtml(v.title) + '">Delete</button>' +
            '</td>';
        tbody.appendChild(tr);
    });
    // Attach delete listeners
    tbody.querySelectorAll('.btn-delete').forEach(function (btn) {
        btn.addEventListener('click', function () { openDeleteModal(btn.dataset.id, btn.dataset.title); });
    });
}

function escHtml(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

// --- Delete modal ---
var deleteTargetId = null;
function openDeleteModal(id, title) {
    deleteTargetId = id;
    var modal = document.getElementById('delete-modal');
    var nameEl = document.getElementById('modal-video-name');
    if (nameEl) nameEl.textContent = title;
    if (modal) modal.classList.add('active');
}
function closeDeleteModal() {
    var modal = document.getElementById('delete-modal');
    if (modal) modal.classList.remove('active');
    deleteTargetId = null;
}
function confirmDelete() {
    if (!deleteTargetId) return;
    var videos = getVideos().filter(function (v) { return v.id !== deleteTargetId; });
    saveVideos(videos);
    closeDeleteModal();
    renderTable();
    updateStats();
    showFlash('Video deleted successfully.', 'success');
}

// --- Init: Admin dashboard (admin.html) ---
function initAdmin() {
    // Toggle form
    var toggleBtn = document.getElementById('btn-toggle-form');
    var form = document.getElementById('add-video-form');
    if (toggleBtn && form) {
        toggleBtn.addEventListener('click', function () {
            form.classList.toggle('collapsed');
            toggleBtn.classList.toggle('collapsed');
        });
    }
    // Add video
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateForm('')) return;
            var video = {
                id: generateId(),
                title: document.getElementById('video-title').value.trim(),
                category: document.getElementById('video-category').value,
                description: document.getElementById('video-description').value.trim(),
                thumbnail: document.getElementById('video-thumbnail').value.trim(),
                embed_url: document.getElementById('video-embed').value.trim(),
                featured: document.getElementById('video-featured').checked,
                createdAt: new Date().toISOString()
            };
            var videos = getVideos();
            videos.unshift(video);
            saveVideos(videos);
            form.reset();
            renderTable();
            updateStats();
            showFlash('Video "' + video.title + '" added successfully!', 'success');
        });
    }
    // Search
    var searchInput = document.getElementById('search-videos');
    if (searchInput) {
        searchInput.addEventListener('input', function () { renderTable(searchInput.value); });
    }
    // Delete modal buttons
    var cancelDel = document.getElementById('btn-cancel-delete');
    var confirmDel = document.getElementById('btn-confirm-delete');
    var modalOverlay = document.getElementById('delete-modal');
    if (cancelDel) cancelDel.addEventListener('click', closeDeleteModal);
    if (confirmDel) confirmDel.addEventListener('click', confirmDelete);
    if (modalOverlay) modalOverlay.addEventListener('click', function (e) { if (e.target === modalOverlay) closeDeleteModal(); });

    renderTable();
    updateStats();
}

// --- Init: Edit page (edit.html) ---
function initEdit() {
    var params = new URLSearchParams(window.location.search);
    var videoId = params.get('id');
    if (!videoId) { window.location.href = './admin.html'; return; }
    var videos = getVideos();
    var video = videos.find(function (v) { return v.id === videoId; });
    if (!video) {
        showFlash('Video not found.', 'error');
        setTimeout(function () { window.location.href = './admin.html'; }, 1500);
        return;
    }
    // Fill form
    document.getElementById('edit-video-id').value = video.id;
    document.getElementById('edit-title').value = video.title;
    document.getElementById('edit-category').value = video.category;
    document.getElementById('edit-description').value = video.description;
    document.getElementById('edit-thumbnail').value = video.thumbnail;
    document.getElementById('edit-embed').value = video.embed_url;
    document.getElementById('edit-featured').checked = video.featured;
    // Preview
    var prevThumb = document.getElementById('preview-thumbnail');
    var prevTitle = document.getElementById('preview-title');
    var prevCat = document.getElementById('preview-category');
    if (prevThumb) prevThumb.src = video.thumbnail;
    if (prevTitle) prevTitle.textContent = video.title;
    if (prevCat) prevCat.textContent = video.category;
    // Submit
    var form = document.getElementById('edit-video-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateForm('edit-')) return;
            var idx = videos.findIndex(function (v) { return v.id === videoId; });
            if (idx === -1) return;
            videos[idx].title = document.getElementById('edit-title').value.trim();
            videos[idx].category = document.getElementById('edit-category').value;
            videos[idx].description = document.getElementById('edit-description').value.trim();
            videos[idx].thumbnail = document.getElementById('edit-thumbnail').value.trim();
            videos[idx].embed_url = document.getElementById('edit-embed').value.trim();
            videos[idx].featured = document.getElementById('edit-featured').checked;
            saveVideos(videos);
            showFlash('Video updated successfully!', 'success');
            setTimeout(function () { window.location.href = './admin.html'; }, 1200);
        });
    }
}

// --- Boot ---
document.addEventListener('DOMContentLoaded', function () {
    var isEdit = window.location.pathname.includes('edit.html');
    if (isEdit) { initEdit(); } else { initAdmin(); }
});
