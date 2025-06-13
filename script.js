// Navigation and Scroll Effects
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    
    // Add scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href');
            
            // Only prevent default and handle smooth scrolling for internal links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    hamburger.classList.remove('active');
                }

                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update active link
                navItems.forEach(link => link.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Update active link and gradient on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Update scroll progress bar
        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
        progressBar.style.transform = `scaleX(${scrollPercentage / 100})`;

        // Update gradient position based on scroll
        const gradientPosition = (scrollPosition / (documentHeight - windowHeight)) * 100;
        document.body.style.backgroundPosition = `${gradientPosition}% ${gradientPosition}%`;

        // Update active section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const sectionRect = section.getBoundingClientRect();
            
            // Calculate how much of the section is visible
            const visiblePercentage = Math.min(
                Math.max(
                    (windowHeight - sectionRect.top) / windowHeight,
                    0
                ),
                1
            );

            // Update section opacity based on visibility
            section.style.opacity = 0.5 + (visiblePercentage * 0.5);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update active navigation link
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease-out';
        observer.observe(section);
    });

    // Initial scroll position
    window.dispatchEvent(new Event('scroll'));
}); 