// ========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ========================================
const estado = {
    cantidadFotos: 5,
    imagenes: [],
    // Configuración de estilos
    estilos: {
        tipoTransicion: 'fade',
        velocidadTransicion: 800,
        colorFondo: '#000000',
        autoplay: true,
        intervaloAutoplay: 3000,
        mostrarFlechas: true,
        mostrarDots: true
    }
};

// ========================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ========================================
const elementos = {
    // Elementos de la sección Images
    inputCantidadFotos: document.getElementById('cantidadFotos'),
    gridImagenes: document.getElementById('gridImagenes'),
    btnDecrementar: document.getElementById('decrementarBtn'),
    btnIncrementar: document.getElementById('incrementarBtn'),
    btnAgregarMas: document.getElementById('agregarMasBtn'),
    itemsSidebar: document.querySelectorAll('.sidebarMenu li'),
    seccionesContenido: document.querySelectorAll('.contentSection'),
    
    // Overlay de drag and drop
    contentArea: document.getElementById('contentArea'),
    dropOverlay: document.getElementById('dropOverlay'),
    
    // Elementos de la sección Style
    radiosTipoTransicion: document.querySelectorAll('input[name="tipoTransicion"]'),
    sliderVelocidad: document.getElementById('velocidadTransicion'),
    labelVelocidad: document.getElementById('velocidadValor'),
    inputColorFondo: document.getElementById('colorFondo'),
    inputColorHex: document.getElementById('colorFondoHex'),
    checkboxAutoplay: document.getElementById('autoplay'),
    grupoIntervalo: document.getElementById('grupoIntervalo'),
    sliderIntervalo: document.getElementById('intervaloAutoplay'),
    labelIntervalo: document.getElementById('intervaloValor'),
    checkboxFlechas: document.getElementById('mostrarFlechas'),
    checkboxDots: document.getElementById('mostrarDots')
};

// ========================================
// FUNCIONES DE NAVEGACIÓN
// ========================================

/**
 * Cambia entre las secciones del sidebar (Images, Style, Text)
 * @param {HTMLElement} itemClickeado - El elemento <li> que fue clickeado
 */
function cambiarSeccion(itemClickeado) {
    // Remover clase active de todos los items
    elementos.itemsSidebar.forEach(item => item.classList.remove('active'));
    
    // Agregar clase active al item clickeado
    itemClickeado.classList.add('active');

    // Ocultar todas las secciones
    elementos.seccionesContenido.forEach(seccion => seccion.classList.remove('active'));
    
    // Mostrar la sección correspondiente
    const nombreSeccion = itemClickeado.getAttribute('data-seccion');
    document.getElementById(`${nombreSeccion}Seccion`).classList.add('active');
}

/**
 * Inicializa los event listeners del sidebar
 */
function inicializarNavegacion() {
    elementos.itemsSidebar.forEach(item => {
        item.addEventListener('click', () => cambiarSeccion(item));
    });
}

// ========================================
// FUNCIONES DE CONTROL DE CANTIDAD
// ========================================

/**
 * Decrementa la cantidad de fotos
 */
function decrementarCantidad() {
    if (estado.cantidadFotos > 1) {
        estado.cantidadFotos--;
        actualizarInputCantidad();
        renderizarGridImagenes();
    }
}

/**
 * Incrementa la cantidad de fotos
 */
function incrementarCantidad() {
    if (estado.cantidadFotos < 10) {
        estado.cantidadFotos++;
        actualizarInputCantidad();
        renderizarGridImagenes();
    }
}

/**
 * Maneja el cambio manual en el input de cantidad
 * @param {Event} evento - El evento de cambio
 */
function manejarCambioInput(evento) {
    let valor = parseInt(evento.target.value);
    
    // Validar límites
    if (valor < 1) valor = 1;
    if (valor > 10) valor = 10;
    
    estado.cantidadFotos = valor;
    actualizarInputCantidad();
    renderizarGridImagenes();
}

