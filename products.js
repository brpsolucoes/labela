/**
 * ==============================================================================
 * LABELA - PERSONALIZADOS & 3D | CADASTRO DE PRODUTOS
 * ==============================================================================
 * Edite, adicione ou remova produtos diretamente nesta lista.
 * 
 * Estrutura de cada produto:
 * - id: Identificador único (ex: "porta-foto-gatinho-trico")
 * - nome: Nome do produto
 * - categoria: Categoria do item (ex: "Natal & Decoração", "Presentes & Decoração", etc.)
 * - preco: Valor numérico em reais (ex: 24.90)
 * - descricao: Descrição detalhada, materiais, dimensões e opções de personalização
 * - imagens: Lista de URLs das fotos (a 1ª foto é exibida na capa; todas aparecem no modal)
 * ==============================================================================
 */

const PRODUCTS = [
  {
    id: "kit-natal-bandeja-ursinho-arvore",
    nome: "Kit Decorativo de Natal - Ursinho & Árvore com Bandeja",
    categoria: "Natal & Decoração",
    preco: 54.90,
    descricao: "Conjunto decorativo natalino encantador composto por bandeja oval canelada, ursinho com textura de tricô usando gorro de Papai Noel e árvore de Natal vermelha em espiral com estrela no topo.\n\nIdeal para decorar aparadores, mesas de centro, escritórios ou presentear com sofisticação neste fim de ano.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D com alta precisão\n• Material: PLA ecológico e resistente\n• Incluso: 1 Bandeja oval canelada, 1 Ursinho natalino e 1 Árvore espiral",
    imagens: [
      "assets/img/products/kit-natal-bandeja-ursinho-arvore/kit-natal-bandeja-ursinho-arvore-capa.jpeg"
    ]
  },
  {
    id: "enfeite-arvore-natal-dupla",
    nome: "Enfeite de Mesa - Árvore de Natal Dupla Minimalista",
    categoria: "Natal & Decoração",
    preco: 34.90,
    descricao: "Escultura decorativa de mesa com duas árvores de Natal estilizadas em formato zigue-zague e estrelas no topo, apoiadas sobre base retangular de encaixe.\n\nDesign moderno e elegante para compor a decoração natalina de salas, mesas de jantar, recepções e ambientes corporativos.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D com alta precisão\n• Material: PLA ecológico e resistente\n• Cores disponíveis: Vermelho, Verde, Dourado e Branco",
    imagens: [
      "assets/img/products/enfeite-arvore-natal-dupla/enfeite-arvore-natal-dupla-capa.jpeg"
    ]
  },
  {
    id: "kit-enfeites-arvore-natal",
    nome: "Kit 10 Enfeites de Árvore de Natal Pendentes",
    categoria: "Natal & Decoração",
    preco: 39.90,
    descricao: "Kit completo com 10 pingentes natalinos clássicos em vermelho vibrante com detalhes em relevo branco. Acompanha argola superior em cada peça para pendurar na árvore de Natal, guirlandas ou embalagens de presente.\n\nModelos inclusos no kit: Guirlanda, Floco de Neve, Papai Noel, Laço, Boneco de Neve, Biscoito Gingerbread, Bota Natalina, Presente, Sino e Bengala Doce.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D com alta precisão\n• Material: PLA ecológico e resistente\n• Quantidade: 10 peças sortidas",
    imagens: [
      "assets/img/products/kit-enfeites-arvore-natal/kit-enfeites-arvore-natal-capa.jpeg"
    ]
  },
  {
    id: "porta-foto-gatinho-trico",
    nome: "Porta-Foto Gatinho Textura Tricô",
    categoria: "Presentes & Decoração",
    preco: 24.90,
    descricao: "Miniatura fofa de gatinho com acabamento detalhado que simula pontos de tricô/crochê (amigurumi), equipada com suporte discreto para encaixar fotos estilo Polaroid, recados ou cartões.\n\nUm presente afetivo e delicado para decorar mesas de trabalho, estantes ou quartos.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D com alta precisão\n• Material: PLA ecológico e resistente\n• Cores disponíveis: Rosa, Amarelo, Branco e Lilás (consultar outras cores)",
    imagens: [
      "assets/img/products/porta-foto-gatinho-trico/porta-foto-gatinho-trico-capa.jpeg",
      "assets/img/products/porta-foto-gatinho-trico/porta-foto-gatinho-trico-01.jpeg"
    ]
  },
  {
    id: "chaveiro-polvo-articulado",
    nome: "Chaveiro Polvinho Articulado 3D",
    categoria: "Chaveiros & Lembrancinhas",
    preco: 14.90,
    descricao: "Chaveiro super divertido de polvinho com tentáculos totalmente articulados e olhinhos expressivos. Acompanha corrente de bolinhas metálica resistente para pendurar em mochilas, bolsas ou chaves.\n\nÓtima opção de lembrancinha para festas, brindes criativos ou mimo para todas as idades.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D articulado sem montagens\n• Material: PLA ecológico e resistente\n• Cores disponíveis: Rosa, Azul, Roxo, Verde e Amarelo",
    imagens: [
      "assets/img/products/chaveiro-polvo-articulado/chaveiro-polvo-articulado-capa.jpeg",
      "assets/img/products/chaveiro-polvo-articulado/chaveiro-polvo-articulado-01.jpeg"
    ]
  },
  {
    id: "chaveiro-outubro-rosa",
    nome: "Chaveiro Coração com Laço - Outubro Rosa",
    categoria: "Chaveiros & Lembrancinhas",
    preco: 7.90,
    descricao: "Chaveiro delicado em formato de coração entrelaçado com o laço símbolo de conscientização do Outubro Rosa. Acompanha correntinha metálica.\n\nIdeal para campanhas corporativas, ações de conscientização, eventos, clínicas e lembrancinhas especiais em quantidade.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D com alta precisão\n• Material: PLA ecológico e resistente\n• Condições especiais para pedidos em atacado/eventos",
    imagens: [
      "assets/img/products/chaveiro-outubro-rosa/chaveiro-outubro-rosa-capa.jpeg"
    ]
  },
  {
    id: "cubo-infinito-fidget",
    nome: "Cubo Infinito Texturizado (Fidget Toy)",
    categoria: "Brinquedos & Fidgets",
    preco: 19.90,
    descricao: "Brinquedo antiestresse (Fidget Toy) modelo Cubo Infinito com textura colmeia hexagonal nas faces e dobradiças articuladas que permitem movimentos contínuos em todas as direções.\n\nAjuda no foco, alívio da ansiedade e coordenação motora, sendo perfeito para ter na mesa de estudos ou escritório.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D em peça única articulada\n• Material: PLA ecológico de alta resistência\n• Cores disponíveis: Azul, Preto, Rosa e sob consulta",
    imagens: [
      "assets/img/products/cubo-infinito-fidget/cubo-infinito-fidget-capa.jpeg"
    ]
  },
  {
    id: "display-nfc-google",
    nome: "Display de Mesa NFC - Google Avaliações",
    categoria: "Corporativo & NFC",
    preco: 49.90,
    descricao: "Totem de balcão e mesa em formato 'L' com o logotipo colorido do Google em alto-relevo 3D e ícone de aproximação (Contactless / NFC).\n\nPerfeito para comércios, clínicas, restaurantes e escritórios facilitarem a avaliação no Google ou acesso rápido a redes sociais e Wi-Fi com apenas um toque do celular.\n\n• Produção: Labela Personalizados & 3D\n• Fabricação: Impresso em 3D multicolorido de alta precisão\n• Material: PLA ecológico premium com acabamento texturizado",
    imagens: [
      "assets/img/products/display-nfc-google/display-nfc-google-capa.jpeg"
    ]
  }
];
