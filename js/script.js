// ==========================================================================
// 1. DATA SOURCE: Projects Array of Objects
// ==========================================================================
const projectsData = [
  {
    id: "dapsaka",
    title: "🔐 DAPSAKA: Decentralized Lightweight IoT Authentication Protocol",
    subtitle: "Hardware & Security",
    category: "Hardware & Security",
    badge: "Hardware & Security",
    icon: "🔒",
    mentor: "Independent / Hardware Security",
    teamSize: "Project Team",
    duration: "Recent",
    description: "Designed and implemented a decentralized security protocol and monitoring dashboard for IoT ecosystems. Enables IoT sensors to communicate securely with a local console without relying on external cloud servers. Implements mutual authentication to establish trust between devices while maintaining the privacy of local environmental data. Includes a real-time dashboard for monitoring sensor readings and tracking the health and integrity of secure connections.",
    tags: ["ESP32", "IoT", "Authentication", "Cybersecurity", "Decentralized Security", "Secure Communication", "Local Dashboard", "IoT Sensors"],
    githubUrl: "https://github.com/Noel-Giji",
    demoUrl: "https://github.com/Noel-Giji"
  },
  {
    id: "personalized-health-diet-planner",
    title: "📱 Personalized Health & Diet Planner",
    subtitle: "Mobile & Healthcare",
    category: "Mobile & Healthcare",
    badge: "Mobile & Healthcare",
    icon: "📱",
    mentor: "Software Engineering",
    teamSize: "Project Team",
    duration: "Recent",
    description: "Developed a personalized mobile application using Flutter for the user interface and Python for backend logic. Provides customized fitness and nutritional recommendations based on individual user preferences, with tailored meal planning and health tracking. Demonstrates the integration of mobile front-end design with back-end data processing.",
    tags: ["Flutter", "Python", "Mobile App", "Health Tracking", "Nutrition", "Meal Planning", "Personalization", "Backend Development"],
    githubUrl: "https://github.com/Noel-Giji",
    demoUrl: "https://github.com/Noel-Giji"
  },
  {
    id: "aurasense",
    title: "🌍 AuraSense: Smart IoT Environmental & Air Quality Monitor",
    subtitle: "Hardware & IoT",
    category: "Hardware & IoT",
    badge: "Hardware & IoT",
    icon: "🌍",
    mentor: "IoT Development",
    teamSize: "Project Team",
    duration: "Recent",
    description: "Designed and implemented an IoT-based environmental monitoring framework for collecting and processing real-time air quality data. Integrates hardware sensors with a 3D visualization interface to transform complex environmental metrics into an intuitive visual dashboard, demonstrating the flow of data from physical IoT devices to a user-friendly software interface.",
    tags: ["ESP32", "IoT", "Air Quality Sensors", "Environmental Monitoring", "3D Visualization", "Real-Time Data", "Sensors Dashboard", "Data Processing"],
    githubUrl: "https://github.com/Noel-Giji",
    demoUrl: "https://github.com/Noel-Giji"
  }
];

// ==========================================================================
// 2. BROWSER STORAGE HELPERS
// ==========================================================================
const Storage = {
  getTheme: () => localStorage.getItem("noel-portfolio-theme") || "light",
  setTheme: (theme) => localStorage.setItem("noel-portfolio-theme", theme),
  getFavorites: () => {
    try {
      return JSON.parse(localStorage.getItem("noel-portfolio-favs") || "[]");
    } catch {
      return [];
    }
  },
  toggleFavorite: (id) => {
    const favs = Storage.getFavorites();
    const index = favs.indexOf(id);
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(id);
    }
    localStorage.setItem("noel-portfolio-favs", JSON.stringify(favs));
    return favs;
  },
  isFavorite: (id) => Storage.getFavorites().includes(id),
  isBannerClosed: () => sessionStorage.getItem("noel-banner-closed") === "true",
  setBannerClosed: () => sessionStorage.setItem("noel-banner-closed", "true")
};

// ==========================================================================
// 3. DOM RENDERING: Project Cards
// ==========================================================================
const projectsGrid = document.getElementById("projects-grid");
const favCountEl = document.getElementById("fav-count");
let currentCategoryFilter = "all";
let currentSearchQuery = "";
let showOnlyFavorites = false;

