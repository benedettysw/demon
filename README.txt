MiTienda - proyecto academico SENA
===================================

COMO ABRIR
1. Extrae la carpeta mitienda del archivo ZIP.
2. Abre index.html con Chrome, Edge o Firefox.
3. Entra a los detalles haciendo clic en el producto.
4. Prueba el buscador, filtros, ordenamiento y carrito.

ARCHIVOS
- index.html: catálogo principal.
- producto.html: detalle de producto (usa ?id=1, ?id=2, etc.).
- css/styles.css: estilos responsive.
- js/products.js: inventario, precios y especificaciones de ejemplo.
- js/app.js: filtros, carrito en localStorage y mensaje de WhatsApp.
- js/detail.js: galería, ficha técnica y compra individual.
- img/: ilustraciones SVG locales de los productos.

CONFIGURAR WHATSAPP
Por seguridad, el teléfono de demostración está configurado como 573001234567
en js/app.js. Cambia window.WHATSAPP_NUMBER por el número del vendedor
en formato internacional, solo dígitos, sin +, espacios ni guiones.
Ejemplo para Colombia: 57 seguido del número móvil real del vendedor.

IMPORTANTE
- No tiene backend, registro, pasarela de pago ni base de datos.
- El carrito se guarda en el navegador mediante localStorage.
- Productos, precios, stock, cuotas y especificaciones son ilustrativos.
- Las imágenes SVG son ilustraciones originales locales, no fotos de producto.
- WhatsApp solo abrirá una conversación; el usuario debe enviar el mensaje.
- Para un despliegue real, valida datos, precios, inventario y políticas comerciales.
