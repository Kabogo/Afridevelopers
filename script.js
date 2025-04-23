// ================ Core Functionality ================
function initializeCoreFeatures() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.querySelector('i').classList.toggle('fa-times');
        hamburger.querySelector('i').classList.toggle('fa-bars');
    });

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (savedTheme === 'dark') applyDarkTheme(true);
    
    themeToggle.addEventListener('click', toggleTheme);

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // Scroll to Top
    const scrollTop = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        scrollTop.classList.toggle('active', window.scrollY > 500);
    });
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ================ Theme Management ================
function applyDarkTheme(enable) {
    if (enable) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.hasAttribute('data-theme');
    applyDarkTheme(!isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// ================ Animations & Effects ================
function initializeAnimations() {
    // Particle Background
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.reset();
        }

        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > this.canvas.width) this.x = 0;
            if (this.x < 0) this.x = this.canvas.width;
            if (this.y > this.canvas.height) this.y = 0;
            if (this.y < 0) this.y = this.canvas.height;
        }

        draw() {
            this.ctx.fillStyle = `rgba(108, 99, 255, 0.5)`;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    function createParticleSystem() {
        const canvas = document.getElementById('particles');
        const particles = [];
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Initialize particles
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle(canvas));
        }

        function animate() {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        }

        animate();
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Initialize all animations
    createParticleSystem();
    initializeScrollAnimations();
    initializeCounterAnimations();
}

// ================ Interactive Components ================
function initializeInteractiveComponents() {
    // Testimonial Slider
    class TestimonialSlider {
        constructor() {
            this.slides = document.querySelectorAll('.testimonial-slide');
            this.dots = document.querySelectorAll('.dot');
            this.currentIndex = 0;
            this.interval = null;
            
            this.initializeControls();
            this.startAutoSlide();
        }

        showSlide(index) {
            this.slides.forEach(slide => slide.classList.remove('active'));
            this.dots.forEach(dot => dot.classList.remove('active'));
            
            this.slides[index].classList.add('active');
            this.dots[index].classList.add('active');
            this.currentIndex = index;
        }

        nextSlide() {
            let newIndex = (this.currentIndex + 1) % this.slides.length;
            this.showSlide(newIndex);
        }

        prevSlide() {
            let newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.showSlide(newIndex);
        }

        initializeControls() {
            document.querySelector('.slider-next').addEventListener('click', () => this.nextSlide());
            document.querySelector('.slider-prev').addEventListener('click', () => this.prevSlide());
            
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.showSlide(index));
            });
        }

        startAutoSlide() {
            this.interval = setInterval(() => this.nextSlide(), 5000);
        }
    }

    // Portfolio Filter
    function initializePortfolioFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                portfolioItems.forEach(item => {
                    item.style.display = 
                        filter === 'all' || item.dataset.category === filter 
                        ? 'block' 
                        : 'none';
                });
            });
        });
    }

    // Initialize components
    new TestimonialSlider();
    initializePortfolioFilter();
}

// ================ Initialization ================
document.addEventListener('DOMContentLoaded', () => {
    initializeCoreFeatures();
    initializeAnimations();
    initializeInteractiveComponents();
    
    // Form Handling
    document.querySelector('.contact-form')?.addEventListener('submit', handleFormSubmit);
    document.querySelector('.newsletter-form')?.addEventListener('submit', handleNewsletter);
});

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Form submitted:', Object.fromEntries(formData.entries()));
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing!');
    e.target.reset();
}