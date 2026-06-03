var galleryIsActive = false;
let isDragging = false;
let previousMouseX = 0;
let activeWrapper = null;

// A-Frame Camera
const cameraEl = document.querySelector('a-camera');

// Object instances
const _xm5model = document.querySelector('#xm5model');
const guitar = document.querySelector('#guitar');
const goethe = document.querySelector('#goethe');
const mephisto = document.querySelector('#mephisto');
const charlotte = document.querySelector('#charlotte');

const headerEl = document.querySelector('#header');
const projectTextEl = document.querySelector('#projectText');
const profilePictureEL = document.querySelector('#profilePicture');

const videoPlane = document.querySelector('#projectVideo');
const videoEl = document.querySelector('#videoPlayer');

const _rotationArrowEL = document.querySelector('#rotationArrow');


// clickable instances
const _projectRTM = document.querySelector('#projectRTM');
const _project2 = document.querySelector('#project2');
const _project3 = document.querySelector('#project3');
const _aboutMe = document.querySelector('#aboutMe');
const _homepage = document.querySelector('#homepage');
const _puppetsButton = document.querySelector('#puppetsButton');
const _3dGallery = document.querySelector('#Gallery');
const _XM5picture = document.querySelector('#XMpicture');
const _guitarPicture = document.querySelector('#guitarPicture');
const xm5Wrapper = document.querySelector('#xm5-wrapper');
const guitarWrapper = document.querySelector('#guitar-wrapper');

function handleSelection() {
    const raycaster = cameraEl.components.raycaster;
    const intersections = raycaster.intersectedEls;

    if (intersections.length > 0) {
        const selected = intersections[0];
        const selectedId = selected.id;

        //Disable all
        HandlePuppets(false);
        _xm5model.setAttribute('visible', false);
        guitar.setAttribute('visible', false);
        videoPlane.setAttribute('visible', false);
        videoEl.pause();
        headerEl.setAttribute('visible', false);
        projectTextEl.setAttribute('visible', false);
        _puppetsButton.setAttribute('visible', false);
        profilePictureEL.setAttribute('visible', false);
        _XM5picture.setAttribute('visible', false);
        _guitarPicture.setAttribute('visible', false);
        _rotationArrowEL.setAttribute('visible', false);


        // show only selected project
        switch (selectedId) {
            case "projectRTM":
                galleryIsActive = false;

                // header
                headerEl.setAttribute('visible', true)
                headerEl.setAttribute('value', 'Rescue The Moon (2023)');
                // text
                projectTextEl.setAttribute('visible', true);
                projectTextEl.setAttribute('value', 'Rescue The Moon is a singleplayer RPG C# coding project I was working on for 5 months during the ' +
                    'second semester of my Augmented and Virtual Reality Design studies (made with Unity).');

                // elements
                playProjectVideo('assets/Videos/RTM.mp4');
                break;

            case "project2":
                galleryIsActive = false;

                // header
                headerEl.setAttribute('visible', true)
                headerEl.setAttribute('value', 'Goethe’s Puppet Theater (2025)');
                // text
                projectTextEl.setAttribute('visible', true);
                projectTextEl.setAttribute('value', 'A mixed reality application, created with Unity. We combined AI with motion captured animations to bring puppets from Goethes universe to live.');
                // elements
                playProjectVideo('assets/Videos/GPT.mp4');
                _puppetsButton.setAttribute('visible', true);
                break;

            case "project3":
                galleryIsActive = false;
                // header
                headerEl.setAttribute('visible', true)
                headerEl.setAttribute('value', 'Ascension to Olympus (2024)');
                // text
                projectTextEl.setAttribute('visible', true);
                projectTextEl.setAttribute('value', '"An environment showcase in the ancient Greek style, developed using Unreal Engine 5. In this project, I applied various guidance techniques that I learned in a universal level design course to orient the player through the level.');
                // elements
                playProjectVideo('videos/AtO.mp4');
                break;

            case "aboutMe":
                galleryIsActive = false;
                profilePictureEL.setAttribute('visible', true);
                projectTextEl.setAttribute('visible', true);
                projectTextEl.setAttribute('value', 'Hello, I\'m Aaron Höhn – an XR Designer and Developer based in Germany (Heidelberg/Darmstadt).\n' +
                    'With a strong focus on Technical Art, I’m passionate about blending the real and virtual worlds through emerging technologies. I\'m driven by curiosity and creativity, always exploring new ways to bring innovative ideas to life in immersive and interactive experiences.');
                break;
                
            case "Gallery":
                if (!galleryIsActive) 
                {
                    galleryIsActive = true;
                    _XM5picture.setAttribute('visible', true);
                    _guitarPicture.setAttribute('visible', true)
                }
                else 
                {
                    galleryIsActive = false;
                    _XM5picture.setAttribute('visible', false);
                    _guitarPicture.setAttribute('visible', false)
                }
                
                break;
                
            default:
                console.log("no project");
        }
    }
}

