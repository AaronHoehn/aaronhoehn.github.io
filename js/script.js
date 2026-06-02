// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const showMoreBtn = document.getElementById('btn-toggle-projects');
    const moreProjectsContainer = document.getElementById('more-projects-container');

    // Sicherheitsabfrage, falls der Button auf einer Unterseite mal nicht existiert
    if (showMoreBtn && moreProjectsContainer) {
        showMoreBtn.addEventListener('click', () => {
            if (moreProjectsContainer.classList.contains('hidden-content')) {
                // Einblenden
                moreProjectsContainer.classList.remove('hidden-content');
                moreProjectsContainer.classList.add('show-content');
                showMoreBtn.textContent = 'Show Less';
            } else {
                // Wieder einklappen
                moreProjectsContainer.classList.remove('show-content');
                moreProjectsContainer.classList.add('hidden-content');
                showMoreBtn.textContent = 'Show More Projects';
                
                // Scrollt den User sanft nach oben zum Anfang des Grids zurück beim Einklappen
                moreProjectsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }
});

document.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('.hover-gif');
    if (video && video.tagName === 'VIDEO') {
        card.addEventListener('mouseenter', () => {
            video.play();
        });
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0; // Setzt das Video auf den Anfang zurück
        });
    }
});