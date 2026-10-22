/**
 * ==============================================================================
 * LABELA - PERSONALIZADOS & 3D | CADASTRO DE PRODUTOS
 * ==============================================================================
 * Edite, adicione ou remova produtos diretamente nesta lista.
 * 
 * Estrutura de cada produto:
 * - id: Identificador único (ex: "enfeite-de-porta-presepio")
 * - nome: Nome do produto
 * - categoria: Categoria do item (ex: "Natal", "Decoração", "Personalizados", etc.)
 * - preco: Valor numérico em reais (ex: 27.90)
 * - descricao: Descrição detalhada, materiais, dimensões e opções de personalização
 * - imagens: Lista de URLs das fotos (a 1ª foto é exibida na capa; todas aparecem no modal)
 * ==============================================================================
 */

const PRODUCTS = [
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
