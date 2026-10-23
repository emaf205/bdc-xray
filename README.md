# BDC X-RAY — Osservatorio conversazioni

**Versione pubblicata:** report sintetico del 17–23 ottobre 2026.

- `index.html`: dashboard statica, utilizzabile senza build.
- `data/week.json`: **34 tracce recuperabili** classificate in **24 filoni**, nove schede di intuizioni con evidenze e tre citazioni.
- Le 34 tracce NON rappresentano tutti i messaggi o tutte le chat degli ultimi sette giorni.

## Pubblicare su Cloudflare Pages
Collega `emaf205/bdc-xray` in Cloudflare → Workers & Pages → Create → Pages → Connect to Git. Scegli `main`. Framework: None; build command: lascia vuoto; output directory: `/` (root). Ogni successivo commit su `main` potrà avviare un nuovo deployment dopo che l'integrazione Git è stata attivata.

**Importante:** creare la repository GitHub NON attiva automaticamente Cloudflare. Lo stato del progetto Cloudflare non è verificato.

## Aggiornamenti
Sostituisci `data/week.json` con il dataset della settimana successiva e aggiorna `index.html` se cambiano le statistiche mostrate nella pagina. Il processo al momento non è automatico. L'accesso all'intero archivio ChatGPT richiede un export fornito dall'utente; il contesto delle chat accessibile all'assistente non è una API di scansione completa.

## Pubblicazione responsabile
La repository è pubblica. Non caricare mai `conversations.json`, contenuti integrali di chat, PDF privati, email, informazioni riservate di clienti, token o credenziali. Il dataset corrente contiene note editoriali sintetiche, non gli originali.
