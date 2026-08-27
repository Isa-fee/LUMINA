# Lumina

## Equipe

* Emanoelly Francinny Brito Tavares
* Isabele Fernanda da Silva Albano
* Lívia Tainá de Medeiros Oliveira
* Tamíris dos Santos Medeiros

## Descrição do Tema

Este projeto tem como objetivo desenvolver um sistema de gerenciamento de dados para uma biblioteca.

O sistema permitirá o cadastro, consulta, edição e exclusão de livros, além do controle de empréstimos e devoluções.


## Tecnologias Utilizadas

### Frontend

* HTML
* CSS
* JavaScript
* React
* Vite

### Backend

* Python
* FastAPI
* SQLModel
* JWT
* SQLite

---

## Configuração do Ambiente

Antes de executar o projeto pela primeira vez, é necessário configurar o ambiente do backend e instalar as dependências do frontend.

### 1. Criar o ambiente virtual

Na raiz do projeto, execute:

```bash
py -m venv env
```

### 2. Ativar o ambiente virtual

#### Windows (CMD)

```cmd
.\env\Scripts\activate
```

Após a ativação, o terminal deverá apresentar `(env)` no início da linha.

### 3. Instalar as dependências do backend

Com o ambiente virtual ativado e ainda na raiz do projeto, execute:

```bash
pip install -r requirements.txt
```

### 4. Instalar as dependências do frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Depois, volte para a raiz do projeto:

```bash
cd ..
```

> As etapas de criação do ambiente virtual e instalação das dependências são necessárias principalmente na primeira execução do projeto.

---

## Executando o Projeto

Para executar o Lumina, é necessário manter **dois terminais abertos simultaneamente**: um para o backend FastAPI e outro para o frontend React.

### Terminal 1 — Backend FastAPI

Abra um terminal na raiz do projeto:

```text
C:\Users\...\Documents\LUMINA>
```

Caso o ambiente virtual ainda não esteja ativado, execute:

```cmd
.\env\Scripts\activate
```

Em seguida, inicie o backend:

```bash
uvicorn main:app --reload
```

O backend estará disponível em:

```text
http://127.0.0.1:8000
```

A documentação automática da API estará disponível em:

```text
http://127.0.0.1:8000/docs
```

Mantenha esse terminal aberto enquanto estiver utilizando o sistema.

### Terminal 2 — Frontend React

Abra um **segundo terminal** no VS Code e entre na pasta do frontend:

```bash
cd frontend
```

Inicie o frontend:

```bash
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

Mantenha esse terminal aberto também.

### Resumo

Ao executar o projeto, os dois terminais deverão ficar aproximadamente assim:

**Terminal 1 — Backend**

```text
(env) C:\Users\...\Documents\LUMINA>
uvicorn main:app --reload

→ FastAPI: http://127.0.0.1:8000
```

**Terminal 2 — Frontend**

```text
(env) C:\Users\...\Documents\LUMINA\frontend>
npm run dev

→ React: http://localhost:5173
```

Depois, acesse o sistema pelo navegador em:

```text
http://localhost:5173
```

### Encerrar o Projeto

Para interromper o backend e o frontend, utilize `Ctrl + C` em cada terminal.

Para desativar o ambiente virtual:

```bash
deactivate
```

---

## Cronograma do Projeto

### 1º Bimestre — Base

* Definir o projeto;
* Levantamento e definição dos requisitos;
* Criação dos diagramas (caso de uso, classe, sequência e atividades);
* Desenvolvimento inicial do backend (API REST) e frontend;
* Implementação de autenticação com JWT;
* Garantir que a aplicação seja stateless.

**Entrega esperada:** Sistema funcionando com autenticação (login).

### 2º Bimestre — Containers

* Criação dos containers da aplicação;
* Execução da aplicação com Docker;
* Testes utilizando Podman;
* Ajustes no funcionamento geral.

**Entrega esperada:** Aplicação rodando em containers.

### 3º Bimestre — Orquestração + IaC

* Configuração do Kubernetes (Rancher Desktop);
* Deploy da aplicação no cluster;
* Utilização do Containerd;
* Implementação de infraestrutura como código (IaC).

**Entrega esperada:** Aplicação rodando no Kubernetes com IaC.

### 4º Bimestre — Finalização

* Testes gerais da aplicação;
* Correção de erros;
* Documentação do projeto.

**Entrega esperada:** Projeto completo.
