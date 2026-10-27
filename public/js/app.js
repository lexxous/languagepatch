// Global state variables
let currentTranslations = [];
let activeCategory = "all";
let activePlatform = "all";
let activeSort = "downloads";
let selectedYamaId = null;
let currentRatingSelection = 5; // Default rating for the star input

// Dom Elements
const translationsGrid = document.getElementById("translationsGrid");
const searchInput = document.getElementById("searchInput");
const totalGameCount = document.getElementById("totalGameCount");
const statDownloads = document.getElementById("statDownloads");
const statAvgRating = document.getElementById("statAvgRating");

// Dialog Modals
const detailModal = document.getElementById("detailModal");
const aboutModal = document.getElementById("aboutModal");

// Detail Modal Elements
const detailBanner = document.getElementById("detailBanner");
const detailStatusBadge = document.getElementById("detailStatusBadge");
const detailTitle = document.getElementById("detailTitle");
const detailDeveloper = document.getElementById("detailDeveloper");
const detailCategory = document.getElementById("detailCategory");
const detailVersion = document.getElementById("detailVersion");
const detailTranslator = document.getElementById("detailTranslator");
const detailReleaseDate = document.getElementById("detailReleaseDate");
const detailPlatforms = document.getElementById("detailPlatforms");
const detailDownloadCount = document.getElementById("detailDownloadCount");
const detailRatingVal = document.getElementById("detailRatingVal");
const detailRatingCount = document.getElementById("detailRatingCount");
const detailDescription = document.getElementById("detailDescription");
const githubBtn = document.getElementById("githubBtn");
const downloadBtn = document.getElementById("downloadBtn");
const commentsList = document.getElementById("commentsList");
const commentForm = document.getElementById("commentForm");
const commentCount = document.getElementById("commentCount");
const starRatingInput = document.getElementById("starRatingInput");
const ratingFeedback = document.getElementById("ratingFeedback");

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    currentTranslations = await TranslationAPI.list();
  } catch (error) {
    showToast(error.message, "error");
    currentTranslations = [];
  }

  updatePlatformStats();
  renderCatalog();
  
  // Setup Dialog fallbacks for closedby support
  setupDialogFallbacks();
  
  // Event listeners for searching & filtering
  searchInput.addEventListener("input", handleSearch);
  
  // Category filter clicks
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      e.target.classList.add("active");
      activeCategory = e.target.dataset.category;
      renderCatalog();
    });
  });
  
  // Platform filter clicks
  document.querySelectorAll(".platform-filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelector(".platform-filter-btn.active").classList.remove("active");
      e.target.classList.add("active");
      activePlatform = e.target.dataset.platform;
      renderCatalog();
    });
  });
  
  // Sort select change
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    activeSort = e.target.value;
    renderCatalog();
  });
  
  // Star rating input hover/click actions
  setupStarRatingInput();
  
  // Comment Form Submit handler
  commentForm.addEventListener("submit", handleCommentSubmit);
  
  // Download button click handler
  downloadBtn.addEventListener("click", handleDownloadClick);
});

// ==========================================================================
// DIALOG & MODAL UTILITIES
// ==========================================================================
function setupDialogFallbacks() {
  const dialogs = [detailModal, aboutModal, document.getElementById("loginModal"), document.getElementById("adminPanelModal")];
  
  dialogs.forEach(dialog => {
    if (!dialog) return;
    
    // Check if the browser supports 'closedBy' natively
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        
        if (isDialogContent) return;
        dialog.close();
      });
    }
  });
}

