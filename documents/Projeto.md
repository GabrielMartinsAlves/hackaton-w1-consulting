# W1 Consultoria - Sistema de Holdings

## 📋 Visão Geral

O projeto W1 Consultoria é uma plataforma completa para estruturação de holdings imobiliárias, desenvolvida para o Hackathon W1. A solução oferece uma jornada intuitiva e simplificada para que clientes possam criar e gerenciar suas holdings de forma segura e eficiente.

## 🎯 Objetivo

Criar uma WebApp que permita aos usuários:
- Simular os benefícios de estruturar uma holding
- Acompanhar o processo de criação da holding
- Gerenciar documentos e contratos
- Receber notificações de comunicação via WhatsApp

## 🏗️ Arquitetura do Sistema

### Frontend (React.js)
- **Framework**: React.js com TypeScript
- **Styling**: Tailwind CSS
- **Ícones**: Font Awesome
- **Funcionalidades**:
  - Landing page responsiva
  - Sistema de autenticação
  - Simulador de valores
  - Interface de acompanhamento

### Backend (Node.js/Express)
- **Framework**: Express.js
- **Banco de Dados**: Sequelize ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Integração**: WhatsApp via Baileys
- **Middleware**: CORS, Morgan, Body Parser

## 📊 Modelo de Dados

### Tabelas Relacionais

#### users
```sql
- id (int4, PK)
- name (varchar)
- email (varchar, unique)
- password (varchar)
- created_at (timestamptz)
- last_access (timestamptz)
- is_active (bool)
```

#### contracts
```sql
- id (int4, PK)
- user_id (int4, FK → users.id)
- contract (varchar)
- status_id (int4, FK → status.id)
- document (text)
```

#### documents
```sql
- id (int4, PK)
- user_id (int4, FK → users.id)
- document (text)
- status_id (int4, FK → status.id)
```

#### steps
```sql
- id (int4, PK)
- user_id (int4, FK → users.id)
- registration (int4)
- documentation (int4)
- structuring (int4)
- drafting (int4)
```

#### status
```sql
- id (int4, PK)
- status (int4)
```

### Tabela Não Relacional

#### leads
```sql
- id (int4, PK)
- email (varchar)
- property_value (numeric)
- notes (text)
```

## 🚀 Funcionalidades

### 1. Landing Page
- **Design Responsivo**: Interface moderna com gradientes e animações
- **Simulador**: Cálculo de benefícios baseado no valor do imóvel
- **Formulário de Lead**: Captura de interessados
- **Testimonials**: Depoimentos de clientes

### 2. Sistema de Autenticação
- **Registro de Usuários**: Validação de email e senha
- **Login Seguro**: JWT com expiração de 5 dias
- **Middleware de Proteção**: Rotas protegidas com verificação de token
- **Logs Detalhados**: Debug completo para troubleshooting

### 3. Acompanhamento de Processo
- **Dashboard**: Visualização do progresso
- **Steps Tracking**: Acompanhamento de etapas
- **Status Updates**: Atualizações em tempo real
- **Documentos**: Upload e gerenciamento de arquivos

### 4. Integração WhatsApp
- **Notificações**: Envio automático de atualizações
- **QR Code**: Autenticação via terminal
- **Mensagens**: Sistema de comunicação direta

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js (v14+)
- PostgreSQL
- npm ou yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configurar variáveis de ambiente
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Configurar REACT_PUBLIC_URL_API no .env.local
npm run dev
```

## 📁 Estrutura de Pastas

```
hackathon-w1-consulting/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contractsController.js
│   │   ├── documentsController.js
│   │   ├── informationController.js
│   │   ├── statusController.js
│   │   ├── stepsController.js
│   │   ├── usersController.js
│   │   └── whatsappController.js
│   ├── models/
│   │   ├── config.js
│   │   ├── contractsModel.js
│   │   ├── documentsModel.js
│   │   ├── index.js
│   │   ├── leadsModel.js
│   │   ├── statusModel.js
│   │   ├── stepsModel.js
│   │   └── usersModel.js
│   ├── node_modules/
│   ├── baileys_auth_info/
│   ├── test/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── nodemon.json
├── frontend/
│   ├── .next/
│   ├── node_modules/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   └── app/
│   │       ├── acompanhamento/
│   │       ├── configuracoes/
│   │       ├── contratos/
│   │       ├── documentos/
│   │       ├── login/
│   │       ├── simulacao/
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── README.md
│   └── tsconfig.json
└── documents/
    └── Projeto.md
```

## 🔧 Endpoints da API

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login do usuário
- `GET /auth/@me` - Informações do usuário logado
- `POST /auth/logout` - Logout
- `GET /auth/debug-db` - Debug do banco de dados

### Gestão de Dados
- `GET /users` - Listar usuários
- `GET /contracts` - Listar contratos
- `GET /documents` - Listar documentos
- `GET /status` - Listar status
- `GET /steps` - Acompanhar etapas
- `POST /informations` - Criar lead

### Comunicação
- `POST /send-whatsapp` - Enviar mensagem WhatsApp


## 🔐 Segurança

### Autenticação JWT
- Tokens com expiração configurável
- Middleware de proteção em rotas sensíveis
- Verificação de usuário ativo
- Logs detalhados para auditoria

### Validações
- Sanitização de entrada de dados
- Validação de formato de email
- Verificação de força da senha
- Proteção contra SQL injection (via Sequelize)

## 📱 Integração WhatsApp

### Configuração
- Utiliza a biblioteca Baileys
- Autenticação via QR Code
- Armazenamento de sessão em `baileys_auth_info/`
- Reconexão automática

### Funcionalidades
- Envio de mensagens individuais
- Notificações de status
- Logs detalhados de operações

## 🎨 Design e UX

### Protótipo de Alta e Guia Visual
Acesse o link do figma para visualizar o nosso protótipo e nosso guia visual.

[Link Figma.](https://www.figma.com/design/uNS2pUCfAcW7d6lSA1e0zX/Prot%C3%B3tipo-W1---Hackathon?node-id=0-1&t=9yKHOjJqJFNfipM7-1)

### Princípios de Design
- **Mobile First**: Responsividade em todos os dispositivos
- **Acessibilidade**: Contraste adequado e navegação intuitiva
- **Performance**: Carregamento otimizado e animações suaves
- **Branding**: Identidade visual consistente com W1

### Paleta de Cores
- Primária: `#022028` (Verde escuro)
- Secundária: `#355054` (Verde médio)
- Accent: `#5CE1E6` (Ciano)
- Gradientes: Combinações harmoniosas

## 🚦 Status do Projeto

### Funcionalidades Implementadas ✅
- Sistema de autenticação completo
- Landing page responsiva
- Simulador de valores
- Integração WhatsApp
- Modelo de dados estruturado
- API RESTful funcional

### Próximos Passos 🔄
- Dashboard administrativo
- Upload de documentos
- Relatórios e analytics
- Testes automatizados
- Deploy em produção

## 🤝 Contribuição

Este projeto foi desenvolvido para o Hackathon W1 com foco em:
- Experiência do usuário intuitiva
- Código limpo e bem documentado
- Arquitetura escalável
- Segurança e performance

## 📞 Suporte

Para dúvidas ou suporte técnico, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.

---

**W1 Consultoria** - Construindo o futuro das holdings imobiliárias 🏢