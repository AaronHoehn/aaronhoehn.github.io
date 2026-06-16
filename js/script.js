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

    // --- 2. Project Card Hover (Desktop) & Center-Scroll Auto-Play (Mobile) ---
    const projectCards = document.querySelectorAll('.project-card');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        // --- DESKTOP LOGIK (Hover) ---
        projectCards.forEach(card => {
            const video = card.querySelector('.hover-gif');
            if (video) {
                card.addEventListener('mouseenter', () => {
                    video.play().catch(e => console.log("Playback blocked:", e));
                });
                card.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        });
    } else {
        // --- MOBILE LOGIK (Center-Scroll) ---
        const checkCenterProject = () => {
            const viewportCenter = window.innerHeight / 2;
            let closestCard = null;
            let minDistance = Infinity;

            projectCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                // Berechne die vertikale Mitte der aktuellen Projektkarte
                const cardCenter = rect.top + rect.height / 2;
                // Abstand zur Bildschirmmitte ermitteln
                const distance = Math.abs(viewportCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

            // Aktivieren der zentralen Karte, Deaktivieren aller anderen
            projectCards.forEach(card => {
                const video = card.querySelector('.hover-gif');
                if (!video) return;

                if (card === closestCard) {
                    if (video.paused) {
                        card.classList.add('is-active');
                        video.play().catch(e => console.log("Autoplay blocked on mobile:", e));
                    }
                } else {
                    card.classList.remove('is-active');
                    video.pause();
                    video.currentTime = 0; // Setzt das Video bei Verlassen zurück
                }
            });
        };

        // Event-Listener für geschmeidiges Tracking beim Scrollen auf dem Smartphone
        window.addEventListener('scroll', checkCenterProject, { passive: true });
        window.addEventListener('resize', checkCenterProject);
        
        // Initialer Aufruf mit minimaler Verzögerung nach dem Laden der Seite
        setTimeout(checkCenterProject, 300);
    }

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