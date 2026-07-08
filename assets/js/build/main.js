"use strict";
// ============================================================
// STATIC & STEMS — shared site behavior
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    /* ---------- preloader ---------- */
    const pre = document.getElementById("preloader");
    if (pre) {
        window.addEventListener("load", () => {
            setTimeout(() => pre.classList.add("hidden"), 350);
        });
        // fallback in case load already fired
        setTimeout(() => pre.classList.add("hidden"), 1800);
    }
    /* ---------- header scroll state + progress bar ---------- */
    const header = document.querySelector("header");
    const progress = document.getElementById("scroll-progress");
    const backToTop = document.getElementById("back-to-top");
    function onScroll() {
        const y = window.scrollY;
        if (header)
            header.classList.toggle("scrolled", y > 30);
        if (backToTop)
            backToTop.classList.toggle("show", y > 600);
        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = h > 0 ? `${(y / h) * 100}%` : "0%";
        }
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (backToTop) {
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
    /* ---------- mobile menu ---------- */
    const toggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    if (toggle && mobileMenu) {
        toggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", mobileMenu.classList.contains("open").toString());
        });
        mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));
    }
    /* ---------- active nav link ---------- */
    const here = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
        const href = a.getAttribute("href");
        if (href === here || (here === "" && href === "index.html")) {
            a.classList.add("active");
        }
    });
    /* ---------- scroll reveal ---------- */
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach((el, i) => {
            el.style.setProperty("--i", `${i % 6}`);
            io.observe(el);
        });
    }
    else {
        revealEls.forEach(el => el.classList.add("is-visible"));
    }
    /* ---------- animated counters ---------- */
    const counters = document.querySelectorAll("[data-count]");
    if (counters.length && "IntersectionObserver" in window) {
        const countIo = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting)
                    return;
                const el = entry.target;
                const target = parseInt(el.dataset.count ?? "0", 10);
                const suffix = el.dataset.suffix ?? "";
                const duration = 1400;
                const start = performance.now();
                function tick(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(eased * target).toLocaleString() + suffix;
                    if (p < 1)
                        requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                countIo.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(el => countIo.observe(el));
    }
    /* ---------- testimonial carousel ---------- */
    const carousel = document.querySelector(".carousel");
    if (carousel) {
        const slides = carousel.querySelectorAll(".carousel-slide");
        const dotsWrap = carousel.querySelector(".carousel-dots");
        if (dotsWrap && slides.length) {
            let active = 0;
            let timer = 0;
            slides.forEach((_, i) => {
                const dot = document.createElement("button");
                if (i === 0)
                    dot.classList.add("active");
                dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
                dot.addEventListener("click", () => goTo(i));
                dotsWrap.appendChild(dot);
            });
            const dots = dotsWrap.querySelectorAll("button");
            function goTo(i) {
                slides[active].classList.remove("active");
                dots[active].classList.remove("active");
                active = i;
                slides[active].classList.add("active");
                dots[active].classList.add("active");
                resetTimer();
            }
            function next() { goTo((active + 1) % slides.length); }
            function resetTimer() {
                window.clearInterval(timer);
                timer = window.setInterval(next, 6000);
            }
            resetTimer();
        }
    }
    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll(".accordion-item").forEach(item => {
        const trigger = item.querySelector(".accordion-trigger");
        const panel = item.querySelector(".accordion-panel");
        if (!trigger || !panel)
            return;
        trigger.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            const parent = item.closest(".accordion");
            if (parent) {
                parent.querySelectorAll(".accordion-item").forEach(other => {
                    other.classList.remove("open");
                    const opanel = other.querySelector(".accordion-panel");
                    if (opanel)
                        opanel.style.maxHeight = "";
                });
            }
            if (!isOpen) {
                item.classList.add("open");
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
            else {
                panel.style.maxHeight = "";
            }
        });
    });
    /* ---------- menu filter ---------- */
    const filterBar = document.querySelector(".filter-bar");
    if (filterBar) {
        const buttons = filterBar.querySelectorAll(".filter-btn");
        const items = document.querySelectorAll(".menu-item");
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const cat = btn.dataset.filter ?? "all";
                items.forEach(item => {
                    const match = cat === "all" || item.dataset.category === cat;
                    item.classList.toggle("hide", !match);
                });
            });
        });
    }
    /* ---------- form validation (booking + contact) ---------- */
    document.querySelectorAll("form[data-validate]").forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let valid = true;
            form.querySelectorAll("[required]").forEach(input => {
                const field = input.closest(".field");
                let ok = input.value.trim().length > 0;
                if (input.type === "email" && ok) {
                    ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
                }
                if (input.type === "tel" && ok) {
                    ok = /^[\d\s\-\+\(\)]{7,}$/.test(input.value.trim());
                }
                if (field)
                    field.classList.toggle("invalid", !ok);
                if (!ok)
                    valid = false;
            });
            const successBox = form.parentElement?.querySelector(".form-success");
            if (valid) {
                form.reset();
                form.querySelectorAll(".field").forEach(f => f.classList.remove("invalid"));
                if (successBox) {
                    successBox.classList.add("show");
                    setTimeout(() => successBox.classList.remove("show"), 6000);
                }
            }
            else if (successBox) {
                successBox.classList.remove("show");
            }
        });
        form.querySelectorAll("[required]").forEach(input => {
            input.addEventListener("input", () => {
                input.closest(".field")?.classList.remove("invalid");
            });
        });
    });
});
