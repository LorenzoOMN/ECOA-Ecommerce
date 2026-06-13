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

### 🛍️ Para Clientes

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

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Landing Page │  │   Catálogo   │  │   Painel Admin   │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼───────────────────┼────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS (App Router)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Server Components + Client Components (use client)  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE (BaaS)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ PostgreSQL   │  │   Storage    │  │   Realtime       │  │
│  │  (produtos)  │  │ (imagens)    │  │  (atualizações)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    WHATSAPP BUSINESS API                     │
│              (Finalização da venda via chat)                 │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Cliente** acessa o site → Next.js renderiza a página
2. **Catálogo** busca produtos do Supabase via API client-side
3. **Admin** faz upload da imagem → Supabase Storage → retorna URL pública
4. **Admin** salva produto → Supabase PostgreSQL → Realtime notifica o catálogo
5. **Cliente** clica em "Tenho Interesse" → Abre WhatsApp com mensagem pré-formatada

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão Mínima | Link |
|------------|---------------|------|
| **Node.js** | 18.17+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 9+ | (vem com Node.js) |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/) |
| **Editor de Código** | — | [VS Code](https://code.visualstudio.com/) (recomendado) |

### Contas Necessárias (todas gratuitas)

- [GitHub](https://github.com/) — Para versionamento
- [Supabase](https://supabase.com/) — Para banco de dados e imagens
- [Vercel](https://vercel.com/) — Para hospedagem (opcional)

---

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/ecoa-site.git
cd ecoa-site
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Supabase

Siga o guia completo em [Configuração do Supabase](#-configuração-do-supabase).

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# WhatsApp (formato: código do país + DDD + número, sem espaços ou símbolos)
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### 5. Execute o Projeto

```bash
npm run dev
```

Acesse:
- **Site:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (senha: `ecoa123`)

---

## 🗄️ Configuração do Supabase

### Passo 1: Criar Projeto

1. Acesse [supabase.com](https://supabase.com/) e faça login
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** `ecoa-ceramica`
   - **Database Password:** (guarde em local seguro)
   - **Region:** `South America (Brazil)` ou mais próxima
4. Aguarde ~2 minutos a criação

### Passo 2: Criar Tabela de Produtos

Vá em **Table Editor** → **New Table** e configure:

| Coluna | Tipo | Configurações |
|--------|------|---------------|
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `nome` | `text` | Not Null |
| `descricao` | `text` | — |
| `preco` | `numeric` | Not Null |
| `imagem_url` | `text` | Not Null |
| `created_at` | `timestamptz` | Default: `now()` |

Ou execute no **SQL Editor**:

```sql
CREATE TABLE produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC NOT NULL,
  imagem_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Realtime para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE produtos;
```

### Passo 3: Criar Bucket de Imagens

1. Vá em **Storage** → **New Bucket**
2. Nome: `imagens-produtos`
3. Marque **Public bucket** ✅
4. Clique em **Save**

### Passo 4: Configurar Políticas de Segurança (RLS)

No **SQL Editor**, execute:

```sql
-- Permitir leitura pública da tabela produtos
CREATE POLICY "Permitir leitura pública"
ON produtos FOR SELECT
USING (true);

-- Permitir inserção pública (para o admin do site)
CREATE POLICY "Permitir inserção"
ON produtos FOR INSERT
WITH CHECK (true);

-- Permitir upload público no bucket
CREATE POLICY "Permitir upload público"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'imagens-produtos');

CREATE POLICY "Permitir leitura pública de imagens"
ON storage.objects FOR SELECT
USING (bucket_id = 'imagens-produtos');
```

### Passo 5: Copiar as Chaves de API

Vá em **Project Settings** → **API** e copie:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔐 Variáveis de Ambiente

| Variável | Obrigatória | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto Supabase | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Chave pública anon do Supabase | `eyJhbGci...` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | Número WhatsApp (com código do país) | `5511999999999` |

> ⚠️ **Importante:** Nunca commite o arquivo `.env.local` no Git. Ele já está listado no `.gitignore`.

---

## 📁 Estrutura do Projeto

```
ecoa-site/
├── app/                          # Next.js App Router
│   ├── admin/                    # Painel administrativo
│   │   └── page.tsx              #   ↳ Formulário de cadastro
│   ├── catalogo/                 # Página do catálogo
│   │   └── page.tsx              #   ↳ Grid de produtos
│   ├── globals.css               # Estilos globais + Tailwind
│   ├── layout.tsx                # Layout raiz (metadata, fonts)
│   └── page.tsx                  # Landing page principal
├── lib/                          # Utilitários e configurações
│   └── supabaseClient.ts         #   ↳ Cliente Supabase
├── public/                       # Arquivos estáticos
│   └── favicon.ico               #   ↳ Ícone do site
├── .env.local                    # Variáveis de ambiente (não commite!)
├── .gitignore                    # Arquivos ignorados pelo Git
├── next.config.js                # Configuração Next.js
├── package.json                  # Dependências e scripts
├── postcss.config.js             # Configuração PostCSS
├── tsconfig.json                 # Configuração TypeScript
└── README.md                     # Esta documentação
```

---

## 🛣️ Rotas da Aplicação

| Rota | Método | Descrição | Acesso |
|------|--------|-----------|--------|
| `/` | GET | Landing page institucional | Público |
| `/catalogo` | GET | Catálogo de produtos | Público |
| `/admin` | GET/POST | Painel administrativo | Protegido por senha |

---

## 📖 Guia de Uso

### Para Clientes

1. **Acesse o site** pelo link fornecido
2. **Conheça a marca** na landing page (história, valores, processo)
3. **Clique em "Explorar Coleção"** para ver o catálogo
4. **Navegue pelas peças** e escolha a que mais gostar
5. **Clique em "Tenho Interesse"** na peça desejada
6. **Será redirecionado ao WhatsApp** com mensagem pré-preenchida
7. **Converse diretamente** com a vendedora para finalizar a compra

### Para Administradores

1. **Acesse** `https://seu-site.com/admin`
2. **Digite a senha** (padrão: `ecoa123`)
3. **Preencha o formulário:**
   - Nome da peça (obrigatório)
   - Descrição (opcional)
   - Preço em reais (obrigatório)
   - Foto da peça (obrigatório, formatos: JPG, PNG, WEBP)
4. **Clique em "Salvar Peça"**
5. **Aguarde o upload** (pode levar alguns segundos)
6. **Confirme o sucesso** pela mensagem de feedback
7. **Volte ao catálogo** para ver a peça publicada

---

## 🎨 Personalização

### Alterar Paleta de Cores

Edite `app/globals.css`:

```css
@theme {
  --color-background: #FDFBF7;   /* Fundo principal */
  --color-foreground: #4A4A48;   /* Texto */
  --color-primary: #E8D5C4;      /* Cor primária (botões) */
  --color-secondary: #D4E2D4;    /* Cor secundária (destaques) */
  --color-accent: #B8C5D6;       /* Cor de acento */
}
```

### Alterar Textos da Marca

- **Landing page:** `app/page.tsx`
- **Metadata (título, descrição):** `app/layout.tsx`
- **Footer:** `app/page.tsx` (seção footer)

### Alterar Número do WhatsApp

No arquivo `.env.local`:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5511987654321
```

Formato: `55` (Brasil) + `11` (DDD) + `987654321` (número)

### Alterar Senha do Admin

No arquivo `app/admin/page.tsx`, localize:

```typescript
if (senha === 'ecoa123') {
```

E substitua `'ecoa123'` pela senha desejada.

> 💡 **Dica de segurança:** Em produção, use variáveis de ambiente para a senha.

---

## 🌐 Deploy em Produção

### Opção 1: Vercel (Recomendado)

1. **Envie o código ao GitHub:**
   ```bash
   git add .
   git commit -m "feat: initial commit"
   git push origin main
   ```

2. **Conecte na Vercel:**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Importe o repositório do GitHub
   - Configure as **Environment Variables**:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - Clique em **Deploy**

3. **Pronto!** Seu site estará no ar em ~1 minuto.

### Opção 2: Netlify

1. Build do projeto: `npm run build`
2. Output directory: `.next`
3. Configure as variáveis de ambiente no painel da Netlify
4. Deploy automático via Git

### Opção 3: Docker (Self-hosted)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t ecoa-site .
docker run -p 3000:3000 --env-file .env.local ecoa-site
```

---

## 🔒 Segurança

### Medidas Implementadas

- ✅ **Sem processamento de pagamentos** no site (elimina risco de fraude)
- ✅ **Variáveis de ambiente** para dados sensíveis
- ✅ **`.env.local` no `.gitignore`** (não é committado)
- ✅ **Senha no admin** (proteção básica de frontend)
- ✅ **HTTPS obrigatório** (Vercel fornece automaticamente)

### Recomendações para Produção

1. **Implementar Supabase Auth** para login real do admin
2. **Configurar Row Level Security (RLS)** no Supabase
3. **Usar variável de ambiente** para a senha do admin
4. **Adicionar rate limiting** no painel administrativo
5. **Configurar CORS** restrito no Supabase
6. **Habilitar 2FA** na conta Supabase e Vercel

---

## ⚡ Performance e SEO

### Otimizações Automáticas (Next.js)

- ✅ **Server Components** para carregamento rápido
- ✅ **Image Optimization** automática
- ✅ **Code Splitting** por rota
- ✅ **Prefetching** de links
- ✅ **Font Optimization**

### Sugestões de Melhoria

- [ ] Adicionar `sitemap.xml`
- [ ] Configurar `robots.txt`
- [ ] Implementar Open Graph tags para compartilhamento
- [ ] Adicionar Google Analytics ou Plausible
- [ ] Usar `next/image` para otimização de imagens do catálogo

---

## 🐛 Troubleshooting

### Erro: `Cannot apply unknown utility class`

**Causa:** Conflito entre Tailwind v3 e v4.

**Solução:** Use `@import "tailwindcss";` no lugar das diretivas `@tailwind`.

### Erro: `Supabase connection failed`

**Causa:** Variáveis de ambiente incorretas.

**Solução:** Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas no `.env.local`.

### Erro: `Upload de imagem falhou`

**Causa:** Bucket não configurado como público ou RLS bloqueando.

**Solução:** Verifique se o bucket `imagens-produtos` está marcado como **Public** e se as políticas RLS estão configuradas.

### Erro: `WhatsApp não abre`

**Causa:** Número em formato incorreto.

**Solução:** Use o formato `5511999999999` (sem espaços, traços ou parênteses).

### Site lento no primeiro carregamento

**Causa:** Cold start na Vercel (plano gratuito).

**Solução:** Aguarde ~30 segundos ou faça upgrade para o plano Pro.

---

## 🗺️ Roadmap

### ✅ Versão 1.0 (Atual)

- [x] Landing page institucional
- [x] Catálogo de produtos
- [x] Painel administrativo
- [x] Integração WhatsApp
- [x] Upload de imagens
- [x] Design responsivo

### 🚧 Versão 1.1 (Planejada)

- [ ] Autenticação real com Supabase Auth
- [ ] Edição e exclusão de produtos
- [ ] Categorias de produtos
- [ ] Busca e filtros no catálogo
- [ ] Galeria de fotos por produto

### 🎯 Versão 2.0 (Futuro)

- [ ] Sistema de favoritos
- [ ] Newsletter de novidades
- [ ] Integração com Instagram Feed
- [ ] Depoimentos de clientes
- [ ] Blog sobre cerâmica
- [ ] Multi-idioma (PT/EN)

---

## 🤝 Contribuindo

Contribuições são **muito bem-vindas**! Siga os passos:

### 1. Fork o Projeto

Clique no botão "Fork" no topo do repositório.

### 2. Clone seu Fork

```bash
git clone https://github.com/seu-usuario/ecoa-site.git
cd ecoa-site
```

### 3. Crie uma Branch

```bash
git checkout -b feature/MinhaFeature
```

### 4. Faça suas Alterações

Siga o padrão de commits [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração

### 5. Commit e Push

```bash
git commit -m "feat: adiciona nova funcionalidade X"
git push origin feature/MinhaFeature
```

### 6. Abra um Pull Request

Descreva claramente o que foi alterado e por quê.

### 📐 Padrões de Código

- Use **TypeScript** em todos os arquivos
- Siga o **ESLint** configurado no projeto
- Componentes em **PascalCase** (`MeuComponente.tsx`)
- Funções em **camelCase** (`minhaFuncao`)
- Variáveis de ambiente com prefixo `NEXT_PUBLIC_`

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2026 ECOA Cerâmica

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Autor

**Desenvolvido por:** Lorenzo  
**GitHub:** [@seu-usuario](https://github.com/seu-usuario)  
**LinkedIn:** [linkedin.com/in/seu-usuario](https://linkedin.com/in/seu-usuario)  
**Email:** seu.email@exemplo.com

---

## 🙏 Agradecimentos

- [Next.js Team](https://nextjs.org/) — Pelo framework incrível
- [Supabase](https://supabase.com/) — Pelo backend open-source
- [Tailwind CSS](https://tailwindcss.com/) — Pela estilização moderna
- [Vercel](https://vercel.com/) — Pela hospedagem gratuita
- [Lucide Icons](https://lucide.dev/) — Pelos ícones minimalistas

---

<p align="center">
  <strong>Feito com 💚, café e muita cerâmica</strong>
</p>

<p align="center">
  <a href="#-ecoa--cerâmica-artesanal">⬆️ Voltar ao topo</a>
</p>
