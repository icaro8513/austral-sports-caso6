# Austral Sports — Segundo Parcial Interfaz del Usuario (Caso 6)

## Entrega

- **Figma:** https://www.figma.com/design/HQkDRQKOWnP9x4sGF9wnmk
- **Sitio web:** abrir `index.html` en el navegador o ejecutar un servidor local desde VS Code (Live Server).
- **Código:** HTML5 semántico, CSS3 responsive y JavaScript nativo mínimo para las selecciones, filtros, validación y navegación.
- **Sin backend ni pasarela de pago:** reserva, precios, horarios y comprobantes son **simulados**. No se cobra ninguna seña real.

## Pantallas y flujo

1. Inicio → Buscar canchas.
2. Filtrar por deporte, superficie y fecha → Ver horarios.
3. Seleccionar horario disponible → Continuar reserva.
4. Revisar datos y seña → Confirmar (con validación de errores).
5. Comprobante → Imprimir o reservar otra cancha.

En todas las pantallas hay un camino de regreso y los turnos reservados/cerrados están deshabilitados.

## Tres heurísticas de Nielsen aplicadas

1. **Visibilidad del estado del sistema:** los horarios presentan etiquetas *Disponible*, *Reservado*, *No disponible* y *Seleccionado*. Un resumen muestra la elección y el importe antes de confirmar.
2. **Prevención de errores:** se bloquea la elección de turnos ocupados, el botón de continuación se deshabilita mientras no se elija un horario, el formulario requiere nombre, correo y teléfono y el usuario debe aceptar las reglas de cancelación.
3. **Control y libertad del usuario:** existe navegación hacia atrás, modificación de filtros/horarios, retorno al inicio y opción de iniciar otra reserva tras finalizar.

**Complementaria — Ayudar a reconocer y recuperarse de errores:** la validación explica los problemas por campo, marca el campo con `aria-invalid` y mueve el foco al primer error.

## Responsive

La web utiliza grillas que pasan de varias columnas a una sola columna con `@media` y anchos fluidos. Se evita la necesidad de desplazamiento horizontal en teléfonos. Debe probarse también manualmente a 320, 375, 768 y 1440 px, con navegación por teclado y con el navegador de un celular.

## Consideraciones para la defensa

El prototipo Figma muestra el flujo de navegación y estados. La implementación web agrega cambios reales de selección y validaciones con JavaScript sin implementar lógica de negocio del servidor. En un sistema productivo, los datos de disponibilidad y la confirmación de reservas deberían validarse en un backend para impedir la doble reserva y gestionar el pago seguro de la seña.

Este ejercicio es un **prototipo académico**, no un sistema comercial operativo.


## Datos de seña en el comprobante (simulados)

El comprobante incluye el **alias ficticio `AUSTRAL.SPORTS.DEMO`** y el **teléfono ficticio `+54 9 2964 000-000`**, como ejemplo de los datos que un complejo deportivo mostraría para recibir una transferencia y el comprobante correspondiente. También muestra el monto de la seña del turno elegido. **No transferir ni contactar**: estos datos no son un medio de pago real. El botón de copia funciona como demostración local y el bloque se incluye en la impresión A4.
