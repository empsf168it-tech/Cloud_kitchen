document.addEventListener('DOMContentLoaded', () => {
  // Global States
  let cart = JSON.parse(localStorage.getItem('cravebox_cart')) || [];
  let currentDiscount = parseFloat(localStorage.getItem('cravebox_discount')) || 0;
  let activePromoCode = localStorage.getItem('cravebox_promo') || '';

  // DOM Elements
  const header = document.querySelector('.crave-navbar');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const offcanvasMenu = document.querySelector('.crave-offcanvas');
  const offcanvasClose = document.querySelector('.crave-offcanvas-close');
  const themeToggle = document.querySelectorAll('.theme-toggle-btn');
  const yearSpan = document.getElementById('current-year');
  
  // Update year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. Page Transitions
     ========================================================================== */
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);

  // Smooth fade-out of transition screen on load
  requestAnimationFrame(() => {
    transitionOverlay.classList.add('fade-out');
  });

  // Intercept navigation links for a smooth fade-in exit transition
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !link.target && href.endsWith('.html')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        transitionOverlay.classList.remove('fade-out');
        setTimeout(() => {
          window.location.href = href;
        }, 380);
      });
    }
  });

  /* ==========================================================================
     2. Navigation and Sticky Header
     ========================================================================== */
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page was refreshed

  // Pure CSS Hamburger lines setup
  if (hamburgerBtn) {
    hamburgerBtn.innerHTML = `
      <span class="bar line1"></span>
      <span class="bar line2"></span>
      <span class="bar line3"></span>
    `;
  }

  // Offcanvas drawer control
  const toggleOffcanvas = () => {
    const isOpen = offcanvasMenu?.classList.toggle('open');
    hamburgerBtn?.classList.toggle('open', isOpen);
    
    let overlay = document.querySelector('.offcanvas-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'offcanvas-overlay';
      document.body.appendChild(overlay);
    }
    overlay.classList.toggle('show');
    
    // Close overlay click
    overlay.onclick = () => {
      offcanvasMenu?.classList.remove('open');
      hamburgerBtn?.classList.remove('open');
      overlay.classList.remove('show');
    };
  };

  hamburgerBtn?.addEventListener('click', toggleOffcanvas);
  offcanvasClose?.addEventListener('click', toggleOffcanvas);

  /* ==========================================================================
     3. Theme Management (Dark / Light Mode)
     ========================================================================== */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('cravebox_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      updateThemeButtons('light');
    } else {
      document.body.classList.remove('light-theme');
      updateThemeButtons('dark');
    }
  };

  const toggleTheme = () => {
    if (document.body.classList.contains('light-theme')) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('cravebox_theme', 'dark');
      updateThemeButtons('dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('cravebox_theme', 'light');
      updateThemeButtons('light');
    }
  };

  const updateThemeButtons = (theme) => {
    themeToggle.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'light') {
          icon.className = 'bi bi-moon-fill';
        } else {
          icon.className = 'bi bi-sun-fill';
        }
      }
    });
  };

  themeToggle.forEach(btn => btn.addEventListener('click', toggleTheme));
  initTheme();

  /* ==========================================================================
     5. Advanced Animation Map & Scroll Observers
     ========================================================================== */
  // Dynamically assign horizontal reveals to give alternate grids distinct movements
  const whyChooseBlocks = document.querySelectorAll('.feature-block');
  whyChooseBlocks.forEach((block, idx) => {
    block.classList.add(idx % 2 === 0 ? 'slide-left-element' : 'slide-right-element');
  });

  const columnsGrids = document.querySelectorAll('.contact-grid > div, .order-layout-grid > div, .about-promise-grid > div');
  columnsGrids.forEach((col, idx) => {
    col.classList.add(idx % 2 === 0 ? 'slide-left-element' : 'slide-right-element');
  });

  // Assign scale-in to testimonial containers
  const testimonialContainer = document.querySelectorAll('.testimonial-container');
  testimonialContainer.forEach(el => el.classList.add('scale-in-element'));

  // Sequential reveal animation sequence for heroes (unique per page style)
  const path = window.location.pathname;
  const isAboutPage = path.includes('about.html');
  const isMenuPage = path.includes('menu.html');
  const isOffersPage = path.includes('offers.html');
  const isOrdersPage = path.includes('orders.html');
  const isContactPage = path.includes('contact.html');
  const isHomePage = path.includes('index.html') || path.endsWith('/') || (!isAboutPage && !isMenuPage && !isOffersPage && !isOrdersPage && !isContactPage);

  const heroBadge = document.querySelector('.hero-section .eyebrow');
  const heroTitle = document.querySelector('.hero-section h1');
  const heroText = document.querySelector('.hero-section p');
  const heroBtn = document.querySelector('.hero-section .btn-crave, .hero-section .controls-container');
  const heroImg = document.querySelector('.hero-section .hero-bg');
  
  if (heroImg) {
    heroImg.style.opacity = '0';
    if (isHomePage) {
      heroImg.style.animation = 'heroImgReveal 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards, slowPan 30s ease-in-out infinite 1.8s';
    } else if (isAboutPage) {
      heroImg.style.animation = 'heroImgReveal 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards';
      heroImg.style.transformOrigin = 'right center';
    } else {
      heroImg.style.animation = 'heroImgReveal 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards';
    }
  }

  if (heroBadge) {
    heroBadge.style.opacity = '0';
    heroBadge.style.animation = 'badgeReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards';
  }

  if (heroTitle) {
    heroTitle.style.opacity = '0';
    if (isHomePage) {
      heroTitle.style.animation = 'heroReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards';
    } else if (isAboutPage) {
      heroTitle.style.animation = 'slideLeftReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards';
    } else if (isMenuPage) {
      heroTitle.style.animation = 'slideDownReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards';
    } else if (isOffersPage) {
      heroTitle.style.animation = 'scaleInReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards';
    } else if (isOrdersPage) {
      heroTitle.style.animation = 'slideDownReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards';
    } else {
      heroTitle.style.animation = 'heroReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards';
    }
  }

  if (heroText) {
    heroText.style.opacity = '0';
    heroText.style.animation = 'textReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards';
  }

  if (heroBtn) {
    heroBtn.style.opacity = '0';
    heroBtn.style.animation = 'textReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards';
  }

  // Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.08
  };

  const animateOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up-element, .slide-left-element, .slide-right-element, .scale-in-element, .stagger-container, .story-image-wrapper').forEach(el => {
    animateOnScroll.observe(el);
  });

  // Statistics counters
  const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;
      
      const timer = setInterval(() => {
        current += Math.ceil(target / 60);
        if (current >= target) {
          stat.textContent = stat.getAttribute('data-target') + (stat.getAttribute('data-suffix') || '');
          clearInterval(timer);
        } else {
          stat.textContent = current + (stat.getAttribute('data-suffix') || '');
        }
      }, 30);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     6. Desktop-Only Premium 3D Tilt & Magnetic Buttons
     ========================================================================== */
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && !isReducedMotion) {
    // 3D perspective card hover and dynamic cursor glow
    const interactiveCards = document.querySelectorAll('.food-card, .featured-card, .offer-card, .feature-block, .stat-box, .sticky-cart-panel, .delivery-form-box');
    
    interactiveCards.forEach(card => {
      // Inject glowing div
      const glow = document.createElement('div');
      glow.className = 'card-glow';
      card.appendChild(glow);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tilt factor up to 5 degrees
        const rotateX = ((centerY - y) / centerY) * 5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.45)';
        
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        glow.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.boxShadow = '';
        glow.style.opacity = '0';
      });
    });

    // Magnetic buttons offsets
    const magneticElements = document.querySelectorAll('.btn-crave, .control-btn');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move element slightly closer to cursor
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  /* ==========================================================================
     7. Shopping Cart Functionality
     ========================================================================== */
  const showToast = (message) => {
    let toast = document.querySelector('.crave-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'crave-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> <span>${message}</span>`;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  const updateCartBadge = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    
    const desktopBadge = document.querySelector('.desktop-cart-count');
    if (desktopBadge) {
      desktopBadge.textContent = totalQty;
      desktopBadge.style.display = totalQty > 0 ? 'inline-block' : 'none';
    }

    const mobileBadge = document.querySelector('.mobile-cart-count');
    if (mobileBadge) {
      mobileBadge.textContent = totalQty;
    }
  };

  const saveCart = () => {
    localStorage.setItem('cravebox_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  };

  window.addToCart = (id, name, price, image) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price: parseFloat(price), qty: 1, image });
    }
    saveCart();
    showToast(`${name} added to cart!`);
    
    const btn = document.querySelector(`.btn-add-cart[data-id="${id}"]`);
    if (btn) {
      btn.classList.add('bi-check-lg');
      btn.classList.remove('bi-plus-lg');
      setTimeout(() => {
        btn.classList.remove('bi-check-lg');
        btn.classList.add('bi-plus-lg');
      }, 1500);
    }
  };

  window.changeQty = (id, delta) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
      saveCart();
    }
  };

  window.removeFromCart = (id) => {
    const item = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    if (item) {
      showToast(`${item.name} removed.`);
    }
  };

  const renderCart = () => {
    const cartContainer = document.querySelector('.cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const deliveryEl = document.getElementById('cart-delivery');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');

    if (!cartContainer) return; 

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="cart-empty-msg">
          <i class="bi bi-basket-fill" style="font-size: 3rem; color: var(--border-color);"></i>
          <p class="mt-3">Your cart is empty.</p>
          <a href="menu.html" class="btn-crave btn-crave-primary mt-3 py-2 px-4">EXPLORE MENU</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      if (deliveryEl) deliveryEl.textContent = '₹0';
      if (discountEl) discountEl.textContent = '-₹0';
      if (totalEl) totalEl.textContent = '₹0';
      return;
    }

    cartContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price-info">₹${item.price} × ${item.qty}</div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      `;
      cartContainer.appendChild(row);
    });

    const deliveryFee = 40;
    const discountVal = Math.round(subtotal * currentDiscount);
    const finalTotal = Math.max(0, subtotal + deliveryFee - discountVal);

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (deliveryEl) deliveryEl.textContent = `₹${deliveryFee}`;
    if (discountEl) discountEl.textContent = `-₹${discountVal}`;
    if (totalEl) totalEl.textContent = `₹${finalTotal}`;
  };

  // Coupon promo code apply
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  const promoInput = document.getElementById('promo-code-input');
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.onclick = () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'CRAVE20') {
        currentDiscount = 0.20;
        activePromoCode = 'CRAVE20';
        localStorage.setItem('cravebox_discount', currentDiscount);
        localStorage.setItem('cravebox_promo', activePromoCode);
        showToast('Promo code CRAVE20 (20% OFF) applied!');
        renderCart();
      } else if (code === '') {
        showToast('Please enter a promo code.');
      } else {
        showToast('Invalid promo code.');
      }
    };
  }

  // Initial cart update
  updateCartBadge();
  renderCart();

  /* ==========================================================================
     8. Menu Page Specific Category Filters
     ========================================================================== */
  const filterChips = document.querySelectorAll('.filter-chip');
  const foodCards = document.querySelectorAll('.food-card-wrapper');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      foodCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     9. Form Validations
     ========================================================================== */
  // Checkout Info Form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const email = document.getElementById('cust-email').value.trim();
      const address = document.getElementById('cust-address').value.trim();
      const city = document.getElementById('cust-city').value.trim();
      const zip = document.getElementById('cust-zip').value.trim();

      if (!name || !phone || !email || !address || !city || !zip) {
        showToast('Please fill out all required fields.');
        return;
      }

      showToast('Order placed successfully! Tracking active.');
      
      // Clear Cart
      cart = [];
      currentDiscount = 0;
      activePromoCode = '';
      localStorage.removeItem('cravebox_cart');
      localStorage.removeItem('cravebox_discount');
      localStorage.removeItem('cravebox_promo');
      saveCart();

      // Trigger status pipeline step update
      const progressSteps = document.querySelectorAll('.progress-step');
      let currentStep = 0;
      
      const interval = setInterval(() => {
        if (currentStep < progressSteps.length) {
          progressSteps.forEach(s => s.classList.remove('active'));
          progressSteps[currentStep].classList.add('completed');
          progressSteps[currentStep].classList.add('active');
          
          const activeLine = document.querySelector('.progress-line-active');
          if (activeLine) {
            activeLine.style.width = `${(currentStep / (progressSteps.length - 1)) * 100}%`;
          }
          currentStep++;
        } else {
          clearInterval(interval);
        }
      }, 3000);
      
      checkoutForm.reset();
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('con-name').value.trim();
      const email = document.getElementById('con-email').value.trim();
      const msg = document.getElementById('con-message').value.trim();

      if (!name || !email || !msg) {
        showToast('Please fill in Name, Email and Message.');
        return;
      }
      showToast('Message sent successfully!');
      contactForm.reset();
    });
  }

  // Newsletter Form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input');
      if (emailInput && emailInput.value.trim()) {
        showToast('Thank you for subscribing to CRAVEBOX!');
        emailInput.value = '';
      }
    });
  }
});