const renderProjects = (projects) => {
  if (!projectsGrid) return;
  const filtered = projects.filter(project => {
    const matchesCategory = currentCategoryFilter === "all" || project.category.toLowerCase() === currentCategoryFilter.toLowerCase();
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || 
      project.title.toLowerCase().includes(query) || 
      project.description.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query));
    
    const matchesFav = !showOnlyFavorites || Storage.isFavorite(project.id);
    return matchesCategory && matchesSearch && matchesFav;
  });

  if (filtered.length === 0) {
    projectsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--bg-secondary, #f8fafc); border-radius: var(--radius-lg, 12px); border: 1px dashed var(--surface-border, #e2e8f0);">
        <p style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</p>
        <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">No Projects Found</h4>
        <p style="color: var(--text-muted, #64748b); font-size: 0.9rem;">Try adjusting your search query or filter criteria.</p>
        <button class="btn btn-outline" style="margin-top: 1rem;" onclick="resetProjectFilters()">Reset Filters</button>
      </div>
    `;
    updateFavoritesCounter();
    return;
  }

  projectsGrid.innerHTML = filtered.map(project => {
    const isFav = Storage.isFavorite(project.id);
    const starIcon = isFav ? "★" : "☆";
    const starTitle = isFav ? "Remove from bookmarks" : "Bookmark this project";
    return `
      <article class="project-card" data-id="${project.id}">
        <div class="project-thumbnail-wrapper">
          <span class="project-category-badge">${project.badge || project.category}</span>
          <button class="project-fav-btn" onclick="handleFavoriteClick('${project.id}', event)" title="${starTitle}" aria-label="${starTitle}">
            <span style="color: ${isFav ? '#eab308' : 'inherit'}; font-size: 1.2rem;">${starIcon}</span>
          </button>
          <div class="project-icon-visual">${project.icon}</div>
        </div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join("")}
          </div>
          <div class="project-actions">
            <button class="btn btn-primary btn-card" onclick="openProjectModal('${project.id}')">
              View Details &rarr;
            </button>
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-card">
              GitHub
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");
  updateFavoritesCounter();
};

const updateFavoritesCounter = () => {
  const count = Storage.getFavorites().length;
  if (favCountEl) {
    favCountEl.textContent = count;
  }
};

window.handleFavoriteClick = (id, event) => {
  if (event) event.stopPropagation();
  Storage.toggleFavorite(id);
  renderProjects(projectsData);
};

window.resetProjectFilters = () => {
  currentCategoryFilter = "all";
  currentSearchQuery = "";
  showOnlyFavorites = false;
  
  const searchInput = document.getElementById("project-search");
  if (searchInput) searchInput.value = "";
  
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === "all");
  });
  const showFavBtn = document.getElementById("show-favorites-btn");
  if (showFavBtn) showFavBtn.textContent = "Toggle Bookmarks View";
  renderProjects(projectsData);
};

// ==========================================================================
// 4. INTERACTIVE UI: Filter & Search Events
// ==========================================================================
document.querySelectorAll(".filter-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentCategoryFilter = button.dataset.category || "all";
    renderProjects(projectsData);
  });
});

const searchInput = document.getElementById("project-search");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;
    renderProjects(projectsData);
  });
}

const showFavoritesBtn = document.getElementById("show-favorites-btn");
if (showFavoritesBtn) {
  showFavoritesBtn.addEventListener("click", () => {
    showOnlyFavorites = !showOnlyFavorites;
    showFavoritesBtn.textContent = showOnlyFavorites ? "Show All Projects" : "Toggle Bookmarks View";
    renderProjects(projectsData);
  });
}

// ==========================================================================
// 5. INTERACTIVE UI: Modal Dialog
// ==========================================================================
const projectModal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");
const modalCloseBtn = document.getElementById("modal-close");

window.openProjectModal = (projectId) => {
  const project = projectsData.find(p => p.id === projectId);
  if (!project || !projectModal || !modalBody) return;
  modalBody.innerHTML = `
    <span class="modal-header-tag">${project.category} &bull; ${project.badge}</span>
    <h3 class="modal-title">${project.title}</h3>
    
    <div class="modal-meta">
      <div><strong>Category:</strong> ${project.category}</div>
    </div>
    <p class="modal-desc">${project.description}</p>
    
    <div class="modal-tech-header">Technologies &amp; Tags:</div>
    <div class="project-tags" style="margin-bottom: 1.5rem;">
      ${project.tags.map(t => `<span class="tech-tag" style="font-size: 0.85rem; padding: 0.25rem 0.65rem;">${t}</span>`).join("")}
    </div>
    <div class="modal-actions">
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        Explore GitHub Repository &rarr;
      </a>
      <button class="btn btn-outline" onclick="closeProjectModal()">Close</button>
    </div>
  `;
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

window.closeProjectModal = () => {
  if (!projectModal) return;
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeProjectModal);
}

if (projectModal) {
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectModal && projectModal.classList.contains("open")) {
    closeProjectModal();
  }
});

// ==========================================================================
// 6. THEME TOGGLE WITH LOCALSTORAGE
// ==========================================================================
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  Storage.setTheme(theme);
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
};

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });
}

// ==========================================================================
// 7. RESPONSIVE MOBILE NAVIGATION
// ==========================================================================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================================================================
// 8. SCROLL-TO-TOP BUTTON
// ==========================================================================
const scrollTopBtn = document.getElementById("scroll-top");