/**
 * Actualiza el valor mostrado en el input
 */
function actualizarInputCantidad() {
    elementos.inputCantidadFotos.value = estado.cantidadFotos;
}

/**
 * Inicializa los event listeners de los controles de cantidad
 */
function inicializarControlesCantidad() {
    elementos.btnDecrementar.addEventListener('click', decrementarCantidad);
    elementos.btnIncrementar.addEventListener('click', incrementarCantidad);
    elementos.inputCantidadFotos.addEventListener('change', manejarCambioInput);
    elementos.btnAgregarMas.addEventListener('click', incrementarCantidad);
}

// ========================================
// FUNCIONES DE MANEJO DE IMÁGENES
// ========================================

/**
 * Renderiza el grid completo de imágenes
 */
function renderizarGridImagenes() {
    elementos.gridImagenes.innerHTML = '';
    
    for (let i = 0; i < estado.cantidadFotos; i++) {
        const caja = crearCajaUploadImagen(i);
        elementos.gridImagenes.appendChild(caja);
    }
}

/**
 * Crea una caja individual de upload de imagen
 * @param {number} indice - El índice de la imagen en el array
 * @returns {HTMLElement} - El elemento div de la caja
 */
function crearCajaUploadImagen(indice) {
    const caja = document.createElement('div');
    caja.className = 'imageUploadBox';
    
    // Crear input de archivo
    const inputArchivo = crearInputArchivo(indice);
    
    // Verificar si ya existe una imagen cargada
    if (estado.imagenes[indice]) {
        mostrarImagenCargada(caja, estado.imagenes[indice]);
    } else {
        mostrarPlaceholderUpload(caja);
    }
    
    caja.appendChild(inputArchivo);
    
    // Configurar event listeners
    configurarEventosCaja(caja, inputArchivo, indice);
    
    return caja;
}

/**
 * Crea el input de archivo para una caja
 * @param {number} indice - El índice de la imagen
 * @returns {HTMLInputElement} - El elemento input
 */
function crearInputArchivo(indice) {
    const inputArchivo = document.createElement('input');
    inputArchivo.type = 'file';
    inputArchivo.accept = 'image/*';
    inputArchivo.id = `inputArchivo${indice}`;
    return inputArchivo;
}

/**
 * Muestra una imagen ya cargada en la caja
 * @param {HTMLElement} caja - El contenedor de la imagen
 * @param {string} urlImagen - La URL de la imagen (base64)
 */
function mostrarImagenCargada(caja, urlImagen) {
    caja.classList.add('hasImage');
    const img = document.createElement('img');
    img.src = urlImagen;
    caja.appendChild(img);
}

/**
 * Muestra el placeholder de upload (icono + texto)
 * @param {HTMLElement} caja - El contenedor
 */
function mostrarPlaceholderUpload(caja) {
    const icono = document.createElement('div');
    icono.className = 'uploadIcon';
    icono.innerHTML = '🖼️';
    
    const texto = document.createElement('div');
    texto.className = 'uploadText';
    texto.textContent = 'Drop image here or click to upload';
    
    caja.appendChild(icono);
    caja.appendChild(texto);
}

/**
 * Configura todos los event listeners de una caja de upload
 * @param {HTMLElement} caja - El contenedor
 * @param {HTMLInputElement} inputArchivo - El input de archivo
 * @param {number} indice - El índice de la imagen
 */
function configurarEventosCaja(caja, inputArchivo, indice) {
    // Click para abrir selector de archivos
    caja.addEventListener('click', () => {
        inputArchivo.click();
    });
    
    // Cambio de archivo seleccionado
    inputArchivo.addEventListener('change', (evento) => {
        manejarSeleccionArchivo(evento, indice);
    });
    
    // Drag and drop
    caja.addEventListener('dragover', (evento) => {
        evento.preventDefault();
        caja.style.backgroundColor = '#3a3a3a';
    });
    
    caja.addEventListener('dragleave', () => {
        caja.style.backgroundColor = '';
    });
    
    caja.addEventListener('drop', (evento) => {
        manejarDropArchivo(evento, caja, indice);
    });
}

