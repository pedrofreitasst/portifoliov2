export interface Project {
  id: string;
  title: string;
  tag: string;
  summary: string;
  description?: string;
  image?: string;
  role?: string;
  stack?: string[];
  year?: string;
  link?: string;
}


export const projects: Project[] = [
  {
    id: 'watson-assistant',
    title: 'Portfólio Pessoal com Agente Conversacional — Watson',
    tag: 'UX Conversacional',
    summary:
      'Fluxo de atendimento desenhado em IBM Watson Assistant, com foco em intenções claras e fallback humanizado.',
    description:
      'Projeto de redesenho de um assistente de atendimento ao cliente em Watson Assistant. Mapeei as 10 intenções mais frequentes, reescrevi entidades para reduzir ambiguidade e desenhei fallbacks que entregam a conversa para um humano sem fricção.\n\nResultado esperado: redução do tempo médio de resolução e aumento da taxa de contenção (resolução pelo bot sem escalonamento).',
    role: 'Conversational Designer',
    stack: ['IBM Watson Assistant', 'Figma', 'Miro'],
    year: '2026',

  },
  {
    id: 'rag-assistant',
    title: 'Assistente RAG com Claude',
    tag: 'IA Aplicada',
    summary:
      'Sistema de perguntas e respostas sobre documentação interna usando RAG, embeddings e a API da Anthropic.',
    description:
      'Construção de uma camada de retrieval-augmented generation sobre uma base de documentos técnicos. Implementei chunking semântico, busca vetorial e prompts estruturados para respostas com citações verificáveis.\n\nFoco em precisão — o assistente só responde quando há base documental suficiente; do contrário, indica essa limitação ao usuário.',
    role: 'AI Engineer',
    stack: ['Next.js', 'TypeScript', 'Anthropic API', 'Embeddings'],
    year: '2026',

  },
  {
    id: 'ibm-skillsbuild-quiz',
    title: 'Quiz mobile do IBM SkillsBuild · Redesign',
    tag: 'UX/UI, UI Design',
    summary:
      'Um problema de UX que escondia uma falha de integridade da certificação.',
    description:
      'Case study completo de redesign mobile-first para a tela de quiz do IBM SkillsBuild. Diagnóstico de três tipos de falhas estruturais durante uso diário da plataforma, incluindo uma falha de design que comprometia a integridade das certificações emitidas.\n\nA solução proposta mantém o sistema visual existente (paleta cobalto IBM, tipografia Plex, geometria Carbon Design System) e reorganiza a interação aplicando princípios de mobile-first, Lei de Fitts, e forcing function como proteção contra fraude.',
    image:
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/bb7a6d249974015.6a14304858c56.png',
    role: 'UI/UX Designer',
    stack: ['Figma'],
    year: '2026',
    link: 'https://www.behance.net/pedrohfreitas',
  },
];
