/* ========================================
   ElhyTravel - Main JavaScript
   Cart, Chatbot, Animations, Forms, WhatsApp
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ========== LOADER ==========
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 1200);
  });

  // ========== AOS INIT ==========
  AOS.init({
    duration: 800,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic'
  });

  // ========== NAVBAR SCROLL ==========
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ========== ACTIVE NAV LINK ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ========== STATS COUNTER ==========
  const counters = document.querySelectorAll('.stat-number');
  let counted = false;

  const animateCounters = () => {
    if (counted) return;
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      counted = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        update();
      });
    }
  };

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // ========== CART SYSTEM ==========
  let cart = [];
  const cartToggle = document.getElementById('cartToggle');
  const floatingCart = document.getElementById('floatingCart');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const finalizeBtn = document.getElementById('finalizeRequest');

  // Add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service');
      if (!cart.includes(service)) {
        cart.push(service);
        updateCartUI();
        // Visual feedback
        btn.innerHTML = '<i class="fas fa-check"></i> Agregado';
        btn.classList.add('btn-success');
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-cart-plus"></i> Agregar';
          btn.classList.remove('btn-success');
        }, 1500);
        
        // Open cart briefly
        floatingCart.classList.add('open');
        setTimeout(() => floatingCart.classList.remove('open'), 2500);
      }
    });
  });

  cartToggle.addEventListener('click', () => {
    floatingCart.classList.toggle('open');
  });

  closeCart.addEventListener('click', () => {
    floatingCart.classList.remove('open');
  });

  function updateCartUI() {
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">No hay servicios seleccionados</p>';
      finalizeBtn.disabled = true;
    } else {
      cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <span class="cart-item-name"><i class="fas fa-check-circle text-gold me-2"></i>${item}</span>
          <button class="cart-item-remove" data-index="${index}" aria-label="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `).join('');
      finalizeBtn.disabled = false;
      
      // Remove listeners
      document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = +btn.getAttribute('data-index');
          cart.splice(idx, 1);
          updateCartUI();
        });
      });
    }
  }

  // Finalize -> WhatsApp
  finalizeBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    const servicesList = cart.map(s => `• ${s}`).join('%0A');
    const message = `Hola ElhyTravel.%0AEstoy interesado en los siguientes servicios:%0A${servicesList}%0A%0AGracias.`;
    
    window.open(`https://wa.me/593989938910?text=${message}`, '_blank');
  });

  // ========== SMART FORM ==========
  const smartForm = document.getElementById('smartForm');
  smartForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim() || 'No especificada';
    const pais = document.getElementById('pais').value.trim() || 'Ecuador';
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value || 'Por definir';
    const destino = document.getElementById('destino').value.trim() || 'Por definir';
    const viajeros = document.getElementById('viajeros').value || '1';
    const mensaje = document.getElementById('mensaje').value.trim() || 'Sin mensaje adicional';
    
    const text = `Hola ElhyTravel.%0A%0A*Nueva Solicitud de Asesoría*%0A%0A*Nombre:* ${nombre} ${apellido}%0A*Correo:* ${correo}%0A*WhatsApp:* ${whatsapp}%0A*Ciudad:* ${ciudad}%0A*País:* ${pais}%0A*Servicio de interés:* ${servicio}%0A*Fecha estimada:* ${fecha}%0A*Destino:* ${destino}%0A*Número de viajeros:* ${viajeros}%0A*Mensaje:*%0A${mensaje}%0A%0A¡Gracias!`;
    
    window.open(`https://wa.me/593989938910?text=${text}`, '_blank');
    
    // Optional: reset form after short delay
    setTimeout(() => {
      smartForm.reset();
    }, 1000);
  });

  // ========== BACK TO TOP ==========
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========== ELHYBOT CHATBOT ==========
  const chatToggle = document.getElementById('chatToggle');
  const chatbot = document.getElementById('chatbot');
  const closeChat = document.getElementById('closeChat');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendChat = document.getElementById('sendChat');
  const suggestions = document.querySelectorAll('.suggestion-btn');

  const knowledge = {
    'schengen': {
      keywords: ['schengen', 'europa', 'españa', 'francia', 'italia', 'alemania', 'visa europa'],
      answer: `🛂 <strong>Visa Schengen</strong><br><br>
      <strong>Requisitos principales:</strong><br>
      • Pasaporte vigente (mín. 3 meses después del viaje)<br>
      • Formulario de solicitud<br>
      • Fotos tamaño pasaporte<br>
      • Reserva de vuelo y hotel<br>
      • Seguro de viaje (cobertura mín. €30.000)<br>
      • Extractos bancarios (3-6 meses)<br>
      • Carta de trabajo / justificación de lazos<br>
      • Itinerario del viaje<br><br>
      ⏱ Tiempo promedio: 15-45 días hábiles<br>
      💰 Costo consular: ~€80 + nuestros honorarios<br><br>
      ¿Quieres que te prepare un checklist personalizado? Escríbenos por WhatsApp 👉`
    },
    'usa': {
      keywords: ['usa', 'estados unidos', 'eeuu', 'america', 'ds-160', 'b1', 'b2', 'visa americana'],
      answer: `🇺🇸 <strong>Visa Estados Unidos (B1/B2)</strong><br><br>
      <strong>Proceso:</strong><br>
      1. Completar DS-160
      2. Pagar MRV (~$185 USD)
      3. Agendar cita en embajada
      4. Preparación de entrevista (¡clave!)
      5. Documentos de lazos con Ecuador

      <strong>Documentos clave:</strong><br>
      • Pasaporte + copias
      • Confirmación DS-160
      • Comprobante pago
      • Carta laboral, extractos, propiedades, etc.

      Te preparamos la entrevista para maximizar aprobación.
      ¿Agenda tu asesoría gratis?`
    },
    'canada': {
      keywords: ['canadá', 'canada', 'visa canadiense', 'estudio', 'trabajo canada'],
      answer: `🇨🇦 <strong>Visa Canadá</strong><br><br>
      Ofrecemos asesoría para:
      • Turismo (eTA / Visa de visitante)
      • Estudios (Study Permit)
      • Trabajo (Work Permit)
      • Residencia permanente (Express Entry, PNP)

      Requisitos varían según el tipo. Generalmente:
      • Pasaporte
      • Prueba de fondos
      • Carta de invitación (si aplica)
      • Exámenes médicos (algunos casos)
      • Biométricos

      ¿Qué tipo de visa a Canadá necesitas?`
    },
    'mexico': {
      keywords: ['méxico', 'mexico', 'visa mexicana'],
      answer: `🇲🇽 <strong>Visa México</strong><br><br>
      Para ecuatorianos la mayoría de estancias cortas de turismo no requieren visa (hasta 180 días), pero sí se recomienda:
      • Pasaporte vigente
      • Boleto de regreso
      • Prueba de fondos
      • Reserva de hotel

      Para trabajo, negocios o estancias largas sí se requiere visa. Te asesoramos en todos los casos.`
    },
    'seguro': {
      keywords: ['seguro', 'seguros', 'cobertura', 'médico', 'equipaje'],
      answer: `🛡️ <strong>Seguro de Viaje</strong><br><br>
      Coberturas que ofrecemos:
      • Asistencia médica internacional
      • Gastos por enfermedad o accidente
      • Pérdida o retraso de equipaje
      • Cancelación o interrupción de viaje
      • Repatriación
      • Asistencia 24/7 en español

      Precios desde $25-30 por semana (depende destino y edad).
      ¡Es obligatorio para Schengen y muy recomendado en general!`
    },
    'pasaporte': {
      keywords: ['pasaporte', 'pasaportes', 'renovar', 'primera vez'],
      answer: `📘 <strong>Pasaporte Ecuatoriano</strong><br><br>
      Te ayudamos con:
      • Primera emisión
      • Renovación
      • Requisitos actualizados
      • Agendamiento y seguimiento

      Documentos habituales: cédula, certificado de votación, fotos, pago de tasas.
      Tiempo: 5-15 días hábiles aproximadamente.`
    },
    'reservas': {
      keywords: ['hotel', 'hoteles', 'vuelo', 'vuelos', 'reserva', 'reservas', 'boleto'],
      answer: `✈️🏨 <strong>Reservas de Vuelos y Hoteles</strong><br><br>
      • Acceso a +500.000 hoteles
      • Tarifas preferenciales y promociones
      • Cancelación flexible en muchos casos
      • Vuelos nacionales e internacionales
      • Combinamos vuelo + hotel + seguro para mejor precio

      Dinos destino y fechas y te armamos las mejores opciones.`
    },
    'horarios': {
      keywords: ['horario', 'horarios', 'atención', 'cuando', 'abierto'],
      answer: `🕐 <strong>Horarios de Atención</strong><br><br>
      Lunes a Viernes: 09:00 - 18:00
      Sábados: 09:00 - 13:00
      WhatsApp: 24/7 para consultas y emergencias

      Número: 0989938910`
    },
    'costos': {
      keywords: ['costo', 'precio', 'cuanto', 'cuánto', 'vale', 'tarifa', 'honorarios'],
      answer: `💰 <strong>Costos e Honorarios</strong><br><br>
      Nuestros honorarios varían según el servicio y complejidad del caso.
      La <strong>primera asesoría es 100% GRATIS</strong>.

      En la consulta te damos un presupuesto claro y transparente sin sorpresas.
      ¿Quieres agendar tu asesoría gratuita ahora?`
    },
    'tiempo': {
      keywords: ['tiempo', 'cuanto demora', 'demora', 'tarda', 'respuesta'],
      answer: `⏱ <strong>Tiempos de Respuesta y Procesos</strong><br><br>
      • Respuesta por WhatsApp: menos de 2 horas en horario laboral
      • Visa Schengen: 15-45 días hábiles
      • Visa USA: depende de la cita (puede ser semanas/meses)
      • Reservas de hotel/vuelo: confirmación en minutos/horas

      Siempre te damos un cronograma realista desde el inicio.`
    },
    'default': `Gracias por tu pregunta. 😊<br><br>
    Para darte la información más precisa y personalizada, te recomiendo hablar directamente con un asesor humano por WhatsApp.<br><br>
    <a href="https://wa.me/593989938910?text=Hola%20ElhyTravel%2C%20tengo%20una%20consulta" target="_blank" style="color:#D4AF37;font-weight:600;">👉 Hablar por WhatsApp ahora</a><br><br>
    También puedes preguntarme sobre: Visa Schengen, USA, Canadá, México, Seguros, Pasaporte, Reservas o Horarios.`
  };

  function getBotResponse(text) {
    const lower = text.toLowerCase();
    
    for (const [key, data] of Object.entries(knowledge)) {
      if (key === 'default') continue;
      if (data.keywords.some(kw => lower.includes(kw))) {
        return data.answer;
      }
    }
    return knowledge.default;
  }

  function addMessage(content, isUser = false) {
    const div = document.createElement('div');
    div.className = isUser ? 'user-message' : 'bot-message';
    div.innerHTML = content;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserMessage(msg) {
    if (!msg.trim()) return;
    addMessage(msg, true);
    chatInput.value = '';
    
    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'bot-message';
    typing.innerHTML = '<em>ElhyBot está escribiendo...</em>';
    typing.id = 'typing';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
      document.getElementById('typing')?.remove();
      const response = getBotResponse(msg);
      addMessage(response);
    }, 800 + Math.random() * 600);
  }

  chatToggle.addEventListener('click', () => {
    chatbot.classList.toggle('open');
    if (chatbot.classList.contains('open')) {
      chatInput.focus();
    }
  });

  closeChat.addEventListener('click', () => {
    chatbot.classList.remove('open');
  });

  sendChat.addEventListener('click', () => {
    handleUserMessage(chatInput.value);
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserMessage(chatInput.value);
    }
  });

  suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      handleUserMessage(q);
    });
  });

  // ========== PARTICLES (simple CSS-like with JS) ==========
  // Lightweight particle system
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.35;';
  document.getElementById('particles-js').appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const particleCount = 40;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ========== SMOOTH SCROLL FOR ANCHORS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
        }
      }
    });
  });

  console.log('%c✈️ ElhyTravel loaded successfully', 'color: #D4AF37; font-weight: bold; font-size: 14px;');
});
