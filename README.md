# 🏋️‍♂️ Zyn - Seu Companheiro Fitness

Bem-vindo ao **Zyn** — uma aplicação web desenvolvida em **React + Node.js** com foco na **saúde e bem-estar** dos usuários. Aqui você pode **monitorar alimentação, registrar exercícios, acompanhar metas de perda de peso** e muito mais!



## Tecnologias Utilizadas

- **React.js** (Vite)
- **React Router DOM**
- **CSS modularizado**
- **Validação de formulários com Regex**
- **Node.js + Express (API REST)**
- **Jest + Testing Library** (testes unitários)
- **localStorage** (persistência simples no frontend)

---

## Funcionalidades Principais

### Autenticação
- Tela de **Login** com validações (e-mail, senha forte)
- Tela de **Cadastro completo** com dados físicos e objetivos

### Alimentação
- Tela de **registro alimentar**
- Acompanhamento nutricional (por implementar)

### Exercícios
- Registro de atividades físicas
- Visualização dos hábitos do usuário

### Metas
- Meta de perda de peso
- Progresso baseado em IMC e gordura corporal

---

## Testes Automatizados

O projeto conta com **testes unitários** utilizando:

- [`@testing-library/react`](https://testing-library.com/)
- [`Jest`](https://jestjs.io/)
- npm test

---

## API - Backend (Node.js + Express)

Esta API fornece os endpoints para login, cadastro e futuras integrações com alimentação, exercícios e metas do usuário.

### Funcionalidades principais

- *Autenticação JWT (planejado)*
- *Cadastro completo de usuário*
- *Validação de campos obrigatórios*
- *Verificação de e-mail e senha*

### Estrutura esperada

```bash
- `routes/usuarios.js`: define as rotas
- `controllers/usuariosController.js`: lógica das ações
- `models/Usuario.js`: modelo de usuário
- `index.js`: inicialização da API
- `middlewares/`: validações personalizadas (em breve)
```bash

### ▶️ Como rodar a API


cd api
npm install
npm run dev

