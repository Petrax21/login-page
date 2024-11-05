const express = require('express');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg'); // Burada Pool'ı içe aktarıyoruz
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // İlgili route dosyasını ekleyin
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('views'));
 // düzelt ömer
const pool = new Pool({
    user: 'pclient',
    host: 'localhost',
    database: 'pclient',
    password: 'pclient',
    port: 5432,
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/views', express.static('views'));

// Routes
app.use('/auth', authRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
