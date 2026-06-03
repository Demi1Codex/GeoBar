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
    { id: 12, name: "Siete Negronis", lat: -33.4300, lon: -70.6318, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 13, name: "Liguria M. Montt", lat: -33.4300, lon: -70.6173, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 14, name: "Bar La Virgen", lat: -33.4301, lon: -70.6175, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 15, name: "Kross Bar Provid.", lat: -33.4234, lon: -70.6122, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 16, name: "Bar La Provid.", lat: -33.4079, lon: -70.5732, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 17, name: "Red2One", lat: -33.4116, lon: -70.6033, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 18, name: "Tamango Bar", lat: -33.3917, lon: -70.5824, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 19, name: "Tramonto Bar", lat: -33.3986, lon: -70.5843, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 20, name: "Zanzibar", lat: -33.3857, lon: -70.5599, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 21, name: "La Batuta", lat: -33.4567, lon: -70.5978, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 22, name: "Bar de René", lat: -33.4480, lon: -70.6270, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 23, name: "Ruca Bar", lat: -33.4470, lon: -70.6270, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 25, name: "Kunstmann Bar", lat: -33.4568, lon: -70.5979, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 26, name: "Rústico BrewPub", lat: -33.5134, lon: -70.7582, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 27, name: "El Late Maipú", lat: -33.5115, lon: -70.7602, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 28, name: "Civilo Restobar", lat: -33.5097, lon: -70.7614, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 30, name: "Bar Vintage", lat: -33.3644, lon: -70.7347, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 31, name: "Club Caribeño", lat: -33.3734, lon: -70.7134, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 32, name: "Donde Ramon", lat: -33.3706, lon: -70.7363, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 33, name: "Calle Calle R.", lat: -33.4019, lon: -70.7128, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 35, name: "Plaza Pub P.Alto", lat: -33.6130, lon: -70.5760, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 36, name: "La Florida Resto", lat: -33.5220, lon: -70.5980, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 37, name: "San Bdo Pub", lat: -33.5920, lon: -70.7050, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 38, name: "Taverna Sur", lat: -33.5500, lon: -70.6500, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 43, name: "The Jazz Corner", lat: -33.4443, lon: -70.6288, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 45, name: "La Oficina Pub", lat: -33.5105, lon: -70.7580, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 50, name: "El Hoyo", lat: -33.4530, lon: -70.6710, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 51, name: "Factoría Franklin", lat: -33.4750, lon: -70.6480, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 52, name: "Uncle Fletch", lat: -33.4245, lon: -70.6135, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 53, name: "Dandee Tobalaba", lat: -33.4210, lon: -70.6010, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 54, name: "H de Hamburgesa", lat: -33.4535, lon: -70.5975, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 55, name: "Club Chocolate", lat: -33.4315, lon: -70.6340, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 56, name: "Borde Río", lat: -33.3865, lon: -70.5615, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 57, name: "Tiramisú EL GOLF", lat: -33.4150, lon: -70.5995, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 58, name: "Resto Pajaritos", lat: -33.4950, lon: -70.7450, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 59, name: "Kross Bar Florida", lat: -33.5240, lon: -70.5970, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 60, name: "Peñalolén Rock", lat: -33.4800, lon: -70.5400, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 61, name: "Macul Gastro", lat: -33.4900, lon: -70.5900, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 62, name: "El Llano Resto", lat: -33.4880, lon: -70.6520, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 63, name: "Gran Avenida Bar", lat: -33.5100, lon: -70.6580, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 64, name: "Chicureo Wine", lat: -33.3050, lon: -70.6750, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
    { id: 65, name: "Lampa Resto", lat: -33.2850, lon: -70.8750, votes: { prendido: 0, vengan: 0, paja: 0 }, lastUpdated: null },
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
