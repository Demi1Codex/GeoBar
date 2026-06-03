const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// BASE DE DATOS INICIAL (Memoria)
let bars = [
    { id: 1, name: "La Piojera", lat: -33.4336, lon: -70.6521, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 2, name: "Liguria Lastarria", lat: -33.4385, lon: -70.6405, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 3, name: "Bocanáriz", lat: -33.4383, lon: -70.6412, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 4, name: "Chipe Libre", lat: -33.4383, lon: -70.6414, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 5, name: "Bar Berri", lat: -33.4388, lon: -70.6402, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 6, name: "Cervecería Nac.", lat: -33.4391, lon: -70.6398, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 7, name: "Bar El Tunel", lat: -33.4344, lon: -70.6548, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 8, name: "Bar Loreto", lat: -33.4312, lon: -70.6385, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 9, name: "Bar Constitución", lat: -33.4263, lon: -70.6348, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 10, name: "Kross Bar Bella", lat: -33.4318, lon: -70.6351, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 11, name: "Patio Bellavista", lat: -33.4332, lon: -70.6358, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 55, name: "Club Chocolate", lat: -33.4315, lon: -70.6340, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
];

// ENDPOINTS
app.get('/bars', (req, res) => {
    res.json(bars);
});

app.post('/vote', (req, res) => {
    const { barId, type } = req.body;
    const bar = bars.find(b => b.id === barId);
    if (bar) {
        bar.votes[type]++;
        bar.lastUpdated = Date.now();
        console.log(`Voto registrado en ${bar.name}: ${type}`);
        res.json({ success: true, bar });
    } else {
        res.status(404).json({ success: false, message: "Bar no encontrado" });
    }
});

app.get('/status', (req, res) => {
    const summary = bars.map(b => ({
        name: b.name,
        votes: b.votes,
        total: b.votes.prendido + b.votes.vengan + b.votes.paja
    }));
    res.json(summary);
});

app.post('/reset-votes', (req, res) => {
    bars = bars.map(bar => ({ ...bar, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null }));
    console.log(" Votos limpiados manualmente.");
    res.json({ success: true, message: "Votos limpiados" });
});

// RESET DE USUARIOS (permite votar de nuevo en bares ya votados)
let userResetTimestamp = Date.now();

app.post('/user-reset', (req, res) => {
    userResetTimestamp = Date.now();
    console.log(" Reset de usuarios ejecutado. Las apps limpiaran sus votos locales.");
    res.json({ success: true, timestamp: userResetTimestamp, message: "Reset de usuarios ejecutado" });
});

app.get('/user-reset-timestamp', (req, res) => {
    res.json({ timestamp: userResetTimestamp });
});

// AUTO-RESET CADA 3 HORAS
const THREE_HOURS = 3 * 60 * 60 * 1000;
setInterval(() => {
    bars = bars.map(bar => ({ ...bar, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null }));
    console.log(" Votos auto-limpiados (cada 3 horas)");
}, THREE_HOURS);

app.post('/removevote', (req, res) => {
    const { barId, type } = req.body;
    const bar = bars.find(b => b.id === barId);
    if (bar && bar.votes[type] > 0) {
        bar.votes[type]--;
        bar.lastUpdated = Date.now();
        console.log(`Voto eliminado en ${bar.name}: ${type}`);
        res.json({ success: true, bar });
    } else {
        res.json({ success: false, message: "Voto no encontrado" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  🚀 SERVIDOR GEOBAR ACTIVO
  -------------------------
  Puerto: ${PORT}
  IP Local: http://0.0.0.0:${PORT}
  -------------------------
  Esperando votos de los celulares...
  `);
});
