const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

// Define las palabras clave y sus respuestas asociadas
const keywords = {

    'hola': ['¡Hola!', 'Hola papi', '¡Hola, ¿cómo estás?'],
    'clima': ['El clima hoy es soleado y cálido.', 'Hoy hace un día hermoso.', 'El pronóstico dice que será un día soleado.'],
    'noticias': ['Aquí tienes las últimas noticias...', 'En las noticias de hoy...', 'Las noticias más recientes son...'],
    // Agrega más palabras clave y respuestas según tus necesidades
};

// Respuestas generales cuando no encuentra una palabra clave específica
const generalResponses = [
    'No entiendo lo que quieres decir.',
    'Lo siento, no tengo una respuesta para eso.',
    'Ups, no encontré ninguna coincidencia.',
];

// Función para normalizar el texto (minúsculas y sin acentos)
function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


// Función para obtener una respuesta aleatoria basada en el array
function getRandomResponseFromArray(array) {
    if (!array || array.length === 0) {
        return 'Lo siento, no tengo una respuesta para eso.';
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// Función para obtener una respuesta aleatoria basada en la palabra clave
function getRandomResponse(keyword) {
    const normalizedKeyword = normalizeText(keyword);
    const responses = keywords[normalizedKeyword];
    return getRandomResponseFromArray(responses) || getRandomResponseFromArray(generalResponses);
}

// ...

// Evento que se dispara cuando el bot recibe un código QR para iniciar sesión
client.on('qr', qr => {
    // No mostrar el código QR en la consola
});

// Evento que se dispara cuando el bot está listo y conectado
client.on('ready', () => {
    console.log('Conexión exitosa nenes');
});

// Evento que se dispara cuando el bot recibe un mensaje
client.on('message', async message => {
    const userMessage = message.body;
    const response = getRandomResponse(userMessage);

    // Verifica que el mensaje no sea del propio bot antes de responder
    if (!message.fromMe) {
        await message.reply(response);
        console.log('Respuesta enviada:', response); // Muestra la respuesta enviada en la consola para fines de registro, puedes eliminar esta línea si lo deseas.
    }
});

// Inicialización del cliente
client.initialize();
