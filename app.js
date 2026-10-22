/**
 * ==============================================================================
 * LABELA - PERSONALIZADOS & 3D | CATÁLOGO DIGITAL ESTÁTICO (GITHUB PAGES READY)
 * ==============================================================================
 * Arquitetura Vanilla JavaScript Modular
 * - Consumo de dados via products.js ou Google Sheets (formato CSV público)
 * - Persistência de sacola em LocalStorage
 * - Interface inspirada no Gifter (TemplateMonster 74228) nas cores da Labela
 * - Checkout direto para o WhatsApp
 * ==============================================================================
 */

// ==============================================================================
// 1. CONFIGURAÇÕES & CONSTANTES GLOBAIS
// ==============================================================================

/**
 * URL do CSV publicado da planilha do Google Sheets (opcional).
 * Caso esteja vazia, utiliza automaticamente os produtos do arquivo products.js.
 */
const GOOGLE_SHEETS_CSV_URL = "";

/**
 * Número do WhatsApp para recebimento dos pedidos (DDI + DDD + Telefone, apenas números).
 */
const WHATSAPP_PHONE_NUMBER = "5511964729650";

/**
 * Chave de armazenamento no LocalStorage para a sacola da Labela
 */
const STORAGE_CART_KEY = "labela_cart_v1";

/**
 * Imagem padrão caso algum produto não possua foto
 */
const PLACEHOLDER_IMAGE = "assets/img/logo.jpeg";

/**
 * Dados de demonstração (fallback inteligente)
 */
const DEMO_PRODUCTS = [
  {
    id: "enfeite-de-porta-presepio",
    nome: "Enfeite de Porta - Presépio",
    categoria: "Natal & Decoração",
    preco: 27.90,
    descricao: "Enfeite de canto de porta (cantoneira de batente) com a cena tradicional do Presépio de Natal. Uma peça delicada e cheia de significado para acolher quem chega ao seu lar com o verdadeiro espírito natalino.\n\nEncaixe prático diretamente no batente da porta, moldura, janela ou prateleira.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D com alta precisão\n• Material: PLA ecológico e resistente\n• Cores disponíveis: Vermelho, Dourado, Bege, Verde e Branco",
    imagens: [
      "assets/img/products/Enfeite%20de%20Porta%20-%20Pres%C3%A9pio/image.jpg",
      "assets/img/products/Enfeite%20de%20Porta%20-%20Pres%C3%A9pio/image.jpg%2001.jpg",
      "assets/img/products/Enfeite%20de%20Porta%20-%20Pres%C3%A9pio/image.jpg%2002.jpg",
      "assets/img/products/Enfeite%20de%20Porta%20-%20Pres%C3%A9pio/image.jpg%2003.jpg",
      "assets/img/products/Enfeite%20de%20Porta%20-%20Pres%C3%A9pio/image.jpg%2004.jpg"
    ]
  },
  {
    id: "rolinha-esqueceram-de-mim",
    nome: "Rolinha da Amizade (Esqueceram de Mim)",
    categoria: "Presentes Afetivos",
    preco: 12.90,
    descricao: "Inspirada no clássico 'Esqueceram de Mim', um símbolo afetivo de união e lealdade para presentear quem você ama ou decorar sua árvore de Natal com significado.\n\n\"Enquanto cada um de nós tiver a sua rolinha, seremos amigos para sempre.\"\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D com alta precisão\n• Material: PLA ecológico e resistente\n• Cor: Branco Off-white perolado",
    imagens: [
      "assets/img/products/rolinha-esqueceram-de-mim/rolinha%20capa.jpeg",
      "assets/img/products/rolinha-esqueceram-de-mim/rolinha%2001.jpeg"
    ]
  }
];

// ==============================================================================
// 2. ESTADO GLOBAL DA APLICAÇÃO (STATE MANAGEMENT)
// ==============================================================================

const AppState = {
  products: [],
  filteredProducts: [],
  cart: [],
  modalProduct: null,
  activeImageIndex: 0,
  modalQuantity: 1,
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "default",
  isCartOpen: false,
  isProductModalOpen: false
};

// ==============================================================================
// 3. UTILITÁRIOS E HELPERS
// ==============================================================================

function formatBRL(value) {
  const safeNumber = isNaN(value) ? 0 : Number(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(safeNumber);
}

function parsePrice(priceStr) {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;

  let cleaned = priceStr.toString().replace(/[^\d.,]/g, "").trim();
  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function parseCSV(text) {
  const rows = [];
  let currentRow = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentRow[currentRow.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push("");
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      if (currentRow.length > 1 || currentRow[0].trim() !== "") {
        rows.push(currentRow);
      }
      currentRow = [""];
    } else {
      currentRow[currentRow.length - 1] += char;
    }
  }

  if (currentRow.length > 1 || currentRow[0].trim() !== "") {
    rows.push(currentRow);
  }

  return rows;
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2800);
}

