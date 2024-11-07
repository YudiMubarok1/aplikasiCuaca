const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const geocode = require('./utils/geocode');
const forecast = require('./utils/prediksiCuaca');

// Set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));

// Menyajikan file statis
app.use(express.static(path.join(__dirname, '../templates')));
app.use(express.static(path.join(__dirname, '../public')));

// Set partials
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

// Rute
app.get('/', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Yudi Mubarok'
    });
});

// Rute untuk info cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            });
        });
    });
});

//Halaman Berita
app.get("/berita", async (req, res) => {
    try {
        "http://api.mediastack.com/v1/news?access_key=3f3e53fb448d0add3e0a349509cb3b12"
    
  
      const params = {
        access_key: apiKey,
        countries: "id",
      };
  
      const response = await axios.get(urlApiMediaStack, { params });
      const dataBerita = response.data;
  
      res.render("berita", {
        name: "Yudi Mubarok",
        title: "News Update",
        berita: dataBerita.data,
      });
    } catch (error) {
      console.error(error);
      res.render("error", {
        title: "Terjadi Kesalahan",
        pesanKesalahan: "Terjadi kesalahan saat mengambil berita.",
      });
    }
  });

// Rute untuk halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Yudi Mubarok'
    });
});

// Rute untuk halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Bantuan dan Dukungan'
    });
});

// Rute untuk halaman penjelasan
app.get('/penjelasan', (req, res) => {
    res.render('penjelasan', {
        judul: 'Penjelasan Aplikasi Cek Cuaca'
    });
});

// Wildcard route untuk halaman tidak ditemukan
app.get('*', (req, res) => {
    res.render('404', {
        pesanKesalahan: 'Halaman tidak ditemukan.'
    });
});


// Jalankan server
app.listen(port, () => {
    console.log('Server berjalan pada port '+ port);
});
