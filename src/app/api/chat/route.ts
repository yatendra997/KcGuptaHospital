import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBIWfUf9Nh5yre54h62HOnGgQ6Hs8YFqew";
const MODEL = "gemma-3-4b-it";

const HOSPITAL_CONTEXT = `You are a helpful hospital assistant for Dr. K.C. Memorial Gupta Hospital in Gajraula, Uttar Pradesh, India.

HOSPITAL INFORMATION:
- Name: Dr. K.C. Memorial Gupta Hospital
- Location: Gajraula, Uttar Pradesh, India
- Capacity: 30+ beds
- Emergency: 24/7 available
- Phone: +91 98765 43210

SERVICES:
- General Medicine
- Pediatrics (child care)
- Emergency Care (24/7)
- Laboratory & Diagnostics
- Vaccination programs
- Health Checkups

DOCTORS:
- Dr. K.C. Gupta - Founder & Chief Medical Officer, Internal Medicine, 30+ years experience
- Dr. Priya Sharma - Senior Consultant, Pediatrics, 18+ years
- Dr. Amit Verma - Consultant, General Surgery, 15+ years
- Dr. Sunita Patel - Consultant, Gynecology, 12+ years

OPD TIMINGS: 10:00 AM to 6:00 PM (Monday to Saturday)
EMERGENCY: Available 24/7

RULES:
1. Give short, helpful responses (1-2 sentences max)
2. Be polite and professional
3. Only answer questions related to hospital services
4. For appointments, ask them to call or visit
5. If unsure, suggest calling the hospital`;

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();

        const contents = [
            {
                role: "user",
                parts: [{ text: HOSPITAL_CONTEXT }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am the hospital assistant for Dr. K.C. Memorial Gupta Hospital. How can I help you today?" }]
            },
            ...history.map((msg: { role: string; content: string }) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            })),
            {
                role: "user",
                parts: [{ text: message }]
            }
        ];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error("Gemini API Error:", error);
            return NextResponse.json(
                { error: "Failed to get response", reply: "Sorry, I'm having trouble responding. Please call us at +91 98765 43210." },
                { status: 500 }
            );
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I apologize, I couldn't process that. Please call us at +91 98765 43210 for assistance.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Server error", reply: "Sorry, something went wrong. Please call +91 98765 43210." },
            { status: 500 }
        );
    }
}