/**
 * Maneja la selección de un archivo mediante el input
 * @param {Event} evento - El evento de cambio
 * @param {number} indice - El índice de la imagen
 */
function manejarSeleccionArchivo(evento, indice) {
    const archivo = evento.target.files[0];
    if (archivo && archivo.type.startsWith('image/')) {
        cargarImagen(archivo, indice);
    }
}

/**
 * Maneja el drop de un archivo
 * @param {DragEvent} evento - El evento de drop
 * @param {HTMLElement} caja - El contenedor
 * @param {number} indice - El índice de la imagen
 */
function manejarDropArchivo(evento, caja, indice) {
    evento.preventDefault();
    caja.style.backgroundColor = '';
    
    const archivos = Array.from(evento.dataTransfer.files);
    const archivosImagen = archivos.filter(archivo => archivo.type.startsWith('image/'));
    
    if (archivosImagen.length === 0) return;
    
    // Si solo hay un archivo, cargarlo en la posición actual
    if (archivosImagen.length === 1) {
        cargarImagen(archivosImagen[0], indice);
        return;
    }
    
    // Si hay múltiples archivos, cargarlos secuencialmente
    cargarMultiplesImagenes(archivosImagen, indice);
}

/**
 * Carga una imagen y la almacena en el estado
 * @param {File} archivo - El archivo de imagen
 * @param {number} indice - El índice donde almacenar la imagen
 */
function cargarImagen(archivo, indice) {
    const lector = new FileReader();
    
    lector.onload = (evento) => {
        estado.imagenes[indice] = evento.target.result;
        renderizarGridImagenes();
    };
    
    lector.readAsDataURL(archivo);
}

/**
 * Carga múltiples imágenes secuencialmente desde un índice inicial
 * 
 * COMPORTAMIENTO:
 * 1. Calcula cuántos slots necesita (indiceInicial + cantidad de archivos)
 * 2. Expande automáticamente los slots si es necesario (máximo 10)
 * 3. Carga todas las imágenes de forma asíncrona
 * 4. Renderiza el grid UNA SOLA VEZ cuando todas las imágenes terminan de cargar
 * 
 * EJEMPLO:
 * - Estado actual: 5 slots, todos vacíos
 * - Usuario suelta 8 imágenes
 * - indiceInicial = 0 (primer slot vacío)
 * - Sistema expande a 8 slots automáticamente
 * - Carga las 8 imágenes en paralelo
 * - Renderiza una vez al final
 * 
 * @param {File[]} archivos - Array de archivos de imagen a cargar
 * @param {number} indiceInicial - El índice desde donde empezar a cargar (generalmente el primer slot vacío)
 */
function cargarMultiplesImagenes(archivos, indiceInicial) {
    // ============================================
    // PASO 1: Calcular espacio necesario
    // ============================================
    const totalNecesario = indiceInicial + archivos.length;
    
    // ============================================
    // PASO 2: Expandir slots si es necesario
    // ============================================
    // Si necesitamos más slots que los actuales, expandir
    // Límite máximo: 10 slots
    if (totalNecesario > estado.cantidadFotos) {
        estado.cantidadFotos = Math.min(totalNecesario, 10);
        actualizarInputCantidad();
    }
    
    // ============================================
    // PASO 3: Cargar todas las imágenes
    // ============================================
    // Usamos FileReader.readAsDataURL() que es asíncrono
    // Contador para saber cuándo terminaron todas las cargas
    let archivosRestantes = 0;
    
    archivos.forEach((archivo, offset) => {
        const indiceDestino = indiceInicial + offset;
        
        // Solo cargar si está dentro del límite de 10 slots
        if (indiceDestino < 10) {
            archivosRestantes++;
            const lector = new FileReader();
            
            // Callback cuando termina de leer el archivo
            lector.onload = (evento) => {
                // Guardar la imagen en base64 en el estado
                estado.imagenes[indiceDestino] = evento.target.result;
                archivosRestantes--;
                
                // ============================================
                // PASO 4: Renderizar solo cuando TODO terminó
                // ============================================
                // Esto evita múltiples re-renderizados y mejora el performance
                if (archivosRestantes === 0) {
                    renderizarGridImagenes();
                }
            };
            
            // Iniciar lectura del archivo como Data URL (base64)
            lector.readAsDataURL(archivo);
        }
    });
    
    // ============================================
    // CASO EDGE: No hay archivos válidos para cargar
    // ============================================
    // Si todos los archivos están fuera del límite de 10,
    // renderizar inmediatamente con los slots expandidos
    if (archivosRestantes === 0) {
        renderizarGridImagenes();
    }
}

