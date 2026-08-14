# DEU CAPA — Firebase

A estrutura do Admin já está preparada para Firebase Authentication + Cloud Firestore.

## 1. Criar o projeto

No Console do Firebase, crie um projeto separado para **DEU CAPA**.

## 2. Registrar um app Web

Adicione um app Web e copie o objeto `firebaseConfig` para `firebase-config.js`.

## 3. Ativar Authentication

Em Authentication, habilite o provedor **E-mail/Senha**.

Crie o usuário administrador usando o e-mail autorizado pelas regras:

`wallissonghost@gmail.com`

## 4. Criar o Firestore

Crie o banco Cloud Firestore.

Depois publique o conteúdo de `firestore.rules` em Firestore > Rules.

## 5. Testar

Acesse:

`https://wallissonghost-code.github.io/tops-revista-digital/admin.html`

O painel possui CRUD inicial para:

- Matérias
- Eventos
- Categorias
- Edições
- Configurações do site

## Segurança

O `firebaseConfig` do app Web identifica o projeto, mas não concede acesso administrativo. As gravações são protegidas pelas Security Rules e exigem um usuário autenticado com o e-mail administrador configurado.
