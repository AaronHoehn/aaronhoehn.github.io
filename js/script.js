document.addEventListener('DOMContentLoaded', () => {

    // --- 1. "Show More Projects" Logik mit localStorage ---
    const showMoreBtn = document.getElementById('btn-toggle-projects');
    const moreProjectsContainer = document.getElementById('more-projects-container');

    if (showMoreBtn && moreProjectsContainer) {
        
        // Initialer Check: Status aus localStorage laden
        if (localStorage.getItem("projectsExpanded") === "true") {
            moreProjectsContainer.classList.remove('hidden-content');
            moreProjectsContainer.classList.add('show-content');
            showMoreBtn.textContent = 'Show Less';
        }

        showMoreBtn.addEventListener('click', () => {
            const isHidden = moreProjectsContainer.classList.contains('hidden-content');
            
            if (isHidden) {
                // Aufklappen
                moreProjectsContainer.classList.remove('hidden-content');
                moreProjectsContainer.classList.add('show-content');
                showMoreBtn.textContent = 'Show Less';
                localStorage.setItem("projectsExpanded", "true"); // Speichern
            } else {
                // Zuklappen
                moreProjectsContainer.classList.remove('show-content');
                moreProjectsContainer.classList.add('hidden-content');
                showMoreBtn.textContent = 'Show More Projects';
                localStorage.setItem("projectsExpanded", "false"); // Speichern
                moreProjectsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    // --- 2. Project Card Hover Video Logik ---
    document.querySelectorAll('.project-card').forEach(card => {
        const video = card.querySelector('.hover-gif');
        if (video && video.tagName === 'VIDEO') {
            card.addEventListener('mouseenter', () => video.play());
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
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
});

// --- 5. Scroll-Position speichern und wiederherstellen ---
    
document.addEventListener('DOMContentLoaded', () => {

    // ... (deine vorhandene "Show More" und andere Logik) ...

    // --- 5. Scroll-Position nur auf der Startseite (index.html) wiederherstellen ---
    
    // Wir prüfen, ob wir auf der index.html sind (oder ob es die Wurzel-Seite ist)
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (isIndexPage) {
        // Beim Verlassen der Index-Seite die Position speichern
        window.addEventListener('beforeunload', () => {
            localStorage.setItem("scrollPosition", window.scrollY);
        });

        // Nach dem Laden der Index-Seite zur gespeicherten Position springen
        window.addEventListener('load', () => {
            const savedScroll = localStorage.getItem("scrollPosition");
            if (savedScroll) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScroll));
                }, 100);
            }
        });
    } else {
        // Wenn wir NICHT auf der Index-Seite sind, löschen wir den Scroll-Wert
        // oder ignorieren ihn einfach, damit die Seite oben startet
        window.scrollTo(0, 0);
    }
});