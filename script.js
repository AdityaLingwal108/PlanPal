// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initPhotoAnimations();
    initScrollAnimations();
    initParallax();
});

// ===== Custom Cursor =====
function initCustomCursor() {
    const cursor = document.querySelector('.cursor-follower');
    
    if (!cursor) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor follow
    function animate() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .photo');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// ===== Photo Animations =====
function initPhotoAnimations() {
    const photos = document.querySelectorAll('.photo');
    
    photos.forEach((photo, index) => {
        // Initial animation on load
        photo.style.opacity = '0';
        photo.style.transform += ' translateY(50px)';
        
        setTimeout(() => {
            photo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            photo.style.opacity = '1';
            
            // Reset transform to original rotation
            const originalTransform = getComputedStyle(photo).transform;
            photo.style.transform = '';
        }, 200 + (index * 150));
    });
    
    // Mouse move parallax effect on photos
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        
        photos.forEach(photo => {
            const speed = parseFloat(photo.dataset.speed) || 1;
            const x = mouseX * speed * 15;
            const y = mouseY * speed * 15;
            
            // Get original rotation
            const rotation = photo.style.transform.match(/rotate\([^)]+\)/)?.[0] || '';
            
            photo.style.transform = `translate(${x}px, ${y}px) ${rotation}`;
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.section-two, .section-three, .section-cta').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Add styles for in-view
    const style = document.createElement('style');
    style.textContent = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Features animation
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(30px)';
        feature.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    });
    
    const featuresObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const features = entry.target.querySelectorAll('.feature');
                features.forEach(feature => {
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateY(0)';
                });
            }
        });
    }, { threshold: 0.3 });
    
    const featuresRow = document.querySelector('.features-row');
    if (featuresRow) {
        featuresObserver.observe(featuresRow);
    }
    
    // Gallery items animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
    });
    
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = document.querySelectorAll('.gallery-item');
                items.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                });
            }
        });
    }, { threshold: 0.2 });
    
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryObserver.observe(galleryGrid);
    }
}

// ===== Parallax Effect =====
function initParallax() {
    const heroText = document.querySelector('.hero-text');
    const galleryText = document.querySelector('.gallery-text h2');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Hero text parallax
        if (heroText && scrollY < window.innerHeight) {
            heroText.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        // Gallery text parallax
        if (galleryText) {
            const sectionThree = document.querySelector('.section-three');
            const sectionTop = sectionThree.offsetTop;
            const relativeScroll = scrollY - sectionTop + window.innerHeight;
            
            if (relativeScroll > 0) {
                galleryText.style.transform = `translate(-50%, -50%) translateY(${relativeScroll * 0.1}px)`;
            }
        }
    });
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== Form handling =====
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
    const input = ctaForm.querySelector('input');
    const button = ctaForm.querySelector('button');
    
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value.trim();
        
        if (validateEmail(email)) {
            button.textContent = 'JOINED!';
            button.style.background = '#10b981';
            input.value = '';
            
            setTimeout(() => {
                button.textContent = 'JOIN US';
                button.style.background = '';
            }, 3000);
        } else {
            input.style.borderColor = '#ef4444';
            input.style.animation = 'shake 0.5s ease';
            
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.animation = '';
            }, 500);
        }
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

console.log('🤝 PlanPal - Connect with your people');
