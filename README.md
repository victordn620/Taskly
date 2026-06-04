# Taskly

Taskly é um app mobile de produtividade para organizar projetos, tarefas e progresso geral em um único lugar. O projeto foi construído com Expo, React Native e TypeScript, com navegação por abas, autenticação simulada local, tema claro/escuro e persistência em `AsyncStorage`.

## Visão geral

O app foi desenhado para servir como um gerenciador pessoal de trabalho e estudos. Na primeira execução, ele carrega dados de exemplo para que o dashboard e as listas já apareçam preenchidos. Tudo é armazenado localmente no dispositivo, sem backend.

## Funcionalidades

- Autenticação local com login, cadastro e logout.
- Persistência de sessão, projetos, tarefas e tema no dispositivo.
- Dashboard inicial com saudação, progresso geral e estatísticas resumidas.
- CRUD de projetos.
- CRUD de tarefas.
- Filtros por status e prioridade.
- Busca de tarefas com debounce.
- Visualização de detalhes de tarefa.
- Perfil do usuário com edição de nome e e-mail.
- Alternância entre tema claro e escuro.
- Seed inicial com dados de demonstração.

## Tecnologias

- Expo
- React Native
- TypeScript
- React Navigation
- Zustand
- AsyncStorage
- React Native Reanimated
- Expo Linear Gradient
- Expo Vector Icons

## Requisitos

- Node.js instalado
- npm ou outro gerenciador compatível com o projeto
- Expo Go no celular, ou emulador Android/iOS, se quiser executar localmente

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

Scripts úteis:

```bash
npm run android
npm run ios
npm run web
```

Observação: os scripts usam `expo@54.0.34` via `npx`, então não é necessário instalar o Expo globalmente.

## Como usar

1. Abra o app.
2. Aguarde a tela inicial carregar.
3. Faça login ou cadastre um usuário novo.
4. Explore as abas Início, Projetos, Tarefas e Perfil.
5. Crie projetos e tarefas para acompanhar o progresso.
6. Use o perfil para alternar o tema e editar seus dados.

## Dados e autenticação

Este projeto não usa servidor nem banco remoto. Os dados ficam salvos localmente em `AsyncStorage`.

Na primeira execução, o app cria automaticamente um conjunto de dados de exemplo para:

- mostrar projetos iniciais;
- popular tarefas de demonstração;
- permitir navegação e testes sem configuração adicional.

A autenticação também é local e simulada. O app valida apenas o formato básico da interação e persiste o usuário no dispositivo.

## Estrutura do projeto

```text
taskly/
  App.tsx
  app.json
  package.json
  src/
    components/
    contexts/
    data/
    hooks/
    routes/
    screens/
    services/
    styles/
    types/
    utils/
```

### Principais áreas

- `src/components`: componentes reutilizáveis como botões, cards, modal, input e barra de progresso.
- `src/contexts`: estados globais de autenticação, projetos, tarefas e tema.
- `src/routes`: navegação principal, fluxo de autenticação e abas do app.
- `src/screens`: telas de login, cadastro, dashboard, projetos, tarefas, perfil e modais de criação.
- `src/services`: camada de persistência local.
- `src/styles`: tema visual, espaçamentos, tipografia e tokens de interface.
- `src/utils`: helpers para datas, filtro, ordenação e estatísticas.

## Comportamento importante

- O primeiro acesso exibe a splash screen antes de abrir o app principal.
- Se não houver sessão salva, o usuário cai no fluxo de autenticação.
- Projetos e tarefas são carregados do armazenamento local e, se não existirem, recebem dados de exemplo.
- O tema escolhido pelo usuário é restaurado automaticamente na próxima abertura.

## Build e plataforma

O projeto está configurado para:

- iOS
- Android
- Web

No `app.json`, o app usa orientação retrato e suporta tablets no iOS.

## Observações

- O projeto foi pensado como uma base de demonstração e produtividade pessoal.
- Não há sincronização em nuvem, login real com backend ou notificações ativas ainda.
- A tela de notificações no perfil está marcada como futura expansão.

## Versão

Versão atual: `1.0.0`
