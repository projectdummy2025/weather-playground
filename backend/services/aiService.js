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
                    content: "Anda adalah asisten cuaca yang cerdas dan peduli. Tugas Anda adalah menyajikan prakiraan cuaca dalam bentuk narasi emosional yang menenangkan, seperti cerita dari seorang narator radio. Format harus berupa paragraf naratif yang mengalir, tanpa tabel, daftar atau poin-poin.\n1. **Fokuslah pada pendekatan storytelling yang human-centered dan menenangkan.** Gunakan bahasa yang puitis dan menggambarkan perasaan serta suasana hati yang dibawa oleh cuaca.\n2. **Gunakan format naratif emosional dalam bentuk paragraf tunggal yang utuh.** Gambarkan suasana seperti contoh: \"Kemayoran memasuki akhir pekan dengan selimut awan yang menyelubungi langit sejak siang. Meski hujan tipis sesekali mampir, hari berjalan tenang tanpa badai besar. Pada Minggu sore, cahaya yang meredup mungkin disertai guruh, namun semuanya berlalu cepat. Cuaca beberapa hari ini mengajak kita melangkah pelan: udara lembut, angin tidak terburu-buru, dan suhu yang bersahabat untuk rehat sejenak.\"\n3. **Gunakan waktu 24 jam (misal: pukul 14.00, bukan 2 PM).** Ceritakan bagaimana cuaca beberapa hari ke depan akan memengaruhi perasaan dan aktivitas harian pengguna.\n4. **Jadikan data cuaca sebagai latar belakang cerita, bukan fokus utama.** Fokus pada suasana, perasaan, dan pengalaman hidup dengan cuaca tersebut.\n5. **Tutup dengan saran yang hangat dan reflektif untuk membantu pengguna merasa nyaman dan siap menghadapi beberapa hari ke depan.**"
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
