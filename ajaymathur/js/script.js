/* ==========================================================================
   Ajay Mathur — Minimalist Editorial Developer CV Javascript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      const span1 = menuToggle.querySelector('span:nth-child(1)');
      const span2 = menuToggle.querySelector('span:nth-child(2)');
      const span3 = menuToggle.querySelector('span:nth-child(3)');
      
      if (menuToggle.classList.contains('active')) {
        span1.style.transform = 'translateY(5px) rotate(45deg)';
        span2.style.opacity = '0';
        span3.style.transform = 'translateY(-5px) rotate(-45deg)';
      } else {
        span1.style.transform = 'none';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
      }
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        const span1 = menuToggle.querySelector('span:nth-child(1)');
        const span2 = menuToggle.querySelector('span:nth-child(2)');
        const span3 = menuToggle.querySelector('span:nth-child(3)');
        span1.style.transform = 'none';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
      });
    });
  }

  // 2. Navigation Active State on Scroll (Intersection Observer)
  const sections = document.querySelectorAll('section[id]');
  
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // 3. Scroll Reveal Animations (Scroll-driven appearance check)
  const animatedElements = document.querySelectorAll('.reveal-fade-in, .reveal-scale');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  });

  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    revealObserver.observe(el);
  });

});