function playProjectVideo(src) {
    videoEl.setAttribute('src', src);
    videoEl.load();
    videoEl.currentTime = 0;

    videoEl.oncanplay = () => {
        videoPlane.setAttribute('visible', true);
        videoEl.play();
    };
}

function OpenHomepage()
{
window.location.href = '../index.html';
}

function HandlePuppets(condition)
{
    goethe.setAttribute('visible', condition)
    mephisto.setAttribute('visible', condition);
    charlotte.setAttribute('visible', condition);
}

function OnPuppetButtonPressed()
{
    if(_puppetsButton.getAttribute('visible')) {
        HandlePuppets(true);
        headerEl.setAttribute('visible', false)
        projectTextEl.setAttribute('visible', false);
        videoPlane.setAttribute('visible', false);
        videoEl.pause();
    }
}

function HandleGallery() {
    if (xm5Wrapper) xm5Wrapper.object3D.rotation.set(0, 0, 0);
    if (guitarWrapper) guitarWrapper.object3D.rotation.set(0, 0, 0);
    const raycaster = cameraEl.components.raycaster;
    const intersections = raycaster.intersectedEls;

    if (intersections.length > 0) {
        const selected = intersections[0];
        const selectedId = selected.id;

        // deactivate all models and wrapper
        _xm5model.setAttribute('visible', false);
        guitar.setAttribute('visible', false);
        xm5Wrapper.setAttribute('visible', false);
        guitarWrapper.setAttribute('visible', false);
        activeWrapper = null;

        switch (selectedId) {
            case "XMpicture":
                if (_XM5picture.getAttribute('visible')) {
                    xm5Wrapper.setAttribute('visible', true);
                    _xm5model.setAttribute('visible', true);
                    activeWrapper = xm5Wrapper;
                    _rotationArrowEL.setAttribute('visible', true);
                }
                break;

            case "guitarPicture":
                if (_guitarPicture.getAttribute('visible')) {
                    guitarWrapper.setAttribute('visible', true);
                    guitar.setAttribute('visible', true);
                    activeWrapper = guitarWrapper;
                    _rotationArrowEL.setAttribute('visible', true);
                }
                break;

            default:
                console.log("no gallery project");
        }
    }
}



// Event listeners
_projectRTM.addEventListener('click', handleSelection);
_projectRTM.addEventListener('touchstart', handleSelection);
_project2.addEventListener('click', handleSelection);
_project2.addEventListener('touchstart', handleSelection);
_project3.addEventListener('click', handleSelection);
_project3.addEventListener('touchstart', handleSelection);
_aboutMe.addEventListener('click', handleSelection);
_aboutMe.addEventListener('touchstart', handleSelection);
_homepage.addEventListener('click', OpenHomepage);
_homepage.addEventListener('touchstart', OpenHomepage);
_puppetsButton.addEventListener('click', OnPuppetButtonPressed);
_puppetsButton.addEventListener('touchstart', OnPuppetButtonPressed);
_3dGallery.addEventListener('click', handleSelection);
_3dGallery.addEventListener('touchstart', handleSelection);
_XM5picture.addEventListener('click', HandleGallery);
_XM5picture.addEventListener('touchstart', HandleGallery);
_guitarPicture.addEventListener('click', HandleGallery);
_guitarPicture.addEventListener('touchstart', HandleGallery);



// Logic for ui
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector('#custom-scanning-overlay');
    const sceneEl = document.querySelector('a-scene');

    // wait till scene is loaded
    sceneEl.addEventListener("loaded", () => {
        const mindarTarget = sceneEl.querySelector('[mindar-image-target]');

        mindarTarget.addEventListener("targetFound", () => {
            // target was detected → hide overlay
            overlay.classList.add("hidden");
        });

        // unhide when target lost
        mindarTarget.addEventListener("targetLost", () => {
            overlay.classList.remove("hidden");
        });
    });
});


// ----------------------- Object rotation --------------------------------

document.addEventListener('mousemove', (e) => {
    if (!isDragging || !activeWrapper) return;

    const deltaX = e.clientX - previousMouseX;
    previousMouseX = e.clientX;

    const currentRotation = activeWrapper.getAttribute('rotation');
    activeWrapper.setAttribute('rotation', {
        x: currentRotation.x,
        y: currentRotation.y,
        z: currentRotation.z + deltaX * 0.5
    });
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging || !activeWrapper) return;

    const deltaX = e.touches[0].clientX - previousMouseX;
    previousMouseX = e.touches[0].clientX;

    const currentRotation = activeWrapper.getAttribute('rotation');
    activeWrapper.setAttribute('rotation', {
        x: currentRotation.x,
        y: currentRotation.y,
        z: currentRotation.z + deltaX * 0.5
    });
});

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousMouseX = e.touches[0].clientX;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});