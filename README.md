# Pedro Freitas — Portfólio

Portfólio pessoal de **Pedro Freitas**, profissional em transição para **UX Designer Conversacional** e **AI Engineer**.

Construído com Next.js 14 (App Router), TypeScript, Tailwind CSS e estrutura pronta para integrar a API da IBM + Anthropic no chatbot flutuante.

# APIs Modificadas

Por problemas relacionados ao serviço IBM Cloud houve uma troca de API para Groq e OpenRouter como backup.

# Análise de Dados do Chatbot

O chatbot possui um sistema de logging que armazena no MongoDB Atlas:
- Mensagens do usuário e respostas do bot
- Provedor usado (Groq, OpenRouter, Mock)
- Tempo de resposta
- Taxa de sucesso/erro
- Idioma da conversa

Esses dados permitem monitorar:
- Quais provedores são mais rápidos
- Taxa de falhas por provedor
- Horários de pico de uso
- Idiomas mais usados

Construído com: MongoDB Atlas, Mongoose, Next.js API Routes