// ==============================================================================
// 4. PERSISTÊNCIA DA SACOLA (LOCALSTORAGE)
// ==============================================================================

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_CART_KEY);
    AppState.cart = stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Erro ao carregar sacola do localStorage:", err);
    AppState.cart = [];
  }
  updateCartCounters();
}

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(AppState.cart));
  } catch (err) {
    console.error("Erro ao salvar sacola no localStorage:", err);
  }
  updateCartCounters();
}

function addToCart(product, quantity = 1) {
  if (!product || !product.id) return;
  const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

  const existingIndex = AppState.cart.findIndex(item => item.product.id === product.id);

  if (existingIndex > -1) {
    AppState.cart[existingIndex].quantity += qtyToAdd;
  } else {
    AppState.cart.push({
      product: {
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagem: (product.imagens && product.imagens.length > 0) ? product.imagens[0] : PLACEHOLDER_IMAGE
      },
      quantity: qtyToAdd
    });
  }

  saveCartToStorage();
  showToast(`"${product.nome}" adicionado à sacola!`);
  renderCartModal();
}

function updateItemQuantity(productId, delta) {
  const itemIndex = AppState.cart.findIndex(item => item.product.id === productId);
  if (itemIndex === -1) return;

  AppState.cart[itemIndex].quantity += delta;

  if (AppState.cart[itemIndex].quantity <= 0) {
    AppState.cart.splice(itemIndex, 1);
  }

  saveCartToStorage();
  renderCartModal();
}

function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(item => item.product.id !== productId);
  saveCartToStorage();
  renderCartModal();
}

function updateCartCounters() {
  const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

  const headerBadge = document.getElementById("headerCartCount");
  const floatingBadge = document.getElementById("floatingCartCount");
  const summaryCount = document.getElementById("cartItemSummaryCount");

  if (headerBadge) headerBadge.textContent = totalItems;
  if (floatingBadge) floatingBadge.textContent = totalItems;
  if (summaryCount) {
    summaryCount.textContent = totalItems === 1 ? "1 item selecionado" : `${totalItems} itens selecionados`;
  }
}

function getCartTotal() {
  return AppState.cart.reduce((total, item) => {
    return total + (item.product.preco * item.quantity);
  }, 0);
}

// ==============================================================================
// 5. CARREGAMENTO E CONSUMO DOS DADOS (PRODUCTS.JS & GOOGLE SHEETS CSV)
// ==============================================================================

function splitImageUrls(imagensField) {
  if (!imagensField || typeof imagensField !== "string") {
    return [PLACEHOLDER_IMAGE];
  }

  const urls = imagensField
    .split(",")
    .map(url => url.trim())
    .filter(url => url.length > 0);

  return urls.length > 0 ? urls : [PLACEHOLDER_IMAGE];
}

async function loadProductsData() {
  const skeleton = document.getElementById("loadingSkeleton");
  const grid = document.getElementById("productsGrid");

  if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) && PRODUCTS.length > 0 && (!GOOGLE_SHEETS_CSV_URL || GOOGLE_SHEETS_CSV_URL.trim() === "")) {
    AppState.products = PRODUCTS;
    AppState.filteredProducts = [...PRODUCTS];
    if (skeleton) skeleton.classList.add("hidden");
    if (grid) grid.classList.remove("hidden");
    renderCategoryFilters();
    renderProducts();
    return;
  }

  if (GOOGLE_SHEETS_CSV_URL && GOOGLE_SHEETS_CSV_URL.trim() !== "") {
    await fetchProductsFromSheets();
    return;
  }

  AppState.products = (typeof PRODUCTS !== "undefined" && PRODUCTS.length > 0) ? PRODUCTS : DEMO_PRODUCTS;
  AppState.filteredProducts = [...AppState.products];
  if (skeleton) skeleton.classList.add("hidden");
  if (grid) grid.classList.remove("hidden");
  renderCategoryFilters();
  renderProducts();
}

