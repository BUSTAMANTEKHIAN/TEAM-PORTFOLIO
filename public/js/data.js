/* Central portfolio content. Only list information present in project sources. */
export const studio = {
  name: "DEV_STUDIO",
  tagline: "Team Portfolio",
  email: "khianbustamante1@gmail.com",
  description: "A small development and design team building websites, applications, and interfaces."
};

export const teamMembers = [
  { id: "chris", number: "01", name: "Chrisjohn B. Pacay", role: "Full Stack Developer", filter: "fullstack", initials: "CP", photo: "images/developer/chris.png", description: "Full stack developer.", skills: [], github: "", portfolio: "", projectIds: [] },
  { id: "khian", number: "02", name: "Khian D. Bustamante", role: "Front End Developer", filter: "frontend", initials: "KB", photo: "images/developer/khian.png", description: "Front end developer.", skills: [], github: "", portfolio: "https://khian-personal-portfolio.pages.dev/", projectIds: ["ykb-clothing", "yankii-barber-co"] },
  { id: "weejay", number: "03", name: "Weejay P. Regalla", role: "Backend Developer", filter: "backend", initials: "WR", photo: "", description: "Backend developer.", skills: [], github: "", portfolio: "", projectIds: [] },
  { id: "euline", number: "04", name: "Euline M. Refamonte", role: "Web Designer", filter: "designer", initials: "ER", photo: "", description: "Web designer.", skills: [], github: "", portfolio: "", projectIds: [] },
  { id: "jayzee", number: "05", name: "Jayzee Lance Artillagas", role: "Developer / Designer", filter: "fullstack", initials: "JA", photo: "", description: "Developer and designer.", skills: [], github: "", portfolio: "https://jayzee-lance-portfolio.pages.dev/", projectIds: ["greencab", "alamo-apartments", "jayzee-portfolio"] },
  { id: "ben", number: "06", name: "Ben Molina", role: "Designer", filter: "designer", initials: "BM", photo: "", description: "Designer.", skills: [], github: "", portfolio: "", projectIds: [] }
];

export const projects = [
  {
    id: "ykb-clothing", name: "YKB Clothing", category: "E-Commerce", filter: "ecommerce", filters: ["ecommerce", "web"], featured: true, status: "LIVE",
    description: "Clothing e-commerce project.", overview: "Clothing e-commerce project.", problem: "", solution: "", features: [], tech: [], memberIds: ["khian"], images: ["images/projects/ykb-clothing.png"], live: "https://ykb-ecommerce-production.up.railway.app/", repo: ""
  },
  {
    id: "yankii-barber-co", name: "YANKIII BARBER CO.", category: "Web Application", filter: "web", filters: ["web"], featured: true, status: "ACTIVE",
    description: "Professional barbershop and salon booking system project. Live preview unavailable.", overview: "Professional barbershop and salon booking system project.", problem: "", solution: "", features: [], tech: [], memberIds: ["khian"], images: ["images/projects/barber.png"], live: "https://yankiii-barber-co.vercel.app/", repo: ""
  },
  {
    id: "greencab", name: "GreenCab", category: "Web Development", filter: "web", filters: ["web"], featured: true, status: "LIVE",
    description: "GreenCab project listed in Jayzee's existing portfolio data.", overview: "GreenCab project listed in Jayzee's existing portfolio data.", problem: "", solution: "", features: [], tech: [], memberIds: ["jayzee"], images: ["images/projects/greenCab.png"], live: "https://greencab-new.web.app/", repo: ""
  },
  {
    id: "alamo-apartments", name: "Alamo Apartments", category: "Web Development", filter: "web", filters: ["web"], featured: true, status: "LIVE",
    description: "Alamo Apartments project listed in Jayzee's existing portfolio data.", overview: "Alamo Apartments project listed in Jayzee's existing portfolio data.", problem: "", solution: "", features: [], tech: [], memberIds: ["jayzee"], images: ["images/projects/alamo.png"], live: "https://plainsstudio.com/", repo: ""
  },
  {
    id: "jayzee-portfolio", name: "Jayzee Lance Portfolio", category: "Website", filter: "web", filters: ["web"], featured: false, status: "LIVE",
    description: "Jayzee's personal portfolio.", overview: "Jayzee's personal portfolio.", problem: "", solution: "", features: [], tech: [], memberIds: ["jayzee"], images: [], live: "https://jayzee-lance-portfolio.pages.dev/", repo: ""
  },
  {
    id: "cphs-archive", name: "CPHS Archive", category: "Website", filter: "web", filters: ["web"], featured: false, status: "ARCHIVED",
    description: "Archived project listed in the existing portfolio data. Project URL unavailable.", overview: "Archived project listed in the existing portfolio data.", problem: "", solution: "", features: [], tech: [], memberIds: ["jayzee"], images: [], live: "", repo: ""
  },
  {
    id: "nemt-solutions", name: "NEMT Solutions", category: "Website", filter: "web", filters: ["web"], featured: false, status: "ARCHIVED",
    description: "Archived project listed in the existing portfolio data. Project URL unavailable.", overview: "Archived project listed in the existing portfolio data.", problem: "", solution: "", features: [], tech: [], memberIds: ["jayzee"], images: [], live: "", repo: ""
  }
];

export const services = [
  { id: "web", title: "Web Development", summary: "Websites and web applications.", detail: "The team includes front end, full stack, and backend development roles." },
  { id: "design", title: "Web Design", summary: "Web design and digital interfaces.", detail: "The team includes web and visual design roles." }
];
export const technologies = [];
export function getMember(id) { return teamMembers.find((member) => member.id === id); }
export function getProject(id) { return projects.find((project) => project.id === id); }
export function membersForProject(project) { return (project.memberIds || []).map(getMember).filter(Boolean); }
export function projectsForMember(member) { return (member.projectIds || []).map(getProject).filter(Boolean); }
