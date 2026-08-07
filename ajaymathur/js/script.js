/* ==========================================================================
   Ajay Mathur — Premium Interactive CV JavaScript
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
      
      // Animate hamburger lines
      const span1 = menuToggle.querySelector('span:nth-child(1)');
      const span2 = menuToggle.querySelector('span:nth-child(2)');
      const span3 = menuToggle.querySelector('span:nth-child(3)');
      
      if (menuToggle.classList.contains('active')) {
        span1.style.transform = 'translateY(6px) rotate(45deg)';
        span2.style.opacity = '0';
        span3.style.transform = 'translateY(-6px) rotate(-45deg)';
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
    rootMargin: '-20% 0px -60% 0px',
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

  // 3. Interactive Skills Filter
  const skillFilters = document.querySelectorAll('#skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  if (skillFilters.length > 0) {
    skillFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button state
        skillFilters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Filter cards with a smooth transition
        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'none';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96) translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 500);
          }
        });
      });
    });
  }

  // 4. Interactive Projects Filter
  const projectFilters = document.querySelectorAll('#projects-filter .filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  if (projectFilters.length > 0) {
    projectFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button state
        projectFilters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        // Filter cards with transition
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'none';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96) translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 500);
          }
        });
      });
    });
  }

  // 5. Reveal Animations on Scroll (Simple lazy viewport trigger)
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
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    // Pause animation initially
    el.style.animationPlayState = 'paused';
    revealObserver.observe(el);
  });

});