function showAboutModal() {
  aboutModal.showModal();
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove toast after animation finishes
  setTimeout(() => {
    toast.style.animation = "slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// ==========================================================================
// PORTAL STATISTICS
// ==========================================================================
function updatePlatformStats() {
  if (currentTranslations.length === 0) return;
  
  // Sum downloads
  const totalDls = currentTranslations.reduce((sum, item) => sum + (item.downloads || 0), 0);
  statDownloads.innerText = totalDls >= 1000 ? `${(totalDls / 1000).toFixed(1)}K+` : totalDls;
  
  // Compute average rating
  const ratedGames = currentTranslations.filter(item => item.rating > 0);
  if (ratedGames.length > 0) {
    const avgRating = (ratedGames.reduce((sum, item) => sum + item.rating, 0) / ratedGames.length).toFixed(1);
    statAvgRating.innerText = avgRating;
  } else {
    statAvgRating.innerText = "N/A";
  }
  
  // Count
  totalGameCount.innerText = currentTranslations.length;
}

// ==========================================================================
// CATALOG RENDERING & FILTERING
// ==========================================================================
function renderCatalog() {
  // Clear grid
  translationsGrid.innerHTML = "";
  
  const query = searchInput.value.toLowerCase().trim();
  
  // Filter
  let filtered = currentTranslations.filter(item => {
    // Search query filter
    const matchesSearch = item.title.toLowerCase().includes(query) || 
                          item.developer.toLowerCase().includes(query) ||
                          item.translator.toLowerCase().includes(query);
                          
    // Category filter
    const matchesCategory = activeCategory === "all" || item.category.toLowerCase().includes(activeCategory.toLowerCase());
    
    // Platform filter
    const matchesPlatform = activePlatform === "all" || item.platforms.includes(activePlatform);
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });
  
  // Sort
  filtered.sort((a, b) => {
    if (activeSort === "downloads") {
      return b.downloads - a.downloads;
    } else if (activeSort === "rating") {
      return b.rating - a.rating;
    } else if (activeSort === "newest") {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    } else if (activeSort === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  // Check empty state
  if (filtered.length === 0) {
    translationsGrid.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px; opacity: 0.5;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <p>Aramanızla eşleşen Türkçe yama bulunamadı. Lütfen filtrelerinizi kontrol edin.</p>
      </div>
    `;
    return;
  }
  
  // Render cards
  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "yama-card";
    card.addEventListener("click", () => openYamaDetails(item.id));
    
    const badgeClass = item.status === "Tamamlandı" ? "status-completed" : "status-inprogress";
    const starsHtml = getStarsString(item.rating);
    
    card.innerHTML = `
      <div class="yama-card-media">
        <span class="yama-card-badge ${badgeClass}">${item.status}</span>
        <img src="${item.imageUrl}" alt="${item.title} Görseli" loading="lazy">
      </div>
      <div class="yama-card-content">
        <span class="yama-card-category">${item.category}</span>
        <h3 class="yama-card-title">${item.title}</h3>
        <p class="yama-card-desc">${item.description}</p>
        
        <div class="yama-progress-container">
          <div class="yama-progress-label">
            <span>Çeviri İlerlemesi</span>
            <span>%${item.progress}</span>
          </div>
          <div class="yama-progress-bar-bg">
            <div class="yama-progress-bar" style="width: ${item.progress}%"></div>
          </div>
        </div>
        
        <div class="yama-card-footer">
          <div class="yama-card-footer-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>${item.downloads.toLocaleString()} indirme</span>
          </div>
          <div class="yama-card-footer-item">
            <span class="card-rating-stars">${starsHtml}</span>
            <span>${item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    `;
    translationsGrid.appendChild(card);
  });
}

function handleSearch() {
  renderCatalog();
}

function getStarsString(rating) {
  const rounded = Math.round(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rounded ? "&#9733;" : "&#9734;";
  }
  return stars;
}

// ==========================================================================
// DETAILS MODAL LOGIC
// ==========================================================================
function openYamaDetails(id) {
  const item = currentTranslations.find(x => x.id === id);
  if (!item) return;
  
  selectedYamaId = id;
  
  // Set up modal contents
  detailBanner.src = item.imageUrl;
  detailBanner.alt = `${item.title} Görseli`;
  detailTitle.innerText = item.title;
  
  // Badge styling
  detailStatusBadge.innerText = `${item.status} (%${item.progress})`;
  detailStatusBadge.className = "detail-status-badge " + (item.status === "Tamamlandı" ? "status-completed" : "status-inprogress");
  
  detailDeveloper.innerText = item.developer;
  detailCategory.innerText = item.category;
  detailVersion.innerText = item.version;
  detailTranslator.innerText = item.translator;
  
  // Format release date nicely
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(item.releaseDate);
    detailReleaseDate.innerText = date.toLocaleDateString("tr-TR", options);
  } catch (e) {
    detailReleaseDate.innerText = item.releaseDate;
  }
  
  detailDownloadCount.innerText = item.downloads.toLocaleString();
  detailRatingVal.innerText = item.rating.toFixed(1);
  detailRatingCount.innerText = item.ratingCount || 0;
  detailDescription.innerText = item.description;
  
  // Render Platform badges
  detailPlatforms.innerHTML = "";
  item.platforms.forEach(p => {
    const badge = document.createElement("span");
    badge.className = "platform-badge";
    badge.innerText = p;
    detailPlatforms.appendChild(badge);
  });
  
  // Set up GitHub Link button
  if (item.githubUrl) {
    githubBtn.href = item.githubUrl;
    githubBtn.classList.remove("hidden");
  } else {
    githubBtn.classList.add("hidden");
  }
  
  // Clear comment form inputs
  commentForm.reset();
  
  // Reset rating selection box in evaluation
  resetStarRatingBox();
  
  // Render comments
  renderCommentsList(item.comments);
  
  // Open dialog
  detailModal.showModal();
}

function renderCommentsList(comments) {
  commentsList.innerHTML = "";
  commentCount.innerText = comments ? comments.length : 0;
  
  if (!comments || comments.length === 0) {
    commentsList.innerHTML = `
      <p style="text-align: center; color: var(--color-text-muted); font-size: 0.85rem; padding: 20px 0;">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
    `;
    return;
  }
  
  // Sort comments by date descending
  const sortedComments = [...comments].sort((a,b) => new Date(b.date) - new Date(a.date));
  
  sortedComments.forEach(c => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    
    // Format date
    let dateStr = c.date;
    try {
      dateStr = new Date(c.date).toLocaleDateString("tr-TR");
    } catch(e) {}
    
    const starsHtml = getStarsString(c.rating || 5);
    
    commentItem.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${escapeHTML(c.author)}</span>
        <div class="comment-meta">
          <span class="comment-stars">${starsHtml}</span>
          <span class="comment-date">${dateStr}</span>
        </div>
      </div>
      <p class="comment-body">${escapeHTML(c.content)}</p>
    `;
    commentsList.appendChild(commentItem);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================================================
// RATING & STAR INTERACTIONS
// ==========================================================================
function setupStarRatingInput() {
  const stars = starRatingInput.querySelectorAll(".star-btn");
  
  stars.forEach(star => {
    // Hover states
    star.addEventListener("mouseover", () => {
      const val = parseInt(star.dataset.value);
      highlightStars(val);
    });
    
    star.addEventListener("mouseout", () => {
      highlightStars(currentRatingSelection);
    });
    
    // Click rate
    star.addEventListener("click", () => {
      const val = parseInt(star.dataset.value);
      currentRatingSelection = val;
      highlightStars(val);
      submitGlobalRating(val);
    });
  });
}

function highlightStars(val) {
  const stars = starRatingInput.querySelectorAll(".star-btn");
  stars.forEach(star => {
    const starVal = parseInt(star.dataset.value);
    if (starVal <= val) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function resetStarRatingBox() {
  currentRatingSelection = 5;
  highlightStars(5);
  ratingFeedback.innerText = "Lütfen değerlendirin";
}

async function submitGlobalRating(score) {
  const item = currentTranslations.find(x => x.id === selectedYamaId);
  if (!item) return;
  
  try {
    const updated = await TranslationAPI.rate(item.id, score);
    const index = currentTranslations.findIndex(x => x.id === item.id);
    if (index !== -1) currentTranslations[index] = updated;
    updatePlatformStats();
    renderCatalog();
    detailRatingVal.innerText = Number(updated.rating || 0).toFixed(1);
    detailRatingCount.innerText = updated.ratingCount || 0;
    ratingFeedback.innerText = `Puanınız kaydedildi: ${score} Yıldız!`;
    showToast(`Yamayı ${score} yıldız ile değerlendirdiniz!`, "info");
  } catch (error) {
    showToast(error.message, "error");
  }
}

// ==========================================================================
// COMMENT FORM SUBMISSION
// ==========================================================================
async function handleCommentSubmit(e) {
  e.preventDefault();
  
  const authorInput = document.getElementById("commentAuthor");
  const textInput = document.getElementById("commentText");
  
  const author = authorInput.value.trim();
  const content = textInput.value.trim();
  
  if (!author || !content) return;
  
  const item = currentTranslations.find(x => x.id === selectedYamaId);
  if (!item) return;
  
  try {
    const updated = await TranslationAPI.comment(item.id, {
      author,
      content,
      rating: currentRatingSelection
    });
    const index = currentTranslations.findIndex(x => x.id === item.id);
    if (index !== -1) currentTranslations[index] = updated;
    updatePlatformStats();
    renderCatalog();
    renderCommentsList(updated.comments || []);
    detailRatingVal.innerText = Number(updated.rating || 0).toFixed(1);
    detailRatingCount.innerText = updated.ratingCount || 0;
    textInput.value = "";
    authorInput.value = "";
    showToast("Yorumunuz başarıyla eklendi!", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

// ==========================================================================
// DOWNLOAD SIMULATION
// ==========================================================================
async function handleDownloadClick() {
  const item = currentTranslations.find(x => x.id === selectedYamaId);
  if (!item) return;
  
  try {
    const updated = await TranslationAPI.download(item.id);
    const index = currentTranslations.findIndex(x => x.id === item.id);
    if (index !== -1) currentTranslations[index] = updated;
    updatePlatformStats();
    renderCatalog();
    detailDownloadCount.innerText = Number(updated.downloads || 0).toLocaleString();
    showToast(`${updated.title} Türkçe Yaması indiriliyor...`, "success");

    if (updated.downloadUrl && updated.downloadUrl !== "#") {
      window.open(updated.downloadUrl, "_blank", "noopener,noreferrer");
    } else {
      simulateFileDownload(updated);
    }
  } catch (error) {
    showToast(error.message, "error");
  }
}

function simulateFileDownload(item) {
  const fileName = `${item.title.replace(/[^a-zA-Z0-9]/g, "_")}_Turkce_Yama_Oku.txt`;
  
  const fileContent = `===============================================================
  ${item.title.toUpperCase()} TÜRKÇE YAMA KURULUM TALİMATI
===============================================================
Yama Sürümü: ${item.version}
Çevirmen / Ekip: ${item.translator}
Platformlar: ${item.platforms.join(", ")}
İndirilme Sayısı: ${item.downloads}

KURULUM ADIMLARI:
1. İndirdiğiniz zip arşivinin içerisindeki dosyaları oyunun ana 
   kurulum dizinine (Örn: Steam/steamapps/common/${item.title}) kopyalayın.
2. Dosyaları değiştirme uyarısı gelirse "Hedefteki dosyaları değiştir" seçeneğini seçin.
3. Oyunu başlatın ve Ayarlar -> Dil menüsünden Türkçe'yi etkinleştirin.

NOT: Yama kurulumundan önce oyun dosyalarınızın orijinal yedeklerini 
almanız tavsiye edilir. Herhangi bir hata durumunda yamayı kaldırıp
orijinal dosyaları geri yükleyebilirsiniz.

Keyifli oyunlar dileriz!
---------------------------------------------------------------
Yama Destek & Takip: TR-NEXUS Platformu (2026)
===============================================================`;

  const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