async function fetchProductsFromSheets() {
  const skeleton = document.getElementById("loadingSkeleton");
  const grid = document.getElementById("productsGrid");
  const errorState = document.getElementById("errorState");
  const emptyState = document.getElementById("emptyState");

  if (!GOOGLE_SHEETS_CSV_URL || GOOGLE_SHEETS_CSV_URL.trim() === "") {
    AppState.products = (typeof PRODUCTS !== "undefined" && PRODUCTS.length > 0) ? PRODUCTS : DEMO_PRODUCTS;
    AppState.filteredProducts = [...AppState.products];
    renderCategoryFilters();
    renderProducts();
    if (skeleton) skeleton.classList.add("hidden");
    if (grid) grid.classList.remove("hidden");
    return;
  }

  try {
    if (skeleton) skeleton.classList.remove("hidden");
    if (grid) grid.classList.add("hidden");
    if (errorState) errorState.classList.add("hidden");
    if (emptyState) emptyState.classList.add("hidden");

    const response = await fetch(GOOGLE_SHEETS_CSV_URL, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Erro HTTP ao buscar planilha: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const parsedRows = parseCSV(csvText);

    if (parsedRows.length < 2) {
      throw new Error("A planilha está vazia ou não contém produtos cadastrados.");
    }

    const headerRow = parsedRows[0].map(col => col.trim().toLowerCase());
    const idIdx = headerRow.findIndex(h => h === "id");
    const nomeIdx = headerRow.findIndex(h => h === "nome" || h === "produto");
    const descIdx = headerRow.findIndex(h => h === "descricao" || h === "descrição");
    const precoIdx = headerRow.findIndex(h => h === "preco" || h === "preço" || h === "valor");
    const imagensIdx = headerRow.findIndex(h => h === "imagens" || h === "imagem" || h === "fotos");
    const catIdx = headerRow.findIndex(h => h === "categoria" || h === "tipo");

    if (nomeIdx === -1 || precoIdx === -1) {
      throw new Error("Cabeçalho inválido no CSV. Certifique-se de ter as colunas: id, nome, descricao, preco, imagens.");
    }

    const products = [];
    for (let i = 1; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      if (!row || row.length === 0 || !row[nomeIdx] || row[nomeIdx].trim() === "") continue;

      const rawId = (idIdx !== -1 && row[idIdx]) ? row[idIdx].trim() : `prod-${i}`;
      const nome = row[nomeIdx].trim();
      const descricao = (descIdx !== -1 && row[descIdx]) ? row[descIdx].trim() : "Sem descrição detalhada.";
      const preco = parsePrice(row[precoIdx]);
      const rawImagens = (imagensIdx !== -1 && row[imagensIdx]) ? row[imagensIdx] : "";
      const categoria = (catIdx !== -1 && row[catIdx]) ? row[catIdx].trim() : "Personalizados";
      const imagens = splitImageUrls(rawImagens);

      products.push({
        id: rawId,
        nome,
        categoria,
        descricao,
        preco,
        imagens
      });
    }

    AppState.products = products;
    AppState.filteredProducts = [...products];

    if (skeleton) skeleton.classList.add("hidden");
    if (grid) grid.classList.remove("hidden");
    renderCategoryFilters();
    renderProducts();

  } catch (error) {
    console.error("Falha ao obter produtos via Google Sheets:", error);
    AppState.products = (typeof PRODUCTS !== "undefined" && PRODUCTS.length > 0) ? PRODUCTS : DEMO_PRODUCTS;
    AppState.filteredProducts = [...AppState.products];

    if (skeleton) skeleton.classList.add("hidden");
    if (grid) grid.classList.remove("hidden");
    renderCategoryFilters();
    renderProducts();
  }
}

// ==============================================================================
// 6. RENDERIZAÇÃO DA INTERFACE PRINCIPAL (GRID DE PRODUTOS & CATEGORIAS)
// ==============================================================================

function renderCategoryFilters() {
  const container = document.getElementById("categoryFilters");
  if (!container) return;

  const categories = [...new Set(AppState.products.map(p => p.categoria).filter(Boolean))];

  if (categories.length <= 1) {
    container.innerHTML = "";
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");
  container.innerHTML = [
    `<button class="category-btn ${AppState.selectedCategory === 'all' ? 'active bg-crimson-700 text-white shadow-md shadow-crimson-900/15 font-bold border border-gold-300/40' : 'bg-champagne-50 text-gold-800 hover:bg-champagne-200/70 border border-gold-400/40 font-semibold'} px-4 py-2 rounded-full text-xs transition-all whitespace-nowrap" data-category="all">★ Todas as Peças</button>`,
    ...categories.map(cat => `
      <button class="category-btn ${AppState.selectedCategory === cat ? 'active bg-crimson-700 text-white shadow-md shadow-crimson-900/15 font-bold border border-gold-300/40' : 'bg-champagne-50 text-gold-800 hover:bg-champagne-200/70 border border-gold-400/40 font-semibold'} px-4 py-2 rounded-full text-xs transition-all whitespace-nowrap" data-category="${cat}">
        ♥ ${cat}
      </button>
    `)
  ].join("");

  container.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      AppState.selectedCategory = btn.getAttribute("data-category") || "all";
      renderCategoryFilters();
      renderProducts();
    });
  });
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const countLabel = document.getElementById("productsCount");
  const emptyState = document.getElementById("emptyState");

  if (!grid) return;

  let list = AppState.products.filter(item => {
    if (AppState.selectedCategory && AppState.selectedCategory !== "all") {
      if (item.categoria !== AppState.selectedCategory) return false;
    }

    if (!AppState.searchQuery) return true;
    const q = AppState.searchQuery.toLowerCase();
    const nomeMatches = item.nome && item.nome.toLowerCase().includes(q);
    const descMatches = item.descricao && item.descricao.toLowerCase().includes(q);
    const catMatches = item.categoria && item.categoria.toLowerCase().includes(q);
    return nomeMatches || descMatches || catMatches;
  });

  if (AppState.sortBy === "price-asc") {
    list.sort((a, b) => a.preco - b.preco);
  } else if (AppState.sortBy === "price-desc") {
    list.sort((a, b) => b.preco - a.preco);
  } else if (AppState.sortBy === "name-asc") {
    list.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  AppState.filteredProducts = list;

  if (countLabel) {
    countLabel.textContent = `${list.length} ${list.length === 1 ? "criação exclusiva disponível" : "criações exclusivas disponíveis"}`;
  }

  if (list.length === 0) {
    grid.innerHTML = "";
    grid.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");
  grid.classList.remove("hidden");

  // Cards em formato de Cartão Atelier (Moldura Dupla Pontilhada Dourada + Fita Vermelha Gifter)
  grid.innerHTML = list.map(product => {
    const firstImage = (product.imagens && product.imagens.length > 0) ? product.imagens[0] : PLACEHOLDER_IMAGE;
    const totalImages = product.imagens ? product.imagens.length : 1;

    return `
      <div 
        class="atelier-product-card p-3.5 flex flex-col group"
        data-id="${product.id}"
      >
        <!-- Moldura da Foto -->
        <div 
          class="relative aspect-square w-full bg-champagne-200 rounded-2xl overflow-hidden cursor-pointer js-open-details border border-gold-300/40"
          data-id="${product.id}"
          title="Ver detalhes de ${product.nome}"
        >
          <img 
            src="${firstImage}" 
            alt="${product.nome}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';"
          >

          <!-- Badges Superiores Estilo Gifter -->
          <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            ${product.categoria ? `
              <span class="bg-crimson-800/90 backdrop-blur-md text-gold-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-gold-400/30">
                ★ ${product.categoria}
              </span>
            ` : "<span></span>"}

            <span class="bg-champagne-50/95 backdrop-blur-md text-gold-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-gold-400/40">
              <span class="text-salmon-400">♥</span> 3D
            </span>
          </div>

          ${totalImages > 1 ? `
            <span class="absolute bottom-2.5 right-2.5 bg-crimson-950/80 backdrop-blur-md text-champagne-100 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-gold-400/30">
              <svg class="w-3 h-3 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              ${totalImages} fotos
            </span>
          ` : ""}
        </div>

        <!-- Corpo Centralizado Estilo Cartão Comemorativo -->
        <div class="pt-4 pb-2 px-2 flex-1 flex flex-col justify-between text-center">
          <div>
            <!-- Subtítulo Atelier -->
            <div class="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gold-600 mb-1 uppercase tracking-[0.18em]">
              <span>Labela Atelier</span>
              <span class="text-salmon-400">♥</span>
              <span>PLA Eco</span>
            </div>

            <!-- Nome do Produto -->
            <h3 
              class="font-serif font-bold text-gold-900 text-xl leading-snug line-clamp-2 hover:text-crimson-700 cursor-pointer transition-colors js-open-details"
              data-id="${product.id}"
              title="${product.nome}"
            >
              ${product.nome}
            </h3>

            <!-- Divisor Delicado -->
            <div class="flex items-center justify-center gap-2 my-2">
              <span class="w-8 h-[1px] bg-gold-400/40"></span>
              <span class="text-gold-500 text-[10px]">✦</span>
              <span class="w-8 h-[1px] bg-gold-400/40"></span>
            </div>

            <!-- Preço Formatado em BRL -->
            <p class="text-xl font-extrabold text-crimson-700">
              ${formatBRL(product.preco)}
            </p>
          </div>

          <!-- Botão Adicionar à Sacola -->
          <button 
            type="button"
            class="mt-4 w-full py-2.5 px-4 rounded-full bg-crimson-700 hover:bg-crimson-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-crimson-900/15 transition-all js-add-cart-btn group border border-gold-300/40 relative z-10"
            data-id="${product.id}"
          >
            <svg class="w-4 h-4 text-gold-300 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Adicionar à Sacola
          </button>
        </div>
      </div>
    `;
  }).join("");

  attachProductCardEvents();
}

function attachProductCardEvents() {
  document.querySelectorAll(".js-open-details").forEach(el => {
    if (el.dataset.bound === "true") return;
    el.dataset.bound = "true";
    el.addEventListener("click", () => {
      const prodId = el.getAttribute("data-id");
      openProductModal(prodId);
    });
  });

  document.querySelectorAll(".js-add-cart-btn").forEach(btn => {
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const prodId = btn.getAttribute("data-id");
      const product = AppState.products.find(p => p.id === prodId);
      if (product) {
        addToCart(product, 1);
      }
    });
  });
}

