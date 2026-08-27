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
* MySQL

---

## Configuração do Ambiente

Antes de executar o projeto pela primeira vez, é necessário configurar o ambiente do backend, instalar as dependências do frontend e criar o banco de dados.

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

## Configuração do Banco de Dados

O Lumina utiliza o **MySQL** como banco de dados.

Antes de iniciar o backend pela primeira vez, é necessário criar o banco utilizado pela aplicação.

### 1. Criar o banco no MySQL Workbench

Abra o **MySQL Workbench**, conecte-se ao servidor MySQL e execute:

```sql
CREATE DATABASE lumina;
```

Para verificar se o banco foi criado corretamente:

```sql
SHOW DATABASES;
```

O banco `lumina` deverá aparecer na lista.

> Não é necessário criar as tabelas manualmente caso o projeto esteja configurado para criá-las automaticamente através do SQLModel.

### 2. Configurar usuário e senha do MySQL

A conexão com o MySQL pode variar de acordo com a configuração de cada computador.

Verifique no projeto o local onde está configurada a URL de conexão com o banco.

Ela poderá ter uma estrutura semelhante a:

```python
mysql+pymysql://root:SENHA@localhost/lumina
```

Onde:

* `root` é o usuário do MySQL;
* `SENHA` é a senha configurada no MySQL do computador;
* `localhost` indica que o banco está sendo executado localmente;
* `lumina` é o nome do banco utilizado pelo projeto.

Caso o MySQL possua senha, substitua `SENHA` pela senha correspondente.

Exemplo:

```python
mysql+pymysql://root:minhasenha@localhost/lumina
```

Caso o usuário `root` não possua senha, remova a senha da URL, mantendo os dois pontos:

```python
mysql+pymysql://root:@localhost/lumina
```

> A senha do MySQL pode ser diferente em cada computador. Por isso, essa configuração deve ser verificada antes de executar o projeto.

---

## Executando o Projeto

Para executar o Lumina, é necessário manter **dois terminais abertos simultaneamente**: um para o backend FastAPI e outro para o frontend React.

### Abrindo o terminal no VS Code

Para abrir o terminal integrado do VS Code, utilize o atalho:

```text
Ctrl + J
```

O painel inferior do VS Code será aberto.

Antes de executar os comandos, verifique se o terminal está utilizando o **Command Prompt (CMD)**.

Caso esteja utilizando PowerShell ou outro terminal:

1. Clique na seta `˅` localizada ao lado do botão `+` no painel do terminal;
2. Selecione **Command Prompt**;
3. Um novo terminal CMD será aberto.

> Os comandos apresentados neste README foram escritos considerando o uso do **Command Prompt (CMD)** no Windows.

---

### Terminal 1 — Backend FastAPI

Abra o terminal utilizando:

```text
Ctrl + J
```

Certifique-se de que está utilizando o **Command Prompt (CMD)** e de que o terminal está na raiz do projeto:

```text
C:\Users\...\Documents\LUMINA>
```

Caso o ambiente virtual ainda não esteja ativado, execute:

```cmd
.\env\Scripts\activate
```

Após a ativação, deverá aparecer `(env)` no início da linha:

```text
(env) C:\Users\...\Documents\LUMINA>
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

**Não feche esse terminal.** Ele deve continuar rodando enquanto o sistema estiver sendo utilizado.

---

### Terminal 2 — Frontend React

Com o primeiro terminal ainda rodando, clique no botão `+` no painel do terminal para abrir **um segundo terminal**.

Verifique novamente se o novo terminal está utilizando o **Command Prompt (CMD)**.

Entre na pasta do frontend:

```cmd
cd frontend
```

O terminal deverá ficar semelhante a:

```text
(env) C:\Users\...\Documents\LUMINA\frontend>
```

Na primeira vez que o projeto for executado, certifique-se de que as dependências já foram instaladas com:

```bash
npm install
```

Depois, inicie o frontend:

```bash
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

**Não feche esse terminal.** O backend e o frontend precisam permanecer rodando ao mesmo tempo.

### Resumo

Ao final, você deverá ter **dois terminais abertos**:

**Terminal 1 — Backend FastAPI**

```text
(env) C:\Users\...\Documents\LUMINA>
uvicorn main:app --reload

→ FastAPI: http://127.0.0.1:8000
```

**Terminal 2 — Frontend React**

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

Para interromper o backend e o frontend, utilize:

```text
Ctrl + C
```

em cada um dos dois terminais.

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
