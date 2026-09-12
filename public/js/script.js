/* =====================================================
   MAIN WEBSITE SCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const teamGrid = document.getElementById("teamGrid");

    const modal = document.getElementById("projectModal");

    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalClose =
        document.getElementById("modalClose");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mainNav =
        document.getElementById("mainNav");

    let lastFocusedElement = null;

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =================================================
       SCROLL REVEAL
    ================================================= */

    function initScrollReveal() {

        if (prefersReducedMotion) return;

        const revealTargets = document.querySelectorAll(
            ".section, .team-card, .service-card, .stat-card, .home-project"
        );

        if (!revealTargets.length) return;

        if (!("IntersectionObserver" in window)) {

            revealTargets.forEach(el =>
                el.classList.add("is-visible")
            );

            return;
        }

        revealTargets.forEach(el =>
            el.classList.add("reveal")
        );

        const observer = new IntersectionObserver(
            (entries, obs) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        obs.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );

        revealTargets.forEach(el =>
            observer.observe(el)
        );

    }


    /* =================================================
       MOBILE MENU
    ================================================= */

    if (mobileMenuBtn && mainNav) {

        mobileMenuBtn.addEventListener("click", () => {

            mainNav.classList.toggle("open");

            const icon =
                mobileMenuBtn.querySelector("i");

            if (mainNav.classList.contains("open")) {

                icon.classList.remove("fa-bars");

                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");
            }

        });


        document.querySelectorAll(".nav-link")
            .forEach(link => {

                link.addEventListener("click", () => {

                    mainNav.classList.remove("open");

                    const icon =
                        mobileMenuBtn.querySelector("i");

                    icon.classList.remove("fa-xmark");

                    icon.classList.add("fa-bars");

                });

            });
    }


    /* =================================================
       AVATAR MARKUP (photo or initials fallback)
    ================================================= */

    function getAvatarMarkup(member) {

        if (member.photo) {

            return `<img src="${member.photo}" alt="" loading="lazy">`;

        }

        return member.initials;

    }


    /* =================================================
       TEAM PHOTO ROTATOR
    ================================================= */

    function renderTeamPhotoRotator() {

        const rotator =
            document.getElementById("teamPhotoRotator");

        if (!rotator || typeof teamMembers === "undefined") return;

        if (!teamMembers.length) return;

        rotator.innerHTML = "";

        teamMembers.forEach((member, index) => {

            const slide =
                document.createElement("div");

            slide.className =
                "team-photo-slide" +
                (index === 0 ? " is-active" : "");

            slide.innerHTML = `

                <div class="team-photo-avatar">
                    ${getAvatarMarkup(member)}
                </div>

                <div class="team-photo-caption">

                    <span class="team-photo-name">
                        ${member.name}
                    </span>

                    <span class="team-photo-role">
                        ${member.role}
                    </span>

                </div>

            `;

            rotator.appendChild(slide);

        });


        if (teamMembers.length < 2) return;

        const slides =
            rotator.querySelectorAll(".team-photo-slide");

        let activeIndex = 0;

        setInterval(() => {

            const nextIndex =
                (activeIndex + 1) % slides.length;

            slides[activeIndex].classList.remove(
                "is-active"
            );

            slides[nextIndex].classList.add(
                "is-active"
            );

            activeIndex = nextIndex;

        }, 3000);

    }


    /* =================================================
       RENDER TEAM
    ================================================= */

    function renderTeam() {

        if (!teamGrid) return;

        teamGrid.innerHTML = "";

        teamMembers.forEach(member => {

            const card =
                document.createElement("article");

            card.className = "team-card";

            card.dataset.memberId = member.id;

            card.setAttribute("role", "button");

            card.setAttribute("tabindex", "0");

            card.setAttribute(
                "aria-label",
                `${member.name}, ${member.role}. View projects.`
            );

            card.innerHTML = `

                <div class="team-top">

                    <span class="team-number">
                        ${member.number}
                    </span>

                    <span class="team-arrow">
                        <i class="fa-solid fa-arrow-up-right"></i>
                    </span>

                </div>


                <div class="team-avatar">
                    ${getAvatarMarkup(member)}
                </div>


                <div class="team-info">

                    <h3 class="team-name">
                        ${member.name}
                    </h3>

                    <div class="team-role">
                        ${member.role}
                    </div>

                    <p class="team-description">
                        ${member.description}
                    </p>

                    <div class="team-project-count">
                        ${member.projects.length}
                        PROJECT${member.projects.length === 1 ? "" : "S"}
                        &nbsp;·&nbsp;
                        VIEW WORK
                    </div>

                </div>
            `;


            card.addEventListener("click", () => {

                openMemberModal(member.id, card);

            });


            card.addEventListener("keydown", (event) => {

                if (event.key === "Enter" || event.key === " ") {

                    event.preventDefault();

                    openMemberModal(member.id, card);

                }

            });


            teamGrid.appendChild(card);

        });

    }


    /* =================================================
       OPEN MEMBER MODAL
    ================================================= */

    function openMemberModal(memberId, triggerEl) {

        const member = getMember(memberId);

        if (!member || !modal) return;

        lastFocusedElement =
            triggerEl || document.activeElement;


        document.getElementById("modalNumber")
            .textContent = member.number;

        document.getElementById("modalName")
            .textContent = member.name;

        document.getElementById("modalRole")
            .textContent = member.role;

        document.getElementById("modalDescription")
            .textContent = member.description;


        /* ================================
           SKILLS
        ================================= */

        const skillsContainer =
            document.getElementById("modalSkills");

        skillsContainer.innerHTML = "";

        member.skills.forEach(skill => {

            const skillElement =
                document.createElement("span");

            skillElement.className =
                "modal-skill";

            skillElement.textContent =
                skill;

            skillsContainer.appendChild(
                skillElement
            );

        });


        /* ================================
           PORTFOLIO
        ================================= */

        const portfolio =
            document.getElementById("modalPortfolio");

        if (member.portfolio) {

            portfolio.href =
                member.portfolio;

            portfolio.style.display =
                "inline-flex";

        } else {

            portfolio.style.display =
                "none";

        }


        /* ================================
           PROJECT COUNT
        ================================= */

        document.getElementById("modalProjectCount")
            .textContent =
            `${member.projects.length} PROJECT${member.projects.length === 1 ? "" : "S"}`;


        /* ================================
           PROJECTS
        ================================= */

        const projectsContainer =
            document.getElementById("modalProjects");

        projectsContainer.innerHTML = "";


        if (!member.projects.length) {

            projectsContainer.innerHTML = `
                <div class="empty-projects">
                    NO PROJECTS AVAILABLE YET.
                </div>
            `;

        } else {

            member.projects.forEach(project => {

                const card =
                    document.createElement("article");

                card.className =
                    "modal-project-card";


                let action = "";

            if (project.link) {
            
                action = `
                    <a
                        href="${project.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-view-link"
                    >
                        VIEW PROJECT
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                `;
            
            }


                card.innerHTML = `

                    <div class="modal-project-image">

                        ${getProjectIcon(project.filter)}

                    </div>

                    <div class="modal-project-category">
                        ${project.category}
                    </div>

                    <h4>
                        ${project.name}
                    </h4>

                    <p>
                        ${project.description}
                    </p>

                    <div class="modal-project-footer">

                        <span class="project-status">
                            ● ${project.status}
                        </span>

                        ${action}

                    </div>

                `;


                projectsContainer.appendChild(card);

            });

        }


        /* ================================
           SHOW MODAL
        ================================= */

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        modalClose.focus();

    }


    /* =================================================
       PROJECT ICON
    ================================================= */

    function getProjectIcon(filter) {

        const icons = {

            ecommerce:
                '<i class="fa-solid fa-cart-shopping"></i>',

            backend:
                '<i class="fa-solid fa-database"></i>',

            ai:
                '<i class="fa-solid fa-wand-magic-sparkles"></i>',

            web:
                '<i class="fa-solid fa-code"></i>',

            uiux:
                '<i class="fa-solid fa-pen-ruler"></i>',

            interactive:
                '<i class="fa-solid fa-cube"></i>'

        };

        return icons[filter] ||
            '<i class="fa-solid fa-code"></i>';
    }


    /* =================================================
       CLOSE MODAL
    ================================================= */

    function closeModal() {

        if (!modal) return;

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

        if (lastFocusedElement) {

            lastFocusedElement.focus();

            lastFocusedElement = null;

        }

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeModal
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeModal();

            }

        }
    );


    /* =================================================
       FOCUS TRAP (MODAL)
    ================================================= */

    if (modal) {

        modal.addEventListener("keydown", (event) => {

            if (
                event.key !== "Tab" ||
                !modal.classList.contains("active")
            ) return;

            const focusable = modal.querySelectorAll(
                'button, [href], input, [tabindex]:not([tabindex="-1"])'
            );

            if (!focusable.length) return;

            const first = focusable[0];

            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {

                event.preventDefault();

                last.focus();

            } else if (!event.shiftKey && document.activeElement === last) {

                event.preventDefault();

                first.focus();

            }

        });

    }


    /* =================================================
       ACTIVE NAVIGATION
    ================================================= */

    const sections =
        document.querySelectorAll("section[id]");

    const navLinks =
        document.querySelectorAll(
            '.nav-link[href^="#"]'
        );


    let scrollTicking = false;

    function updateActiveNav() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 150;

            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ) {

                link.classList.add("active");

            }

        });

        scrollTicking = false;

    }

    window.addEventListener(
        "scroll",
        () => {

            if (scrollTicking) return;

            scrollTicking = true;

            window.requestAnimationFrame(updateActiveNav);

        },
        { passive: true }
    );

    /* =================================================
   HOME PROJECT SHOWCASE
================================================= */

