document.addEventListener('DOMContentLoaded', () => {

    // --- 1. "Show More Projects" Logik ---
    const showMoreBtn = document.getElementById('btn-toggle-projects');
    const moreProjectsContainer = document.getElementById('more-projects-container');

    if (showMoreBtn && moreProjectsContainer) {
        showMoreBtn.addEventListener('click', () => {
            if (moreProjectsContainer.classList.contains('hidden-content')) {
                moreProjectsContainer.classList.remove('hidden-content');
                moreProjectsContainer.classList.add('show-content');
                showMoreBtn.textContent = 'Show Less';
            } else {
                moreProjectsContainer.classList.remove('show-content');
                moreProjectsContainer.classList.add('hidden-content');
                showMoreBtn.textContent = 'Show More Projects';
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