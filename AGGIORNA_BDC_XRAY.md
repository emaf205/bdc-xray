# COMANDO: AGGIORNA BDC X-RAY

Analizza le conversazioni ChatGPT degli **ultimi 7 giorni di calendario**, incluso oggi, fuso Europe/Rome. Utilizza esclusivamente chat e file realmente accessibili in questa sessione: se manca l'archivio integrale, considera i risultati un campione e NON attribuire numeri all'intera cronologia.

1. Ricostruisci, senza duplicati, data, titolo, tema, segnale (idea / revisione / decisione / ostacolo) e sintesi di ogni traccia supportata da evidenze.
2. Calcola solo metriche verificabili: tracce, filoni normalizzati, giorni con tracce, distribuzione giornaliera, temi, revisioni annotate. Non inventare conteggi di messaggi, orari, tempi di lavoro o risultati.
3. Genera 9 schede brevi di insight: titolo di massimo 6 parole, osservazione di massimo 20 parole, riferimenti alle tracce. Distingui MISURA da IPOTESI.
4. Recupera fino a 3 citazioni letterali SOLO quando il testo originale è accessibile; conserva data e riferimento. Nessuna citazione inventata.
5. Escludi dati personali, testi integrali, credenziali, informazioni finanziarie, allegati e dettagli riservati dei clienti: **GitHub e la pagina Cloudflare sono pubblici**.
6. Aggiorna `data/week.json` della repository `emaf205/bdc-xray`, mantenendo lo schema esistente, e aggiorna `index.html` per mostrare le nuove metriche e schede. Verifica che dati, date e cifre coincidano.
7. Crea un commit su `main` e restituisci link al commit con un breve resoconto delle modifiche. Verifica l'eventuale deploy Cloudflare, ma non dichiararlo attivo senza conferma.

**Limite tecnico:** una normale chat non dispone di un'API che scandisce automaticamente tutta la cronologia ChatGPT. Per una copertura esaustiva serve fornire un export aggiornato (es. `conversations.json`); tale archivio si analizza in modo privato e non si pubblica.
