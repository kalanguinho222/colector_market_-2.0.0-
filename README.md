# Colector Market

Marketplace de itens de coleção: cartas de Pokémon, Yu-Gi-Oh!, Magic e colecionáveis em
geral. Cada usuário cria a conta dele, anuncia o que tem para vender e o anúncio aparece
no catálogo para todo mundo, com filtro por categoria e por preço.

> **Proposta:** o front-end já está feito e funcionando. O que não existe é o back-end.
> A gente vai construir ele do zero em **Node.js + Express + SQLite**, criar a API,
> e ligar as telas que já existem nessa API. O HTML, o CSS e o visual continuam os
> mesmos, ninguém vai reescrever tela.
>
> **Sem compra e sem pagamento.** O sistema é de anúncio: quem quiser o item combina
> por fora. Isso é escolha de escopo, não esquecimento.

---

## Por que fazer isso

Abre o `frontend/index.html` e desce até a linha 107. Ali começa o primeiro produto, o
Charizard. São 25 linhas de HTML: a imagem, o nome, a categoria, o preço e o botão.
Depois vem o próximo, e o próximo, dezoito vezes. O arquivo tem 572 linhas e mais de
400 são produto escrito na mão.

Agora responde: como um usuário anuncia uma carta nesse site hoje?

Ele não anuncia. Alguém tem que abrir o `index.html` no editor, copiar um bloco de 25
linhas, trocar o nome, o preço, a categoria, o caminho da imagem, salvar e subir o
arquivo de novo. O site não é um marketplace, é uma vitrine de papel.

É esse buraco que o back-end fecha. Quando o produto vier do banco, anunciar vira
preencher um formulário, e o `index.html` deixa de ter produto dentro dele.

Tem uma segunda razão, que dá para ver no próprio código:

- A `postagem.html` (a tela de criar produto) está pronta, bonita, e **não faz nada**.
  O botão "postar" não está dentro de um `<form>`, não tem `action` e não tem JS. Clicar
  não acontece nada.
- Ninguém consegue chegar na `postagem.html`. Nenhuma das cinco telas tem link para ela.
- O `login.html` manda o formulário para `/login` e o `cadastro.html` para `/cadastro`.
  Os dois endereços foram escolhidos certos, só que não existe ninguém do outro lado
  para responder. Clicar em "login" hoje dá erro do navegador.
- O banco `colector_market_b_v2.sql` está modelado com as colunas certas (`nome`,
  `preco`, `categoria`, `img`, `dono`) e nunca é lido por nada.

Ou seja: metade do trabalho de pensar o sistema já foi feita. Falta a metade que roda.

---

## Progresso

`█░░░░░░░░░░░░░░░░░` **7%**, 2/28 issues concluídas

| Fase | Foco | Progresso |
|---|---|---|
| 0 | Preparar as pastas e o banco | 50% (2/4) |
| 1 | API de produtos | 0% (0/5) |
| 2 | Cadastro, login e sessão | 0% (0/5) |
| 3 | Anunciar de verdade (upload e dono) | 0% (0/5) |
| 4 | As telas buscando na API | 0% (0/5) |
| 5 | Acabamento e o que está quebrado | 0% (0/4) |

> O progresso oficial fica nos **Milestones** do GitHub, a barra sobe sozinha quando a
> issue fecha. A tabela aqui é um retrato, atualizado de vez em quando.

---

## As fases

| Fase | O que entra | O que você aprende |
|---|---|---|
| **0** | Separar `backend/` e `frontend/`, traduzir o banco de MySQL para SQLite | Organização de projeto e SQL de criação de tabela |
| **1** | As rotas do catálogo: listar, buscar um, filtrar | Uma API REST inteira com o que já vimos em aula |
| **2** | Cadastro com senha protegida, login, logout, middleware | Hash de senha, sessão, 401 e 403 |
| **3** | Criar, editar e apagar anúncio, com imagem | Upload de arquivo e por que o dono vem da sessão |
| **4** | Cada tela buscando os dados na API | `fetch`, montar HTML com dado do banco, e por que escapar texto |
| **5** | Consertar o que nunca funcionou | Testar o caso que dá errado, não só o que dá certo |

A ordem importa. A Fase 3 depende do login da Fase 2, porque sem saber quem está
logado não dá para gravar o `dono` do anúncio. E a Fase 4 depende das rotas existirem.

