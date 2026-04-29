# Interns Module

Dokumentasi singkat perubahan terbaru pada modul rekrutmen internship.

## Perubahan Utama

- Perbaikan bug state konfirmasi WhatsApp onboarding di `internship-candidate-detail.html`.
  - Tombol submit onboarding tidak lagi ikut nonaktif ketika event perubahan field dipicu tanpa perubahan nilai setup.
  - Reset konfirmasi WhatsApp onboarding sekarang hanya terjadi jika setup onboarding (tanggal, waktu, departemen) benar-benar berubah.
- Validasi waktu interview 09.00-18.00 dan mode interview online/offline tetap dipertahankan pada modal interview.
- Card kandidat di `candidate-internship.html` sekarang menampilkan:
  - Jadwal interview dalam format `[Hari], [Tanggal] - [Jam] WIB`.
  - Badge status jadwal (`Upcoming`, `Today`, `Completed`) dengan warna berbeda.
  - Ringkasan interviewer + tooltip nama lengkap.
  - Pembaruan data real-time dengan Firestore `onSnapshot`.

## File Terkait

- `data/candidate-internship.html`
- `data/internship-candidate-detail.html`
- `element/recruitment-interview-utils.js`
- `tests/recruitment-interview-utils.test.mjs`
- `tests/whatsapp-encoding.test.mjs`

## Menjalankan Test

```bash
node tests/whatsapp-encoding.test.mjs
node tests/recruitment-interview-utils.test.mjs
```