// ==============================================================================
// 7. MODAL DE DETALHES DO PRODUTO & CARROSSEL DE IMAGENS
// ==============================================================================

function openProductModal(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  AppState.modalProduct = product;
  AppState.activeImageIndex = 0;
  AppState.modalQuantity = 1;
  AppState.isProductModalOpen = true;

  const modal = document.getElementById("productModal");
  const modalName = document.getElementById("modalProductName");
  const modalPrice = document.getElementById("modalProductPrice");
  const modalDesc = document.getElementById("modalProductDescription");
  const modalQtyVal = document.getElementById("modalQtyValue");

  if (modalName) modalName.textContent = product.nome;
  if (modalPrice) modalPrice.textContent = formatBRL(product.preco);
  if (modalDesc) modalDesc.textContent = product.descricao || "Sem descrição disponível.";
  if (modalQtyVal) modalQtyVal.textContent = "1";

  updateCarouselView();

  if (modal) {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.add("hidden");
  }
  AppState.isProductModalOpen = false;
  AppState.modalProduct = null;
  if (!AppState.isCartOpen) {
    document.body.classList.remove("overflow-hidden");
  }
}

function updateCarouselView() {
  const product = AppState.modalProduct;
  if (!product) return;

  const images = (product.imagens && product.imagens.length > 0) ? product.imagens : [PLACEHOLDER_IMAGE];
  const total = images.length;
  const currentIdx = Math.max(0, Math.min(AppState.activeImageIndex, total - 1));
  AppState.activeImageIndex = currentIdx;

  const mainImg = document.getElementById("carouselMainImg");
  const badge = document.getElementById("carouselBadge");
  const prevBtn = document.getElementById("carouselPrevBtn");
  const nextBtn = document.getElementById("carouselNextBtn");
  const thumbnailsContainer = document.getElementById("carouselThumbnails");

  if (mainImg) {
    mainImg.src = images[currentIdx];
    mainImg.alt = `${product.nome} - Imagem ${currentIdx + 1}`;
    mainImg.onerror = () => { mainImg.src = PLACEHOLDER_IMAGE; };
  }

  if (badge) {
    badge.textContent = `${currentIdx + 1} / ${total}`;
    badge.style.display = total > 1 ? "block" : "none";
  }

  if (prevBtn) prevBtn.style.display = total > 1 ? "flex" : "none";
  if (nextBtn) nextBtn.style.display = total > 1 ? "flex" : "none";

  if (thumbnailsContainer) {
    if (total <= 1) {
      thumbnailsContainer.innerHTML = "";
    } else {
      thumbnailsContainer.innerHTML = images.map((url, idx) => `
        <button 
          type="button"
          class="w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${idx === currentIdx ? "border-crimson-700 scale-95 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}"
          onclick="selectCarouselImage(${idx})"
          aria-label="Ver imagem ${idx + 1}"
        >
          <img src="${url}" alt="Miniatura ${idx + 1}" class="w-full h-full object-cover" onerror="this.src='${PLACEHOLDER_IMAGE}';">
        </button>
      `).join("");
    }
  }
}

