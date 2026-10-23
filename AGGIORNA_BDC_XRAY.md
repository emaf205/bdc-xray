# COMANDO — AGGIORNA BDC X-RAY (SETTIMANA MOBILE)

**Attivazione:** esegui integralmente questo processo nella sessione corrente. Non chiedere autorizzazioni già concesse. Non pubblicare archivi personali.

**Destinazione GitHub:** `emaf205/bdc-xray` · branch `main` · file `data/week.json`. L'app è statica: quando Cloudflare Pages è collegato a GitHub, ogni nuovo commit può innescare il deploy.

## FASE 1 — COPERTURA REALE

Determina gli ultimi **7 giorni di calendario**, compreso oggi, nel fuso **Europe/Rome**. Usa fonti realmente disponibili: conversazioni accessibili, documenti forniti ed eventualmente il file `conversations.json` che l'utente ha caricato **esplicitamente**. Non dichiarare mai di aver scandito tutta la cronologia ChatGPT se non è realmente disponibile.

Se il dataset è incompleto, dichiara `"status":"partial"`. Se non ci sono abbastanza dati per un'analisi utile, non sostituire il report precedente con dati inventati; segnala il limite.

## FASE 2 — ESTRARRE, SENZA INVENTARE

Per ogni traccia documentata raccogli ID, data, argomento, titolo breve, sintesi, categoria e segnale. Rimuovi i duplicati. Usa categorie coerenti con quelle già in `data/week.json`. Classifica i segnali come `idea`, `revisione`, `decisione`, `ostacolo` o `altro` soltanto quando il testo li supporta; altrimenti `altro`.

Calcola: tracce, filoni, giorni con tracce, picco, distribuzione giornaliera, categorie, progetti e segnali. Se è disponibile `conversations.json`, puoi derivare anche conteggi reali di chat e messaggi, ma **non pubblicare l'archivio**.

Scrivi fino a 9 **schede-scoperta**: titolo < 7 parole, osservazione < 25 parole, evidenze puntuali (`Txxx`) e natura (`MISURA`, `INFERENZA`, `IPOTESI`, `LIMITE`). Usa fino a 3 citazioni **letterali verificabili**, con data ed evidenza. Non inventare parole attribuite all'utente.

## FASE 3 — PRIVACY E QUALITÀ

La repository e il sito possono essere pubblici. Rimuovi prima dell'upload: testi integrali, nominativi di terzi, informazioni riservate dei clienti, indirizzi email, recapiti, codici, nomi di account, credenziali, documenti confidenziali, allegati e dati sanitari.

Aggiorna unicamente il dataset pubblico strutturato `data/week.json`, mantenendo le chiavi `schema`, `period` (`start`, `end`), `status`, `note`, `updated`, `records`, `insights`, `quotes`, `links`. Verifica riferimenti, giorni, totali e formato JSON. **Non modificare l'interfaccia** se non strettamente necessario.

Esegui `npm test` se disponibile, oppure verifica staticamente lo stesso set di vincoli. In caso di errori, non pubblicare.

## FASE 4 — GITHUB → CLOUDFLARE

Crea un commit descrittivo su `main`. Verifica che `data/week.json` sia effettivamente cambiato. Se Cloudflare Pages è collegato, verifica l'esito del deployment; altrimenti indica chiaramente che **la pubblicazione del sito non è stata verificata**. Consegna soltanto: periodo, copertura, novità principali, link al commit e stato del deploy.

**Limite operativo:** nessun prompt può accedere autonomamente e integralmente a ogni vecchia chat ChatGPT; per una scansione esaustiva serve l'esportazione aggiornata fornita dall'utente o una fonte integrata autorizzata.
