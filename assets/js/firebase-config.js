// assets/js/firebase-config.js
// =====================================================================
// Konfigurasi Firebase TUNGGAL untuk website interns (dialogika-co CANONICAL).
// Mengikuti standar arsitektur Pilot / Restructuring Dialogika.
// =====================================================================

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDYrzxyQ1oGaVRIdnFfYvjydWZz3xdxpTs",
  authDomain: "dialogika-co.firebaseapp.com",
  projectId: "dialogika-co",
  storageBucket: "dialogika-co.firebasestorage.app",
  messagingSenderId: "664395741941",
  appId: "1:664395741941:web:f20ff01c166e4423d823bc"
};

// Guard agar tidak initializeApp dua kali saat di-import di berbagai modul
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

