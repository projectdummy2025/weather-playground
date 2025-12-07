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
                    content: `Anda adalah asisten cuaca pribadi yang efisien. Tugas Anda adalah menganalisis data cuaca dan memberikan ringkasan yang dapat ditindaklanjuti (actionable insights).
JANGAN gunakan bahasa puitis. Gunakan bahasa yang jelas, padat, dan langsung pada intinya.
Output HARUS berupa JSON valid (raw JSON, tanpa markdown block) dengan struktur berikut:
{
  "morning": { "condition": "Ringkasan cuaca pagi (06:00-11:00)", "action": "Saran aktivitas/pakaian" },
  "afternoon": { "condition": "Ringkasan cuaca siang (12:00-15:00)", "action": "Saran aktivitas/pakaian" },
  "evening": { "condition": "Ringkasan cuaca sore (16:00-18:00)", "action": "Saran aktivitas/pakaian" },
  "night": { "condition": "Ringkasan cuaca malam (19:00-05:00)", "action": "Saran aktivitas/pakaian" }
}
Pastikan saran yang diberikan spesifik dan berguna (contoh: "Bawa payung", "Hindari jemur pakaian").`
                },
                {
                    role: "user",
                    content: `Analisis data cuaca berikut untuk lokasi ${weatherData.lokasi.desa || weatherData.lokasi.kecamatan}, ${weatherData.lokasi.kota}: \n\n${JSON.stringify(weatherData.prakiraan, null, 2)}`
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