window.addEventListener("scroll", () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==========================================================================
// 9. CLIENT-SIDE FORM VALIDATION WITH REGEX
// ==========================================================================
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const phoneInput = document.getElementById("contact-phone");
const messageInput = document.getElementById("contact-message");
const formAlert = document.getElementById("form-alert");

const REGEX = {
  name: /^[a-zA-Z\s]{3,50}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[6-9]\d{9}$/
};

const validateField = (input, validatorFn, feedbackId, errorMsg) => {
  if (!input) return false;
  const feedbackEl = document.getElementById(feedbackId);
  const val = input.value.trim();
  const isValid = validatorFn(val);

  if (val === "") {
    input.classList.remove("is-valid", "is-invalid");
    if (feedbackEl) {
      feedbackEl.textContent = "This field is required.";
      feedbackEl.className = "validation-message error";
    }
    return false;
  }

  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (feedbackEl) {
      feedbackEl.textContent = "✓ Looks good!";
      feedbackEl.className = "validation-message success";
    }
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    if (feedbackEl) {
      feedbackEl.textContent = errorMsg;
      feedbackEl.className = "validation-message error";
    }
    return false;
  }
};

if (nameInput) {
  nameInput.addEventListener("input", () => validateField(nameInput, val => REGEX.name.test(val), "name-feedback", "Please enter a valid name (3-50 letters only)."));
  nameInput.addEventListener("blur", () => validateField(nameInput, val => REGEX.name.test(val), "name-feedback", "Please enter a valid name (3-50 letters only)."));
}

if (emailInput) {
  emailInput.addEventListener("input", () => validateField(emailInput, val => REGEX.email.test(val), "email-feedback", "Please enter a valid email address."));
  emailInput.addEventListener("blur", () => validateField(emailInput, val => REGEX.email.test(val), "email-feedback", "Please enter a valid email address."));
}

if (phoneInput) {
  phoneInput.addEventListener("input", () => validateField(phoneInput, val => REGEX.phone.test(val), "phone-feedback", "Enter a valid 10-digit mobile number starting with 6-9."));
  phoneInput.addEventListener("blur", () => validateField(phoneInput, val => REGEX.phone.test(val), "phone-feedback", "Enter a valid 10-digit mobile number."));
}

if (messageInput) {
  messageInput.addEventListener("input", () => validateField(messageInput, val => val.length >= 10, "message-feedback", "Message must be at least 10 characters long."));
  messageInput.addEventListener("blur", () => validateField(messageInput, val => val.length >= 10, "message-feedback", "Message must be at least 10 characters long."));
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const isNameValid = validateField(nameInput, val => REGEX.name.test(val), "name-feedback", "Please enter a valid name (3-50 letters only).");
    const isEmailValid = validateField(emailInput, val => REGEX.email.test(val), "email-feedback", "Please enter a valid email address.");
    const isPhoneValid = validateField(phoneInput, val => REGEX.phone.test(val), "phone-feedback", "Enter a valid 10-digit mobile number.");
    const isMessageValid = validateField(messageInput, val => val.length >= 10, "message-feedback", "Message must be at least 10 characters long.");

    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
      const submission = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        message: messageInput.value.trim(),
        submittedAt: new Date().toISOString()
      };
      
      try {
        const previousInquiries = JSON.parse(localStorage.getItem("contact_inquiries") || "[]");
        previousInquiries.push(submission);
        localStorage.setItem("contact_inquiries", JSON.stringify(previousInquiries));
      } catch (err) {
        console.error("Failed saving to local storage", err);
      }

      if (formAlert) {
        formAlert.style.display = "block";
        formAlert.className = "form-alert success";
        formAlert.innerHTML = `✓ Thank you <strong>${submission.name}</strong>! Your message has been recorded.`;
      }

      contactForm.reset();
      document.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid", "is-invalid"));
      document.querySelectorAll(".validation-message").forEach(el => el.textContent = "");

      setTimeout(() => {
        if (formAlert) formAlert.style.display = "none";
      }, 6000);
    } else {
      if (formAlert) {
        formAlert.style.display = "block";
        formAlert.className = "form-alert error";
        formAlert.textContent = "Please resolve the highlighted errors before submitting.";
      }
    }
  });
}

// ==========================================================================
// 10. SESSION GREETING BANNER
// ==========================================================================
const greetingBanner = document.getElementById("greeting-banner");
const closeBannerBtn = document.getElementById("close-banner");

if (closeBannerBtn && greetingBanner) {
  if (Storage.isBannerClosed()) {
    greetingBanner.style.display = "none";
  }
  closeBannerBtn.addEventListener("click", () => {
    greetingBanner.style.display = "none";
    Storage.setBannerClosed();
  });
}

// ==========================================================================
// 11. INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = Storage.getTheme();
  applyTheme(savedTheme);
  renderProjects(projectsData);
  console.log("Noel Giji Madukkammottil Portfolio loaded successfully.");
});