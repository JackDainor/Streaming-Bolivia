// Variables globales
let servicioIndividual = '';
let precioIndividual = 0;
let comboSeleccionado = [];
const telefonoWhatsApp = '59175761732';

// Productos para el combo (mismo orden que HTML)
const productosCombo = [
    { nombre: 'Netflix Premium', precio: 35, tags: 'netflix' },
    { nombre: 'Disney+ standar', precio: 17, tags: 'disney' },
    { nombre: 'HBO Max standar', precio: 14, tags: 'hbo' },
    { nombre: 'Prime Video HD', precio: 17, tags: 'prime' },
    { nombre: 'YouTube Premium', precio: 20, tags: 'youtube' }
];

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    inicializarComboPersonalizable();
    inicializarBusqueda();
    actualizarContador(6, 6);
    
    // Smooth scroll y animaciones
    window.addEventListener('load', animarProductos);
});

// 1. COMBO PERSONALIZABLE
function inicializarComboPersonalizable() {
    const container = document.getElementById('checkboxesCombo');
    let html = '';
    
    productosCombo.forEach((producto, index) => {
        html += `
            <div class="checkbox-item">
                <input type="checkbox" id="combo${index}" value="${producto.precio}" data-nombre="${producto.nombre}">
                <label for="combo${index}">${producto.nombre}</label>
                <span class="precio-item">Bs. ${producto.precio}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Event listeners para checkboxes
    document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', calcularCombo);
    });
    
    document.getElementById('btnComboPersonalizado').addEventListener('click', abrirFormularioCombo);
}

function calcularCombo() {
    const checkboxes = document.querySelectorAll('#checkboxesCombo input[type="checkbox"]:checked');
    comboSeleccionado = Array.from(checkboxes).map(cb => ({
        nombre: cb.dataset.nombre,
        precio: parseInt(cb.value)
    }));
    
    const cantidad = comboSeleccionado.length;
    const subtotal = comboSeleccionado.reduce((sum, item) => sum + item.precio, 0);
    const descuento = subtotal * 0.05;
    const total = subtotal - descuento;
    
    // Actualizar UI
    document.getElementById('subtotalCombo').textContent = `Bs. ${subtotal}`;
    document.getElementById('descuentoCombo').textContent = `Bs. ${descuento.toFixed(0)}`;
    document.getElementById('totalComboFinal').textContent = `Bs. ${total.toFixed(0)}`;
    document.getElementById('precioCombo').textContent = total.toFixed(0);
    
    const btnCombo = document.getElementById('btnComboPersonalizado');
    
    if (cantidad >= 2 && cantidad <= 3) {
        btnCombo.disabled = false;
        btnCombo.innerHTML = `✅ ¡Crear Combo (${cantidad} servicios)!`;
    } else {
        btnCombo.disabled = true;
        btnCombo.innerHTML = '❌ ¡Selecciona 2-3 servicios!';
    }
}

function abrirFormularioCombo() {
    if (comboSeleccionado.length < 2 || comboSeleccionado.length > 3) return;
    
    const servicios = comboSeleccionado.map(item => item.nombre).join(' + ');
    const subtotal = comboSeleccionado.reduce((sum, item) => sum + item.precio, 0);
    const descuento = subtotal * 0.05;
    const total = subtotal - descuento;
    
    servicioIndividual = `Combo Personalizado: ${servicios} (Subtotal Bs.${subtotal} -5% = Bs.${total.toFixed(0)})`;
    precioIndividual = total.toFixed(0);
    
    abrirModalIndividual();
}

// 2. BÚSQUEDA EN TIEMPO REAL
function inicializarBusqueda() {
    const buscador = document.getElementById('buscador');
    buscador.addEventListener('input', function() {
        const termino = this.value.toLowerCase().trim();
        filtrarProductos(termino);
    });
}

function filtrarProductos(termino) {
    const cards = document.querySelectorAll('.producto-card');
    let visibles = 0;
    
    cards.forEach(card => {
        const tags = (card.dataset.tags || '').toLowerCase();
        const texto = card.textContent.toLowerCase();
        
        if (termino === '' || tags.includes(termino) || texto.includes(termino)) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            visibles++;
            
            // Animación de aparición
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
    
    actualizarContador(visibles, 6);
    actualizarTituloBusqueda(termino, visibles);
}

function actualizarContador(visibles, total) {
    document.getElementById('contador').textContent = visibles;
}

function actualizarTituloBusqueda(termino, visibles) {
    const titulo = document.getElementById('tituloProductos');
    if (termino && visibles > 0) {
        titulo.textContent = `"${termino}" - ${visibles} resultado${visibles > 1 ? 's' : ''}`;
    } else if (termino) {
        titulo.textContent = `"${termino}" - Sin resultados`;
    } else {
        titulo.textContent = 'Nuestros Planes';
    }
}

// 3. FORMULARIOS INDIVIDUALES
function abrirFormulario(servicio, precio) {
    servicioIndividual = servicio;
    precioIndividual = precio;
    abrirModalIndividual();
}

function abrirModalIndividual() {
    document.getElementById('tituloServicio').textContent = servicioIndividual;
    document.getElementById('precioSeleccionado').textContent = `Bs. ${precioIndividual} / mes`;
    document.getElementById('modalIndividual').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus en nombre
    setTimeout(() => document.getElementById('nombreIndividual').focus(), 300);
}

function cerrarModalIndividual() {
    document.getElementById('modalIndividual').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('formIndividual').reset();
}

// Formulario Individual
document.getElementById('formIndividual').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombreIndividual').value.trim();
    const whatsapp = document.getElementById('whatsappIndividual').value.trim();
    
    if (!nombre || !whatsapp) return;
    
    const mensaje = `🚀 *NUEVA COMPRA STREAMING* 🚀%0A%0A👤 *Cliente:* ${nombre}%0A📱 *WhatsApp:* +591${whatsapp}%0A%0A🎬 *SERVICIO:* ${servicioIndividual}%0A💰 *PRECIO:* Bs. ${precioIndividual}%0A%0A⚡ *Listo para procesar*%0A⏰ *Hora:* ${new Date().toLocaleString('es-BO')}`;
    
    const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    // Abrir WhatsApp y cerrar modal
    window.open(urlWhatsApp, '_blank');
    cerrarModalIndividual();
    
    // Mensaje de éxito
    mostrarNotificacion('¡Pedido enviado a WhatsApp! ✅');
});

// 4. ANIMACIONES
function animarProductos() {
    const cards = document.querySelectorAll('.producto-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        setTimeout(() => {
            card.style.transition = 'all 0.8s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Cerrar modales clicando fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalIndividual');
    if (event.target === modal) {
        cerrarModalIndividual();
    }
}

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalIndividual();
    }
});

// Notificación de éxito
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(40,167,69,0.4);
        z-index: 3000;
        font-weight: 600;
        transform: translateX(400px);
        transition: all 0.4s ease;
        max-width: 350px;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(notificacion), 400);
    }, 3000);
}

// Prevenir zoom en iOS
document.addEventListener('touchstart', function() {}, true);