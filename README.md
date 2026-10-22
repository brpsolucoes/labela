# Labela — Personalizados & 3D | Catálogo Digital

Catálogo web estático, responsivo e de alta performance desenvolvido para a **Labela Personalizados & 3D**, utilizando **HTML5, Tailwind CSS e Vanilla JavaScript**, pronto para hospedagem direta no **GitHub Pages**.

O visual foi desenhado com inspiração no template **Gifter (TemplateMonster 74228)** e harmonizado com as cores da identidade visual da **Labela** (`assets/img/logo.jpeg`) e a paleta natalina solicitada (**Vermelho Veludo, Dourado/Bronze, Bege Champagne e Salmão Rosé**).

---

## ✨ Funcionalidades

- **Visual Exclusivo Greeting-Card & Atelier (Inspirado no Gifter 74228):**
  - Barra de navegação em pílula flutuante (`rounded-full`)
  - Hero em formato de Cartão de Natal dividido por onda orgânica em `S`, com fita vermelha/dourada dobrada, lua iluminada e collage de Polaroids interativas
  - Enfeites circulares suspensos por fios dourados com animação de pêndulo (`baubles`)
  - Cards de produtos estilo Atelier com moldura interna pontilhada dourada
- **Canvas Interativo Multi-Modo:** Partículas suaves de neve, estrelas douradas de 4 pontas e brilho salmão com 4 modos (`Intensa`, `Chuva de Estrelas`, `Desligada`, `Suave`).
- **Catálogo em Código (`products.js`) ou Google Sheets (CSV):** Fácil edição local ou sincronização em tempo real com planilha pública.
- **Galeria e Carrossel Interativo:** Modal de detalhes com navegação entre fotos, miniaturas e suporte a teclado (`←`, `→`, `ESC`).
- **Sacola Persistente (`localStorage`):** Mantém os itens salvos mesmo ao recarregar a página.
- **Checkout Direto para WhatsApp:** Gera a mensagem formatada com itens, quantidades e valores em Real (`R$`).
- **Busca, Filtro por Categoria e Ordenação Instantânea.**

---

## 📁 Estrutura de Arquivos

```text
labela/
├── index.html     # Estrutura principal, layout Gifter e configuração Tailwind CDN
├── products.js    # Cadastro de produtos (adicione ou edite itens aqui!)
├── app.js         # Lógica da sacola, carrossel, filtros, Google Sheets e Canvas
├── style.css      # Estilizações da paleta Labela, fitas, pêndulos e molduras
├── assets/
│   └── img/
│       ├── logo.jpeg
│       └── products/
└── README.md      # Documentação do projeto
```
