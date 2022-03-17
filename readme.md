## DOKUMENTASI

### Requirements Sebelum Instalasi

- Install nodejs
- Install sqlserver

### Instalasi Utama

- Pertama, ambil repositori ini dan lakukan instalasi.

```bash
  $ git clone https://github.com/rans0/u-store-laravel.git
  $ cd u-store-laravel
  $ composer install
```

- Setelah selesai, hasilkan sebuah _key_ khusus untuk Laravel, sebelumnya copy **.env.example** menjadi **.env** terlebih dahulu.

```bash
    $ php artisan key:generate
```

- Lanjut untuk lakukan setting pada Database yang digunakan

1. Copy file .env.example menjadi .env
2. Lalu sesuaikan value .env untuk koneksi ke database yang anda punya

```
    DB_DATABASE=isi dengan nama database
    DB_USERNAME=root
    DB_PASSWORD=
```

- Lanjut lakukan migrasi database dan melakukan seeding data ke database

```bash
    $ php artisan migrate:fresh --seed
```

- Setelah semua tahap dilakukan, untuk menjalankan website ketikan perintah dibawah ini

```bash
    $ php artisan serve
```

### Daftar List Route Utama

```
    /
    /login
    /about-us
    /catalogue
    /logout
    /admin/home
```
