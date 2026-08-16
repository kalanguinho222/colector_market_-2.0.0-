# TASKS

Checklist para seguir na ordem. Marque `[x]` ao concluir. Cada item vira uma issue no
GitHub, e o `Origem:` diz qual arquivo de hoje você tem que abrir antes de começar.

Regra: só avança de fase depois de conseguir **explicar o que a peça anterior faz**.

---

## Fase 0, preparar as pastas e o banco (4)

- [x] Criar `backend/` e `frontend/` e mover o que está em `src/`, sem mudar nada de
      conteúdo. O CSS foi inteiro, os 7 arquivos, do jeito que estão. O dump do banco foi
      para o `backend/`, que é onde ele vira `schema.sql`.
- [x] Renomear `index.HTML` para `index.html` e `singin.html` para `cadastro.html`, e
      corrigir os links que apontam para elas (era o `home.html:41`).
- [ ] Converter o dump para `backend/schema.sql` em SQLite: tira as crases,
      `AUTO_INCREMENT` vira `AUTOINCREMENT`, some com `ENGINE` e `CHARSET`, e aplica as
      quatro correções do README (senha com espaço para o hash, `username UNIQUE`,
      `preco REAL`, `nome TEXT`).
      `Origem: backend/colector_market_b_v2.sql`
- [ ] `backend/seed.js`: os 18 produtos que estão no catálogo viram linha na tabela.
      O `data-categoria` e o `data-preco` de cada `<li>` já são duas das colunas.
      `Origem: frontend/index.html, linhas 103 a 554`

## Fase 1, API de produtos (5)

- [ ] `npm init`, instalar `express` e `better-sqlite3`, e o `server.js` respondendo
      `GET /api/ping` e servindo o `frontend/` como estático.
- [ ] `backend/db.js`: abre o `market.db`, roda o `schema.sql` e liga o
      `PRAGMA foreign_keys = ON`. Exporta a conexão.
- [ ] `GET /api/produtos`, o catálogo em JSON. Aceita `?categoria=` e `?precoMax=`, os
      mesmos dois filtros que a tela já tem.
      `Origem: frontend/js/index.js`
- [ ] `GET /api/produtos/:id`, um produto só. Se não existir, responde 404 em vez de
      quebrar.
- [ ] `backend/testes.http` com as rotas, para testar sempre do mesmo jeito.
      Conforme for criando rota, vai adicionando nesse arquivo.

## Fase 2, cadastro, login e sessão (5)

- [ ] `POST /api/cadastro`, com `bcrypt` para gravar a senha e tratando o erro de
      `username` repetido.
      `Origem: frontend/cadastro.html:34`
- [ ] `POST /api/login`, com `bcrypt.compare` e `express-session`. A sessão guarda o id
      do usuário, nunca a senha.
      `Origem: frontend/login.html:33`
- [ ] `POST /api/logout` e `GET /api/eu`.
- [ ] `backend/middlewares/auth.js`: o `exigeLogin`, que responde 401 quando não tem
      `req.session.usuarioId`.
- [ ] As telas de login e cadastro chamando a API com `fetch`, no lugar do
      `action="/login"` que não existe. Mostrar a mensagem de erro na tela, sem `alert`.

## Fase 3, anunciar de verdade (5)

- [ ] `POST /api/produtos`, protegido pelo `exigeLogin`. O `dono` vem de
      `req.session.usuarioId`, **nunca** de `req.body`.
- [ ] `backend/upload.js` com `multer`: só imagem, limite de tamanho, salva em
      `uploads/` com nome único, e o `server.js` passa a servir `/uploads`.
      `Origem: frontend/postagem.html:29`
- [ ] `PUT /api/produtos/:id`, conferindo o dono antes de gravar e respondendo 403
      quando não for dele.
- [ ] `DELETE /api/produtos/:id`, mesma conferência.
- [ ] A `postagem.html` funcionando: envolver os campos num `<form>` de verdade, criar o
      `js/postagem.js`, e ligar a tela na rota. Hoje o botão "postar" está solto fora de
      form e não faz nada.
      `Origem: frontend/postagem.html:66`

## Fase 4, as telas buscando na API (5)

- [ ] `frontend/js/api.js`, o compartilhado: `api()` em cima do `fetch`, que manda para
      o login no 401, mais `texto()` para escapar o que o usuário digitou e `reais()`
      para formatar o preço.
- [ ] O `index.html` sem os 18 produtos escritos dentro. A lista vem do
      `GET /api/produtos` e o card é montado no JS, com a mesma marcação e as mesmas
      classes de hoje, para o CSS continuar valendo.
      `Origem: frontend/index.html`
- [ ] O filtro passa a pedir para a API (`?categoria=&precoMax=`) em vez de esconder
      `<li>` com classe. O `.mostrar` e o `.esconder` saem do CSS.
      `Origem: frontend/js/index.js`
- [ ] Tela "meus anúncios": lista o que o usuário logado publicou, com botão de editar e
      de apagar.
- [ ] O cabeçalho mostra quem está logado e tem o botão de sair. Deslogado, mostra
      entrar e cadastrar. E a `postagem.html` finalmente ganha um link, hoje nenhuma
      tela leva até ela.

## Fase 5, acabamento (4)

- [ ] Os seletores do `responsivo.css` não batem com o HTML:
      `.container .filtros .categorias-cartas`, `.filtros .preco-cartas` e
      `.filtros .btn-comprar` não existem na página, porque `.preco-cartas` e
      `.btn-filtrar` são irmãos de `.filtros`, não filhos. Metade do arquivo não tem
      efeito nenhum hoje.
      `Origem: frontend/css/responsivo.css:23 e :31`
- [ ] Tirar o `position: absolute` com `top`/`left` em `vw` da home, do login e do
      cadastro. A tela inteira está posicionada no olho e o media query de 1500px só
      reajusta as coordenadas. Refazer no fluxo, com flex.
      `Origem: frontend/css/estilo-home.css:27`
- [ ] Os `<label for="senha">` apontam para inputs que só têm `name`, sem `id`. Clicar
      no rótulo não foca o campo.
      `Origem: frontend/login.html:41, frontend/cadastro.html:42`
- [ ] O preço aceitar vírgula. O filtro usa `parseFloat` num campo de texto, então
      digitar `5.000` vira 5 e `5,00` vira 5.
      `Origem: frontend/js/index.js:28`
