# BDC X-RAY V3 — Conversation Intelligence

Dashboard **mobile-first**, installabile come PWA, basata su HTML/CSS/JavaScript senza dipendenze esterne. Design ad alto contrasto, titoli XXL, numeri molto leggibili.

## Dentro l'app

- **Cruscotto:** indicatori principali, attività giornaliera, categorie, scoperte e citazioni.
- **Scoperte:** schede con ipotesi e riferimenti alle tracce.
- **Atlante:** progetti, filoni e termini ricorrenti, selezionabili.
- **Tracce:** ricerca, filtri per area e segnale, collegamenti alle evidenze.
- **Dati / Export:** import di `conversations.json` o dataset BDC X-RAY; esporta JSON, CSV, grafico SVG e stampa/PDF.

### Dati e limiti

Edizione iniziale: **17–23 ottobre 2026**, **34 tracce** ricostruite, **24 filoni**, **6 giorni con tracce**. Non sono totali di tutte le chat ChatGPT. Le 9 scoperte editoriali contengono riferimenti interni; alcune sono inferenze, non fatti dimostrati.

Il file `data/week.json` contiene solo estratti e sintesi selezionati per una pubblicazione **pubblica**. Non aggiungere archivi, testi integrali, credenziali o informazioni riservate a GitHub.

L'import locale di `conversations.json` usa esclusivamente il browser: niente upload, niente salvataggio persistente, niente API esterne. Importa messaggi **utente e assistente** relativi agli ultimi 7 giorni nel fuso Europe/Rome, mostrando anche il conteggio chat. Argomenti e segnali derivati dal testo sono **euristici** e possono richiedere correzione. Per un ZIP dell'export, estrai prima `conversations.json`.

## Test

```bash
npm test
```

Controlla validità del dataset, periodo, riferimenti, privacy di base, file essenziali, sintassi JavaScript e rendering delle cinque schermate.

## Pubblicare su Cloudflare Pages

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Repository `emaf205/bdc-xray`; production branch `main`.
3. Framework **None**; Build command `npm test`; Build output directory `.` (radice del repository).
4. **Save and Deploy**. Dopo l'associazione Cloudflare ricostruirà automaticamente il sito a ogni commit su `main`.

**Nota:** il collegamento all'account Cloudflare è un'operazione separata; non è verificato da questa repository. Vedi la guida Cloudflare: https://developers.cloudflare.com/pages/get-started/git-integration/

## Aggiornamento con un comando

Usa [AGGIORNA_BDC_XRAY.md](./AGGIORNA_BDC_XRAY.md). L'analisi aggiorna `data/week.json`, mantenendo il codice dell'interfaccia stabile. L'aggiornamento può essere attivato dall'utente, **non** da una presunta API di lettura automatica di tutta la cronologia ChatGPT. Per dati esaustivi usa un nuovo export fornito esplicitamente.

## Struttura

```
index.html
data/week.json
assets/main.css
assets/responsive.css
assets/data.js
assets/views.js
assets/app.js
app.webmanifest
sw.js
icons/icon.svg
scripts/verify.mjs
AGGIORNA_BDC_XRAY.md
```

Licenza: progetto personale. `noindex` predefinito per ridurre l'indicizzazione di dati sulle conversazioni.
