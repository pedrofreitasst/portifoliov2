'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Locale = 'pt' | 'en' | 'es' | 'zh';
const messages = {
  en: {
    menu: 'Menu', closeMenu: 'Close menu', openOri: 'Open Ori chat', closeOri: 'Close Ori chat', skip: 'Skip to content', home: 'Pedro de Freitas', work: 'Work', fun: 'Fun', about: 'About', resume: 'Resume',
    backToWorks: 'Back to works', chapters: 'Case chapters', language: 'Language',
    location: 'Rio de Janeiro, Brazil', localTime: 'Brasília time', headline: 'Here to help people', heroAside: 'And make it look good while doing it.',
    heroCopy: 'Pedro is a UX Designer who builds from a user-first standpoint, where data, heart, and design converge.',
    selectedWork: 'Selected work', readCase: 'Read the case', year: '2026',
    apolloDescription: 'An adaptive screen guide that helps people move through unfamiliar interfaces at their own pace. A universal onboarding system.',
    skillsDescription: 'A mobile redesign that uncovered an integrity flaw in the certification process.',
    chatbotDescription: 'A personal corner of the web with a multi-platform live chatbot.',
    personalDescription: 'Designs, posters, and experiments from now and other eras.',
    aboutHeading: 'About', aboutTitle: "The 'I' of The Storm", skills: 'Skills', copied: 'Copied!', email: 'E-mail',
    contact: 'Contact', footerHeadline: 'Let’s go deeper.', footerTogether: 'together', playgroundTitle: 'The playground is under construction', playgroundCopy: 'I’m reworking this space. Check back soon for experiments and side projects.', backHome: 'Back home', askOri: 'Ask Ori anything', send: 'Send question', close: 'Close', reset: 'Reset conversation',
    chatAnswers: 'Chat answers', greeting: 'In a rush? Ask Ori anything about Pedro’s work.',
    disclaimer: 'ORI IS AN AI AND CAN MAKE MISTAKES', you: 'You', thinking: 'Thinking',
    caseStudy: 'Case study', personalWork: 'Personal work', gallery: 'Gallery', previous: 'Previous image', next: 'Next image',
    aboutCopy1: "Hey there! I'm Pedro, also known as Sani online. I'm a UX/UI Designer with a Social Communications background and nearly 10 years working with international clients. That taught me to find a way to address any need, whether technological or human.",
    aboutCopy2: "I've always been passionate about art, tech, and people. Discovering UX made me realize they could all live in one place. I've been experimenting with code since 2014 and making art since 2016, with selected pieces shown in a 2017 college exhibition.",
    aboutCopy3: "High-pressure work taught me to teach myself whatever the job needs: tools, languages, soft skills. What drives me is figuring out how things work. That put me here: a designer who codes, a coder who designs. We're multitudes, and I'm proud of that. Who else can say they're a communicative UX designer who can also do backend?",
    resumeText: 'Download resume', projects: 'Projects',
  },
  pt: {
    menu: 'Menu', closeMenu: 'Fechar menu', openOri: 'Abrir conversa com Ori', closeOri: 'Fechar conversa com Ori', skip: 'Pular para o conteúdo', home: 'Pedro de Freitas', work: 'Trabalhos', fun: 'Pessoal', about: 'Sobre', resume: 'Currículo',
    backToWorks: 'Voltar aos trabalhos', chapters: 'Capítulos do case', language: 'Idioma',
    location: 'Rio de Janeiro, Brasil', localTime: 'Horário de Brasília', headline: 'Aqui para ajudar pessoas', heroAside: 'E fazer bonito.',
    heroCopy: 'Pedro é designer de UX e cria com as pessoas em primeiro lugar, no encontro entre dados, coração e design.',
    selectedWork: 'Trabalhos selecionados', readCase: 'Ler o case', year: '2026',
    apolloDescription: 'Um guia adaptativo de tela que ajuda pessoas a navegar por interfaces desconhecidas no próprio ritmo. Um sistema universal de onboarding.',
    skillsDescription: 'Um redesign mobile que revelou uma falha de integridade no processo de certificação.',
    chatbotDescription: 'Um cantinho pessoal na web com um chatbot ao vivo em várias plataformas.',
    personalDescription: 'Designs, pôsteres e experimentos de hoje e de outras épocas.',
    aboutHeading: 'Sobre', aboutTitle: "O 'eu' da tempestade", skills: 'Habilidades', copied: 'Copiado!', email: 'E-mail',
    contact: 'Contato', footerHeadline: 'Vamos mais fundo.', footerTogether: 'juntos', playgroundTitle: 'O playground está em construção', playgroundCopy: 'Estou reformulando este espaço. Volte em breve para ver experimentos e projetos pessoais.', backHome: 'Voltar ao início', askOri: 'Pergunte qualquer coisa ao Ori', send: 'Enviar pergunta', close: 'Fechar', reset: 'Reiniciar conversa',
    chatAnswers: 'Respostas do chat', greeting: 'Com pressa? Pergunte ao Ori sobre o trabalho do Pedro.',
    disclaimer: 'ORI É UMA IA E PODE COMETER ERROS', you: 'Você', thinking: 'Pensando',
    caseStudy: 'Estudo de caso', personalWork: 'Trabalho pessoal', gallery: 'Galeria', previous: 'Imagem anterior', next: 'Próxima imagem',
    aboutCopy1: 'Oi! Eu sou Pedro, também conhecido como Sani na internet. Sou designer de UX/UI e venho da área de Comunicação Social. Trabalhei por quase 10 anos com clientes internacionais. Essa experiência me ensinou a buscar soluções para necessidades tecnológicas e humanas.',
    aboutCopy2: 'Sempre me interessei por arte, tecnologia e pessoas. Quando descobri UX, percebi que tudo isso podia coexistir. Experimento com código desde 2014 e faço arte desde 2016. Algumas peças foram exibidas em uma mostra universitária em 2017.',
    aboutCopy3: 'Trabalhar sob pressão me ensinou a aprender por conta própria o que cada trabalho exige: ferramentas, idiomas e habilidades interpessoais. Gosto de entender como as coisas funcionam. Hoje, desenho e também programo, inclusive no back-end.',
    resumeText: 'Baixar currículo', projects: 'Projetos',
  },
  es: {
    menu: 'Menú', closeMenu: 'Cerrar menú', openOri: 'Abrir chat de Ori', closeOri: 'Cerrar chat de Ori', skip: 'Saltar al contenido', home: 'Pedro de Freitas', work: 'Proyectos', fun: 'Personal', about: 'Sobre mí', resume: 'Currículum',
    backToWorks: 'Volver a proyectos', chapters: 'Capítulos del caso', language: 'Idioma',
    location: 'Río de Janeiro, Brasil', localTime: 'Hora de Brasilia', headline: 'Aquí para ayudar a las personas', heroAside: 'Y hacer que todo se vea bien.',
    heroCopy: 'Pedro es diseñador UX y crea pensando primero en las personas, donde convergen los datos, el corazón y el diseño.',
    selectedWork: 'Proyectos seleccionados', readCase: 'Leer el caso', year: '2026',
    apolloDescription: 'Una guía de pantalla adaptable que ayuda a las personas a recorrer interfaces desconocidas a su ritmo. Un sistema universal de incorporación guiada.',
    skillsDescription: 'Un rediseño móvil que reveló una falla de integridad en el proceso de certificación.',
    chatbotDescription: 'Un rincón personal en la web con un chatbot en vivo y multiplataforma.',
    personalDescription: 'Diseños, carteles y experimentos de hoy y de otras épocas.',
    aboutHeading: 'Sobre mí', aboutTitle: 'El «yo» de la tormenta', skills: 'Habilidades', copied: '¡Copiado!', email: 'Correo',
    contact: 'Contacto', footerHeadline: 'Profundicemos.', footerTogether: 'juntos', playgroundTitle: 'El playground está en construcción', playgroundCopy: 'Estoy renovando este espacio. Vuelve pronto para ver experimentos y proyectos personales.', backHome: 'Volver al inicio', askOri: 'Pregúntale lo que quieras a Ori', send: 'Enviar pregunta', close: 'Cerrar', reset: 'Reiniciar conversación',
    chatAnswers: 'Respuestas del chat', greeting: '¿Tienes prisa? Pregúntale a Ori sobre el trabajo de Pedro.',
    disclaimer: 'ORI ES UNA IA Y PUEDE COMETER ERRORES', you: 'Tú', thinking: 'Pensando',
    caseStudy: 'Estudio de caso', personalWork: 'Trabajo personal', gallery: 'Galería', previous: 'Imagen anterior', next: 'Imagen siguiente',
    aboutCopy1: '¡Hola! Soy Pedro, también conocido como Sani en internet. Soy diseñador UX/UI y estudié Comunicación Social. Trabajé casi 10 años con clientes internacionales. Esa experiencia me enseñó a buscar soluciones para necesidades tecnológicas y humanas.',
    aboutCopy2: 'Siempre me interesaron el arte, la tecnología y las personas. Al descubrir UX, vi que todo podía convivir. Experimento con código desde 2014 y hago arte desde 2016. Algunas obras se exhibieron en una muestra universitaria en 2017.',
    aboutCopy3: 'Trabajar bajo presión me enseñó a aprender por mi cuenta lo que cada trabajo requiere: herramientas, idiomas y habilidades interpersonales. Me gusta entender cómo funcionan las cosas. Hoy diseño y también programo, incluido el back-end.',
    resumeText: 'Descargar currículum', projects: 'Proyectos',
  },
  zh: {
    menu: '菜单', closeMenu: '关闭菜单', openOri: '打开 Ori 聊天', closeOri: '关闭 Ori 聊天', skip: '跳转到正文', home: 'Pedro de Freitas', work: '作品', fun: '个人创作', about: '关于', resume: '简历',
    backToWorks: '返回作品', chapters: '案例章节', language: '语言',
    location: '巴西里约热内卢', localTime: '巴西利亚时间', headline: '在这里帮助人们', heroAside: '也让这一切更美好。',
    heroCopy: 'Pedro 是一位以用户为先的 UX 设计师，让数据、同理心与设计在此交汇。',
    selectedWork: '精选作品', readCase: '阅读案例', year: '2026',
    apolloDescription: '自适应屏幕指南，帮助人们按照自己的节奏使用陌生界面。一个通用的新手引导系统。',
    skillsDescription: '一次移动端改版，发现了认证流程中的诚信漏洞。',
    chatbotDescription: '一个带有多平台实时聊天机器人的个人网络空间。',
    personalDescription: '近期与往年的设计、海报和实验作品。',
    aboutHeading: '关于', aboutTitle: '风暴中的“我”', skills: '技能', copied: '已复制！', email: '电子邮件',
    contact: '联系方式', footerHeadline: '让我们一起深入探索。', footerTogether: '一起', playgroundTitle: 'Playground 正在建设中', playgroundCopy: '我正在重新设计这个空间。欢迎稍后回来查看实验和个人项目。', backHome: '返回首页', askOri: '向 Ori 提问', send: '发送问题', close: '关闭', reset: '重置对话',
    chatAnswers: '聊天回复', greeting: '赶时间吗？可以问 Ori 关于 Pedro 的作品。',
    disclaimer: 'ORI 是人工智能，回答可能有误', you: '你', thinking: '正在思考',
    caseStudy: '案例研究', personalWork: '个人作品', gallery: '图库', previous: '上一张图片', next: '下一张图片',
    aboutCopy1: '你好！我是 Pedro，也常在网上使用 Sani 这个名字。我是一名 UX/UI 设计师，拥有社会传播学背景，并与国际客户合作了近十年。这段经历让我学会解决技术和人的各种需求。',
    aboutCopy2: '我一直热爱艺术、科技与人。接触 UX 后，我发现这些兴趣可以结合在一起。我从 2014 年开始尝试编程，2016 年开始创作艺术，部分作品曾在 2017 年的大学展览中展出。',
    aboutCopy3: '高压工作让我学会按需自学工具、语言和沟通技能。我喜欢弄清事物如何运作。现在我既做设计，也写代码，包括后端开发。',
    resumeText: '下载简历', projects: '项目',
  },
} as const;

