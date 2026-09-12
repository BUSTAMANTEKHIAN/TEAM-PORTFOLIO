/* =====================================================
   PROFESSIONAL PROJECTS PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const projectsContainer =
        document.getElementById("allProjects");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const previewModal =
        document.getElementById("livePreviewModal");

    const totalProjectCountEl =
        document.getElementById("totalProjectCount");

    const visibleProjectCountEl =
        document.getElementById("visibleProjectCount");


    if (!projectsContainer) return;


    /* =================================================
       PROJECT DATA
    ================================================= */

    const projects =
        typeof getAllProjects === "function"
            ? getAllProjects()
            : [];

    if (totalProjectCountEl) {

        totalProjectCountEl.textContent =
            String(projects.length);

    }


    /* =================================================
       RENDER PROJECTS
    ================================================= */

    function renderProjects(filter = "all") {

        const filteredProjects =
            filter === "all"
                ? projects
                : projects.filter(
                    project =>
                        project.filter === filter
                );


        if (visibleProjectCountEl) {

            visibleProjectCountEl.textContent =
                String(filteredProjects.length);

        }


        projectsContainer.innerHTML = "";


        if (!filteredProjects.length) {

            projectsContainer.innerHTML = `

                <div class="projects-empty">

                    <i class="fa-regular fa-folder-open"></i>

                    <h3>
                        More projects coming soon.
                    </h3>

                    <p>
                        This category doesn't have a live
                        project available yet.
                    </p>

                </div>

            `;

            return;

        }


        filteredProjects.forEach(
            (project, index) => {

                const card =
                    document.createElement("article");

                card.className =
                    "professional-project-card";


                const hasLiveWebsite =
                    Boolean(
                        project.link &&
                        project.link !== "#"
                    );


                /* ================================
                   LIVE PREVIEW
                ================================= */

                let previewHTML = "";


                if (hasLiveWebsite) {

                    previewHTML = `

                        <div class="live-browser">

                            <div class="live-browser-bar">

                                <div
                                    class="browser-dots"
                                >
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>


                                <div
                                    class="browser-address"
                                >

                                    <i
                                        class="fa-solid fa-lock"
                                    ></i>

                                    ${getDomain(
                                        project.link
                                    )}

                                </div>


                                <button
                                    class="browser-open"
                                    type="button"
                                    data-open-live="${escapeAttribute(
                                        project.link
                                    )}"
                                    title="Open live website"
                                >

                                    <i
                                        class="fa-solid fa-arrow-up-right-from-square"
                                    ></i>

                                </button>

                            </div>


                            <div
                                class="live-website-frame"
                            >

                                <iframe
                                    src="${escapeAttribute(
                                        project.link
                                    )}"
                                    title="${escapeAttribute(
                                        project.name
                                    )} live website preview"
                                    loading="lazy"
                                    referrerpolicy="strict-origin-when-cross-origin"
                                    onload="this.classList.add('is-loaded')"
                                    onerror="this.closest('.live-browser').innerHTML = '<div class=&quot;project-no-live&quot;><i class=&quot;fa-solid fa-triangle-exclamation&quot;></i><span>PREVIEW UNAVAILABLE</span><small>SITE COULDN&#039;T BE LOADED</small></div>'"
                                ></iframe>


                                <div
                                    class="live-preview-hint"
                                >

                                    <i
                                        class="fa-solid fa-hand-pointer"
                                    ></i>

                                    SCROLL TO EXPLORE

                                </div>

                            </div>

                        </div>

                    `;

                } else {

                    previewHTML = `

                        <div
                            class="project-no-live"
                        >

                            <i
                                class="fa-solid fa-compass-drafting"
                            ></i>

                            <span>
                                LIVE PREVIEW UNAVAILABLE
                            </span>

                            <small>
                                PROJECT LINK COMING SOON
                            </small>

                        </div>

                    `;

                }


                /* ================================
                   TECH
                ================================= */

                const techHTML =
                    (project.tech || [])
                        .map(
                            tech =>
                                `<span>${escapeHTML(
                                    tech
                                )}</span>`
                        )
                        .join("");


                /* ================================
                   CARD
                ================================= */

                card.innerHTML = `

                    <div class="professional-project-number">

                        ${String(index + 1)
                            .padStart(2, "0")}

                    </div>


                    ${previewHTML}


                    <div class="professional-project-content">

                        <div class="professional-project-meta">

                            <span>
                                ${escapeHTML(
                                    project.category ||
                                    "PROJECT"
                                )}
                            </span>


                            <span
                                class="project-live-status"
                            >

                                ${hasLiveWebsite
                                    ? "● LIVE"
                                    : "○ OFFLINE"}

                            </span>

                        </div>


                        <h2>
                            ${escapeHTML(
                                project.name
                            )}
                        </h2>


                        <p>
                            ${escapeHTML(
                                project.description ||
                                ""
                            )}
                        </p>


                        <div class="professional-project-tech">

                            ${techHTML}

                        </div>


                        <div
                            class="professional-project-bottom"
                        >

                            <div>

                                <span
                                    class="project-by"
                                >
                                    BUILT BY
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        project.memberName
                                    )}
                                </strong>

                            </div>


                            <div
                                class="professional-project-actions"
                            >

                                ${
                                    hasLiveWebsite

                                        ? `

                                            <button
                                                class="live-preview-button"
                                                type="button"
                                                data-preview="${escapeAttribute(
                                                    project.link
                                                )}"
                                                data-title="${escapeAttribute(
                                                    project.name
                                                )}"
                                            >

                                                LIVE PREVIEW

                                                <i
                                                    class="fa-solid fa-expand"
                                                ></i>

                                            </button>


                                            <a
                                                href="${escapeAttribute(
                                                    project.link
                                                )}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="project-live-link"
                                            >

                                                OPEN LIVE

                                                <i
                                                    class="fa-solid fa-arrow-up-right"
                                                ></i>

                                            </a>

                                        `

                                        : `

                                            <span
                                                class="project-coming-soon"
                                            >
                                                DETAILS COMING SOON
                                            </span>

                                        `

                                }

                            </div>

                        </div>

                    </div>

                `;


                projectsContainer.appendChild(card);

            }
        );


        attachProjectActions();

    }


    /* =================================================
       LIVE PREVIEW ACTIONS
    ================================================= */

    function attachProjectActions() {

        document
            .querySelectorAll(
                "[data-preview]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        openLivePreview(
                            button.dataset.preview,
                            button.dataset.title
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                "[data-open-live]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        window.open(
                            button.dataset.openLive,
                            "_blank",
                            "noopener,noreferrer"
                        );

                    }
                );

            });

    }


    /* =================================================
       FULLSCREEN LIVE PREVIEW
    ================================================= */

    function openLivePreview(
        url,
        title
    ) {

        if (!previewModal) {

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            return;

        }


        const frame =
            previewModal.querySelector(
                "#livePreviewFrame"
            );

        const titleElement =
            previewModal.querySelector(
                "#livePreviewTitle"
            );


        if (frame) {

            frame.src = url;

        }


        if (titleElement) {

            titleElement.textContent =
                title;

        }


        previewModal.classList.add(
            "active"
        );

        document.body.classList.add(
            "preview-open"
        );

    }


    /* =================================================
       CLOSE PREVIEW
    ================================================= */

    function closeLivePreview() {

        if (!previewModal) return;


        previewModal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "preview-open"
        );


        const frame =
            previewModal.querySelector(
                "#livePreviewFrame"
            );


        if (frame) {

            frame.src =
                "about:blank";

        }

    }


    if (previewModal) {

        const closeButton =
            previewModal.querySelector(
                "#livePreviewClose"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeLivePreview
            );

        }


        previewModal
            .querySelector(
                ".live-preview-backdrop"
            )
            ?.addEventListener(
                "click",
                closeLivePreview
            );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                previewModal?.classList.contains(
                    "active"
                )
            ) {

                closeLivePreview();

            }

        }
    );


    /* =================================================
       FILTERS
    ================================================= */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                renderProjects(
                    button.dataset.filter ||
                    "all"
                );

            }
        );

    });


    /* =================================================
       HELPERS
    ================================================= */

    function getDomain(url) {

        try {

            return new URL(url)
                .hostname
                .replace(
                    /^www\./,
                    ""
                );

        } catch {

            return "LIVE WEBSITE";

        }

    }


    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function escapeAttribute(value) {

        return escapeHTML(value);

    }


    /* =================================================
       INITIALIZE
    ================================================= */

    renderProjects("all");

});