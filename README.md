# 🌿 ECOA — Cerâmica Artesanal

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Versão-1.0.0-blue?style=for-the-badge" alt="Versão">
  <img src="https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge" alt="Licença">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
</p>

<p align="center">
  <strong>Plataforma de e-commerce para cerâmica artesanal com foco em sustentabilidade, design minimalista e vendas via WhatsApp.</strong>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-deploy">Deploy</a> •
  <a href="#-contribuindo">Contribuir</a>
</p>

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Contexto e Motivação](#-contexto-e-motivação)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Configuração do Supabase](#-configuração-do-supabase)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Guia de Uso](#-guia-de-uso)
- [Personalização](#-personalização)
- [Deploy em Produção](#-deploy-em-produção)
- [Segurança](#-segurança)
- [Performance e SEO](#-performance-e-seo)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

**ECOA** é uma plataforma web desenvolvida para uma marca de cerâmica artesanal que valoriza a sustentabilidade, o trabalho manual e a conexão com a natureza. O projeto oferece uma experiência digital completa que vai desde a apresentação da história da marca até a finalização da compra via WhatsApp, sem processar transações financeiras diretamente no site.

### 🎨 Identidade Visual

O design foi construído sobre uma **paleta de cores em tons pastéis**, cuidadosamente selecionada para transmitir:

- **Leveza e naturalidade** (creme `#FDFBF7`)
- **Sofisticação discreta** (cinza `#4A4A48`)
- **Acolhimento** (pêssego `#E8D5C4`)
- **Natureza e sustentabilidade** (verde menta `#D4E2D4`)
- **Serenidade** (azul acinzentado `#B8C5D6`)

---

## 💡 Contexto e Motivação

### Problema Resolvido

Pequenos artesãos e marcas de cerâmica frequentemente enfrentam os seguintes desafios:

1. **Dificuldade em vender online** sem uma presença digital profissional
2. **Risco de fraudes** ao processar pagamentos diretamente no site
3. **Complexidade técnica** para gerenciar catálogos e imagens
4. **Falta de conexão pessoal** com o cliente durante a compra

### Solução Proposta

O ECOA resolve esses problemas oferecendo:

- ✅ **Site profissional** que apresenta a marca e seus valores
- ✅ **Catálogo visual** com upload fácil de imagens
- ✅ **Vendas via WhatsApp**, eliminando riscos de fraude
- ✅ **Painel administrativo simples** para a dona da marca
- ✅ **Hospedagem gratuita** (Supabase + Vercel)

---

## ✨ Funcionalidades

### ️ Para Clientes

| Funcionalidade | Descrição |
|----------------|-----------|
| **Landing Page Institucional** | Apresentação da marca, história e valores |
| **Seção "Como Funciona"** | Explicação clara do processo de compra em 3 passos |
| **Catálogo de Produtos** | Grid responsivo com fotos, descrições e preços |
| **Integração WhatsApp** | Botão direto em cada peça com mensagem pré-preenchida |
| **Design Responsivo** | Experiência otimizada para mobile, tablet e desktop |
| **Carregamento em Tempo Real** | Atualização automática do catálogo via Supabase Realtime |

### 🔐 Para Administradores

| Funcionalidade | Descrição |
|----------------|-----------|
| **Painel Administrativo** | Acesso protegido por senha |
| **Cadastro de Produtos** | Formulário completo com upload de imagens |
| **Armazenamento de Imagens** | Upload direto para Supabase Storage |
| **Gerenciamento de Preços** | Atualização fácil de valores e descrições |
| **Visualização Imediata** | Alterações refletidas instantaneamente no site |

---

## 🛠️ Tecnologias Utilizadas

### Frontend

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **[Next.js](https://nextjs.org/)** | 14+ | Framework React com App Router, SSR e otimizações automáticas |
| **[TypeScript](https://www.typescriptlang.org/)** | 5+ | Tipagem estática para código mais seguro e manutenível |
| **[Tailwind CSS](https://tailwindcss.com/)** | v4 | Utility-first CSS com performance e customização |
| **[Lucide React](https://lucide.dev/)** | Latest | Ícones modernos, leves e consistentes |

### Backend & Infraestrutura

| Tecnologia | Uso | Plano |
|------------|-----|-------|
| **[Supabase](https://supabase.com/)** | Banco de dados PostgreSQL | Gratuito (500MB) |
| **Supabase Storage** | Armazenamento de imagens | Gratuito (1GB) |
| **Supabase Realtime** | Atualizações em tempo real | Gratuito |
| **[Vercel](https://vercel.com/)** | Hospedagem e deploy | Gratuito (Hobby) |

---

## ️ Arquitetura do Projeto
