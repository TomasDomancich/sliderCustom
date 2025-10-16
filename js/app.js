// ========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ========================================
const estado = {
    cantidadFotos: 5,
    imagenes: []
};

// ========================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ========================================
const elementos = {
    inputCantidadFotos: document.getElementById('cantidadFotos'),
    gridImagenes: document.getElementById('gridImagenes'),
    btnDecrementar: document.getElementById('decrementarBtn'),
    btnIncrementar: document.getElementById('incrementarBtn'),
    btnAgregarMas: document.getElementById('agregarMasBtn'),
    itemsSidebar: document.querySelectorAll('.sidebarMenu li'),
    seccionesContenido: document.querySelectorAll('.contentSection')
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
    
    const archivo = evento.dataTransfer.files[0];
    if (archivo && archivo.type.startsWith('image/')) {
        cargarImagen(archivo, indice);
    }
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

// ========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ========================================

/**
 * Función principal que inicializa toda la aplicación
 */
function inicializarApp() {
    inicializarNavegacion();
    inicializarControlesCantidad();
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