// ========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ========================================

/**
 * Función principal que inicializa toda la aplicación
 */
function inicializarApp() {
    inicializarNavegacion();
    inicializarControlesCantidad();
    inicializarControlesEstilo();
    inicializarDragAndDropGlobal();
    renderizarGridImagenes();
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);

// Si el script se carga después del DOM, ejecutar inmediatamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}

// ========================================
// FUNCIONES DE CONTROL DE ESTILOS
// ========================================

/**
 * Inicializa todos los controles de la sección Style
 */
function inicializarControlesEstilo() {
    // Radio buttons - Tipo de transición
    elementos.radiosTipoTransicion.forEach(radio => {
        radio.addEventListener('change', (evento) => {
            estado.estilos.tipoTransicion = evento.target.value;
            console.log('Tipo de transición:', estado.estilos.tipoTransicion);
        });
    });

    // Slider - Velocidad de transición
    elementos.sliderVelocidad.addEventListener('input', (evento) => {
        const valor = evento.target.value;
        estado.estilos.velocidadTransicion = parseInt(valor);
        elementos.labelVelocidad.textContent = `${valor}ms`;
    });

    // Color picker
    elementos.inputColorFondo.addEventListener('input', (evento) => {
        const color = evento.target.value;
        estado.estilos.colorFondo = color;
        elementos.inputColorHex.value = color;
    });

    // Input de color hexadecimal
    elementos.inputColorHex.addEventListener('input', (evento) => {
        let valor = evento.target.value;
        if (valor.startsWith('#') && (valor.length === 7 || valor.length === 4)) {
            estado.estilos.colorFondo = valor;
            elementos.inputColorFondo.value = valor;
        }
    });

    // Switch - Autoplay
    elementos.checkboxAutoplay.addEventListener('change', (evento) => {
        estado.estilos.autoplay = evento.target.checked;
        toggleGrupoIntervalo(evento.target.checked);
    });

    // Slider - Intervalo de autoplay
    elementos.sliderIntervalo.addEventListener('input', (evento) => {
        const valor = evento.target.value;
        estado.estilos.intervaloAutoplay = parseInt(valor);
        elementos.labelIntervalo.textContent = `${valor / 1000}s`;
    });

    // Checkbox - Mostrar flechas
    elementos.checkboxFlechas.addEventListener('change', (evento) => {
        estado.estilos.mostrarFlechas = evento.target.checked;
    });

    // Checkbox - Mostrar dots
    elementos.checkboxDots.addEventListener('change', (evento) => {
        estado.estilos.mostrarDots = evento.target.checked;
    });
}

/**
 * Muestra u oculta el grupo de intervalo según el estado de autoplay
 * @param {boolean} mostrar - Si debe mostrar el grupo
 */
function toggleGrupoIntervalo(mostrar) {
    elementos.grupoIntervalo.style.display = mostrar ? 'block' : 'none';
}

// ========================================
// DRAG AND DROP GLOBAL
// ========================================

