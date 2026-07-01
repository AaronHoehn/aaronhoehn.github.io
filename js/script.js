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
    if (!document.getElementById('image-modal')) {
        const modalHTML = `
            <div id="image-modal" class="modal">
                <span class="close">&times;</span>
                
                <!-- HIER: Das neue Textfeld für deine Erklärungen oben drüber -->
                <div id="lightbox-caption" class="lightbox-caption"></div>
                
                <button class="lightbox-nav-btn lightbox-prev">&#10094;</button>
                <div id="lightbox-container" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%;">
                    <!-- Inhalt wird dynamisch injiziert -->
                </div>
                <button class="lightbox-nav-btn lightbox-next">&#10095;</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById("image-modal");
    const container = document.getElementById("lightbox-container");
    const captionContainer = document.getElementById("lightbox-caption");
    const prevBtn = modal.querySelector(".lightbox-prev");
    const nextBtn = modal.querySelector(".lightbox-next");

    let currentMediaElements = [];
    let currentIndex = 0;

    // Funktion, die das Medium basierend auf dem aktuellen Index rendert
    function renderLightboxElement() {
        container.innerHTML = ""; // Container leeren
        const activeElement = currentMediaElements[currentIndex];

        if (!activeElement) return;

        // --- Beschreibungstext setzen ---
        const captionText = activeElement.getAttribute('data-caption');
        if (captionText) {
            captionContainer.textContent = captionText;
            captionContainer.style.display = 'block';
        } else {
            captionContainer.style.display = 'none'; // Verstecken, falls kein Text hinterlegt wurde
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
            container.appendChild(imgEl);
        }
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentMediaElements.length;
        renderLightboxElement();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentMediaElements.length) % currentMediaElements.length;
        renderLightboxElement();
    }

    // Klick auf ein Galerie-Element
    document.addEventListener('click', (e) => {
        if (e.target.matches('.zoomable')) {
            currentMediaElements = Array.from(document.querySelectorAll('.zoomable'));
            currentIndex = currentMediaElements.indexOf(e.target);

            modal.style.display = "block";
            renderLightboxElement();
        }
    });

    // Event Listener für die Pfeil-Buttons
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Tastatur-Support (Pfeiltasten links/rechts + Esc)
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "block") {
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "Escape") closeModal();
        }
    });

    function closeModal() {
        modal.style.display = "none";
        const activeVideo = container.querySelector('video');
        if (activeVideo) {
            activeVideo.pause();
        }
        container.innerHTML = "";
        captionContainer.textContent = ""; // Text leeren beim Schließen
    }

    // Schließen bei Klick auf Hintergrund oder Schließen-Symbol
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close') || e.target === container) {
            closeModal();
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