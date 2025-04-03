// src/components/Chatbot.tsx
import { useState, useEffect, useRef } from 'react'; // No need for React import with "jsx": "react-jsx"
import './style.css'; // Adjust path if CSS is not in src/components/

const API_KEY = "AIzaSyCmvD8hy0KO2QiyxVRemFA_vb29JZWrKDc";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const CONTEXTO_PROYECTO = `Este proyecto es un sistema de gestión de paneles solares aplicable a cualquier tipo de panel.
Usa una Raspberry Pi como cerebro central, recopilando datos de sensores SCT13, BH1750, DSQ8B20 y DHT22.
Estos datos se envían a Firebase, que sirve como base de datos para aplicaciones web utilizando javascript, css, html,typeScript y framework de next.js y para la app movile se utilizo flutter.
La aplicación web está alojada en Vercel, y los dispositivos están protegidos con una carcasa diseñada en SolidWorks.
El sistema se alimenta con una fuente de 24V a 5V, se trabajo en base a la metodologia Scrum, la documentacion se encuentra en el reporte de estadias, usamos el protocolo MQTT para la transferencia de datos y la estimación de energía fotovoltaica se realizó con la fórmula de la ley de ohm, considerando la corriente y el voltaje del panel solar.
El sistema está diseñado para ser escalable y adaptable a diferentes tipos de paneles solares, permitiendo su uso en una variedad de aplicaciones.`;

const PREGUNTAS_VALIDAS = [
    "que base de datos se utiliza", "donde se aloja la app web", "que sensores se usaron", "hablame del proyecto",
    "que fórmula se utilizó para la estimación de la energía fotovoltaica", "qué es vercel", "que se utilizo para diseñar la carcasa",
    "cual es el cerebro central del proyecto", "en que lenguaje se programo la app web", "en que lenguaje se programo la app movil", "que metodologia se utilizo",
    "que protocolo de transferencia de datos se uso", "donde esta la documentacion del proyecto", "que es MQTT",
    "cual es la fuente de alimentacion", "para que panel solar aplica", "para que sirve la Raspberry Pi"
];

interface Message {
    text: string;
    isUser: boolean;
    isThinking?: boolean;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hola! <br /> Como puedo ayudarte hoy?", isUser: false }
    ]);
    const [input, setInput] = useState<string>("");
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const esPreguntaValida = (mensaje: string): boolean => {
        return PREGUNTAS_VALIDAS.some(pregunta => mensaje.toLowerCase().includes(pregunta.toLowerCase()));
    };

    const generateBotResponse = async (message: string): Promise<string> => {
        if (!esPreguntaValida(message)) {
            return "Solo puedo responder preguntas relacionadas con este proyecto.";
        }

        const promptContexto = `
        Eres un experto en el siguiente proyecto:
        ${CONTEXTO_PROYECTO}

        Responde la siguiente pregunta con precisión y claridad:
        "${message}"
        `;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "contents": [{ "parts": [{ "text": promptContexto }] }] })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Error en la respuesta de la API");

            return data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        } catch (err) {
            console.error(err);
            return "Lo siento, ocurrió un error al procesar tu solicitud.";
        }
    };

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { text: input, isUser: true };
        setMessages((prev: Message[]) => [...prev, userMessage]);
        setInput("");

        const thinkingMessage: Message = { text: "", isUser: false, isThinking: true };
        setMessages((prev: Message[]) => [...prev, thinkingMessage]);

        const botResponse = await generateBotResponse(userMessage.text);
        setMessages((prev: Message[]) => prev.map((msg: Message) => 
            msg.isThinking ? { text: botResponse, isUser: false } : msg
        ));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && input.trim()) {
            e.preventDefault();
            handleSendMessage(e as any); // Temporary type assertion; refine if needed
        }
    };

    return (
        <div className="chatbot-popup">
            <div className="chat-header">
                <div className="header-info">
                    <svg className="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
                    </svg>
                    <h2 className="logo-text">Solar Sync Assistant</h2>
                </div>
                <button id="close-chatbot" className="material-symbols-rounded">arrow_drop_down</button>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
                {messages.map((msg: Message, index: number) => (
                    <div key={index} className={`message ${msg.isUser ? "user-message" : "bot-message"} ${msg.isThinking ? "thinking" : ""}`}>
                        {!msg.isUser && (
                            <svg className="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
                            </svg>
                        )}
                        <div
                            className="message-text"
                            dangerouslySetInnerHTML={{
                                __html: msg.isThinking
                                    ? '<div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>'
                                    : msg.text
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="chat-footer">
                <form className="chat-form" onSubmit={handleSendMessage}>
                    <textarea
                        placeholder="Message..."
                        className="message-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                    />
                    <div className="chat-controls">
                        <button type="submit" id="send-message" className="material-symbols-rounded">arrow_upward</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;