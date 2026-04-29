import assert from "node:assert/strict";
import {
    normalizeWhatsappMessage,
    encodeWhatsappMessage,
    normalizeWhatsappNumber,
    buildWhatsappDeepLink,
    hasReplacementCharacter
} from "../element/whatsapp-encoding.js";

function runTest(name, fn) {
    try {
        fn();
        console.log("[PASS]", name);
    } catch (error) {
        console.error("[FAIL]", name);
        throw error;
    }
}

runTest("normalizeWhatsappMessage menormalkan line break ke LF", () => {
    const input = "Baris 1\r\nBaris 2\rBaris 3";
    const output = normalizeWhatsappMessage(input);
    assert.equal(output, "Baris 1\nBaris 2\nBaris 3");
});

runTest("normalizeWhatsappMessage mempertahankan replacement character", () => {
    const output = normalizeWhatsappMessage("Semangat ya �");
    assert.equal(output, "Semangat ya �");
});

runTest("encodeWhatsappMessage melakukan URL encoding teks umum", () => {
    const encoded = encodeWhatsappMessage("A B");
    assert.equal(encoded, "A%20B");
});

runTest("encodeWhatsappMessage aman untuk surrogate tidak berpasangan", () => {
    const malformed = "Tes " + String.fromCharCode(0xD83E);
    const encoded = encodeWhatsappMessage(malformed);
    assert.ok(encoded.includes("%EF%BF%BD"));
});

runTest("normalizeWhatsappNumber menormalkan format nomor Indonesia", () => {
    assert.equal(normalizeWhatsappNumber("0812-3456-7890"), "6281234567890");
    assert.equal(normalizeWhatsappNumber("+62 812 3456 7890"), "6281234567890");
});

runTest("buildWhatsappDeepLink membentuk URL wa.me dengan pesan ter-encode", () => {
    const link = buildWhatsappDeepLink("081234567890", "Halo kandidat");
    assert.equal(link, "https://wa.me/6281234567890?text=Halo%20kandidat");
});

runTest("buildWhatsappDeepLink tetap meng-encode replacement character", () => {
    const link = buildWhatsappDeepLink("081234567890", "Halo �");
    assert.equal(link, "https://wa.me/6281234567890?text=Halo%20%EF%BF%BD");
});

runTest("hasReplacementCharacter mendeteksi karakter rusak", () => {
    assert.equal(hasReplacementCharacter("Halo �"), true);
    assert.equal(hasReplacementCharacter("Halo kandidat"), false);
});

console.log("Semua test whatsapp-encoding lulus.");
