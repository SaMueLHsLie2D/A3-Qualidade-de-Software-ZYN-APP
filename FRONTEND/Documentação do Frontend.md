# Documentação do Frontend - ZYN APP

## 1. Visão Geral

Este documento descreve a arquitetura, estrutura e funcionalidades do projeto frontend do aplicativo ZYN. O frontend é responsável pela interface do usuário, permitindo que os usuários interajam com os recursos do aplicativo, como registro, login, visualização de informações e interação com dados de saúde e exercícios.

O projeto foi desenvolvido utilizando React com Vite, proporcionando um ambiente de desenvolvimento rápido e eficiente. A navegação entre as páginas é gerenciada pelo `react-router-dom`.

## 2. Estrutura do Projeto

A estrutura de pastas principal do frontend está organizada da seguinte forma:

```
FRONTEND/
├── public/             # Arquivos estáticos públicos (ex: vite.svg)
├── src/
│   ├── assets/         # Imagens e outros recursos estáticos usados nos componentes
│   ├── Pages/          # Componentes que representam páginas completas da aplicação
│   │   ├── Alimentacao/
│   │   │   └── index.jsx
│   │   ├── Exercicios/
│   │   │   ├── art.css
│   │   │   └── index.jsx
│   │   ├── Home/
│   │   │   ├── art.css
│   │   │   └── index.jsx
│   │   ├── Login/
│   │   │   ├── art.css
│   │   │   └── index.jsx
│   │   │   └── index.test.jsx  # Testes unitários para Login
│   │   └── Register/
│   │       ├── art.css
│   │       └── index.jsx
│   │       └── index.test.jsx # Testes unitários para Register
│   ├── index.css       # Estilos CSS globais
│   ├── main.jsx        # Ponto de entrada principal da aplicação React
│   └── setupTests.js   # Configuração para os testes unitários (Jest + Testing Library)
├── .eslintrc.cjs       # Configuração do ESLint (desativado por padrão no Vite inicial)
├── index.html          # Arquivo HTML principal servido pelo Vite
├── package.json        # Define dependências e scripts do projeto
├── package-lock.json   # Bloqueia as versões das dependências
└── vite.config.js      # Arquivo de configuração do Vite
```

**Pastas e Arquivos Chave:**

*   `src/`: Contém todo o código-fonte da aplicação React.
*   `src/Pages/`: Cada subpasta representa uma rota/página principal da aplicação (Login, Register, Home, etc.).
*   `src/assets/`: Armazena imagens e outros arquivos estáticos utilizados pelos componentes.
*   `src/main.jsx`: Ponto de entrada da aplicação. Configura o React Router e renderiza o componente principal.
*   `src/index.css`: Arquivo para estilos CSS globais que afetam toda a aplicação.
*   `package.json`: Gerencia as dependências do projeto (React, Vite, React Router, Testing Library, etc.) e define scripts (`dev`, `build`, `test`, `lint`, `preview`).
*   `vite.config.js`: Configurações específicas do build tool Vite.

## 3. Configuração e Instalação

Para configurar o ambiente de desenvolvimento do frontend, siga os passos abaixo:

1.  **Pré-requisitos:** Certifique-se de ter o Node.js e o npm (ou yarn) instalados em sua máquina.
2.  **Navegue até a Pasta:** Abra um terminal e navegue até o diretório raiz do frontend (`FRONTEND/`).
3.  **Instale as Dependências:** Execute o comando:
    ```bash
    npm install
    ```
    Este comando lerá o `package.json` e baixará todas as dependências necessárias para o projeto, incluindo React, Vite e as bibliotecas de teste.

## 4. Executando o Projeto

### 4.1. Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento local (geralmente na porta 5173), execute o seguinte comando dentro da pasta `FRONTEND/`:

```bash
npm run dev
```

Isso iniciará o servidor Vite com Hot Module Replacement (HMR), permitindo que você veja as alterações no código refletidas no navegador quase instantaneamente sem precisar recarregar a página.

**Importante:** Para que as funcionalidades que dependem da API (como login e registro) funcionem, o servidor backend (`API-BACKEND`) também precisa estar em execução.

### 4.2. Build de Produção

Para criar uma versão otimizada do frontend para implantação (deploy), execute:

```bash
npm run build
```

Este comando criará uma pasta `dist/` com os arquivos estáticos prontos para serem servidos por um servidor web.

