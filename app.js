// NENETFLIX - Simplified JavaScript

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');

    // Prevent body scroll when menu is open
    if (mobileMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking on a link
  const mobileNavItems = mobileMenu.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// Scroll Progress Bar
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');

function updateProgress() {
  if (!progressBar) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight > 0) {
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  }
}

// Back to Top Button
const toTopBtn = document.getElementById('toTop');

function updateBackToTop() {
  if (!toTopBtn) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  if (scrollTop > 300) {
    toTopBtn.classList.add('show');
  } else {
    toTopBtn.classList.remove('show');
  }
}

// Scroll event handler (throttled with RAF)
let scrollTicking = false;

function onScroll() {
  if (scrollTicking) return;

  scrollTicking = true;
  requestAnimationFrame(() => {
    updateProgress();
    updateBackToTop();
    scrollTicking = false;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
  updateProgress();
  updateBackToTop();
});

// Back to top click
if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Tab Switching Logic
const tabs = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.getAttribute('data-tab');

    // Remove active class from all tabs and panels
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });

    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Add active class to clicked tab
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Show corresponding panel
    const targetPanel = document.getElementById('panel-' + targetTab);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  });
});

// Reveal on Scroll (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show', 'in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// Fallback: Show all reveals after load (in case observer doesn't trigger)
window.addEventListener('load', () => {
  setTimeout(() => {
    revealElements.forEach(el => {
      el.classList.add('show', 'in');
    });
  }, 500);
});

// Price Comparison Calculator
const selectAllCheckbox = document.getElementById('selectAll');
const serviceCheckboxes = document.querySelectorAll('.service-row .service-checkbox');
const totalMonthlyEl = document.getElementById('totalMonthly');
const totalYearlyEl = document.getElementById('totalYearly');
const savingsAmountEl = document.getElementById('savingsAmount');
const savingsNoteEl = document.getElementById('savingsNote');
const selectedCountEl = document.getElementById('selectedCount');

const NENETFLIX_YEARLY = 50;

function calculateTotals() {
  let totalMonthly = 0;
  let totalYearly = 0;
  let selectedCount = 0;

  document.querySelectorAll('.service-row').forEach(row => {
    const checkbox = row.querySelector('.service-checkbox');
    if (checkbox && checkbox.checked) {
      totalMonthly += parseFloat(row.dataset.monthly);
      totalYearly += parseFloat(row.dataset.yearly);
      selectedCount++;
    }
  });

  // Update selected count
  if (selectedCountEl) {
    const plural = selectedCount === 1 ? 'servicio seleccionado' : 'servicios seleccionados';
    selectedCountEl.textContent = `${selectedCount} ${plural}`;
  }

  // Update totals display
  if (totalMonthlyEl) {
    totalMonthlyEl.textContent = `~${Math.round(totalMonthly)}€`;
  }
  if (totalYearlyEl) {
    totalYearlyEl.textContent = `~${Math.round(totalYearly)}€`;
  }

  // Calculate savings
  const savings = totalYearly - NENETFLIX_YEARLY;
  const savingsPercent = totalYearly > 0 ? ((savings / totalYearly) * 100).toFixed(0) : 0;

  if (savingsAmountEl) {
    savingsAmountEl.textContent = `${Math.round(savings)}€`;
  }
  if (savingsNoteEl) {
    savingsNoteEl.textContent = `Equivalente a más del ${savingsPercent}% de ahorro`;
  }
}

// Select/Deselect all functionality
if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', () => {
    const isChecked = selectAllCheckbox.checked;
    serviceCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });
    calculateTotals();
  });
}

// Individual checkbox change
serviceCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    // Update "Select All" state
    const allChecked = Array.from(serviceCheckboxes).every(cb => cb.checked);
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allChecked;
    }
    calculateTotals();
  });
});

// Click on row to toggle checkbox
document.querySelectorAll('.service-row').forEach(row => {
  row.addEventListener('click', (e) => {
    // Don't toggle if clicking directly on the checkbox
    if (e.target.type === 'checkbox') return;

    const checkbox = row.querySelector('.service-checkbox');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;

      // Update "Select All" state
      const allChecked = Array.from(serviceCheckboxes).every(cb => cb.checked);
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
      }

      calculateTotals();
    }
  });
});

// Initial calculation on page load
if (totalMonthlyEl || totalYearlyEl) {
  calculateTotals();
}

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or detect system preference
function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    return savedTheme;
  }

  // Detect system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

// Set initial theme
const initialTheme = getInitialTheme();
htmlElement.setAttribute('data-theme', initialTheme);

// Theme toggle click handler
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Listen for system theme changes (optional, updates in real-time if user changes OS theme)
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}
