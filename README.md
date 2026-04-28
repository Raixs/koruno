# Trivial Koruño

Juego web móvil y estático para adivinar vocabulario koruño. La v0.2 mantiene la interfaz del PoC, pero separa datos, estilos y lógica para poder crecer sin dejar de publicarse fácil en GitHub Pages.

## Ejecutar en local

La app usa `fetch` para cargar `data/words.json`, así que conviene servirla con un servidor estático:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080`.

También puedes usar Docker sin instalar nada global:

```bash
docker compose up
```

Abre `http://localhost:8080`.

## Editar palabras

Las palabras viven en `data/words.json`. Cada entrada debe seguir este formato:

```json
{
  "word": "bute",
  "displayWord": "BUTE",
  "correctDefinition": "Bueno, genial o de mucha calidad.",
  "fakeDefinitions": [
    "El bus que va lleno a Riazor en día de partido.",
    "La mochila que pesa más que el propio chinorro.",
    "Una discusión eterna sobre dónde aparcar en Matogrande."
  ],
  "example": "Este bocata está bute, neno; me cunde máis que unha tarde de praia.",
  "difficulty": "easy",
  "tags": ["positivo", "expresión", "básico"],
  "note": "Úsase cando algo che parece moi bo ou che presta moito.",
  "type": "definition"
}
```

Campos:

- `displayWord`, `note` y `type` son opcionales.
- Si falta `displayWord`, se usa `word.toUpperCase()`.
- Si falta `type`, se asume `"definition"`.
- `difficulty` debe ser `"easy"`, `"medium"` o `"hard"`.
- `tags` debe ser siempre un array, aunque esté vacío.
- `fakeDefinitions` debe tener al menos 3 elementos. Si hay más, el juego escoge 3 al azar.
- Las entradas mal formadas se ignoran y dejan un aviso en consola.

## Estructura

```text
.
├── index.html
├── manifest.webmanifest
├── assets/
├── data/
│   └── words.json
├── src/
│   ├── app.js
│   ├── config.js
│   ├── daily.js
│   ├── data.js
│   ├── game.js
│   ├── scoring.js
│   ├── share.js
│   ├── storage.js
│   └── ui.js
├── styles/
│   └── app.css
└── test/
```

## Tests

Los tests son opcionales para jugar. Si tienes Node instalado:

```bash
npm install
npm test
```

Cubren normalización de palabras, puntuación, texto compartible y selección diaria determinista.

## GitHub Pages

No hay build obligatorio. Publica la rama o carpeta raíz en GitHub Pages. Las rutas son relativas (`./data/words.json`, `./src/app.js`), así que funciona también si el repo se sirve desde un subdirectorio.

## Roadmap

- Modo diario con partida determinista por fecha.
- Envío de palabras por usuarios.
- Modo grupo o reto compartido.
- Backend futuro para ranking global y moderación.