### 4.3. Pré-visualização do Build

Para testar localmente o build de produção antes de implantar, execute:

```bash
npm run preview
```

Isso iniciará um servidor local simples servindo os arquivos da pasta `dist/`.

## 5. Testes Unitários

O projeto está configurado para usar Jest e React Testing Library para testes unitários. Os arquivos de teste estão localizados junto aos componentes que eles testam (ex: `src/Pages/Login/index.test.jsx`).

Para executar todos os testes unitários, use o comando:

```bash
npm test
```

Isso executará o Jest no modo interativo (watch mode por padrão), mostrando os resultados dos testes no terminal.

## 6. Roteamento

A navegação entre as diferentes páginas da aplicação é gerenciada pela biblioteca `react-router-dom`. A configuração das rotas geralmente é feita no arquivo `src/main.jsx` ou em um componente de roteamento dedicado.

As principais rotas configuradas são:

*   `/`: Página de Login (`src/Pages/Login/index.jsx`)
*   `/Register`: Página de Cadastro (`src/Pages/Register/index.jsx`)
*   `/Home`: Página Principal após login (`src/Pages/Home/index.jsx`)
*   Outras rotas (Alimentacao, Exercicios) podem existir dependendo da implementação completa.

O hook `useNavigate` é utilizado dentro dos componentes para realizar o redirecionamento programático entre as rotas (ex: após login ou cadastro bem-sucedido).

## 7. Componentes Principais

*   **Login (`src/Pages/Login/index.jsx`):**
    *   Renderiza o formulário de login com campos para email e senha.
    *   Inclui validações básicas de preenchimento e formato de email/senha.
    *   Realiza a chamada à API (`/api/users/login`) para autenticar o usuário.
    *   Em caso de sucesso, armazena dados do usuário no `localStorage` e redireciona para `/Home`.
    *   Permite visualizar/ocultar a senha.
    *   Possui botão para navegar para a página de Cadastro.
*   **Register (`src/Pages/Register/index.jsx`):**
    *   Renderiza o formulário de cadastro completo (nome, email, senha, dados de saúde).
    *   Inclui validações para todos os campos (obrigatórios, formato, valores numéricos positivos, senha segura).
    *   Realiza a chamada à API (`/api/users/register-full`) para cadastrar o novo usuário.
    *   Em caso de sucesso, exibe mensagem e redireciona para a página de Login (`/`).
    *   Permite visualizar/ocultar a senha.
    *   Possui botão para voltar à página de Login.
*   **Home (`src/Pages/Home/index.jsx`):**
    *   Página principal acessada após o login.
    *   (Detalhes da implementação específica desta página precisam ser verificados no código).
*   **Alimentacao (`src/Pages/Alimentacao/index.jsx`) e Exercicios (`src/Pages/Exercicios/index.jsx`):**
    *   Páginas adicionais acessíveis após login.
    *   (Detalhes da implementação específica precisam ser verificados no código).

## 8. Integração com a API

O frontend se comunica com o backend (API) para realizar operações como autenticação, cadastro e busca/salvamento de dados.

*   As chamadas à API são feitas utilizando a função `fetch` nativa do navegador.
*   As URLs base da API (ex: `http://localhost:3000`) estão codificadas diretamente nas chamadas `fetch` dentro dos componentes.
    *   **Recomendação:** Para facilitar a manutenção e configuração em diferentes ambientes (desenvolvimento, produção), considere mover a URL base da API para uma variável de ambiente (usando arquivos `.env` e `import.meta.env` do Vite).
*   As requisições geralmente enviam e recebem dados no formato JSON (`Content-Type: application/json`).
*   O tratamento de erros inclui a exibição de mensagens de alerta (`alert()`) para o usuário e logs no console (`console.error()`) para depuração.

## 9. Estilização

A estilização dos componentes é feita principalmente através de arquivos CSS.

*   `src/index.css`: Contém estilos globais aplicados a toda a aplicação.
*   Arquivos CSS específicos por página/componente (ex: `src/Pages/Login/art.css`, `src/Pages/Home/art.css`): Contêm estilos específicos para os elementos daquela página ou componente.
*   As classes CSS definidas nesses arquivos são aplicadas aos elementos JSX usando o atributo `className`.

---
*Documentação gerada por Manus em 26/05/2025.*

