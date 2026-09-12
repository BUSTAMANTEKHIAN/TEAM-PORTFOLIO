/* =====================================================
   TEAM PORTFOLIO DATA
   Single source of truth for:
   - Team members
   - Skills
   - Projects
   - Live project links

   ADDING A REAL PHOTO:
   1. Put the image file in an "images" folder next to
      index.html, e.g. images/khian.jpg
   2. Set that member's "photo" field below to the path,
      e.g. photo: "images/khian.jpg"
   3. Leave "photo" as an empty string ("") to keep
      showing the initials placeholder instead.
   Recommended: square photos, at least 300x300px.
===================================================== */

const teamMembers = [

    /* =================================================
       01 — KHIAN
    ================================================= */

    {
        id: "khian",
        number: "01",

        name: "KHIAN BUSTAMANTE",

        role: "Frontend Developer",

        initials: "KB",

        photo: "images/developer/khian.png",

        description:
            "Frontend developer focused on building responsive, polished, and functional web experiences with strong attention to detail.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Node.js",
            "Express",
            "MySQL",
            "Figma",
            "Git"
        ],

        portfolio:
                "",

        projects: [

            {
                name: "YKB CLOTHING",

                category: "E-COMMERCE",

                filter: "ecommerce",

                description:
                    "A complete clothing e-commerce platform featuring product browsing, authentication, cart, admin command, wishlist, checkout, orders, and backend database integration.",

                tech: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Node.js",
                    "Express",
                    "MySQL"
                ],

                status: "LIVE",

                link:
                    "https://ykb-ecommerce-production.up.railway.app/"
            },

            {
                name: "INVENTORY MANAGEMENT SYSTEM",

                category: "WEB APPLICATION",

                filter: "web",

                description:
                    "A web-based inventory management solution designed to organize products, stock information, and business records.",

                tech: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Node.js",
                    "MySQL"
                ],

                status: "PROJECT",

                link: ""
            },

            {
                name: "AI PHOTO EDITOR",

                category: "AI / SOFTWARE",

                filter: "ai",

                description:
                    "An image editing concept focused on intelligent image processing and accessible editing workflows.",

                tech: [
                    "Python",
                    "AI",
                    "Image Processing"
                ],

                status: "CONCEPT",

                link: ""
            }

        ]
    },


    /* =================================================
       02 — CHRIS
    ================================================= */

    {
        id: "chris",

        number: "02",

        name: "CHRIS JOHN PACAY",

        role: "Full Stack Developer",

        initials: "CP",

        photo: "images/developer/chris.png",

        description:
            "Full stack developer focused on connecting modern interfaces with reliable backend systems and practical application architecture.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Node.js",
            "Express",
            "MySQL",
            "Git"
        ],

        portfolio: "",

        projects: [

            {
                name: "FULL STACK PROJECT",

                category: "WEB APPLICATION",

                filter: "web",

                description:
                    "A full stack web application combining frontend interfaces, backend functionality, and database integration.",

                tech: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Node.js",
                    "MySQL"
                ],

                status: "PROJECT",

                link: ""
            }

        ]
    },


    /* =================================================
       03 — JAYZEE
    ================================================= */

    {
        id: "jayzee",

        number: "03",

        name: "JAYZEE ARTILLAGAS",

        role: "Full Stack Developer",

        initials: "JA",

        photo: "images/developer/jayzee.png",

        description:
            "Full stack developer creating interactive websites, digital experiences, and modern web interfaces.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Firebase",
            "Node.js",
            "UI / UX"
        ],

        portfolio:
            "https://jayzee-lance-portfolio.pages.dev/",

        projects: [

            {
                name: "GREENCAB",

                category: "WEB APPLICATION",

                filter: "web",

                description:
                    "A live web experience built for GreenCab with a modern frontend and Firebase-powered functionality.",

                tech: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Firebase"
                ],

                status: "LIVE",

                link:
                    "https://greencab-new.web.app/"
            },

            {
                name: "ALAMO APARTMENTS",

                category: "WEBSITE",

                filter: "web",

                description:
                    "A modern property-focused website experience developed with JavaScript and Firebase technologies.",

                tech: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Firebase"
                ],

                status: "LIVE",

                link:
                    "https://plainsstudio.com/"
            },

            {
                name: "CPHS ARCHIVE",

                category: "WEB PROJECT",

                filter: "web",

                description:
                    "An archived web project presented as part of Jayzee's portfolio work.",

                tech: [
                    "HTML",
                    "CSS",
                    "JavaScript"
                ],

                status: "ARCHIVED",

                link:
                    "https://jayzee-lance-portfolio.pages.dev/"
            },

            {
                name: "NEMT SOLUTIONS",

                category: "WEB PROJECT",

                filter: "web",

                description:
                    "An archived website project showcasing web development and interface work.",

                tech: [
                    "HTML",
                    "CSS",
                    "JavaScript"
                ],

                status: "ARCHIVED",

                link:
                    "https://jayzee-lance-portfolio.pages.dev/"
            }

        ]
    },


    /* =================================================
       04 — WEEJAY
    ================================================= */

    {
        id: "weejay",

        number: "04",

        name: "WEEJAY REGALLA",

        role: "Backend Developer",

        initials: "WR",

        photo: "images/developer/weejay.png",

        description:
            "Backend developer focused on APIs, databases, server-side logic, and reliable application infrastructure.",

        skills: [
            "Node.js",
            "Express",
            "MySQL",
            "REST API",
            "JavaScript",
            "Python"
        ],

        portfolio: "",

        projects: [

            {
                name: "BACKEND SYSTEM",

                category: "BACKEND",

                filter: "backend",

                description:
                    "A backend-focused project involving API architecture, server-side logic, and structured database integration.",

                tech: [
                    "Node.js",
                    "Express",
                    "MySQL",
                    "REST API"
                ],

                status: "PROJECT",

                link: ""
            }

        ]
    },


    /* =================================================
       05 — EULINE
    ================================================= */

    {
        id: "euline",

        number: "05",

        name: "EULINE REFAMONTE",

        role: "UI / UX Designer",

        initials: "ER",

        photo: "images/developer/euline.png",

        description:
            "UI/UX designer focused on clean interfaces, visual hierarchy, responsive layouts, and thoughtful user experiences.",

        skills: [
            "Figma",
            "UI Design",
            "UX Design",
            "Wireframing",
            "Prototyping",
            "Design Systems"
        ],

        portfolio: "",

        projects: [

            {
                name: "UI / UX DESIGN SYSTEM",

                category: "UI / UX",

                filter: "uiux",

                description:
                    "A visual design project focused on interface structure, usability, layout systems, and responsive experiences.",

                tech: [
                    "Figma",
                    "UI",
                    "UX"
                ],

                status: "DESIGN",

                link: ""
            }

        ]
    },


    /* =================================================
       06 — BEN MOLINA
    ================================================= */

    {
        id: "ben",

        number: "06",

        name: "BEN MOLINA",

        role: "Designer",

        initials: "BM",

        photo: "images/developer/ben.png",

        description:
            "Designer focused on creating clean visual systems, strong layouts, and engaging digital experiences.",

        skills: [
            "Figma",
            "UI Design",
            "UX Design",
            "Visual Design",
            "Wireframing",
            "Prototyping"
        ],

        portfolio: "",

        projects: []

    }

];


/* =====================================================
   HELPERS
===================================================== */

function getMember(memberId) {

    return teamMembers.find(
        member => member.id === memberId
    );

}


function getAllProjects() {

    return teamMembers.flatMap(member =>

        member.projects.map(project => ({

            ...project,

            memberId: member.id,

            memberName: member.name,

            memberRole: member.role

        }))

    );

}