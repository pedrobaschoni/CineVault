# CineVault

CineVault é um site onde os usuários podem deixar suas notas e opiniões sobre séries, filmes e animes. Este projeto foi desenvolvido utilizando Next.js e TypeScript, proporcionando uma experiência de usuário fluida e moderna.

## Estrutura do Projeto

O projeto possui a seguinte estrutura de diretórios:

```
cinevault-frontend
├── src
│   ├── app
│   │   ├── layout.tsx          # Layout global da aplicação
│   │   ├── page.tsx            # Página inicial do CineVault
│   │   ├── login
│   │   │   └── page.tsx        # Página de login
│   │   └── home
│   │       └── page.tsx        # Página principal com conteúdo
│   ├── components
│   │   ├── Sidebar.tsx         # Componente do menu lateral
│   │   ├── LoginForm.tsx       # Componente do formulário de login
│   │   ├── MovieCard.tsx       # Componente para exibir pôsteres
│   │   └── Header.tsx          # Componente do cabeçalho
│   ├── styles
│   │   └── globals.css         # Estilos globais da aplicação
│   └── types
│       └── index.ts            # Definições de tipos e interfaces
├── public
│   └── images
│       ├── fundo2.jpg          # Imagem de fundo da tela de login
│       └── iconeescuro.png     # Ícone do site
├── package.json                 # Configuração do npm
├── tsconfig.json                # Configuração do TypeScript
├── next.config.js               # Configurações específicas do Next.js
└── README.md                    # Documentação do projeto
```

## Instalação

Para instalar e executar o projeto, siga os passos abaixo:

1. Clone o repositório:
   ```
   git clone <URL_DO_REPOSITORIO>
   ```

2. Navegue até o diretório do projeto:
   ```
   cd cinevault-frontend
   ```

3. Instale as dependências:
   ```
   npm install
   ```

4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

5. Acesse o site em seu navegador:
   ```
   http://localhost:3000
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.