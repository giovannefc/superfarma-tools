# Super Farma Popular - Sistema de Gestão

Sistema de gestão interno da Super Farma Popular desenvolvido com React Router
v7, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **React Router v7** - Framework web moderno
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Lucide React** - Ícones

## ✨ Funcionalidades

### 🏠 Dashboard

- Visão geral do sistema
- Estatísticas principais
- Navegação intuitiva

### 💰 Empréstimos

- **Gestão de Empréstimos**: Controle de empréstimos de entrada e saída
- **Parceiros**: Cadastro e gerenciamento de parceiros
- **Status**: Acompanhamento de status (Pendente, Separado, Pago)
- **Histórico**: Visualização completa do histórico

### 💳 Conferência de Cartões

- **Importação CSV**: Upload de relatórios da Rede
- **Conciliação Automática**: Comparação entre dados da Rede e sistema A7
- **Relatórios Detalhados**:
  - Vendas não encontradas no sistema
  - Divergências de modalidade
  - Divergências de bandeira
  - Vendas conferidas
- **Estatísticas**: Resumos e totais por categoria

### 📋 Orçamentos

- **Integração A7**: Busca automática de orçamentos do sistema A7
- **Preview Detalhado**: Visualização completa dos itens
- **Geração de Imagem**:
  - Criação automática de imagem do orçamento
  - Logo oficial da Super Farma Popular
  - Layout profissional e limpo
  - Download em PNG
  - Cópia para área de transferência

## 🎨 Interface

### Design System

- **Tema Adaptativo**: Suporte a modo claro e escuro
- **Componentes Consistentes**: Baseados em shadcn/ui
- **Responsivo**: Funciona em desktop e mobile
- **Acessível**: Seguindo padrões de acessibilidade

### Loading States

- **Barra Global**: Loading automático durante navegações
- **Estados Específicos**: Feedback visual em operações
- **Transições Suaves**: Experiência fluida

### Notificações

- **Toast Messages**: Feedback de ações
- **Estados de Erro**: Tratamento elegante de erros
- **Confirmações**: Feedback de sucesso

## 🔧 Configuração

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações do banco
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Session
SESSION_SECRET="your-secret-key"

# A7 API
A7_API_URL="https://api.example.com"
A7_API_TOKEN="your-api-token"
```

## 📁 Estrutura do Projeto

```
app/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── panel/          # Componentes específicos do painel
├── models/             # Modelos de dados e lógica de negócio
├── routes/             # Rotas da aplicação
│   ├── api/           # Rotas de API
│   └── panel/         # Rotas do painel administrativo
├── services/           # Serviços externos (APIs, auth)
├── utils/              # Utilitários e helpers
└── hooks/              # Hooks customizados
```

## 🔐 Autenticação e Permissões

### Sistema de Autenticação

- **Login Seguro**: Autenticação baseada em sessão
- **Controle de Acesso**: Rotas protegidas por nível de usuário
- **Gerenciamento de Sessão**: Sessões persistentes

### Níveis de Usuário

#### 👑 **Administrador**

- ✅ Dashboard
- ✅ Empréstimos (completo)
- ✅ Orçamentos
- ✅ **Relatórios** (Balanço, Vendas, Despesas)
- ✅ **Conferência de Cartões**

#### 👤 **Usuário Comum**

- ✅ Dashboard
- ✅ Empréstimos (completo)
- ✅ Orçamentos
- ❌ Relatórios (bloqueado)
- ❌ Conferência de Cartões (bloqueado)

### Proteções Implementadas

- **Layout Protection**: Rotas protegidas redirecionam para dashboard
- **Menu Filtering**: Itens restritos não aparecem no menu
- **API Protection**: Endpoints protegidos por nível de usuário

## 📊 Banco de Dados

### Modelos Principais

- **User**: Usuários do sistema
- **Emprestimo**: Empréstimos e movimentações
- **EmprestimoParceiro**: Parceiros de negócio
- **Conciliacao**: Conciliações de cartão
- **Cartao**: Transações de cartão

## 🚀 Deploy

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

### Docker

```bash
# Build da imagem
docker build -t superfarma-tools .

# Executar container
docker run -p 3000:3000 superfarma-tools
```

### 👥 Setup de Usuários de Produção

Para configurar os usuários iniciais em produção, use os scripts dedicados:

#### **Usuários Criados:**

1. **Administrador**:
   - 📧 Email: `giovannefc@gmail.com`
   - 👤 Nome: `Giovanne Ferreira`
   - 🔑 Senha: `03031987.TnT`
   - 👑 Admin: **Sim** (acesso total)

2. **Usuário Comum**:
   - 📧 Email: `contato@superfarmapopular.com.br`
   - 👤 Nome: `Super Farma Popular`
   - 🔑 Senha: `101703tnt`
   - 👤 Admin: **Não** (sem acesso a relatórios/conciliações)

#### **Scripts de Setup:**

```bash
# Setup completo (migrations + usuários) - Recomendado
npm run setup:prod

# Apenas criar usuários
npm run db:seed:prod

# Execução direta
npx tsx prisma/seed-production.ts
```

#### **Para Docker/Produção:**

```bash
# Entrar no container
docker exec -it <container-name> sh

# Executar setup
npm run setup:prod
```

#### **Características:**

- ✅ **Senhas hasheadas** com bcrypt
- ✅ **Upsert seguro** - pode executar múltiplas vezes
- ✅ **Não sobrescreve dados** existentes
- ✅ **Logs seguros** - não expõe senhas

## 🧪 Testes

```bash
# Executar testes
npm test

# Verificação de tipos
npm run typecheck

# Linting
npm run lint
```

## 📈 Performance

- **Bundle Otimizado**: Vite para build rápido
- **Code Splitting**: Carregamento sob demanda
- **Assets Otimizados**: Imagens e recursos comprimidos
- **Loading States**: Feedback visual durante carregamentos

## 🔄 Integrações

### API A7

- Busca de orçamentos
- Dados de cartões
- Sincronização automática

### Rede (Adquirente)

- Importação de relatórios CSV
- Conciliação automática
- Análise de divergências

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run typecheck    # Verificação de tipos
npm run lint         # Linting do código
```

### Padrões de Código

- **TypeScript**: Tipagem estrita
- **ESLint**: Linting automático
- **Prettier**: Formatação consistente
- **Conventional Commits**: Padrão de commits

## 📝 Licença

Este projeto é propriedade da Super Farma Popular e é destinado apenas para uso
interno.

## 👥 Equipe

Desenvolvido pela equipe de tecnologia da Super Farma Popular.

---

**Super Farma Popular** - Sistema de Gestão Interno
