document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu Mobile Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.getElementById('navbar');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Fechar ao clicar num link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Navbar Scrolled Background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Carrossel da Galeria
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  if (track && prevBtn && nextBtn) {
    let scrollAmount = 0;

    nextBtn.addEventListener('click', () => {
      const card = track.querySelector('.gallery-card');
      const cardWidth = card ? card.offsetWidth + 20 : 340;
      const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;

      scrollAmount += cardWidth;
      if (scrollAmount > maxScroll) {
        scrollAmount = 0; // Volta ao início para carrossel infinito
      }
      track.style.transform = `translateX(-${scrollAmount}px)`;
    });

    prevBtn.addEventListener('click', () => {
      const card = track.querySelector('.gallery-card');
      const cardWidth = card ? card.offsetWidth + 20 : 340;

      scrollAmount -= cardWidth;
      if (scrollAmount < 0) {
        const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
        scrollAmount = maxScroll > 0 ? maxScroll : 0;
      }
      track.style.transform = `translateX(-${scrollAmount}px)`;
    });
  }

  // 4. Accordion FAQ
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      // Fecha todos os outros
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBody = otherItem.querySelector('.accordion-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Se não estava ativo, abre
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
});
