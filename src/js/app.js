// Search and filter functionality
let filteredSessions = [...sessions];
let activeFilter = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderSessions();
  setupEventListeners();
  initMobileMenu();
});

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('sessionSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filterSessions(query, activeFilter);
    });
  }

  // Filter buttons
  const filterButtons = document.querySelectorAll('[data-filter]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.target.dataset.filter;
      activeFilter = filter;
      
      // Update active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Update filtered results
      const query = document.getElementById('sessionSearch')?.value.toLowerCase() || '';
      filterSessions(query, filter);
    });
  });
}

// Filter sessions based on search query and category
function filterSessions(query, category) {
  filteredSessions = sessions.filter(session => {
    const matchesQuery = 
      session.title.toLowerCase().includes(query) ||
      session.description.toLowerCase().includes(query) ||
      session.tagline.toLowerCase().includes(query) ||
      `${session.speaker_first} ${session.speaker_last}`.toLowerCase().includes(query);

    if (category === 'all') return matchesQuery;

    const categoryTag = category.toLowerCase();
    const sessionText = `${session.title} ${session.description} ${session.tagline}`.toLowerCase();
    
    const categoryMatches = {
      'ai': sessionText.includes('ai') || sessionText.includes('artificial intelligence') || sessionText.includes('llm') || sessionText.includes('copilot') || sessionText.includes('agent'),
      'azure': sessionText.includes('azure') || sessionText.includes('cloud') || sessionText.includes('foundry'),
      'data': sessionText.includes('fabric') || sessionText.includes('data') || sessionText.includes('power bi') || sessionText.includes('sql') || sessionText.includes('dataverse') || sessionText.includes('lakehouse'),
      'github': sessionText.includes('github') || sessionText.includes('dev') || sessionText.includes('git') || sessionText.includes('ci/cd') || sessionText.includes('copilot'),
      'power platform': sessionText.includes('power platform') || sessionText.includes('power apps') || sessionText.includes('power automate') || sessionText.includes('power bi'),
      'security': sessionText.includes('security') || sessionText.includes('sentinel') || sessionText.includes('encryption') || sessionText.includes('zero trust')
    };

    return matchesQuery && (categoryMatches[categoryTag] || false);
  });

  renderSessions();
}

// Render sessions grid
function renderSessions() {
  const sessionsGrid = document.getElementById('sessionsGrid');
  if (!sessionsGrid) return;

  if (filteredSessions.length === 0) {
    sessionsGrid.innerHTML = `
      <div class="no-results">
        <p>No sessions found. Try adjusting your search or filters.</p>
      </div>
    `;
    return;
  }

  sessionsGrid.innerHTML = filteredSessions.map(session => `
    <div class="session-card">
      <div class="session-card-header">
        ${session.profile_picture ? `<img src="${session.profile_picture}" alt="${session.speaker_first} ${session.speaker_last}" class="speaker-avatar">` : '<div class="speaker-avatar-placeholder"></div>'}
        <div class="speaker-info">
          <h3 class="speaker-name">${session.speaker_first} ${session.speaker_last}</h3>
          <p class="speaker-tagline">${session.tagline}</p>
        </div>
      </div>
      <h2 class="session-title">${session.title}</h2>
      <p class="session-description">${session.description.substring(0, 150)}...</p>
      <div class="session-footer">
        ${session.linkedin ? `<a href="${session.linkedin}" target="_blank" class="linkedin-link" title="Speaker LinkedIn">🔗 LinkedIn</a>` : ''}
      </div>
    </div>
  `).join('');

  // Smooth scroll animation
  document.querySelectorAll('.session-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const filtersContainer = document.getElementById('filtersContainer');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      filtersContainer.classList.toggle('mobile-open');
      mobileMenuBtn.classList.toggle('active');
    });
  }
  
  // Close menu when filter is clicked on mobile
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        filtersContainer.classList.remove('mobile-open');
        mobileMenuBtn?.classList.remove('active');
      }
    });
  });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
