document.addEventListener('DOMContentLoaded', () => {

    // --- 1. "Show More Projects" Logik mit localStorage ---
    const showMoreBtn = document.getElementById('btn-toggle-projects');
    const moreProjectsContainer = document.getElementById('more-projects-container');

    if (showMoreBtn && moreProjectsContainer) {
        if (localStorage.getItem("projectsExpanded") === "true") {
            moreProjectsContainer.classList.remove('hidden-content');
            moreProjectsContainer.classList.add('show-content');
            showMoreBtn.textContent = 'Show Less';
        }

        showMoreBtn.addEventListener('click', () => {
            const isHidden = moreProjectsContainer.classList.contains('hidden-content');
            if (isHidden) {
                moreProjectsContainer.classList.remove('hidden-content');
                moreProjectsContainer.classList.add('show-content');
                showMoreBtn.textContent = 'Show Less';
                localStorage.setItem("projectsExpanded", "true");
            } else {
                moreProjectsContainer.classList.remove('show-content');
                moreProjectsContainer.classList.add('hidden-content');
                showMoreBtn.textContent = 'Show More Projects';
                localStorage.setItem("projectsExpanded", "false");
                moreProjectsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    // --- 2. Project Card Hover & Auto-Play (Intersection Observer) ---
    // Desktop: Hover, Mobile: Scroll-In-View
    const observerOptions = {
        root: null,
        threshold: 0.5 // Startet, sobald das Element zur Hälfte sichtbar ist
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.hover-gif');
            if (!video) return;

            if (entry.isIntersecting) {
                video.play().catch(e => console.log("Autoplay blockiert:", e));
            } else {
                video.pause();
                video.currentTime = 0; // Setzt Video bei Verlassen zurück[cite: 16]
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => {
        // Desktop Hover Logik beibehalten
        const video = card.querySelector('.hover-gif');
        if (video) {
            card.addEventListener('mouseenter', () => video.play());
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
            // Intersection Observer zur Beobachtung hinzufügen
            videoObserver.observe(card);
        }
    });

    // --- 3. Lightbox (Bild-Zoom) Logik ---
    if (!document.getElementById('image-modal')) {
        const modalHTML = `
            <div id="image-modal" class="modal">
                <span class="close">&times;</span>
                <img class="modal-content" id="full-image">
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("full-image");

    document.addEventListener('click', (e) => {
        if (e.target.matches('.zoomable')) {
            modal.style.display = "block";
            modalImg.src = e.target.src;
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close')) {
            modal.style.display = "none";
        }
    });

    // --- 4. Side Back Button Logik ---
    const sideBtn = document.getElementById('side-back-button');
    if (sideBtn) {
        document.addEventListener('mousemove', (e) => {
            if (e.clientX < 200) {
                sideBtn.classList.add('is-visible');
            } else {
                sideBtn.classList.remove('is-visible');
            }
        });
    }

    // --- 5. Scroll-Position speichern und wiederherstellen ---
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (isIndexPage) {
        window.addEventListener('beforeunload', () => {
            localStorage.setItem("scrollPosition", window.scrollY);
        });

        window.addEventListener('load', () => {
            const savedScroll = localStorage.getItem("scrollPosition");
            if (savedScroll) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScroll));
                }, 100);
            }
        });
    } else {
        window.scrollTo(0, 0);
    }
});