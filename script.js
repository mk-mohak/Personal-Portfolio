import * as framerMotion from "https://esm.run/framer-motion";

document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();
    const { animate, stagger } = framerMotion;
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        // Check if the user has scrolled more than 50px from the top
        if (window.scrollY > 50) {
            // If scrolled, add the blurred background and a shadow
            navbar.classList.add("bg-ivory/80", "backdrop-blur-md", "shadow-lg");
        } else {
            // If at the top, remove the classes to make it transparent
            navbar.classList.remove("bg-ivory/80", "backdrop-blur-md", "shadow-lg");
        }
    });

    // Mobile menu elements
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileNavLinks = mobileMenu.querySelectorAll(".mobile-nav-link");

    const openMenu = () => {
        mobileMenuButton.classList.add("open");
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("flex");

        animate(
            mobileMenu,
            { opacity: [0, 1], scale: [0.95, 1] },
            { duration: 0.3, ease: "easeOut" }
        ).finished.then(() => {
            document.body.style.overflow = "hidden";
        });
    };

    const closeMenu = () => {
        mobileMenuButton.classList.remove("open");
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");

        document.body.style.overflow = "";
    };

    mobileMenuButton.addEventListener("click", () => {
        if (mobileMenu.classList.contains("hidden")) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // Smooth scroll for internal links
    const allNavLinks = document.querySelectorAll(
        'nav a[href^="#"], footer a[href^="#"], a.mobile-nav-link[href^="#"]'
    );
    const sections = document.querySelectorAll("section[id]");
    allNavLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href.startsWith("#")) {
                e.preventDefault();
                const target = document.getElementById(href.slice(1));
                if (target) target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Active link on scroll
    const updateActiveLink = () => {
        let current = "";
        sections.forEach((sec) => {
            if (window.pageYOffset >= sec.offsetTop - window.innerHeight * 0.66) {
                current = sec.getAttribute("id");
            }
        });
        allNavLinks.forEach((link) => {
            link.classList.remove("active", "text-lavender", "font-semibold");
            if (link.getAttribute("href") === `#${current}`)
                link.classList.add("active", "text-lavender", "font-semibold");
            else if (link.closest("#navbar"))
                link.classList.remove("text-lavender", "font-semibold");
        });
    };
    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();

    const rippleButtons = document.querySelectorAll(".ripple-button");
    rippleButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement("span");

            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            ripple.classList.add("ripple");

            const existingRipple = button.querySelector(".ripple");
            if (existingRipple) existingRipple.remove();

            button.appendChild(ripple);

            ripple.addEventListener("animationend", () => {
                ripple.remove();
            });
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseFloat(element.dataset.animationDelay) || 0;
                let initialX = 0;

                if (
                    element.classList.contains("timeline-item") &&
                    window.innerWidth >= 768
                ) {
                    const parent = element.parentElement;
                    if (parent) {
                        const children = Array.from(parent.children).filter((child) =>
                            child.classList.contains("timeline-item")
                        );
                        const index = children.indexOf(element);
                        initialX = index % 2 !== 0 ? 50 : -50;
                    }
                }

                animate(
                    element,
                    {
                        opacity: [0, 1],
                        y: [element.classList.contains("section-title") ? 20 : 40, 0],
                        x: [initialX, 0],
                    },
                    { duration: 0.7, delay: delay, ease: "easeOut" }
                );
                observer.unobserve(element);
            }
        });
    };

    const intersectionObserver = new IntersectionObserver(
        observerCallback,
        observerOptions
    );

    document.querySelectorAll(".animated-element").forEach((el, index) => {
        el.style.opacity = 0;
        if (!el.dataset.animationDelay) {
            if (
                !el.classList.contains("timeline-item") &&
                !el.closest(".passion-badge")
            ) {
                el.dataset.animationDelay = (index % 4) * 0.1;
            }
        }
        intersectionObserver.observe(el);
    });

    document.querySelectorAll(".moment-card").forEach((card) => {
        const anchorHref = card.getAttribute("href") || "";
        let videoId = "";

        const matchV = anchorHref.match(/[?&]v=([^&]+)/);
        const matchShort = anchorHref.match(/youtu\.be\/([^?&]+)/);

        if (matchV && matchV[1]) {
            videoId = matchV[1];
        } else if (matchShort && matchShort[1]) {
            videoId = matchShort[1];
        }

        if (videoId) {
            // Find the <img> within this card and set its src
            const imgTag = card.querySelector("img");
            if (imgTag) {
                imgTag.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                imgTag.alt = `Video thumbnail for ${videoId}`;
            }
        }
    });

    console.log("Devanshi Dubey’s portfolio scripts initialized.");
});
