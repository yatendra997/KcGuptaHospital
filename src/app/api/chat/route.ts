import { NextRequest, NextResponse } from "next/server";

const MODEL = "gemma-3-4b-it";

// Shorter context for faster processing
const HOSPITAL_CONTEXT = `You are an AI assistant for Dr. K.C. Memorial Gupta Hospital, Gajraula, UP, India.
KEY INFO: 30+ beds, 24/7 Emergency, Phone: +91 90390 67378. TPA Helpdesk: +91 8954155336.
OPD: 10AM-6PM (Mon-Sat).
SERVICES: General Medicine, Pediatrics, Gynae, Vaccination, Lab, Ultrasound (3D, 4D), OT.
DOCTORS: Dr. Sachin Gupta (Physician), Dr. Shweta Gupta (Gynae), Dr. Gajal Gupta (Psychiatrist).
RULES: Short answers (1-2 sentences). For appointments/emergencies, ask to call +91 90390 67378. Be professional and kind.`;

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();

        // Limit history to last 4 messages for faster processing
        const recentHistory = history.slice(-4);

        const contents = [
            {
                role: "user",
                parts: [{ text: HOSPITAL_CONTEXT }]
            },
            {
                role: "model",
                parts: [{ text: "Hello! How can I help you today?" }]
            },
            ...recentHistory.map((msg: { role: string; content: string }) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            })),
            {
                role: "user",
                parts: [{ text: message }]
            }
        ];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 80,
                        topP: 0.8,
                        topK: 20,
                    },
                }),
            }
        );

        if (!response.ok) {
            console.error("Gemini API Error:", await response.text());
            return NextResponse.json(
                { reply: "Please call +91 98765 43210 for help." },
                { status: 500 }
            );
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Please call +91 98765 43210.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat Error:", error);
        return NextResponse.json(
            { reply: "Please call +91 98765 43210." },
            { status: 500 }
        );
    }
}
