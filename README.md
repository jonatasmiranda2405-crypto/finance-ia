# Finance IA — Controle Financeiro Pessoal

Aplicação web completa de controle de renda e finanças pessoais, em português do Brasil: receitas, despesas, categorias, orçamentos, metas, gráficos e análise por IA.

## Como o app funciona

Este é um site **100% front-end** (HTML + CSS + JavaScript puro, sem servidor/backend). Isso significa:

- ✅ Funciona em qualquer hospedagem de arquivos estáticos, de graça (GitHub Pages, Netlify, Vercel, etc).
- ✅ Cada visitante tem sua própria conta e seus próprios dados, salvos no **localStorage do navegador dele**.
- ⚠️ Não existe um banco de dados central. Os dados de um usuário **não** aparecem para outro, nem são visíveis para você em nenhum painel externo — eles moram apenas no navegador de quem usou o site.
- ⚠️ Limpar os dados do navegador (ou trocar de aparelho/navegador) apaga o acesso àquela conta.
- ⚠️ O envio de e-mail de verificação/recuperação de senha é **simulado**: o código aparece na própria tela em vez de ser enviado por e-mail de verdade (veja a seção "Ativar e-mail real" abaixo).
- ⚠️ A **Análise por IA** e o **chat financeiro** chamam a API da Anthropic diretamente do navegador. Isso só funciona dentro do ambiente de artifacts do Claude.ai. Publicado como site próprio, essas duas funcionalidades vão mostrar um aviso pedindo configuração de backend (veja "Ativar IA real" abaixo).

## Estrutura do projeto

```
finance-ia/
├── index.html      → estrutura da página
├── css/style.css   → todo o visual (tema, cores, layout)
├── js/app.js       → toda a lógica (autenticação, dados, gráficos, IA)
└── README.md       → este arquivo
```

Simples assim — só 3 arquivos de verdade. Qualquer alteração de texto, cor, funcionalidade ou regra de negócio é feita editando `css/style.css` e `js/app.js`.

---

## Publicar no GitHub Pages (passo a passo)

1. **Crie um repositório no GitHub** (github.com → "New repository"), por exemplo `finance-ia`. Pode ser público.
2. **Suba os arquivos deste projeto** para o repositório. Duas formas:
   - **Pelo navegador (mais fácil):** na página do repositório vazio, clique em "uploading an existing file", arraste as pastas `css`, `js` e o arquivo `index.html`, e clique em "Commit changes".
   - **Pelo terminal (git):**
     ```bash
     cd finance-ia
     git init
     git add .
     git commit -m "Primeira versão do Finance IA"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/finance-ia.git
     git push -u origin main
     ```
3. No repositório, vá em **Settings → Pages**.
4. Em "Source", selecione a branch `main` e a pasta `/ (root)`. Clique em **Save**.
5. Em alguns minutos, o GitHub mostra o link do site publicado, algo como:
   `https://SEU-USUARIO.github.io/finance-ia/`
6. Esse é o link que você compartilha com outras pessoas.

## Como atualizar o site depois de publicado

Sempre que quiser mudar algo (texto, cor, nova funcionalidade):

1. Edite os arquivos localmente (ou peça para eu editar e te devolver os arquivos atualizados).
2. Rode:
   ```bash
   git add .
   git commit -m "Descreva o que mudou"
   git push
   ```
3. O GitHub Pages atualiza o site automaticamente em 1–2 minutos. Não precisa reconfigurar nada.

> Dica: sempre que eu (Claude) fizer uma alteração no app para você, basta substituir os arquivos `index.html`, `css/style.css` e/ou `js/app.js` pelos novos, e repetir o `git add / commit / push` acima.

---

## Ativar e-mail real (opcional)

Hoje o código de verificação aparece na tela. Para enviar de verdade, o caminho mais simples sem precisar de backend é o **EmailJS** (emailjs.com, tem plano grátis):

1. Crie conta no EmailJS e conecte seu provedor de e-mail (Gmail, Outlook, etc.) → gera um **Service ID**.
2. Crie um template de e-mail com variáveis `{{to_email}}`, `{{user_name}}` e `{{code}}` → gera um **Template ID**.
3. Copie sua **Public Key** em Account → General.
4. Me envie os 3 valores (Service ID, Template ID, Public Key) e eu integro o envio real de e-mail no `js/app.js`, substituindo a tela que mostra o código.

## Ativar a Análise por IA fora do Claude (opcional, requer backend)

Para a análise por IA e o chat funcionarem em um site publicado, é necessário:

1. Uma chave de API da Anthropic (console.anthropic.com).
2. Um pequeno backend (ex: uma função serverless na Vercel/Netlify) que recebe a pergunta do navegador, chama a API da Anthropic com a chave guardada em segredo no servidor, e devolve a resposta. **A chave de API nunca deve ficar exposta no código do navegador.**

Se quiser, posso te ajudar a montar essa função serverless quando for a hora — é um projeto separado e pequeno (poucas linhas de código em Node.js).

---

## Painel administrador (uso local/teste)

Na tela de login existe o link **"Acesso administrador"**. Ele lista as contas cadastradas no navegador atual, permite verificar contas manualmente e "entrar como" qualquer usuário — útil para testes, já que cada navegador só enxerga os próprios dados.

A senha do admin não fica em texto puro no código — é guardada como hash SHA-256, na constante `ADMIN_PASSWORD_HASH` no início do `js/app.js`. Para trocar a senha no futuro:

1. Abra o site publicado (ou o `index.html` localmente) e abra o Console do navegador (F12 → aba "Console").
2. Rode: `await sha256('sua-nova-senha')` e copie o resultado (uma sequência de letras/números).
3. Substitua o valor de `ADMIN_PASSWORD_HASH` no `js/app.js` por esse novo hash.
4. Salve, faça commit e push — pronto, a senha mudou.
