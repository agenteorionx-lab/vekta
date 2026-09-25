document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu Mobile Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.getElementById('navbar');

  if (mobileToggle && navLinks) {
    const closeMobileMenu = () => {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active', isActive);
    });

    // Fechar ao clicar num link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Fechar ao clicar ou tocar em qualquer outra área fora do menu
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('touchstart', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    }, { passive: true });
  }

  // 2. Navbar Scrolled Background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2.1. Transição Cinematográfica Hero: Imagem Poster -> Vídeo Background (Cross-fade)
  const heroVideo = document.getElementById('heroVideo');
  const heroPosterLayer = document.getElementById('heroPosterLayer');

  if (heroVideo && heroPosterLayer) {
    let fadeInitiated = false;

    const handleVideoPlaying = () => {
      if (fadeInitiated) return;
      fadeInitiated = true;
      // Dá tempo do visitante admirar a foto da academia por ~2.5s antes de esmaecer suavemente para o vídeo
      setTimeout(() => {
        heroPosterLayer.classList.add('fade-out');
      }, 2500);
    };

    // Se já estiver tocando
    if (heroVideo.currentTime > 0 && !heroVideo.paused && !heroVideo.ended) {
      handleVideoPlaying();
    } else {
      heroVideo.addEventListener('playing', handleVideoPlaying, { once: true });
      heroVideo.addEventListener('timeupdate', () => {
        if (heroVideo.currentTime > 0.1) {
          handleVideoPlaying();
        }
      }, { once: true });
    }

    // Fallback: em redes mais lentas ou economizadores de dados, garante que o poster continue visível
    heroVideo.play().catch(() => {
      // Se o autoplay for bloqueado pelo sistema operacional, mantém a imagem visível com qualidade total
    });
  }
  // 3. Carrossel de Avaliações / Depoimentos (com Dots e Setas Laterais)
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewsPrev = document.getElementById('reviewsPrev');
  const reviewsNext = document.getElementById('reviewsNext');
  const reviewsDots = document.getElementById('reviewsDots');

  if (reviewsTrack && reviewsPrev && reviewsNext) {
    const cards = reviewsTrack.querySelectorAll('.review-card');
    let currentIndex = 0;

    const getVisibleCount = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      const visible = getVisibleCount();
      return Math.max(0, cards.length - visible);
    };

    // Gera os pontinhos correspondentes ao número de comentários
    const renderDots = () => {
      if (!reviewsDots) return;
      reviewsDots.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `review-dot ${idx === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir para depoimento ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
        });
        reviewsDots.appendChild(dot);
      });
    };

    const updateDots = () => {
      if (!reviewsDots) return;
      const allDots = reviewsDots.querySelectorAll('.review-dot');
      allDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      const card = cards[0];
      const cardWidth = card ? card.offsetWidth + 20 : 330;
      const maxIndex = getMaxIndex();

      if (index > maxIndex) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex = index;
      }

      reviewsTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots();
    };

    reviewsNext.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });

    reviewsPrev.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });

    renderDots();

    // Autoplay Suave no Mobile (com pausa ao pressionar/tocar)
    let autoPlayTimer = null;
    let pauseTimeout = null;
    let isPaused = false;
    const AUTOPLAY_INTERVAL = 3800; // velocidade suave e agradável
    const RESUME_DELAY = 4500; // pausa por uns instantes ao interagir antes de retomar

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        if (!isPaused && window.innerWidth <= 991) {
          const maxIndex = getMaxIndex();
          const nextIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
          goToSlide(nextIndex);
        }
      }, AUTOPLAY_INTERVAL);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    const pauseTemporarily = () => {
      isPaused = true;
      if (pauseTimeout) clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        isPaused = false;
      }, RESUME_DELAY);
    };

    // Eventos de toque no mobile para pausar ao pressionar
    reviewsTrack.addEventListener('touchstart', () => {
      pauseTemporarily();
    }, { passive: true });

    reviewsTrack.addEventListener('touchend', () => {
      pauseTemporarily();
    }, { passive: true });

    // Se o usuário clicar nos dots ou nas setas, também pausa temporariamente
    if (reviewsDots) {
      reviewsDots.addEventListener('click', pauseTemporarily);
    }
    reviewsNext.addEventListener('click', pauseTemporarily);
    reviewsPrev.addEventListener('click', pauseTemporarily);

    // No desktop: pausa ao passar o mouse por cima
    reviewsTrack.addEventListener('mouseenter', () => { isPaused = true; });
    reviewsTrack.addEventListener('mouseleave', () => { isPaused = false; });

    startAutoPlay();

    window.addEventListener('resize', () => {
      renderDots();
      goToSlide(currentIndex);
      startAutoPlay();
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

  // 5. Modais de Termos de Uso e Políticas de Privacidade
  const openTermsBtn = document.getElementById('openTermsBtn');
  const openPrivacyBtn = document.getElementById('openPrivacyBtn');
  const termsModal = document.getElementById('termsModal');
  const privacyModal = document.getElementById('privacyModal');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openTermsBtn) {
    openTermsBtn.addEventListener('click', () => openModal(termsModal));
  }

  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener('click', () => openModal(privacyModal));
  }

  // Fechar botões com data-close-modal
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const targetModal = document.getElementById(modalId);
      closeModal(targetModal);
    });
  });

  // Fechar ao clicar no overlay de fundo
  [termsModal, privacyModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // 6. Lightbox de Fotos da Galeria (Zoom/Pesquisa)
  const galleryLightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');

  const openLightbox = (imgSrc) => {
    if (!galleryLightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    galleryLightbox.classList.add('active');
    galleryLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!galleryLightbox) return;
    galleryLightbox.classList.remove('active');
    galleryLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-photo-item').forEach(item => {
    item.addEventListener('click', () => {
      const fullImg = item.getAttribute('data-full-img') || item.querySelector('img')?.src;
      if (fullImg) openLightbox(fullImg);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(termsModal);
      closeModal(privacyModal);
      closeLightbox();
    }
  });
});
