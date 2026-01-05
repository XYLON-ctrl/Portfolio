// Enable smooth scrolling to next/previous section on wheel, stopping at section top
let isScrolling = false;
const sections = document.querySelectorAll('section');
let currentSectionIndex = 0;

function getCurrentSectionIndex() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < bottom) {
            return i;
        }
    }
    return currentSectionIndex;
}

window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    const lastSectionIndex = sections.length - 1;
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex === lastSectionIndex) {
        return;
    }
    const isScrollingDown = e.deltaY > 0;
    if (isScrollingDown && currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
    } else if (!isScrollingDown && currentSectionIndex > 0) {
        currentSectionIndex--;
    } else {
        return;
    }
    const targetSection = sections[currentSectionIndex];
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight;
    isScrolling = true;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}, { passive: false });

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        currentSectionIndex = getCurrentSectionIndex();
    }
});

// Highlight navigation link corresponding to current scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach((link) => {
        link.style.color = '#a0adc7';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#6496ff';
        }
    });
});

// 3D mouse-driven floating for hero content
(function() {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    const maxTranslate = 20;
    const maxRotate = 8;
    const maxZ = 40;
    const ease = 0.08;

    document.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        mouseX = (e.clientX - cx) / rect.width;
        mouseY = (e.clientY - cy) / rect.height;
    });

    document.addEventListener('mouseleave', () => { mouseX = 0; mouseY = 0; });

    function raf() {
        posX += (mouseX - posX) * ease;
        posY += (mouseY - posY) * ease;
        const tx = posX * maxTranslate;
        const ty = posY * maxTranslate;
        const rx = -posY * maxRotate;
        const ry = posX * maxRotate;
        const tz = (Math.abs(posX) + Math.abs(posY)) * maxZ * 0.5;
        hero.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        requestAnimationFrame(raf);
    }
    raf();
})();

// Initialize centered layout immediately
const centered_team_grid = document.querySelector('#about .team-grid');
if (centered_team_grid) {
    centered_team_grid.classList.add('centered');
}

// Apply slide-up animation to team cards when the team grid becomes visible
const teamGrid = document.getElementById('teamGrid');
const team_Cards = teamGrid ? teamGrid.querySelectorAll('.team-member-card') : [];
if (teamGrid && team_Cards.length > 0) {
    const teamGridObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                team_Cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('slide-up-animate');
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1 });
    teamGridObserver.observe(teamGrid);
}

// Handle team card clicks to shift layout left and display member details
const teamCards = document.querySelectorAll('.team-member-card');
const detailPanel = document.querySelector('.team-section-right');
const teamSectionLeft = document.querySelector('.team-section-left');
const aboutTeamWrapper = document.querySelector('.about-team-wrapper');

teamCards.forEach((card) => {
    card.addEventListener('click', () => {
        teamCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        aboutTeamWrapper.classList.add('viewing-detail');
        const name = card.getAttribute('data-name');
        const avatar = card.getAttribute('data-avatar');
        const role = card.getAttribute('data-role');
        const bio = card.getAttribute('data-bio');
        const skillsStr = card.getAttribute('data-skills');
        const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()) : [];
        detailPanel.innerHTML = '';
        const cardImage = card.querySelector('.member-image');
        const imageSrc = cardImage ? cardImage.src : '';
        const panel = document.createElement('div');
        panel.className = 'detail-panel active';
        const skillsHTML = skills.map((skill) => '<span class="skill-tag">' + skill + '</span>').join('');
        panel.innerHTML = `
            <button class="detail-back-btn" id="backToTeamBtn">&larr; Back to Team</button>
            <div class="detail-content-wrapper">
                <div class="detail-top-section">
                    <div class="detail-image-wrapper">
                        ${imageSrc ? `<img src="${imageSrc}" alt="${name}" class="detail-member-image">` : `<div class="detail-avatar">${avatar}</div>`}
                    </div>
                    <div class="detail-info-wrapper">
                        <h2 class="detail-name">${name}</h2>
                        <p class="detail-role">${role}</p>
                        <div class="detail-skills">${skillsHTML}</div>
                    </div>
                </div>
                <p class="detail-bio">${bio}</p>
            </div>
        `;
        detailPanel.appendChild(panel);
        document.getElementById('backToTeamBtn').addEventListener('click', () => {
            aboutTeamWrapper.classList.remove('viewing-detail');
            teamCards.forEach((c) => c.classList.remove('active'));
        });
    });
});

// Apply fade-in animation class to elements as they enter viewport
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// Handle contact form submission with success confirmation message
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    alert(`Thank you, ${name}! Your message has been sent. I'll get back to you at ${email} soon.`);
    this.reset();
});

// --- Navbar toggle behavior ---
(function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navbarNav = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('#navbarNav .nav-link');
    if (!navToggle || !navbarNav) return;

    function closeMenu() {
        navToggle.classList.remove('open');
        navbarNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        navToggle.classList.add('open');
        navbarNav.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
    }

    navToggle.addEventListener('click', (e) => {
        const opened = navToggle.classList.contains('open');
        if (opened) closeMenu(); else openMenu();
    });

    navLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));

    document.addEventListener('click', (e) => {
        if (!navbarNav.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
})();