window.selectCarouselImage = function(index) {
  AppState.activeImageIndex = index;
  updateCarouselView();
};

function prevCarouselImage() {
  if (!AppState.modalProduct || !AppState.modalProduct.imagens) return;
  const total = AppState.modalProduct.imagens.length;
  AppState.activeImageIndex = (AppState.activeImageIndex - 1 + total) % total;
  updateCarouselView();
}

function nextCarouselImage() {
  if (!AppState.modalProduct || !AppState.modalProduct.imagens) return;
  const total = AppState.modalProduct.imagens.length;
  AppState.activeImageIndex = (AppState.activeImageIndex + 1) % total;
  updateCarouselView();
}

// ==============================================================================
// 8. MODAL DA SACOLA DE COMPRAS
// ==============================================================================

function openCartModal() {
  AppState.isCartOpen = true;
  renderCartModal();

  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }
}

function closeCartModal() {
  AppState.isCartOpen = false;
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.add("hidden");
  }
  if (!AppState.isProductModalOpen) {
    document.body.classList.remove("overflow-hidden");
  }
}

function renderCartModal() {
  const container = document.getElementById("cartItemsList");
  const emptyView = document.getElementById("emptyCartView");
  const footer = document.getElementById("cartFooter");
  const subtotalEl = document.getElementById("cartSubtotalValue");
  const totalEl = document.getElementById("cartTotalValue");

  if (!container) return;

  if (AppState.cart.length === 0) {
    container.innerHTML = "";
    container.classList.add("hidden");
    if (emptyView) emptyView.classList.remove("hidden");
    if (footer) footer.classList.add("hidden");
    return;
  }

  if (emptyView) emptyView.classList.add("hidden");
  if (footer) footer.classList.remove("hidden");
  container.classList.remove("hidden");

  container.innerHTML = AppState.cart.map(item => {
    const itemTotal = item.product.preco * item.quantity;
    const itemImage = (item.product.imagens && item.product.imagens.length > 0) 
      ? item.product.imagens[0] 
      : (item.product.imagem || PLACEHOLDER_IMAGE);

    return `
      <div class="py-4 flex gap-4 items-center justify-between">
        <img 
          src="${itemImage}" 
          alt="${item.product.nome}" 
          class="w-16 h-16 rounded-xl object-cover bg-champagne-200 border border-gold-400/40 flex-shrink-0"
          onerror="this.src='${PLACEHOLDER_IMAGE}';"
        >

        <div class="flex-1 min-w-0">
          <h4 class="font-serif text-base font-bold text-gold-900 truncate" title="${item.product.nome}">
            ${item.product.nome}
          </h4>
          <p class="text-xs text-gold-700 mt-0.5">
            ${formatBRL(item.product.preco)} cada
          </p>

          <div class="flex items-center gap-2 mt-2">
            <button 
              type="button"
              class="w-7 h-7 rounded-full bg-champagne-200 hover:bg-crimson-700 text-gold-900 hover:text-white font-bold text-xs flex items-center justify-center transition-colors border border-gold-400/40"
              onclick="updateCartItemQty('${item.product.id}', -1)"
              aria-label="Diminuir quantidade"
            >-</button>
            <span class="text-xs font-bold text-crimson-800 w-5 text-center">${item.quantity}</span>
            <button 
              type="button"
              class="w-7 h-7 rounded-full bg-champagne-200 hover:bg-crimson-700 text-gold-900 hover:text-white font-bold text-xs flex items-center justify-center transition-colors border border-gold-400/40"
              onclick="updateCartItemQty('${item.product.id}', 1)"
              aria-label="Aumentar quantidade"
            >+</button>
          </div>
        </div>

        <div class="text-right flex flex-col items-end justify-between self-stretch">
          <button 
            type="button" 
            class="text-gold-600 hover:text-crimson-700 transition-colors p-1"
            onclick="removeCartItem('${item.product.id}')"
            title="Remover peça"
            aria-label="Remover peça"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
          <span class="text-sm font-black text-crimson-700">
            ${formatBRL(itemTotal)}
          </span>
        </div>
      </div>
    `;
  }).join("");

  const grandTotal = getCartTotal();
  if (subtotalEl) subtotalEl.textContent = formatBRL(grandTotal);
  if (totalEl) totalEl.textContent = formatBRL(grandTotal);
}

