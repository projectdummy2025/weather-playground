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
                    content: "Anda adalah asisten ahli meteorologi yang ramah. Tugas Anda adalah menjelaskan data prakiraan cuaca kepada pengguna awam dalam bahasa Indonesia yang mudah dipahami. Berikan ringkasan singkat tentang kondisi cuaca, suhu, dan saran aktivitas atau pakaian yang sesuai. Hindari istilah teknis yang terlalu rumit."
                },
                {
                    role: "user",
                    content: `Tolong jelaskan data cuaca berikut ini untuk lokasi ${weatherData.lokasi.desa || weatherData.lokasi.kecamatan}, ${weatherData.lokasi.kota}: \n\n${JSON.stringify(weatherData.prakiraan[0], null, 2)}`
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
