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
                const cardCenter = rect.top + rect.height / 2;
                const distance = Math.abs(viewportCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

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
                    video.currentTime = 0;
                }
            });
        };

        window.addEventListener('scroll', checkCenterProject, { passive: true });
        window.addEventListener('resize', checkCenterProject);
        
        setTimeout(checkCenterProject, 300);
    }

    // --- 3. Lightbox (Bild- & Video-Zoom mit Navigation & Beschreibungstext) Logik ---
    let modal = document.getElementById('image-modal');
    
    // Falls das Modal gar nicht existiert, erstellen wir es komplett neu
    if (!modal) {
        const modalHTML = `
            <div id="image-modal" class="modal">
                <span class="close">&times;</span>
                <div id="lightbox-caption" class="lightbox-caption"></div>
                <button class="lightbox-nav-btn lightbox-prev">&#10094;</button>
                <div id="lightbox-container" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%;">
                    <!-- Inhalt wird dynamisch injiziert -->
                </div>
                <button class="lightbox-nav-btn lightbox-next">&#10095;</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('image-modal');
    }

    // Falls das Modal da war, aber die innere Struktur für das dynamische Skript fehlt (wie im alten Zustand der HTML)
    let container = document.getElementById("lightbox-container");
    if (!container && modal) {
        // Fallback: Nutze das vorhandene full-image oder baue die Struktur im bestehenden Modal um
        const staticImg = document.getElementById("full-image");
        if (staticImg) {
            // Umhülle das Bild mit dem benötigten Container, falls nicht vorhanden
            container = document.createElement('div');
            container.id = "lightbox-container";
            container.style.cssText = "display:flex; justify-content:center; align-items:center; width:100%; height:100%;";
            staticImg.parentNode.insertBefore(container, staticImg);
            container.appendChild(staticImg);
        }
    }

    const captionContainer = document.getElementById("lightbox-caption");
    const prevBtn = modal.querySelector(".lightbox-prev");
    const nextBtn = modal.querySelector(".lightbox-next");

    let currentMediaElements = [];
    let currentIndex = 0;

    // Funktion, die das Medium basierend auf dem aktuellen Index rendert
    function renderLightboxElement() {
        if (!container) return;
        container.innerHTML = ""; // Container leeren
        const activeElement = currentMediaElements[currentIndex];

        if (!activeElement) return;

        // --- Beschreibungstext setzen ---
        const captionText = activeElement.getAttribute('data-caption');
        if (captionContainer) {
            if (captionText) {
                captionContainer.textContent = captionText;
                captionContainer.style.display = 'block';
            } else {
                captionContainer.style.display = 'none';
            }
        }

        // --- Medium rendern ---
        if (activeElement.tagName.toLowerCase() === 'video') {
            const videoEl = document.createElement('video');
            videoEl.src = activeElement.src;
            videoEl.className = "modal-content";
            videoEl.controls = true;
            videoEl.autoplay = true;
            container.appendChild(videoEl);
        } else {
            const imgEl = document.createElement('img');
            imgEl.src = activeElement.src;
            imgEl.className = "modal-content";
            imgEl.alt = "Lightbox Ansicht";
            container.appendChild(imgEl);
        }
    }

    function showNext() {
        if (currentMediaElements.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentMediaElements.length;
        renderLightboxElement();
    }

    function showPrev() {
        if (currentMediaElements.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentMediaElements.length) % currentMediaElements.length;
        renderLightboxElement();
    }

    // Klick auf ein Galerie-Element
    document.addEventListener('click', (e) => {
        if (e.target.matches('.zoomable')) {
            currentMediaElements = Array.from(document.querySelectorAll('.zoomable'));
            currentIndex = currentMediaElements.indexOf(e.target);

            if (modal) {
                modal.style.display = "flex"; // Nutze flex für saubere Zentrierung
                renderLightboxElement();
            }
        }
    });

    // Event Listener für die Pfeil-Buttons (nur wenn sie existieren)
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });
    }

    // Tastatur-Support (Pfeiltasten links/rechts + Esc)
    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === "flex") {
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "Escape") closeModal();
        }
    });

    function closeModal() {
        if (!modal) return;
        modal.style.display = "none";
        if (container) {
            const activeVideo = container.querySelector('video');
            if (activeVideo) {
                activeVideo.pause();
            }
            container.innerHTML = "";
        }
        if (captionContainer) {
            captionContainer.textContent = "";
        }
    }

    // Schließen bei Klick auf Hintergrund oder Schließen-Symbol
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close') || e.target === container) {
                closeModal();
            }
        });
    }

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