---

## A ideia da arquitetura

Hoje o projeto tem **uma camada só**: o HTML é a tela, é o dado e é o banco ao mesmo
tempo. O Charizard está escrito dentro do arquivo que desenha o Charizard. Não dá para
mudar o preço sem mexer na marcação, nem listar produto sem abrir o navegador.

```
HOJE                                DEPOIS

navegador                           navegador
    |                                   |  fetch (JSON)
    | abre o arquivo                    v
    v                               backend/   regra e banco, sem HTML
index.html                              |
(marcação + os 18                       v
 produtos escritos                   SQLite
 na mão)
                                    frontend/  HTML, CSS e JS, sem SQL
```

Três camadas com fronteira clara:

| Camada | Onde | Responsabilidade | Nunca faz |
|---|---|---|---|
| Front | `frontend/` | Montar a tela, ouvir o clique, chamar a API | Falar com o banco, decidir regra |
| Back | `backend/` | Validar, aplicar regra, falar com o banco | Gerar HTML |
| Banco | `market.db` | Guardar e garantir integridade | Ter regra de negócio |

O `server.js` não vai ter regra nenhuma, de propósito. Ele sobe o Express, serve o
`frontend/` como estático e pendura as rotas. Se um `if` de negócio aparecer lá dentro,
o arquivo começa a crescer e daqui a pouco a gente tem um `index.html` de novo, só que
em JavaScript.

Como o Express serve o front, tudo roda na mesma origem: o site abre em
`localhost:3000` e a API responde em `localhost:3000/api/...`. É isso que faz o cookie
de sessão funcionar e é por isso que não vai precisar de CORS. Abrir o HTML direto do
disco com dois cliques não vai funcionar depois da Fase 1, e isso é esperado.

---

## O banco

Duas tabelas, a mesma modelagem do `colector_market_b_v2.sql`, com quatro correções.

```
usuario                        produto
-------                        -------
id                             id_produto
username  UNIQUE               nome
senha     (hash bcrypt)        preco       REAL
                               categoria
                               img
                               dono   ──>  usuario.id
```

**As quatro correções em relação ao MySQL:**

1. `senha varchar(20)` guardava a senha em texto puro, e em 20 caracteres não cabe hash
   nenhum. A coluna cresce e só o hash do bcrypt entra nela. Senha em texto no banco é
   o primeiro problema que um jurado da feira vai procurar.
2. `username` ganha `UNIQUE`. Sem isso dá para cadastrar dois usuários com o mesmo nome
   e o login não sabe qual é qual.
3. `preco float` vira `REAL` e o front sempre manda ponto, nunca vírgula. Float de banco
   MySQL com dinheiro dá 4999.9998 na tela.
4. `nome varchar(23)` era um limite escolhido no chute, e o próprio catálogo tem título
   que não cabe. Passa a `TEXT`.

E a `FOREIGN KEY` de `dono` só vale de verdade com `PRAGMA foreign_keys = ON` no
`db.js`. O SQLite aceita a declaração e não fiscaliza nada se você esquecer essa linha.

Os 18 produtos que estão no `index.html` viram o `seed.js`. Cada `<li class="carta">`
já tem `data-categoria` e `data-preco`, que são exatamente duas colunas da tabela. O
catálogo atual é o gabarito: quando a tela montada pela API ficar igual à estática, a
Fase 4 está certa.

---

## A API

Dez rotas, e é isso.

| Rota | O que faz | Precisa de login |
|---|---|---|
| `GET /api/produtos` | catálogo, aceita `?categoria=` e `?precoMax=` | não |
| `GET /api/produtos/:id` | um produto | não |
| `POST /api/produtos` | cria o anúncio, com imagem | sim |
| `PUT /api/produtos/:id` | edita, só o dono | sim |
| `DELETE /api/produtos/:id` | apaga, só o dono | sim |
| `GET /api/produtos?dono=eu` | os anúncios de quem está logado | sim |
| `POST /api/cadastro` | cria a conta, senha com bcrypt | não |
| `POST /api/login` | confere a senha e abre a sessão | não |
| `POST /api/logout` | encerra a sessão | não |
| `GET /api/eu` | quem está logado | não |

