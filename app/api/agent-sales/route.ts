import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  SALES_AGENT_SYSTEM_PROMPT,
  AgentResponsePayload,
} from "@/ia/agent-sales-config";

const apiKey = process.env.GEMINI_API_KEY;
const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let genAI: GoogleGenerativeAI | null = null;

if (!apiKey) {
  console.warn("GEMINI_API_KEY no está configurada. El agente no podrá responder.");
} else {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(req: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "Falta configuración de IA (GEMINI_API_KEY)." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron mensajes al agente." },
        { status: 400 }
      );
    }

    const conversation = messages
      .map((m) => `${m.role === "user" ? "Usuario" : "Agente"}: ${m.content}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: modelId });

    const fullPrompt = `
${SALES_AGENT_SYSTEM_PROMPT}

Historial de conversación hasta ahora:
${conversation}
`.trim();

    const result = await model.generateContent({
      contents: [
        {
mkdir -p app/api/agent-sales

cat > app/api/agent-sales/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  SALES_AGENT_SYSTEM_PROMPT,
  AgentResponsePayload,
} from "@/ia/agent-sales-config";

const apiKey = process.env.GEMINI_API_KEY;
const modelId = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let genAI: GoogleGenerativeAI | null = null;

if (!apiKey) {
  console.warn("GEMINI_API_KEY no está configurada. El agente no podrá responder.");
} else {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(req: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "Falta configuración de IA (GEMINI_API_KEY)." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron mensajes al agente." },
        { status: 400 }
      );
    }

    const conversation = messages
      .map((m) => `${m.role === "user" ? "Usuario" : "Agente"}: ${m.content}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: modelId });

    const fullPrompt = `
${SALES_AGENT_SYSTEM_PROMPT}

Historial de conversación hasta ahora:
${conversation}
`.trim();

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const text =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: AgentResponsePayload;

    try {
      // Intentamos extraer solo el JSON por si el modelo agrega texto alrededor
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const jsonString =
        jsonStart !== -1 && jsonEnd !== -1
          ? text.slice(jsonStart, jsonEnd + 1)
          : text;

      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.error("Error parseando JSON del modelo:", e, text);
      parsed = {
        reply:
          "Se me complicó interpretar tu caso con precisión. ¿Podés explicarme de nuevo brevemente tu negocio y qué querés mejorar?",
        step: "descubrimiento",
        summary: {
          tipoNegocio: "pendiente",
          ubicacion: "pendiente",
          facturacionAprox: "pendiente",
          dolorPrincipal: "pendiente",
          oportunidadesClave: [],
          serviciosRecomendados: [],
        },
        leadScore: 1,
        nextActions: [],
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error en /api/agent-sales:", error);
    return NextResponse.json(
      { error: "Error interno en el agente de ventas." },
      { status: 500 }
    );
  }
}
