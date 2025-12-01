const { OpenRouter } = require("@openrouter/sdk");
require('dotenv').config();

// Initialize OpenRouter client
const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Explains the weather forecast using AI.
 * @param {Object} weatherData - The weather data object to explain.
 * @returns {Promise<string>} - The explanation text.
 */
async function explainWeather(weatherData) {
    try {
        if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('YOUR_API_KEY')) {
            throw new Error('OpenRouter API Key is missing or invalid.');
        }

        const completion = await client.chat.send({
            model: "openai/gpt-oss-20b:free",
            messages: [
                {
                    role: "system",
                    content: "Anda adalah asisten cuaca yang cerdas dan peduli. Tugas Anda adalah menyajikan prakiraan cuaca dengan format yang jelas dan bermanfaat.\n1. **Buat tabel perbandingan cuaca ringkas untuk 3 hari ke depan.** Tabel harus berisi kolom: Hari, Kondisi Cuaca (misal: Cerah Berawan), Suhu (rata-rata atau rentang), dan Kelembapan (rata-rata atau rentang).\n2. **Setelah tabel, tulis narasi paragraf. Gunakan format waktu 24 jam (misal: pukul 14.00, bukan 2 PM).** Jelaskan apa arti data tersebut untuk beberapa hari ke depan, soroti hal-hal penting yang perlu diwaspadai (misalnya, potensi hujan lebat di sore hari atau suhu yang sangat panas), dan tutup dengan saran yang hangat dan praktis agar pengguna bisa menjaga diri dan beraktivitas dengan nyaman."
                },
                {
                    role: "user",
                    content: `Tolong jelaskan data cuaca berikut ini untuk lokasi ${weatherData.lokasi.desa || weatherData.lokasi.kecamatan}, ${weatherData.lokasi.kota}: \n\n${JSON.stringify(weatherData.prakiraan, null, 2)}`
                }
            ]
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error in AI service:", error);
        throw new Error("Gagal mendapatkan penjelasan AI: " + error.message);
    }
}

module.exports = { explainWeather };
