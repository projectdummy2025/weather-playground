const { OpenRouter } = require("@openrouter/sdk");
require('dotenv').config();

const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

async function explainWeather(weatherData) {
    try {
        if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('YOUR_API_KEY')) {
            throw new Error('OpenRouter API Key is missing or invalid.');
        }

        const completion = await client.chat.send({
            model: "openai/gpt-oss-20b:free",
            response_format: { type: "json_object" },
            max_tokens: 350,                   
            stop: ["END_JSON"],                
            messages: [
                {
                    role: "system",
                    content: `
                                Anda adalah parser cuaca otomatis. 
                                TUGAS ANDA HANYA: menghasilkan JSON VALID. 
                                Dilarang menggunakan gaya puitis, metafora, opini, atau kalimat deskriptif panjang.

                                Output format WAJIB:

                                {
                                "morning": { "condition": "", "action": "" },
                                "afternoon": { "condition": "", "action": "" },
                                "evening": { "condition": "", "action": "" },
                                "night": { "condition": "", "action": "" }
                                }

                                Aturan keras:
                                - Tidak ada narasi.
                                - Tidak ada kalimat indah.
                                - Tidak ada paragraf panjang.
                                - Hanya ringkasan faktual + saran langsung.
                                - Tulis singkat, faktual, 1–2 kalimat per field.
                                Akhiri JSON dengan tulisan: END_JSON`
                },
                {
                    role: "user",
                    content: `Data cuaca: ${JSON.stringify(weatherData.prakiraan)}`
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