/**
 * Inicializa el sistema de drag and drop global
 * 
 * COMPORTAMIENTO:
 * - Previene que el navegador abra imágenes en nuevas pestañas
 * - Muestra overlay visual solo cuando se arrastran archivos sobre el área válida
 * - Al soltar múltiples imágenes, siempre las distribuye desde el primer slot vacío
 * 
 * PROBLEMAS RESUELTOS:
 * 1. Feedback visual: El overlay aparece al detectar drag sobre el área de contenido
 * 2. Prevención de apertura: preventDefault en todo el documento
 * 3. Distribución correcta: Usa encontrarPrimerSlotVacio() para ubicar imágenes
 */
function inicializarDragAndDropGlobal() {
    let contadorDrag = 0;

    // ============================================
    // PASO 1: Prevenir comportamiento por defecto del navegador
    // ============================================
    // Esto evita que el navegador abra las imágenes en nuevas pestañas
    // cuando se sueltan fuera de los slots válidos
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // ============================================
    // PASO 2: Mostrar overlay al arrastrar sobre área válida
    // ============================================
    // El overlay solo aparece cuando se arrastra sobre el contentArea
    // y solo si estamos en la sección de imágenes
    elementos.contentArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
        contadorDrag++;
        
        // Verificar que estamos en la sección de imágenes
        const seccionActiva = document.querySelector('.contentSection.active');
        if (seccionActiva && seccionActiva.id === 'imagenesSeccion') {
            elementos.dropOverlay.classList.add('active');
        }
    });

    // ============================================
    // PASO 3: Ocultar overlay al salir del área
    // ============================================
    // Usamos un contador para manejar múltiples dragenter/dragleave
    // (pueden dispararse múltiples veces por elementos hijos)
    elementos.contentArea.addEventListener('dragleave', (e) => {
        contadorDrag--;
        if (contadorDrag === 0) {
            elementos.dropOverlay.classList.remove('active');
        }
    });

    elementos.contentArea.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    // ============================================
    // PASO 4: Procesar imágenes al soltar
    // ============================================
    // COMPORTAMIENTO CLAVE:
    // - Las imágenes SIEMPRE se cargan desde el primer slot vacío
    // - No importa dónde el usuario suelte las imágenes
    // - Esto mantiene el orden lógico y evita gaps innecesarios
    elementos.contentArea.addEventListener('drop', (e) => {
        e.preventDefault();
        contadorDrag = 0;
        elementos.dropOverlay.classList.remove('active');

        // Solo procesar si estamos en la sección de imágenes
        const seccionActiva = document.querySelector('.contentSection.active');
        if (seccionActiva && seccionActiva.id === 'imagenesSeccion') {
            const archivos = Array.from(e.dataTransfer.files);
            const archivosImagen = archivos.filter(archivo => archivo.type.startsWith('image/'));
            
            if (archivosImagen.length > 0) {
                // IMPORTANTE: Siempre buscar el primer slot vacío
                // Esto garantiza que las imágenes se distribuyan correctamente
                const primerSlotVacio = encontrarPrimerSlotVacio();
                cargarMultiplesImagenes(archivosImagen, primerSlotVacio);
            }
        }
    });
}

/**
 * Encuentra el índice del primer slot vacío en el grid de imágenes
 * 
 * PROPÓSITO:
 * Esta función garantiza que al soltar múltiples imágenes,
 * se carguen desde el primer espacio disponible, manteniendo
 * un orden lógico y evitando gaps innecesarios
 * 
 * @returns {number} - Índice del primer slot vacío (0-9), o cantidadFotos si todos están llenos
 */
function encontrarPrimerSlotVacio() {
    for (let i = 0; i < estado.cantidadFotos; i++) {
        if (!estado.imagenes[i]) {
            return i;
        }
    }
    // Si todos los slots están llenos, retornar la cantidad actual
    // (esto permitirá expandir si es necesario)
    return estado.cantidadFotos;
}