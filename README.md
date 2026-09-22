<p align="center">
  <img src="./docs/logo.svg" alt="NexusPC Logo" width="280" />
</p>

# NexusPC — E-Commerce de Hardware & Componentes de PC

Plataforma web full-stack de tienda online para venta de hardware, componentes y periféricos de PC de alto rendimiento en Argentina. Desarrollada con arquitectura moderna (Frontend en Next.js y Backend en Express con PostgreSQL).

---

## 📌 Acerca del Proyecto

**NexusPC** es una plataforma de e-commerce desarrollada como **proyecto personal de desarrollo de software y portafolio técnico full-stack**. El objetivo del proyecto es simular y resolver los desafíos de ingeniería de una tienda online moderna: catálogo dinámico con filtrado, gestión de estado global de carrito persistente, autenticación segura basada en tokens con cookies seguras y un flujo integral de checkout y pagos conectado a pasarelas reales en modo de prueba.

> **Nota:** La plataforma funciona como un entorno demostrativo y de prueba técnica. Los productos exhibidos no se encuentran a la venta en la vida real, no se despacha mercadería física y la pasarela de pagos opera exclusivamente en modo test (sin transacciones de dinero real).

---

## 🚀 Características Principales

- **Catálogo Dinámico y Filtrado:** Búsqueda en tiempo real y filtrado multidimensional por categoría, subcategoría, marcas, rango de precios, productos en oferta y disponibilidad de stock.
- **Ficha de Producto Detallada:** Visualización de especificaciones técnicas completas, cálculo dinámico de cuotas, precios promocionales y stock en tiempo real.
- **Carrito de Compras Persistente:** Gestión de estado global reactivo mediante Zustand con persistencia en el almacenamiento local del cliente (`localStorage`).
- **Autenticación y Seguridad Robusta:** Sistema de registro e inicio de sesión con contraseñas encriptadas mediante hashing unidireccional seguro (`bcrypt`), manejo de sesiones con tokens JWT (`access-token` y `refresh-token`) almacenados en cookies seguras `httpOnly` con directivas `SameSite=Strict` y protección de rutas mediante middleware.
- **Pasarela de Pagos (Modo Test):** Integración con el SDK oficial de Mercado Pago para generación de preferencias de pago y simulación de transacciones completas.
- **Webhooks y Notificaciones IPN:** Endpoint seguro para recepción y validación de firmas de eventos de pago de Mercado Pago, actualizando el estado de las órdenes en la base de datos de forma asíncrona.
- **Panel Administrativo (Backoffice):** Rutas protegidas para administración de catálogo (creación, edición y eliminación de productos, categorías y ofertas) y subida de imágenes optimizadas a la nube con Cloudinary.
- **Diseño Moderno & Responsivo:** Interfaz construida con enfoque *mobile-first*, paleta de colores personalizada de alto contraste, iconografía moderna con Lucide y componentes accesibles y optimizados para SEO.

---

## 🛠️ Stack Tecnológico

### 💻 Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components y Client Components)
- **Biblioteca Core:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos & Diseño:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestión de Estado:** [Zustand](https://zustand-demo.pmnd.rs/) (con middleware `persist`)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Validación de Datos:** [Zod](https://zod.dev/)

### ⚙️ Backend
- **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework Web:** [Express 5](https://expressjs.com/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (ejecutado con `tsx`)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (conexión por Pool con `pg` / Neon Serverless Postgres)
- **Pasarela de Pagos:** [Mercado Pago SDK](https://www.mercadopago.com.ar/developers)
- **Autenticación & Criptografía:** JSON Web Tokens (`jsonwebtoken`), `cookie-parser`, `bcrypt`
- **Almacenamiento Multimedia:** [Cloudinary SDK](https://cloudinary.com/) & [Multer](https://github.com/expressjs/multer)
- **Seguridad & Rendimiento:** [Helmet](https://helmetjs.github.io/), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), [CORS](https://github.com/expressjs/cors)
- **Validación de Schemas:** [Zod](https://zod.dev/)

---

## 🔌 Estructura de la API

- `/auth` — Autenticación, registro de usuarios, refresco de sesión y logout.
- `/productos` — Consulta de catálogo con filtros facetados y gestión de productos.
- `/categorias` — Consulta y administración de categorías principales.
- `/subcategorias` — Gestión de subcategorías de hardware y periféricos.
- `/ordenes` — Creación de pedidos, historial de compras y preferencias de pago (Mercado Pago).
- `/usuarios` — Gestión de perfil, datos de facturación y actualización de contraseñas.
- `/ofertas` — Administración de descuentos y productos promocionales.
- `/webhooks` — Recepción y validación de notificaciones de pago (IPN).
- `/admin/upload` — Subida y optimización de imágenes en Cloudinary.

---

## 📄 Documentación

Puedes consultar la documentación técnica extendida y diagramas del sistema a través del siguiente enlace:

📄 **[Ver Documentación Técnica (PDF)](./docs/documentacion.pdf)**