function renderHomeProjects() {

    const projectsContainer =
        document.getElementById("homeProjects");

    if (!projectsContainer || !teamMembers) return;


    /*
       Get projects from every team member.
       This uses the same project data already used
       by the developer modal.
    */

    const allProjects = [];


    teamMembers.forEach(member => {

        if (!member.projects) return;


        member.projects.forEach(project => {

            allProjects.push({

                ...project,

                memberName:
                    member.name,

                memberRole:
                    member.role

            });

        });

    });


    /*
       Limit the homepage showcase.

       The full list remains available on
       projects.html.
    */

    const featuredProjects =
        allProjects.slice(0, 6);


    projectsContainer.innerHTML = "";


    featuredProjects.forEach(
        (project, index) => {


            const article =
                document.createElement("article");

            article.className =
                "home-project";


            /*
               Project preview

               Only use an iframe when a live
               project URL exists.
            */

            let preview = "";


            if (project.link) {

                preview = `

                    <iframe
                        src="${project.link}"
                        loading="lazy"
                        title="${project.name} website preview"
                        onload="this.classList.add('is-loaded')"
                        onerror="this.closest('.home-project-preview').innerHTML = '<div class=&quot;home-project-no-preview&quot;><i class=&quot;fa-solid fa-triangle-exclamation&quot;></i><span>PREVIEW UNAVAILABLE</span></div>'"
                    ></iframe>

                    <div
                        class="home-project-preview-label"
                    >

                        <i class="fa-solid fa-circle"></i>

                        LIVE WEBSITE

                    </div>

                `;

            } else {

                preview = `

                    <div
                        class="home-project-no-preview"
                    >

                        <i class="fa-solid fa-code"></i>

                        <span>
                            PROJECT PREVIEW
                        </span>

                    </div>

                `;

            }


            /*
               Technologies
            */

            let technologies = "";


            if (
                project.tech &&
                Array.isArray(project.tech)
            ) {

                technologies =
                    project.tech
                        .slice(0, 5)
                        .map(tech => `
                            <span>
                                ${tech}
                            </span>
                        `)
                        .join("");

            }


            /*
               Project link
            */

            let viewLink = "";


            if (project.link) {

                viewLink = `

                    <a
                        href="${project.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="home-project-view"
                    >

                        VIEW PROJECT

                        <i class="fa-solid fa-arrow-up-right"></i>

                    </a>

                `;

            } else {

                viewLink = `

                    <a
                        href="projects.html"
                        class="home-project-view"
                    >

                        VIEW DETAILS

                        <i class="fa-solid fa-arrow-right"></i>

                    </a>

                `;

            }


            article.innerHTML = `

                <div class="home-project-preview">

                    ${preview}

                </div>


                <div class="home-project-info">


                    <div class="home-project-top">

                        <span class="home-project-number">

                            ${String(index + 1)
                                .padStart(2, "0")}

                        </span>


                        <span class="home-project-category">

                            ${project.category || "PROJECT"}

                        </span>

                    </div>


                    <h3>
                        ${project.name}
                    </h3>


                    <p class="home-project-description">

                        ${project.description || ""}

                    </p>


                    <div class="home-project-tech">

                        ${technologies}

                    </div>


                    <div class="home-project-footer">

                        <span class="home-project-status">

                            ${project.status || "ACTIVE"}

                        </span>


                        <span class="home-project-member">

                            ${project.memberName}

                        </span>


                        ${viewLink}

                    </div>

                </div>

            `;


            projectsContainer.appendChild(article);

        }
    );

}
    /* =================================================
       INITIALIZE
    ================================================= */

    renderTeam();
    renderTeamPhotoRotator();
    renderHomeProjects();
    initScrollReveal();

});