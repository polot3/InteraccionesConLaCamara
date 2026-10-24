# Especificación - Cámara Web Neon

## Descripción del Proyecto

Aplicación web minimalista que proporciona acceso a la cámara web del dispositivo con una interfaz estilizada en neon cyberpunk.

## Funcionalidades

1. **Acceso a la Cámara Web**
   - Captura de video en tiempo real desde la cámara del dispositivo
   - Resolución ideal: 640x480px
   - Sin audio

2. **Controles de Cámara**
   - Botón "Iniciar" para activar la cámara
   - Botón "Detener" para desactivar la cámara
   - Estados de botones: habilitado/deshabilitado según corresponda

3. **Interfaz Visual**
   - Tipografía: Jacquard 12 (Google Fonts)
   - Paleta de colores neon:
     - Cyan: #00ffff
     - Magenta: #ff00ff
     - Azul: #0099ff
   - Fondo oscuro con gradiente
   - Efectos de glow y parpadeo
   - Animaciones en botones (hover, click)

## Requisitos Técnicos

- **Compatibilidad**: Navegadores modernos con soporte para MediaDevices API
- **HTTPS/Localhost**: La aplicación requiere contexto seguro para acceder a la cámara
- **Sin dependencias externas**: Solo HTML5, CSS3 y JavaScript vanilla
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## Estructura de Archivos

```
InteraccionesConLaCamara/
├── index.html          (Aplicación principal)
├── css/
│   └── (estilos locales si es necesario)
├── js/
│   └── (scripts locales si es necesario)
└── Spec.md            (Este archivo)
```

## Estados de la Aplicación

| Estado | Botón Iniciar | Botón Detener | Video |
|--------|---------------|---------------|-------|
| Inicial | Habilitado | Deshabilitado | Vacío |
| Cámara activa | Deshabilitado | Habilitado | En vivo |
| Cámara detenida | Habilitado | Deshabilitado | Vacío |

## Consideraciones de Seguridad

- Requiere permiso explícito del usuario para acceder a la cámara
- No se almacena ni transmite video en línea
- Procesamiento completamente local en el navegador

## Notas de Desarrollo

- Código JavaScript inline en index.html para simplificar despliegue
- No requiere build process o herramientas de bundling
- Compatible con Live Server u otros servidores locales de desarrollo
