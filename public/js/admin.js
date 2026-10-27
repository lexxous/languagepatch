// Admin authentication and MongoDB CRUD panel logic
const adminLoginTrigger = document.getElementById("adminLoginTrigger");
const adminBtnText = document.getElementById("adminBtnText");
const adminPanelTrigger = document.getElementById("adminPanelTrigger");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const adminPanelModal = document.getElementById("adminPanelModal");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const adminYamasList = document.getElementById("adminYamasList");
const addNewYamaBtn = document.getElementById("addNewYamaBtn");
const yamaCrudForm = document.getElementById("yamaCrudForm");
const formPanelTitle = document.getElementById("formPanelTitle");
const emptyFormState = document.getElementById("emptyFormState");
const yamaIdInput = document.getElementById("yamaId");
const yamaTitleInput = document.getElementById("yamaTitle");
const yamaDeveloperInput = document.getElementById("yamaDeveloper");
const yamaCategoryInput = document.getElementById("yamaCategory");
const yamaTranslatorInput = document.getElementById("yamaTranslator");
const yamaVersionInput = document.getElementById("yamaVersion");
const yamaReleaseDateInput = document.getElementById("yamaReleaseDate");
const yamaStatusSelect = document.getElementById("yamaStatus");
const yamaProgressInput = document.getElementById("yamaProgress");
const yamaDescriptionInput = document.getElementById("yamaDescription");
const yamaImageUrlInput = document.getElementById("yamaImageUrl");
const yamaDownloadUrlInput = document.getElementById("yamaDownloadUrl");
const yamaGithubUrlInput = document.getElementById("yamaGithubUrl");
const yamaFormImagePreview = document.getElementById("yamaFormImagePreview");
const cancelYamaFormBtn = document.getElementById("cancelYamaFormBtn");

const isAdminLoggedIn = () => Boolean(sessionStorage.getItem("admin_token"));

function checkAdminSession() {
  const active = isAdminLoggedIn();
  adminBtnText.innerText = active ? "Çıkış Yap" : "Yönetici Girişi";
  adminPanelTrigger.classList.toggle("hidden", !active);
}

async function refreshTranslations() {
  currentTranslations = await TranslationAPI.list();
  updatePlatformStats();
  renderCatalog();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (isAdminLoggedIn()) {
    try { await TranslationAPI.session(); }
    catch { sessionStorage.removeItem("admin_token"); }
  }
  checkAdminSession();

  adminLoginTrigger.addEventListener("click", () => {
    if (isAdminLoggedIn()) handleAdminLogout();
    else {
      loginForm.reset();
      loginError.classList.add("hidden");
      loginModal.showModal();
    }
  });
  loginForm.addEventListener("submit", handleAdminLoginSubmit);
  adminPanelTrigger.addEventListener("click", openAdminPanel);
  adminLogoutBtn.addEventListener("click", handleAdminLogout);
  addNewYamaBtn.addEventListener("click", prepareAddForm);
  yamaImageUrlInput.addEventListener("input", updateImagePreview);
  yamaCrudForm.addEventListener("submit", handleYamaCrudSubmit);
  cancelYamaFormBtn.addEventListener("click", resetFormPanel);
});

async function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  try {
    const result = await TranslationAPI.login(user, pass);
    sessionStorage.setItem("admin_token", result.token);
    checkAdminSession();
    loginModal.close();
    showToast("Başarıyla yönetici girişi yapıldı!", "success");
    setTimeout(openAdminPanel, 300);
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.remove("hidden");
  }
}

async function handleAdminLogout() {
  try { if (isAdminLoggedIn()) await TranslationAPI.logout(); } catch {}
  sessionStorage.removeItem("admin_token");
  checkAdminSession();
  if (adminPanelModal.open) adminPanelModal.close();
  if (loginModal.open) loginModal.close();
  showToast("Yönetici çıkışı yapıldı.", "info");
}

function openAdminPanel() {
  if (!isAdminLoggedIn()) return;
  renderAdminYamasList();
  resetFormPanel();
  adminPanelModal.showModal();
}

function renderAdminYamasList() {
  adminYamasList.innerHTML = "";
  if (!currentTranslations.length) {
    adminYamasList.innerHTML = '<div style="text-align:center;padding:20px;color:var(--color-text-muted);">Çeviri bulunamadı.</div>';
    return;
  }

  currentTranslations.forEach(item => {
    const row = document.createElement("div");
    row.className = "admin-yama-row";
    row.dataset.id = item.id;
    row.innerHTML = `
      <div class="admin-row-info">
        <span class="admin-row-title">${escapeHTML(item.title)}</span>
        <span class="admin-row-meta">${escapeHTML(item.category)} &bull; ${escapeHTML(item.version)}</span>
      </div>
      <div class="admin-row-actions">
        <button class="action-icon-btn delete-btn" data-id="${item.id}" title="Çeviriyi Sil">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>`;
    row.addEventListener("click", e => {
      if (e.target.closest(".delete-btn")) return;
      document.querySelectorAll(".admin-yama-row").forEach(r => r.classList.remove("active"));
      row.classList.add("active");
      loadYamaToForm(item.id);
    });
    row.querySelector(".delete-btn").addEventListener("click", e => {
      e.stopPropagation();
      handleDeleteYama(item.id);
    });
    adminYamasList.appendChild(row);
  });
}

