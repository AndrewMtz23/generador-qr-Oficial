<div align="center">

<img src="Frontend/public/og-image.png" alt="QR Gratis: crea tu código QR gratis en segundos" width="720" />

# QR Gratis

**Generador de códigos QR gratis, sin registro, sin anuncios y sin fecha de caducidad.**

[Usar QR Gratis](https://www.qrgratis.es) · [Reportar un problema](https://github.com/BigNight1/generador-qr-Oficial/issues) · [Proponer una idea](https://github.com/BigNight1/generador-qr-Oficial/issues/new) · [Apoyar el proyecto](https://www.qrgratis.es/donaciones)

</div>

---

QR Gratis convierte un enlace, un número de WhatsApp, una red WiFi o un texto en un código QR que puedes descargar e imprimir. Los códigos son **estáticos**: el contenido va dentro del código, así que funcionan para siempre y no dependen de ninguna cuenta ni suscripción.

## Qué puedes hacer

| Tipo | Para qué sirve | Página |
|------|----------------|--------|
| Enlace (URL) | Llevar a una web, un menú en PDF o tus redes | [/generador-qr/url](https://www.qrgratis.es/generador-qr/url) |
| WhatsApp | Abrir un chat contigo con un mensaje ya escrito | [/generador-qr/whatsapp](https://www.qrgratis.es/generador-qr/whatsapp) |
| WiFi | Conectar a tus invitados sin dictar la contraseña | [/generador-qr/wifi](https://www.qrgratis.es/generador-qr/wifi) |
| Texto | Guardar una nota o unas instrucciones | [/generador-qr/texto](https://www.qrgratis.es/generador-qr/texto) |

Además puedes elegir el color, el tamaño (200 a 2000 px), añadir tu logo en el centro y descargar en **PNG, JPG, SVG o PDF**. La interfaz está en español, inglés y portugués, con modo claro y oscuro.

**Privacidad:** el servidor solo crea la imagen y no guarda el contenido de tus códigos. El historial se guarda en tu navegador.

## Cómo está hecho

```
generador-qr-Oficial/
├── Frontend/   React 18 + TypeScript + Vite + Tailwind CSS (prerender en el build)
└── Backend/    API en Node.js + Express que genera la imagen (qrcode + sharp)
```

| Pieza | Detalle |
|-------|---------|
| Prerender | `npm run build` genera un HTML propio por ruta (título, descripción, canonical, contenido y datos estructurados) para que los buscadores lean cada página. Ver `Frontend/scripts/prerender.mjs`. |
| Textos | Todo el contenido vive en `Frontend/src/i18n/locales/{es,en,pt}.json`. |
| Diseño | Sistema de diseño en `Frontend/design-system/qr-gratis/MASTER.md`. |
| API | `POST /api/generate-qr` devuelve la imagen en base64. Detalles en [Backend/README.md](Backend/README.md). |
| Despliegue | Frontend y Backend en Vercel, cada uno con su `vercel.json`. |

## Ejecutarlo en local

Necesitas Node.js 18 o superior.

**1. Backend** (puerto 3800)

```bash
cd Backend
npm install
npm run dev
```

Crea `Backend/.env`:

```env
PORT=3800
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

> Si `CORS_ORIGINS` no incluye el puerto donde corre el frontend, el navegador bloquea la petición y verás un error de CORS en la consola.

**2. Frontend** (puerto 5173)

```bash
cd Frontend
npm install
npm run dev
```

Por defecto el frontend llama a `http://localhost:3800`. Para usar otra API, crea `Frontend/.env.local` con `VITE_API_URL=https://tu-api.example.com`.

**3. Comprueba que funciona:** abre http://localhost:5173, escribe una URL y pulsa **Generar QR**. Deberías ver la vista previa y el botón de descarga.

## Cómo contribuir

Toda ayuda suma: desde corregir una falta de ortografía hasta proponer un tipo de QR nuevo.

1. **Abre un issue** contando qué quieres cambiar o qué problema encontraste. Así evitamos trabajo duplicado.
2. **Haz un fork** y crea una rama desde `main` (`feat/vcard`, `fix/wifi-hidden`, `docs/readme`).
3. **Haz los cambios** siguiendo el estilo del código que ya existe. Si añades texto visible, añádelo en los tres idiomas.
4. **Verifica** antes de abrir el PR, desde `Frontend/`:
   ```bash
   npm run build                          # debe terminar con "done: 11 pages" o más
   npx tsc -p tsconfig.app.json --noEmit  # sin errores
   npx eslint .                           # sin errores
   ```
5. **Abre el Pull Request** con commits en formato [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `docs:`) y una descripción breve de qué cambia y cómo probarlo.

### Reglas del proyecto

- **Nada de datos inventados.** Sin contadores de usuarios, reseñas o cifras que no sean reales.
- **Las promesas deben ser ciertas en el código.** Si dices "no caduca" o "no guardamos tus datos", tiene que ser verdad.
- **Accesibilidad primero.** Contraste mínimo 4.5:1, foco visible, etiquetas en los formularios.
- **Una página nueva necesita contenido propio.** Si añades un tipo de QR, crea su texto, pasos y preguntas frecuentes, no copies los de otro tipo.

## Ideas para seguir creciendo

¿Buscas por dónde empezar? Estas son las mejoras que más ayudarían. Comenta en un issue antes de empezar una.

**Fáciles** (buenas para tu primera contribución)
- [ ] Título de la pestaña traducido al cambiar a inglés o portugués.
- [ ] Mensajes de error junto al campo en lugar de `alert()`.
- [ ] Evitar el destello blanco al cargar en modo oscuro.

**Nuevos tipos de QR**
- [ ] Tarjeta de contacto (vCard): nombre, teléfono, email y empresa.
- [ ] Reseñas de Google: pegar el enlace de tu ficha y obtener el QR.
- [ ] Email, SMS y llamada telefónica.
- [ ] Ubicación en el mapa.
- [ ] Evento de calendario.

**Más útil para negocios**
- [ ] Plantillas imprimibles en PDF: cartel de mesa, pegatina de WiFi, tarjeta de visita.
- [ ] Marcos con texto de llamada a la acción ("Escanéame").
- [ ] Generación por lotes desde un CSV.
- [ ] Comprobador de lectura: avisar si el color o el logo hacen difícil escanear el código.

## Apoya el proyecto

QR Gratis es gratis y seguirá siéndolo. Si te resulta útil, puedes ayudar a mantenerlo:

- Dale una **estrella** al repositorio.
- **Compártelo** con quien necesite un código QR.
- Propón ideas o reporta errores en [Issues](https://github.com/BigNight1/generador-qr-Oficial/issues).
- Haz una **donación** desde [qrgratis.es/donaciones](https://www.qrgratis.es/donaciones) (PayPal, Yape, Plin o Binance Pay).

---

<div align="center">

Hecho por <a href="https://github.com/BigNight1">Edu Armas</a>

</div>