type MessageKey = keyof typeof messages.en;

type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: MessageKey) => string };
const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('portfolio-locale');
      if (stored === 'pt' || stored === 'en' || stored === 'es' || stored === 'zh') setLocaleState(stored);
    } catch {
      // The selector still works for the current visit when storage is unavailable.
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  }, [locale]);
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem('portfolio-locale', next);
    } catch {
      // Keep the selected language in memory for the current visit.
    }
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : next;
  };
  const value = useMemo<I18nValue>(() => ({
    locale, setLocale,
    t: (key) => messages[locale][key] as string,
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}

export function getSuggestions(locale: Locale) {
  return {
    en: ['Where are you located?', 'What is your availability?', 'How does the chatbot work?', 'Who is Sani?'],
    pt: ['Onde você mora?', 'Qual é sua disponibilidade?', 'Como o chatbot funciona?', 'Quem é Sani?'],
    es: ['¿Dónde vives?', '¿Cuál es tu disponibilidad?', '¿Cómo funciona el chatbot?', '¿Quién es Sani?'],
    zh: ['你在哪里？', '你目前有空吗？', '聊天机器人如何工作？', 'Sani 是谁？'],
  }[locale];
}

const CASE_LABELS: Record<string, Record<Locale, string>> = {
  'At a glance': { en: 'At a glance', pt: 'Visão geral', es: 'Resumen', zh: '概览' },
  Context: { en: 'Context', pt: 'Contexto', es: 'Contexto', zh: '背景' },
  'The problem': { en: 'The problem', pt: 'O problema', es: 'El problema', zh: '问题' },
  'Responsible disclosure': { en: 'Responsible disclosure', pt: 'Divulgação responsável', es: 'Divulgación responsable', zh: '负责任披露' },
  'Respect the system': { en: 'Respect the system', pt: 'Respeitar o sistema', es: 'Respetar el sistema', zh: '遵循设计系统' },
  'Decision: respect the system': { en: 'Decision: respect the system', pt: 'Decisão: respeitar o sistema', es: 'Decisión: respetar el sistema', zh: '决策：遵循设计系统' },
  'Selection & submission': { en: 'Selection & submission', pt: 'Seleção e envio', es: 'Selección y envío', zh: '选择与提交' },
  'Decision: selection & submission': { en: 'Decision: selection & submission', pt: 'Decisão: seleção e envio', es: 'Decisión: selección y envío', zh: '决策：选择与提交' },
  'Hard selection limit': { en: 'Hard selection limit', pt: 'Limite rígido de seleção', es: 'Límite estricto de selección', zh: '严格限制选择数量' },
  'Decision: hard selection limit': { en: 'Decision: hard selection limit', pt: 'Decisão: limite rígido de seleção', es: 'Decisión: límite estricto de selección', zh: '决策：严格限制选择数量' },
  'States as a system': { en: 'States as a system', pt: 'Estados como sistema', es: 'Estados como sistema', zh: '将状态视为系统' },
  Reflection: { en: 'Reflection', pt: 'Reflexão', es: 'Reflexión', zh: '反思' },
  Origin: { en: 'Origin', pt: 'Origem', es: 'Origen', zh: '起源' },
  Research: { en: 'Research', pt: 'Pesquisa', es: 'Investigación', zh: '研究' },
  'Constraints & direction': { en: 'Constraints & direction', pt: 'Restrições e direção', es: 'Restricciones y dirección', zh: '约束与方向' },
  'Core decision: adaptive scaffolding': { en: 'Core decision: adaptive scaffolding', pt: 'Decisão central: apoio adaptativo', es: 'Decisión central: guía adaptativa', zh: '核心决策：自适应辅助' },
  'A unified window system': { en: 'A unified window system', pt: 'Um sistema unificado de janelas', es: 'Un sistema unificado de ventanas', zh: '统一的窗口系统' },
  'The flow': { en: 'The flow', pt: 'Fluxo', es: 'Flujo', zh: '流程' },
  Onboarding: { en: 'Onboarding', pt: 'Integração', es: 'Incorporación', zh: '引导流程' },
  'Assistant identity & testing': { en: 'Assistant identity & testing', pt: 'Identidade e testes do assistente', es: 'Identidad y pruebas del asistente', zh: '助手身份与测试' },
  'What could go wrong': { en: 'What could go wrong', pt: 'O que pode dar errado', es: 'Qué podría salir mal', zh: '可能出现的问题' },
  "v1.0, Watson's Corner": { en: "v1.0, Watson's Corner", pt: 'v1.0, Watson no canto', es: 'v1.0, Watson en la esquina', zh: 'v1.0，角落里的 Watson' },
  'What broke': { en: 'What broke', pt: 'O que falhou', es: 'Qué falló', zh: '出现的问题' },
  'v2.0, the Hero Chat': { en: 'v2.0, the Hero Chat', pt: 'v2.0, chat no hero', es: 'v2.0, chat en el hero', zh: 'v2.0，主视觉聊天' },
  'What Broke II': { en: 'What Broke II', pt: 'O que falhou II', es: 'Qué falló II', zh: '出现的问题 II' },
  'v3.0, Sidebar': { en: 'v3.0, Sidebar', pt: 'v3.0, painel lateral', es: 'v3.0, panel lateral', zh: 'v3.0，侧边栏' },
  'What if you own the app?': { en: 'What if you own the app?', pt: 'E se você controla o app?', es: '¿Y si controlas la app?', zh: '如果你拥有应用呢？' },
  Validation: { en: 'Validation', pt: 'Validação', es: 'Validación', zh: '验证' },
  'Case study': { en: 'Case study', pt: 'Estudo de caso', es: 'Estudio de caso', zh: '案例研究' },
  'IBM SkillsBuild, a Mobile-First Redesign': { en: 'IBM SkillsBuild, a Mobile-First Redesign', pt: 'IBM SkillsBuild: redesign mobile-first', es: 'IBM SkillsBuild: rediseño mobile-first', zh: 'IBM SkillsBuild：移动优先改版' },
  'A UX problem that hid an integrity flaw.': { en: 'A UX problem that hid an integrity flaw.', pt: 'Um problema de UX que escondia uma falha de integridade.', es: 'Un problema de UX que ocultaba una falla de integridad.', zh: '一个掩盖了诚信漏洞的 UX 问题。' },
  'Personal Portfolio and Chatbot': { en: 'Personal Portfolio and Chatbot', pt: 'Portfólio pessoal e chatbot', es: 'Portafolio personal y chatbot', zh: '个人作品集与聊天机器人' },
  'From a corner bubble to a sidebar that stays out of the way.': { en: 'From a corner bubble to a sidebar that stays out of the way.', pt: 'De um balão no canto a um painel lateral que não atrapalha.', es: 'De una burbuja en la esquina a un panel lateral que no estorba.', zh: '从角落气泡到不碍事的侧边栏。' },
  'Apollo, an Adaptive Screen Guide': { en: 'Apollo, an Adaptive Screen Guide', pt: 'Apollo, um guia de tela adaptativo', es: 'Apollo, una guía de pantalla adaptable', zh: 'Apollo：自适应屏幕指南' },
  'A universal onboarding system disguised as a personal assistant. Through dims and spotlights, it teaches you any process.': { en: 'A universal onboarding system disguised as a personal assistant. Through dims and spotlights, it teaches you any process.', pt: 'Um sistema universal de orientação que se apresenta como assistente pessoal. Ele ensina processos com escurecimento e foco de tela.', es: 'Un sistema universal de guía que se presenta como asistente personal. Enseña procesos con oscurecimiento y enfoque de pantalla.', zh: '一个伪装成个人助手的通用引导系统，通过调暗和聚焦屏幕来指导用户完成流程。' },
  'Role: Solo, research to interaction design': { en: 'Role: Solo, research to interaction design', pt: 'Função: projeto individual, da pesquisa ao design de interação', es: 'Rol: proyecto individual, de investigación a diseño de interacción', zh: '职责：独立完成，从研究到交互设计' },
  'Timeline: Roughly 2 weeks': { en: 'Timeline: Roughly 2 weeks', pt: 'Prazo: cerca de 2 semanas', es: 'Duración: unas 2 semanas', zh: '周期：约 2 周' },
  "Tools: Figma, Good Ol' Pen & Paper": { en: "Tools: Figma, Good Ol' Pen & Paper", pt: 'Ferramentas: Figma, papel e caneta', es: 'Herramientas: Figma, papel y lápiz', zh: '工具：Figma、纸和笔' },
  'Personal Works and Explorations': { en: 'Personal Works and Explorations', pt: 'Trabalhos pessoais e explorações', es: 'Trabajos personales y exploraciones', zh: '个人作品与探索' },
  'Role: Independent UX/UI redesign': { en: 'Role: Independent UX/UI redesign', pt: 'Função: redesign independente de UX/UI', es: 'Rol: rediseño UX/UI independiente', zh: '职责：独立 UX/UI 改版' },
  'Scope: Mobile quiz, 390×844': { en: 'Scope: Mobile quiz, 390×844', pt: 'Escopo: quiz mobile, 390×844', es: 'Alcance: cuestionario móvil, 390×844', zh: '范围：移动端测验，390×844' },
  'Tools: Figma, IBM Plex, Carbon': { en: 'Tools: Figma, IBM Plex, Carbon', pt: 'Ferramentas: Figma, IBM Plex, Carbon', es: 'Herramientas: Figma, IBM Plex, Carbon', zh: '工具：Figma、IBM Plex、Carbon' },
};

export function translateCaseLabel(locale: Locale, label: string) {
  return CASE_LABELS[label]?.[locale] ?? label;
}

export const CASE_CHAPTERS = {
  skillsbuild: [
    ['at-a-glance', ['At a glance', 'Visão geral', 'Resumen', '概览']], ['context', ['Context', 'Contexto', 'Contexto', '背景']],
    ['the-problem', ['The problem', 'O problema', 'El problema', '问题']], ['responsible-disclosure', ['Responsible disclosure', 'Divulgação responsável', 'Divulgación responsable', '负责任披露']],
    ['respect-the-system', ['Respect the system', 'Respeitar o sistema', 'Respetar el sistema', '遵循设计系统']], ['selection-submission', ['Selection & submission', 'Seleção e envio', 'Selección y envío', '选择与提交']],
    ['hard-selection-limit', ['Hard selection limit', 'Limite rígido de seleção', 'Límite estricto de selección', '严格限制选择数量']], ['states-as-a-system', ['States as a system', 'Estados como sistema', 'Estados como sistema', '将状态视为系统']], ['reflection', ['Reflection', 'Reflexão', 'Reflexión', '反思']],
  ],
  chatbot: [
    ['at-a-glance', ['At a glance', 'Visão geral', 'Resumen', '概览']], ['the-problem', ['The problem', 'O problema', 'El problema', '问题']], ['v1-watson', ["v1.0, Watson's Corner", 'v1.0, Watson no canto', 'v1.0, Watson en la esquina', 'v1.0，角落里的 Watson']], ['what-broke', ['What broke', 'O que falhou', 'Qué falló', '出现的问题']],
    ['v2-hero', ['v2.0, the Hero Chat', 'v2.0, chat no hero', 'v2.0, chat en el hero', 'v2.0，主视觉聊天']], ['what-broke-2', ['What broke II', 'O que falhou II', 'Qué falló II', '出现的问题 II']], ['v3-sidebar', ['v3.0, Sidebar', 'v3.0, painel lateral', 'v3.0, panel lateral', 'v3.0，侧边栏']], ['reflection', ['Reflection', 'Reflexão', 'Reflexión', '反思']],
  ],
  apollo: [
    ['at-a-glance', ['At a glance', 'Visão geral', 'Resumen', '概览']], ['origin', ['Origin', 'Origem', 'Origen', '起源']], ['the-problem', ['The problem', 'O problema', 'El problema', '问题']], ['research', ['Research', 'Pesquisa', 'Investigación', '研究']],
    ['direction', ['Constraints & direction', 'Restrições e direção', 'Restricciones y dirección', '约束与方向']], ['the-core-decision', ['Core decision', 'Decisão central', 'Decisión central', '核心决策']], ['window-system', ['Window system', 'Sistema de janelas', 'Sistema de ventanas', '窗口系统']], ['the-flow', ['The flow', 'Fluxo', 'Flujo', '流程']],
    ['onboarding', ['Onboarding', 'Integração', 'Incorporación', '引导流程']], ['assistant-identity', ['Assistant identity', 'Identidade do assistente', 'Identidad del asistente', '助手身份']], ['risks', ['What could go wrong', 'O que pode dar errado', 'Qué podría salir mal', '可能出现的问题']], ['own-the-app', ['If you own the app', 'Se você controla o app', 'Si controlas la app', '如果你拥有应用']], ['validation', ['Validation', 'Validação', 'Validación', '验证']], ['reflection', ['Reflection', 'Reflexão', 'Reflexión', '反思']],
  ],
} as const;