Duas regras que valem para todas elas, desde a primeira linha:

**Prepared statement sempre.** O valor vai com `?`, nunca colado na string da query.
`db.prepare('SELECT * FROM produto WHERE categoria = ?').all(categoria)`. Concatenar
o que o usuário digitou dentro do SQL é SQL injection.

**O dono vem da sessão, nunca do corpo do pedido.** Se a rota ler `dono` de
`req.body`, qualquer pessoa anuncia no nome de qualquer outra. O valor confiável é o
`req.session.usuarioId`, porque foi o servidor que gravou.

---

## Estrutura proposta

```
colector_market/
├── backend/           o servidor Node: rotas, regras e banco
│   ├── server.js      sobe o Express, serve o front, pendura as rotas
│   ├── db.js          abre o SQLite, liga as FKs, roda o schema
│   ├── schema.sql     CREATE TABLE IF NOT EXISTS, roda toda vez sem apagar nada
│   ├── seed.js        os 18 produtos do catálogo atual
│   ├── upload.js      multer, salva a imagem do anúncio
│   ├── routes/        auth.js e produtos.js
│   └── middlewares/   exigeLogin
├── frontend/          as telas de hoje, no lugar certo
│   ├── index.html     catálogo, agora sem produto escrito dentro
│   ├── home.html  login.html  cadastro.html  postagem.html
│   ├── css/           os 7 arquivos que você escreveu, sem reescrever
│   ├── js/            api.js compartilhado, e um arquivo por tela
│   └── imagens/
├── uploads/           as imagens que os usuários mandarem
├── docs/
└── README.md
```

O `css/` não é reescrito. As telas mantêm os mesmos nomes de classe. O que muda é
**onde cada coisa mora**, não como ela é.

As duas pastas já existem: o que estava em `src/` foi para o `frontend/`, e o dump do
banco para o `backend/`. O que está listado dentro do `backend/` aí em cima é o que
ainda não existe, e cada linha daquelas é uma tarefa.

Na mudança entraram duas renomeações, as duas por motivo prático:

- `index.HTML` virou `index.html`. No Mac e no Windows tanto faz a caixa da letra, mas
  no Linux (que é onde qualquer servidor roda) `index.HTML` e `index.html` são dois
  arquivos diferentes. O `home.html` já chamava `location.href='index.html'`, então isso
  ia quebrar na primeira vez que o projeto saísse da máquina de quem escreveu.
- `singin.html` virou `cadastro.html`. A tela é de cadastro, e "singin" nem é a escrita
  certa de "sign in".

---

## Como contribuir

1. Escolha uma tarefa no [TASKS.md](docs/TASKS.md) (ou uma issue aberta) e se atribua
   a ela, para ficar registrado o que está em andamento.
2. Antes de escrever qualquer linha, abra a tela ou o arquivo que a tarefa cita e
   entenda o que ele faz hoje. O que já existe é o gabarito do que a API tem que
   devolver.
3. Saia sempre da `main` atualizada. Branch nascida de base velha é o que mais deu
   dor de cabeça nos outros projetos. Veja o [GITFLOW.md](docs/GITFLOW.md).
4. Implemente e **teste rodando o sistema de verdade**, não só lendo o código. Sobe o
   servidor, abre a tela, clica no botão.
5. Antes de commitar, olhe o `git diff --stat`. Se aparecer arquivo que você não mexeu,
   pare e veja o que aconteceu.
6. Abra o PR com `Closes #N` na última linha.

E a regra que vale mais que todas: **não passe para a próxima tarefa sem saber
explicar, em voz alta, o que a anterior faz.** Se não consegue explicar, não entendeu
ainda, volta e olha de novo.

---

## Como rodar

Precisa só de Node.js. Não tem build, não tem framework, não tem bundler.

```bash
cd backend
npm install
npm run seed     # cria o banco e põe os 18 produtos do catálogo
npm start        # http://localhost:3000
```

Abra **http://localhost:3000**. O Express serve a pasta `frontend/`, então o `/` cai no
`frontend/index.html` e a API responde no mesmo endereço, em `/api/...`.

O `market.db` e o conteúdo de `uploads/` não são versionados. Cada um tem o seu banco
local, e o `npm run seed` recria ele quando precisar.

**Requisitos:** Node 20 ou mais novo.