window.updateCartItemQty = function(id, delta) {
  updateItemQuantity(id, delta);
};

window.removeCartItem = function(id) {
  removeFromCart(id);
};

// ==============================================================================
// 9. CHECKOUT VIA WHATSAPP (MENSAGEM FORMATADA LABELA)
// ==============================================================================

function checkoutViaWhatsApp() {
  if (AppState.cart.length === 0) {
    showToast("Sua sacola está vazia!");
    return;
  }

  const cleanPhone = WHATSAPP_PHONE_NUMBER.replace(/\D/g, "");

  const itensFormatados = AppState.cart.map(item => {
    const itemSubtotal = formatBRL(item.product.preco * item.quantity);
    return `• ${item.quantity}x ${item.product.nome} (${formatBRL(item.product.preco)}) = ${itemSubtotal}`;
  }).join("\n");

  const totalFormatado = formatBRL(getCartTotal());

  const mensagem = [
    "🎄 *Olá, Labela Personalizados & 3D! Gostaria de fazer o seguinte pedido:*",
    "",
    itensFormatados,
    "",
    `✨ *Total Estimado das Peças: ${totalFormatado}*`,
    "",
    "Poderia me informar as opções de cores/personalização, prazo de produção e frete para o meu CEP?"
  ].join("\n");

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensagem)}`;
  window.open(whatsappUrl, "_blank");
}

// ==============================================================================
// 10. INICIALIZAÇÃO DE EVENTOS & CICLO DE VIDA (DOM READY)
// ==============================================================================

function setupEventListeners() {
  const cartHeaderBtn = document.getElementById("cartHeaderBtn");
  const cartFloatingBtn = document.getElementById("cartFloatingBtn");
  const closeCartBtn = document.getElementById("closeCartModalBtn");
  const continueShoppingBtn = document.getElementById("continueShoppingBtn");

  if (cartHeaderBtn) cartHeaderBtn.addEventListener("click", openCartModal);
  if (cartFloatingBtn) cartFloatingBtn.addEventListener("click", openCartModal);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartModal);
  if (continueShoppingBtn) continueShoppingBtn.addEventListener("click", closeCartModal);

  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) closeCartModal();
    });
  }

  const productModal = document.getElementById("productModal");
  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }

  const closeProductModalBtn = document.getElementById("closeProductModalBtn");
  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener("click", closeProductModal);
  }

  const carouselPrevBtn = document.getElementById("carouselPrevBtn");
  const carouselNextBtn = document.getElementById("carouselNextBtn");
  if (carouselPrevBtn) carouselPrevBtn.addEventListener("click", prevCarouselImage);
  if (carouselNextBtn) carouselNextBtn.addEventListener("click", nextCarouselImage);

  const modalQtyMinus = document.getElementById("modalQtyMinus");
  const modalQtyPlus = document.getElementById("modalQtyPlus");
  const modalQtyVal = document.getElementById("modalQtyValue");
  const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

  if (modalQtyMinus) {
    modalQtyMinus.addEventListener("click", () => {
      if (AppState.modalQuantity > 1) {
        AppState.modalQuantity--;
        if (modalQtyVal) modalQtyVal.textContent = AppState.modalQuantity;
      }
    });
  }

  if (modalQtyPlus) {
    modalQtyPlus.addEventListener("click", () => {
      AppState.modalQuantity++;
      if (modalQtyVal) modalQtyVal.textContent = AppState.modalQuantity;
    });
  }

  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener("click", () => {
      if (AppState.modalProduct) {
        addToCart(AppState.modalProduct, AppState.modalQuantity);
        closeProductModal();
      }
    });
  }

  const whatsappBtn = document.getElementById("whatsappCheckoutBtn");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", checkoutViaWhatsApp);
  }

  const searchInput = document.getElementById("searchInput");
  const searchMobileInput = document.getElementById("searchMobileInput");
  const resetSearchBtn = document.getElementById("resetSearchBtn");

  const handleSearch = (val) => {
    AppState.searchQuery = val.trim();
    if (searchInput) searchInput.value = val;
    if (searchMobileInput) searchMobileInput.value = val;
    renderProducts();
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
  }
  if (searchMobileInput) {
    searchMobileInput.addEventListener("input", (e) => handleSearch(e.target.value));
  }
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", () => {
      handleSearch("");
      AppState.selectedCategory = "all";
      renderCategoryFilters();
      renderProducts();
    });
  }

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      AppState.sortBy = e.target.value;
      renderProducts();
    });
  }

  const retryBtn = document.getElementById("retryBtn");
  if (retryBtn) {
    retryBtn.addEventListener("click", loadProductsData);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (AppState.isProductModalOpen) closeProductModal();
      if (AppState.isCartOpen) closeCartModal();
    } else if (AppState.isProductModalOpen) {
      if (e.key === "ArrowLeft") prevCarouselImage();
      if (e.key === "ArrowRight") nextCarouselImage();
    }
  });

  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ==============================================================================
// 11. SISTEMA MULTI-MODO DE NEVE & ESTRELAS DOURADAS (CANVAS GIFTER 74228)
// Modos: Intensa ➔ Tempestade ➔ Desligada ➔ Suave
// ==============================================================================

const SNOW_PRESETS = {
  suave: {
    id: "suave",
    icon: "✨",
    label: "Magia: Suave",
    title: "Modo Atual: Suave. Clique para alternar para Intensa.",
    desktopCount: 45,
    mobileCount: 24,
    speedMin: 0.45,
    speedMax: 1.15,
    wind: 0.1,
    swing: 0.4,
    radiusMin: 1.0,
    radiusMax: 2.6,
    opacityMin: 0.25,
    opacityMax: 0.65,
    canvasOpacity: "0.75"
  },
  intensa: {
    id: "intensa",
    icon: "✨",
    label: "Magia: Intensa",
    title: "Modo Atual: Intensa. Clique para alternar para Tempestade Dourada.",
    desktopCount: 115,
    mobileCount: 55,
    speedMin: 0.8,
    speedMax: 2.1,
    wind: 0.35,
    swing: 0.65,
    radiusMin: 1.2,
    radiusMax: 3.4,
    opacityMin: 0.35,
    opacityMax: 0.8,
    canvasOpacity: "0.9"
  },
  tempestade: {
    id: "tempestade",
    icon: "🌟",
    label: "Chuva de Estrelas",
    title: "Modo Atual: Chuva de Estrelas & Neve. Clique para desativar.",
    desktopCount: 210,
    mobileCount: 100,
    speedMin: 1.8,
    speedMax: 4.2,
    wind: 1.4,
    swing: 0.9,
    radiusMin: 1.4,
    radiusMax: 4.2,
    opacityMin: 0.4,
    opacityMax: 0.95,
    canvasOpacity: "1"
  },
  desligada: {
    id: "desligada",
    icon: "⏸️",
    label: "Magia: Desligada",
    title: "Efeito desativado. Clique para reativar em modo Suave.",
    desktopCount: 0,
    mobileCount: 0,
    speedMin: 0,
    speedMax: 0,
    wind: 0,
    swing: 0,
    radiusMin: 0,
    radiusMax: 0,
    opacityMin: 0,
    opacityMax: 0,
    canvasOpacity: "0"
  }
};

const SNOW_MODE_ORDER = ["intensa", "tempestade", "desligada", "suave"];

function initSnowEffect() {
  const canvas = document.getElementById("snowCanvas");
  const toggleBtn = document.getElementById("toggleSnowBtn");
  const statusText = document.getElementById("snowStatusText");
  const snowIcon = document.getElementById("snowIcon");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const savedMode = localStorage.getItem("labela_snow_mode");
  let currentMode = (savedMode && SNOW_PRESETS[savedMode]) ? savedMode : "intensa";

  const flakes = [];
  // Cores da paleta Labela: Branco Neve, Dourado Champagne e Salmão Rosé
  const PALETTE = [
    { r: 255, g: 255, b: 255, isStar: false },
    { r: 255, g: 250, b: 242, isStar: false },
    { r: 212, g: 163, b: 89, isStar: true },
    { r: 223, g: 168, b: 152, isStar: false }
  ];

  function createFlake(preset, isInitial = false) {
    const radius = Math.random() * (preset.radiusMax - preset.radiusMin) + preset.radiusMin;
    const speedY = Math.random() * (preset.speedMax - preset.speedMin) + preset.speedMin;
    const opacity = Math.random() * (preset.opacityMax - preset.opacityMin) + preset.opacityMin;
    const colorPick = PALETTE[Math.floor(Math.random() * PALETTE.length)];

    return {
      x: Math.random() * (width + 100) - 50,
      y: isInitial ? Math.random() * height : -12,
      radius,
      speedY,
      swing: preset.swing,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: Math.random() * 0.03 + 0.012,
      opacity,
      color: colorPick
    };
  }

  function drawFourPointStar(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.lineTo(x + Math.cos(angle) * r * 1.6, y + Math.sin(angle) * r * 1.6);
      const midAngle = angle + Math.PI / 4;
      ctx.lineTo(x + Math.cos(midAngle) * r * 0.45, y + Math.sin(midAngle) * r * 0.45);
    }
    ctx.closePath();
    ctx.fill();
  }

  function applyMode(modeKey) {
    currentMode = modeKey;
    const preset = SNOW_PRESETS[modeKey];
    if (!preset) return;

    localStorage.setItem("labela_snow_mode", modeKey);

    if (snowIcon) snowIcon.textContent = preset.icon;
    if (statusText) statusText.textContent = preset.label;
    if (toggleBtn) toggleBtn.title = preset.title;

    canvas.style.opacity = preset.canvasOpacity;

    if (modeKey === "desligada") {
      canvas.classList.add("snow-disabled");
      flakes.length = 0;
    } else {
      canvas.classList.remove("snow-disabled");
      const count = window.innerWidth < 640 ? preset.mobileCount : preset.desktopCount;
      flakes.length = 0;
      for (let i = 0; i < count; i++) {
        flakes.push(createFlake(preset, true));
      }
    }
  }

  applyMode(currentMode);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentIndex = SNOW_MODE_ORDER.indexOf(currentMode);
      const nextIndex = (currentIndex + 1) % SNOW_MODE_ORDER.length;
      applyMode(SNOW_MODE_ORDER[nextIndex]);
    });
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (currentMode !== "desligada") {
      applyMode(currentMode);
    }
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    if (currentMode !== "desligada" && flakes.length > 0) {
      const preset = SNOW_PRESETS[currentMode];
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.angle += f.angleSpeed;
        f.y += f.speedY;
        f.x += Math.sin(f.angle) * f.swing + preset.wind;

        const { r, g, b, isStar } = f.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${f.opacity})`;

        if (isStar && f.radius > 1.8) {
          drawFourPointStar(ctx, f.x, f.y, f.radius);
        } else {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        if (f.y > height + 12) {
          f.y = -12;
          f.x = Math.random() * (width + 60) - 30;
        }
        if (f.x > width + 30) {
          f.x = -20;
        } else if (f.x < -30) {
          f.x = width + 20;
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// ==============================================================================
// 12. BOOTSTRAP DA APLICAÇÃO
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initSnowEffect();
  setupEventListeners();
  loadCartFromStorage();
  loadProductsData();
  attachProductCardEvents();
});