function resetFormPanel() {
  yamaCrudForm.reset();
  yamaIdInput.value = "";
  yamaFormImagePreview.classList.add("hidden");
  yamaFormImagePreview.src = "";
  yamaCrudForm.classList.add("hidden");
  emptyFormState.classList.remove("hidden");
  document.querySelectorAll(".admin-yama-row").forEach(r => r.classList.remove("active"));
}

function updateImagePreview() {
  const url = yamaImageUrlInput.value.trim();
  yamaFormImagePreview.src = url;
  yamaFormImagePreview.classList.toggle("hidden", !url);
}

function prepareAddForm() {
  resetFormPanel();
  formPanelTitle.innerText = "Yeni Çeviri Ekle";
  yamaProgressInput.value = 100;
  yamaReleaseDateInput.value = new Date().toISOString().split("T")[0];
  emptyFormState.classList.add("hidden");
  yamaCrudForm.classList.remove("hidden");
}

function loadYamaToForm(id) {
  const item = currentTranslations.find(x => x.id === id);
  if (!item) return;
  formPanelTitle.innerText = "Çeviri Düzenle";
  yamaIdInput.value = item.id;
  yamaTitleInput.value = item.title || "";
  yamaDeveloperInput.value = item.developer || "";
  yamaCategoryInput.value = item.category || "";
  yamaTranslatorInput.value = item.translator || "";
  yamaVersionInput.value = item.version || "";
  yamaReleaseDateInput.value = (item.releaseDate || "").slice(0, 10);
  yamaStatusSelect.value = item.status || "Tamamlandı";
  yamaProgressInput.value = item.progress ?? 0;
  yamaDescriptionInput.value = item.description || "";
  yamaImageUrlInput.value = item.imageUrl || "";
  yamaDownloadUrlInput.value = item.downloadUrl || "";
  yamaGithubUrlInput.value = item.githubUrl || "";
  document.querySelectorAll('input[name="yamaPlatforms"]').forEach(cb => {
    cb.checked = (item.platforms || []).includes(cb.value);
  });
  updateImagePreview();
  emptyFormState.classList.add("hidden");
  yamaCrudForm.classList.remove("hidden");
}

async function handleYamaCrudSubmit(e) {
  e.preventDefault();
  const id = yamaIdInput.value;
  const platforms = [...document.querySelectorAll('input[name="yamaPlatforms"]:checked')].map(cb => cb.value);
  if (!platforms.length) return showToast("Lütfen en az bir uyumlu platform seçin!", "error");

  const payload = {
    title: yamaTitleInput.value.trim(),
    developer: yamaDeveloperInput.value.trim(),
    category: yamaCategoryInput.value.trim(),
    translator: yamaTranslatorInput.value.trim(),
    version: yamaVersionInput.value.trim(),
    releaseDate: yamaReleaseDateInput.value,
    status: yamaStatusSelect.value,
    progress: Number(yamaProgressInput.value),
    description: yamaDescriptionInput.value.trim(),
    imageUrl: yamaImageUrlInput.value.trim(),
    downloadUrl: yamaDownloadUrlInput.value.trim(),
    githubUrl: yamaGithubUrlInput.value.trim(),
    platforms
  };

  try {
    if (id) await TranslationAPI.update(id, payload);
    else await TranslationAPI.create(payload);
    await refreshTranslations();
    renderAdminYamasList();
    resetFormPanel();
    showToast(id ? "Çeviri başarıyla güncellendi!" : "Yeni yama çevirisi eklendi!", "success");
  } catch (error) {
    if (/oturum/i.test(error.message)) {
      sessionStorage.removeItem("admin_token");
      checkAdminSession();
    }
    showToast(error.message, "error");
  }
}

async function handleDeleteYama(id) {
  const item = currentTranslations.find(x => x.id === id);
  if (!item || !confirm(`"${item.title}" yama çevirisini silmek istediğinize emin misiniz?`)) return;
  try {
    await TranslationAPI.remove(id);
    await refreshTranslations();
    renderAdminYamasList();
    if (yamaIdInput.value === id) resetFormPanel();
    showToast("Yama çevirisi başarıyla silindi.", "info");
  } catch (error) {
    showToast(error.message, "error");
  }
}
