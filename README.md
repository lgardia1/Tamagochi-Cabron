# Tamagochi Cabronazo
Este es un juego donde pondras jugarlo con los amigos, podras mover , guirar y disparar nada mas con el ratón!!
necesitaras tener el puerto 3000 abierto y al menos 2 amigos disponibles.

# Como usarlo

```
Tamagochi Cabron/
│
├── Game-Client/
│   ├── assets/
│   └── index.html
│
├── Game-Server/
│   ├── node_modules/
│   ├── src/
│   ├── .env
│   ├── Game-Client/
│   ├── tsconfig.json
│   └── package.json
│ 
└── .gitignore
```

En `Game'Client` deberemos de inciar un servidor (*opcion: Visual Studio>**Live Server***)

En `Game-Server` deberemos de inciar otro servidor con node, primero instalamos las dependencias y luego ejecutamos.
Asegurate de tener descargado [node](https://nodejs.org/es/download)

```bash
  npm install
  npm run dev
```

# Caracterisitcas

## 1. Diseño del Tablero y Mecánicas de Juego
• Implementación de un tablero de tamaño NxN correctamente generado.
• Configuración inicial de los jugadores en las esquinas del tablero.
• Implementación de ataques entre jugadores con reglas de distancia.
• Implementación de casillas de escondite con normas de posicionamiento
adecuadas.

## 2. Comunicación Cliente-Servidor con WebSockets
• Configuración del servidor para manejar conexiones de clientes vía WebSockets.
• Envío y recepción de mensajes de manera eficiente entre cliente y servidor.
• Sincronización en tiempo real del estado del juego en todos los clientes
conectados.
• Manejo de desconexiones y reconexiones de jugadores sin afectar la partida.

## 3. Implementación del Cliente y Eventos del Juego
• Representación visual dinámica del tablero y los jugadores según datos del servidor.
• Implementación de eventos de juego: desplazamiento, rotación y disparo.
• Diseño de una interfaz intuitiva para la interacción del jugador.
• (5 pts) Adaptabilidad del cliente a posibles rediseños o mejoras futuras.

## 4. Gestión de Salas y Control de Juego
• Implementación de salas para gestionar partidas independientes.
• Control centralizado del estado del juego en el servidor.
• Compartición eficiente de datos del mapa entre todos los clientes.
• Manejo de finalización de partidas y asignación de ganadores.

## 5. Uso de Buenas Prácticas de Programación y Patrones de Diseño 
• Uso adecuado de clases, objetos JSON y patrones de diseño.
• Código modular y bien estructurado que facilite la escalabilidad.
