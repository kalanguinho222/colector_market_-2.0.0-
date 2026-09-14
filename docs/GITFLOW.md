# Gitflow, como a gente trabalha nesse repositório

Regra de ouro: **ninguém commita direto na `main`.** A `main` tem que estar sempre
rodando. Se alguém clonar agora, tem que funcionar.

---

## O ciclo, do começo ao fim

```
main  ──●────────────────────●──────>
         \                  /
          ●──●──●──────────●
          sua branch      PR
```

### 1. Atualize a main

Sempre antes de começar. Sua branch tem que nascer do código mais novo:

```bash
git checkout main
git pull
```

### 2. Crie a branch da sua issue

```bash
git checkout -b feat/rota-produtos
```

O nome tem duas partes:

| Prefixo | Quando usar | Exemplo |
|---|---|---|
| `feat/` | coisa nova | `feat/login`, `feat/rota-produtos` |
| `fix/` | consertar algo quebrado | `fix/seletor-responsivo` |
| `docs/` | só documentação | `docs/readme` |

Sem acento, sem espaço, tudo minúsculo, separado por hífen.

### 3. Trabalhe e commite

Commit pequeno e frequente é melhor que um gigante no fim. A mensagem é em português,
no imperativo, dizendo o que o commit faz, e cita a issue:

```bash
git add .
git commit -m "Cria a rota GET /api/produtos (issue #7)"
```

| Boa | Ruim |
|---|---|
| `Cria a rota GET /api/produtos (issue #7)` | `alteracoes` |
| `Corrige o seletor do responsivo (issue #25)` | `agora vai` |
| `Adiciona bcrypt no cadastro (issue #10)` | `commit` |

Se a mensagem precisa de um "e" no meio da frase, provavelmente deviam ser dois commits.

### 4. Mande para o GitHub

```bash
git push -u origin feat/rota-produtos
```

O `-u` só na primeira vez. Depois `git push` puro basta.

### 5. Abra o Pull Request

No GitHub aparece o botão **Compare & pull request**. No corpo do PR escreva, com suas
palavras:

- o que você fez e por quê, em dois ou três parágrafos curtos
- o que ficou faltando, se ficou
- como testar, o comando ou o clique exato
- `Closes #7` na última linha, que é o que **fecha a issue sozinha** quando o PR entrar

Um exemplo de PR bom:

```
Fiz a rota do catálogo, a #7. É um GET /api/produtos que devolve os produtos em JSON,
e aceita ?categoria= e ?precoMax= na URL, que são os mesmos dois filtros que a tela
já tinha no js/index.js.

Se não vier filtro nenhum, devolve tudo. Os valores vão para a query com prepared
statement (aqueles ?), que é o jeito seguro, sem risco de SQL injection.

Para testar sobe o back com npm start e abre localhost:3000/api/produtos?categoria=pokemon,
que tem que voltar os 5 produtos de Pokémon do seed.

Closes #7
```

Repara que ele diz o que faz, de onde veio, e como conferir. Ninguém precisa abrir o
código para entender o PR.

### 6. Espere o review

Eu leio e comento. Se eu pedir mudança, é só commitar na **mesma branch** e dar push.
O PR atualiza sozinho, não precisa abrir outro.

### 7. Depois do merge

```bash
git checkout main
git pull
git branch -d feat/rota-produtos
```

Branch com o trabalho já mergeado só atrapalha. Pode apagar.

---

## Quando der problema

**"Esqueci e commitei na main"**, ainda dá para salvar, se você não deu push:

```bash
git branch feat/minha-coisa     # guarda seu trabalho numa branch
git reset --hard origin/main    # devolve a main ao normal
git checkout feat/minha-coisa   # volta para o seu trabalho
```

**"Deu conflito"**, significa que a mesma linha foi mexida na sua branch e na main.
O git marca assim no arquivo:

```
<<<<<<< HEAD
o que está na main
=======
o que está na sua branch
>>>>>>> feat/sua-branch
```

Você escolhe qual fica (ou junta as duas), **apaga as três linhas de marcação** e
commita. Se ficar em dúvida, chama antes de sair apagando. Arquivo com essas marcações
commitado é código quebrado dentro do repositório.

**"Minha branch está velha"**, a main andou desde que você começou:

```bash
git checkout main
git pull
git checkout feat/sua-branch
git merge main
```

---

## Resumo

```bash
git checkout main && git pull          # 1. atualiza
git checkout -b feat/assunto           # 2. cria a branch
# ... trabalha e testa rodando ...
git add . && git commit -m "Faz X (issue #N)"
git push -u origin feat/assunto        # 3. envia
# 4. abre o PR no GitHub com "Closes #N"
```
