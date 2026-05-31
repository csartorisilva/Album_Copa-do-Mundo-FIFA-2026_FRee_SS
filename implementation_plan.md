# Renomear brasões para códigos ISO

## Objetivo
- Transformar os arquivos atuais em `crests/` (nomeados em português, ex.: `brasão da seleção brasil.png`) em nomes padronizados de três letras ISO (`BRA.png`, `USA.png`, `COL.webp`, …) para que o `crestsMap` em `app.js` funcione corretamente.

## Etapas
1. **Gerar script PowerShell** `rename_crests_iso.ps1` que:
   - Lê cada arquivo em `crests/`.
   - Remove a frase `brasão da seleção` e espaços, converte para minúsculas e elimina acentos.
   - Usa um dicionário de correspondência *português → ISO* (ex.: `brasil` → `BRA`, `colombia` → `COL`, `catar` → `QAT`).
   - Renomeia o arquivo para `<ISO><extensão>` mantendo a extensão original.
   - Ignora arquivos que não correspondam a nenhum país (ex.: logos).
2. **Executar o script**.
3. **Verificar o conteúdo da pasta** para garantir que todos os 44 países têm o nome correto.
4. **Atualizar `crestsMap`** em `app.js` caso algum código ISO falte ou tenha extensão diferente (ex.: `COL.webp`).
5. **Recarregar o app** e confirmar que os brasões aparecem.

## Perguntas abertas
- Algum arquivo na pasta `crests/` não segue o padrão `brasão da seleção <país>` (por exemplo, `Logo CocaZero Copa.webp`)? Deve‑ser mantido sem renomear.

## Aprovação
Aguardo sua confirmação para executar o plano.
