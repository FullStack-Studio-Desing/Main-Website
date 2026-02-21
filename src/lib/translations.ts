import type { Locale } from "./geo";

const translations = {
  // ─── Brand / Global ───────────────────────────────────────────
  brand: {
    en: {
      tagline: "Build. Scale. Dominate.",
      location: "Serving US, Canada & Beyond",
      hours: "Monday - Friday: 9:00 AM - 6:00 PM EST",
    },
    es: {
      tagline: "Construye. Escala. Domina.",
      location: "Servicio en México, EE.UU. y más",
      hours: "Lunes a Viernes: 9:00 AM - 6:00 PM CST",
    },
  },

  // ─── Navigation ───────────────────────────────────────────────
  nav: {
    en: {
      home: "Home",
      services: "Services",
      packages: "Packages",
      contact: "Contact",
      faq: "FAQ",
      blog: "Blog",
      available: "Available",
      letsTalk: "Let's Talk",
      startProject: "Start Your Project",
      viewAll: "View All",
      ourServices: "Our Services",
      fullStackSolutions: "Full-stack digital solutions",
      notSure: "Not sure what you need?",
      freeStrategy: "Free strategy call • No commitment",
      bookCall: "Book a Call",
    },
    es: {
      home: "Inicio",
      services: "Servicios",
      packages: "Paquetes",
      contact: "Contacto",
      faq: "Preguntas Frecuentes",
      blog: "Blog",
      available: "Disponible",
      letsTalk: "Hablemos",
      startProject: "Inicia Tu Proyecto",
      viewAll: "Ver Todos",
      ourServices: "Nuestros Servicios",
      fullStackSolutions: "Soluciones digitales integrales",
      notSure: "¿No sabes qué necesitas?",
      freeStrategy: "Consulta gratuita • Sin compromiso",
      bookCall: "Agendar Llamada",
    },
  },

  // ─── Service labels (for Header dropdown, Dock, Footer) ──────
  serviceLabels: {
    en: {
      "web-development": "Web Development",
      "software-development": "Custom Software",
      "ai-solutions": "AI & Automation",
      "digital-marketing": "Digital Marketing",
      "paid-advertising": "Paid Advertising",
      seo: "SEO",
    },
    es: {
      "web-development": "Desarrollo Web",
      "software-development": "Software a la Medida",
      "ai-solutions": "IA y Automatización",
      "digital-marketing": "Marketing Digital",
      "paid-advertising": "Publicidad de Pago",
      seo: "SEO",
    },
  },

  serviceDescs: {
    en: {
      "web-development": "Blazing-fast, conversion-optimized websites",
      "software-development": "Scalable apps and platforms built to last",
      "ai-solutions": "Intelligent solutions that work 24/7",
      "digital-marketing": "Data-driven campaigns that convert",
      "paid-advertising": "Maximum ROI on every ad dollar",
      seo: "Dominate search rankings organically",
    },
    es: {
      "web-development": "Sitios web ultrarrápidos optimizados para convertir",
      "software-development": "Apps y plataformas escalables hechas para durar",
      "ai-solutions": "Soluciones inteligentes que trabajan 24/7",
      "digital-marketing": "Campañas basadas en datos que convierten",
      "paid-advertising": "Máximo retorno por cada peso invertido en publicidad",
      seo: "Domina los rankings de búsqueda de forma orgánica",
    },
  },

  // ─── Dock items ───────────────────────────────────────────────
  dock: {
    en: {
      contact: "Contact",
      emailUs: "Email Us",
    },
    es: {
      contact: "Contacto",
      emailUs: "Escríbenos",
    },
  },

  // ─── Hero Section ─────────────────────────────────────────────
  hero: {
    en: {
      headline: "We Build Digital Products That",
      flipWords: ["Convert", "Scale", "Dominate", "Perform"],
      subheadline:
        "From pixel-perfect websites to AI-powered platforms and revenue-driving marketing—we're the full-stack team that turns your vision into measurable results.",
      cta: "Start Your Free Strategy Call",
      exploreServices: "Explore Services",
      accepting: "Now accepting new projects for Q1 2025",
      trustedBy: "Trusted by innovative companies worldwide",
      scroll: "Scroll",
      stats: [
        { value: "200+", label: "Projects Delivered" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "3x", label: "Average ROI" },
      ],
    },
    es: {
      headline: "Creamos Productos Digitales Que",
      flipWords: ["Convierten", "Escalan", "Dominan", "Rinden"],
      subheadline:
        "Desde sitios web impecables hasta plataformas con IA y marketing que genera ingresos—somos el equipo full-stack que convierte tu visión en resultados medibles.",
      cta: "Agenda Tu Consulta Gratuita",
      exploreServices: "Explorar Servicios",
      accepting: "Aceptando nuevos proyectos para Q1 2025",
      trustedBy: "La confianza de empresas innovadoras en todo el mundo",
      scroll: "Scroll",
      stats: [
        { value: "200+", label: "Proyectos Entregados" },
        { value: "98%", label: "Satisfacción del Cliente" },
        { value: "3x", label: "ROI Promedio" },
      ],
    },
  },

  // ─── About Section ────────────────────────────────────────────
  about: {
    en: {
      label: "About Us",
      headline: "More Than an Agency",
      body: "Engineers, designers, and marketers building great products—fast.",
      values: [
        { number: "01", title: "Ship Fast, Ship Right", description: "Weeks, not months. Quality at speed." },
        { number: "02", title: "Outcomes Over Output", description: "Your growth is our KPI." },
        { number: "03", title: "Radically Transparent", description: "No surprises. You always know where you stand." },
        { number: "04", title: "Built to Scale", description: "We build for tomorrow, not just today." },
      ],
    },
    es: {
      label: "Nosotros",
      headline: "Más Que una Agencia",
      body: "Ingenieros, diseñadores y marketers construyendo grandes productos—rápido.",
      values: [
        { number: "01", title: "Rápido y Bien Hecho", description: "Semanas, no meses. Calidad con velocidad." },
        { number: "02", title: "Resultados, No Tareas", description: "Tu crecimiento es nuestro KPI." },
        { number: "03", title: "Transparencia Total", description: "Sin sorpresas. Siempre sabes cómo va todo." },
        { number: "04", title: "Hecho para Crecer", description: "Construimos para el mañana, no solo para hoy." },
      ],
    },
  },

  // ─── Services Section ─────────────────────────────────────────
  servicesSection: {
    en: {
      label: "What We Do",
      headline: "Full-Stack Digital Services",
      body: "Everything you need to build, launch, and grow—under one roof. No more juggling agencies.",
      startingAt: "Starting at",
      explore: "Explore",
      customNote: "Need something custom? We love unique challenges.",
      customCta: "Let's discuss your project",
    },
    es: {
      label: "Lo Que Hacemos",
      headline: "Servicios Digitales Integrales",
      body: "Todo lo que necesitas para construir, lanzar y crecer—bajo un mismo techo. Sin más agencias que coordinar.",
      startingAt: "Desde",
      explore: "Explorar",
      customNote: "¿Necesitas algo personalizado? Nos encantan los retos únicos.",
      customCta: "Platiquemos sobre tu proyecto",
    },
  },

  // ─── Packages Section ─────────────────────────────────────────
  packagesSection: {
    en: {
      label: "Pricing",
      headline: "Simple, transparent pricing",
      body: "No hidden fees. No scope creep. Pick the package that matches your ambition.",
      popular: "Popular",
      bottomNote: "All packages include a detailed project proposal.",
      customLink: "Need something custom?",
    },
    es: {
      label: "Precios",
      headline: "Precios simples y transparentes",
      body: "Sin costos ocultos. Sin cambios de alcance. Elige el paquete que se ajuste a tu ambición.",
      popular: "Popular",
      bottomNote: "Todos los paquetes incluyen una propuesta de proyecto detallada.",
      customLink: "¿Necesitas algo personalizado?",
    },
  },

  packages: {
    en: [
      {
        name: "Starter",
        price: "$2,500 USD",
        bestFor: "Perfect for startups ready to establish their digital presence",
        includes: [
          "5-Page Responsive Website",
          "Basic SEO Setup & Optimization",
          "Google Business Profile Setup",
          "Social Media Starter Kit (2 platforms)",
          "AI Chatbot (FAQ Automation)",
          "30-Day Support & Training",
        ],
        cta: "Get Started",
      },
      {
        name: "Growth",
        price: "$7,500 USD",
        bestFor: "For businesses ready to scale and outpace competition",
        includes: [
          "10-Page Website or Web Application",
          "Custom Software Integration",
          "Full SEO Campaign (90 days)",
          "Google & Meta Ads Management",
          "AI-Powered Lead Qualification",
          "Content Marketing (Blog + Social)",
          "Analytics Dashboard Setup",
          "90-Day Priority Support",
        ],
        cta: "Accelerate Growth",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$10,000+ USD",
        bestFor: "Full-scale digital transformation for market leaders",
        includes: [
          "Custom Software Platform Build",
          "Advanced AI & Automation Suite",
          "Enterprise SEO Strategy",
          "Multi-Channel Paid Advertising",
          "Marketing Automation Workflows",
          "Dedicated Success Manager",
          "Custom Integrations & APIs",
          "6-Month Partnership & Support",
        ],
        cta: "Let's Talk",
      },
    ],
    es: [
      {
        name: "Starter",
        price: "$45,000 MXN",
        bestFor: "Perfecto para startups listas para establecer su presencia digital",
        includes: [
          "Sitio Web Responsivo de 5 Páginas",
          "Configuración y Optimización SEO Básica",
          "Configuración de Google Business Profile",
          "Kit de Redes Sociales (2 plataformas)",
          "Chatbot con IA (Automatización de FAQ)",
          "30 Días de Soporte y Capacitación",
        ],
        cta: "Comenzar",
      },
      {
        name: "Growth",
        price: "$135,000 MXN",
        bestFor: "Para negocios listos para escalar y superar a la competencia",
        includes: [
          "Sitio Web o Aplicación Web de 10 Páginas",
          "Integración de Software Personalizado",
          "Campaña SEO Completa (90 días)",
          "Gestión de Anuncios en Google y Meta",
          "Calificación de Leads con IA",
          "Marketing de Contenidos (Blog + Redes)",
          "Configuración de Dashboard de Analítica",
          "90 Días de Soporte Prioritario",
        ],
        cta: "Acelerar Crecimiento",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$360,000+ MXN",
        bestFor: "Transformación digital completa para líderes del mercado",
        includes: [
          "Plataforma de Software a la Medida",
          "Suite Avanzada de IA y Automatización",
          "Estrategia SEO Empresarial",
          "Publicidad de Pago Multicanal",
          "Flujos de Automatización de Marketing",
          "Gerente de Éxito Dedicado",
          "Integraciones y APIs Personalizadas",
          "Alianza y Soporte por 6 Meses",
        ],
        cta: "Hablemos",
      },
    ],
  },

  // ─── Testimonials Section ─────────────────────────────────────
  testimonials: {
    en: {
      label: "Client Stories",
      headline: "Don't Take Our Word for It",
      body: "Here's what happens when strategy meets execution. Real results from real clients.",
      stats: [
        { value: "4.9", label: "Average Rating" },
        { value: "98%", label: "Would Recommend" },
        { value: "50+", label: "Happy Clients" },
      ],
      ratedText: "Rated 4.9/5 from 50+ reviews",
    },
    es: {
      label: "Historias de Clientes",
      headline: "No Solo Lo Decimos Nosotros",
      body: "Esto es lo que pasa cuando la estrategia se encuentra con la ejecución. Resultados reales de clientes reales.",
      stats: [
        { value: "4.9", label: "Calificación Promedio" },
        { value: "98%", label: "Nos Recomiendan" },
        { value: "50+", label: "Clientes Satisfechos" },
      ],
      ratedText: "Calificación 4.9/5 de más de 50 reseñas",
    },
  },

  // Testimonial quotes stay in English (they're real client quotes)
  // but we add translated versions for the ES locale
  testimonialItems: {
    en: [
      { quote: "They rebuilt our entire platform in 8 weeks—something our previous agency quoted 6 months for. Revenue is up 340% since launch.", author: "Sarah Mitchell", role: "CEO, TechStart Inc." },
      { quote: "The AI chatbot they built handles 70% of our support tickets automatically. We saved $180K in the first year alone.", author: "Michael Rodriguez", role: "COO, ServicePro" },
      { quote: "Finally, an agency that speaks our language. They understood our business, not just our brief. Our CAC dropped 45% in 90 days.", author: "Jennifer Liu", role: "VP Marketing, GrowthCo" },
      { quote: "We've worked with agencies that over-promise. These folks under-promise and over-deliver. Every. Single. Time.", author: "David Chen", role: "Founder, Launchpad Ventures" },
      { quote: "The SEO results speak for themselves—we went from page 4 to position 2 for our main keyword. Organic leads tripled.", author: "Amanda Torres", role: "Director of Growth, ScaleUp" },
    ],
    es: [
      { quote: "Reconstruyeron toda nuestra plataforma en 8 semanas—algo que nuestra agencia anterior cotizó en 6 meses. Los ingresos subieron 340% desde el lanzamiento.", author: "Sarah Mitchell", role: "CEO, TechStart Inc." },
      { quote: "El chatbot con IA que construyeron maneja el 70% de nuestros tickets de soporte automáticamente. Ahorramos $180K solo en el primer año.", author: "Michael Rodriguez", role: "COO, ServicePro" },
      { quote: "Por fin, una agencia que habla nuestro idioma. Entendieron nuestro negocio, no solo el brief. Nuestro CAC bajó 45% en 90 días.", author: "Jennifer Liu", role: "VP Marketing, GrowthCo" },
      { quote: "Hemos trabajado con agencias que prometen de más. Estos prometen poco y entregan de más. Cada. Una. De. Las. Veces.", author: "David Chen", role: "Fundador, Launchpad Ventures" },
      { quote: "Los resultados de SEO hablan por sí solos—pasamos de la página 4 a la posición 2 en nuestra palabra clave principal. Los leads orgánicos se triplicaron.", author: "Amanda Torres", role: "Directora de Crecimiento, ScaleUp" },
    ],
  },

  // ─── FAQ Section ──────────────────────────────────────────────
  faqSection: {
    en: {
      label: "FAQ",
      headline: "Questions?",
      headlineAccent: "We've Got Answers.",
      body: "Everything you need to know about working with us. Can't find what you're looking for?",
      letsTalk: "Let's talk.",
      stillQuestions: "Still have questions?",
      stillBody: "Our team is here to help. Schedule a free consultation and we'll walk you through everything.",
      getInTouch: "Get in Touch",
      orEmail: "or email us at",
    },
    es: {
      label: "FAQ",
      headline: "¿Preguntas?",
      headlineAccent: "Tenemos Respuestas.",
      body: "Todo lo que necesitas saber sobre trabajar con nosotros. ¿No encuentras lo que buscas?",
      letsTalk: "Hablemos.",
      stillQuestions: "¿Aún tienes preguntas?",
      stillBody: "Nuestro equipo está aquí para ayudarte. Agenda una consulta gratuita y te explicamos todo.",
      getInTouch: "Contáctanos",
      orEmail: "o escríbenos a",
    },
  },

  faqs: {
    en: [
      { q: "How fast can you actually deliver?", a: "We move fast without cutting corners. Most websites ship in 4-6 weeks. Custom software typically takes 8-12 weeks for an MVP. We'll give you a realistic timeline upfront—and we stick to it." },
      { q: "What makes you different from other agencies?", a: "We're builders first, not salespeople. You work directly with the people doing the work—no account managers playing telephone. We're obsessed with outcomes, not billable hours." },
      { q: "Do you offer payment plans?", a: "Yes. Standard terms are 50% to kick off, 50% at launch. For larger projects, we can structure milestone-based payments. We're flexible—let's find what works for you." },
      { q: "What happens after launch?", a: "We don't disappear. Every project includes a support window (30-90 days depending on scope). For ongoing partnerships, our retainer model gives you a dedicated team without the overhead of hiring." },
      { q: "What's your tech stack?", a: "We use modern, proven technologies: React, Next.js, Node.js, Python for backends, PostgreSQL/MongoDB for data, AWS/GCP/Vercel for infrastructure. We pick the right tool for the job, not whatever's trending." },
      { q: "Do you work with international clients?", a: "Absolutely. We serve clients across North America, Europe, and beyond. We have dedicated teams familiar with different markets and can accommodate various time zones." },
      { q: "How do we get started?", a: "Book a free strategy call. We'll discuss your goals, audit your current setup if relevant, and give you honest recommendations—even if that means we're not the right fit." },
    ],
    es: [
      { q: "¿Qué tan rápido pueden entregar?", a: "Nos movemos rápido sin sacrificar calidad. La mayoría de los sitios web se entregan en 4-6 semanas. El software personalizado típicamente toma 8-12 semanas para un MVP. Te damos un plazo realista desde el inicio—y lo cumplimos." },
      { q: "¿Qué los hace diferentes de otras agencias?", a: "Somos constructores primero, no vendedores. Trabajas directamente con las personas que hacen el trabajo—sin intermediarios. Estamos obsesionados con los resultados, no con las horas facturadas." },
      { q: "¿Ofrecen planes de pago?", a: "Sí. Los términos estándar son 50% al iniciar y 50% al lanzamiento. Para proyectos más grandes, podemos estructurar pagos por hitos. Somos flexibles—encontremos lo que funcione para ti." },
      { q: "¿Qué pasa después del lanzamiento?", a: "No desaparecemos. Cada proyecto incluye un periodo de soporte (30-90 días según el alcance). Para alianzas continuas, nuestro modelo de retainer te da un equipo dedicado sin el gasto de contratar personal." },
      { q: "¿Cuál es su stack tecnológico?", a: "Usamos tecnologías modernas y probadas: React, Next.js, Node.js, Python para backends, PostgreSQL/MongoDB para datos, AWS/GCP/Vercel para infraestructura. Elegimos la herramienta correcta para el trabajo, no la que está de moda." },
      { q: "¿Trabajan con clientes internacionales?", a: "¡Por supuesto! Atendemos clientes en toda América, Europa y más. Tenemos equipos familiarizados con diferentes mercados y nos adaptamos a distintas zonas horarias." },
      { q: "¿Cómo empezamos?", a: "Agenda una llamada estratégica gratuita. Platicamos sobre tus objetivos, revisamos tu situación actual si es relevante, y te damos recomendaciones honestas—incluso si eso significa que no somos la mejor opción." },
    ],
  },

  // ─── Contact Section ──────────────────────────────────────────
  contactSection: {
    en: {
      availableBadge: "Available for Projects",
      headline: "Ready to Build Something That Actually Works?",
      subheadline: "No pitch decks, no fluff. Just a conversation about your goals and how we can help you hit them. Book your free strategy call.",
      email: "Email",
      serviceArea: "Service Area",
      businessHours: "Business Hours",
      trustedBy: "Trusted by industry leaders",
      badges: ["200+ Projects", "98% Satisfaction", "3x Avg ROI"],
      formTitle: "Book Your Free Strategy Call",
      formSubtitle: "Fill out the form and we'll get back to you within 24 hours.",
      fieldName: "Your Name",
      fieldEmail: "Work Email",
      fieldCompany: "Company",
      fieldPhone: "Phone (Optional)",
      fieldService: "What Can We Help With?",
      fieldBudget: "Budget Range",
      fieldMessage: "Tell Us About Your Project",
      placeholderName: "John Smith",
      placeholderEmail: "john@company.com",
      placeholderCompany: "Your Company",
      placeholderPhone: "+1 (555) 000-0000",
      placeholderMessage: "Tell us about your project, goals, and timeline...",
      selectService: "Select a service",
      selectBudget: "Select budget range",
      serviceOptions: ["Web Development", "Custom Software", "AI & Automation", "Digital Marketing", "Paid Advertising", "SEO", "Full Package"],
      budgetOptions: ["Under $5,000", "$5,000 - $15,000", "$15,000 - $35,000", "$35,000+", "Ongoing Retainer"],
      sendMessage: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent Successfully!",
      successBody: "We'll get back to you within 24 hours. Talk soon!",
      errorMessage: "Something went wrong. Please try again or email us directly.",
      privacyConsent: "By submitting, you agree to our",
      privacyLink: "Privacy Policy",
    },
    es: {
      availableBadge: "Disponible para Proyectos",
      headline: "¿Listo para Construir Algo que Realmente Funcione?",
      subheadline: "Sin presentaciones vacías, sin relleno. Solo una conversación sobre tus objetivos y cómo podemos ayudarte a alcanzarlos. Agenda tu consulta gratuita.",
      email: "Correo",
      serviceArea: "Área de Servicio",
      businessHours: "Horario de Atención",
      trustedBy: "La confianza de líderes de la industria",
      badges: ["200+ Proyectos", "98% Satisfacción", "3x ROI Promedio"],
      formTitle: "Agenda Tu Consulta Gratuita",
      formSubtitle: "Llena el formulario y te responderemos en menos de 24 horas.",
      fieldName: "Tu Nombre",
      fieldEmail: "Correo de Trabajo",
      fieldCompany: "Empresa",
      fieldPhone: "Teléfono (Opcional)",
      fieldService: "¿En Qué Podemos Ayudarte?",
      fieldBudget: "Rango de Presupuesto",
      fieldMessage: "Cuéntanos Sobre Tu Proyecto",
      placeholderName: "Juan Pérez",
      placeholderEmail: "juan@empresa.com",
      placeholderCompany: "Tu Empresa",
      placeholderPhone: "+52 (55) 1234-5678",
      placeholderMessage: "Cuéntanos sobre tu proyecto, objetivos y tiempos...",
      selectService: "Selecciona un servicio",
      selectBudget: "Selecciona rango de presupuesto",
      serviceOptions: ["Desarrollo Web", "Software a la Medida", "IA y Automatización", "Marketing Digital", "Publicidad de Pago", "SEO", "Paquete Completo"],
      budgetOptions: ["Menos de $90,000 MXN", "$90,000 - $270,000 MXN", "$270,000 - $630,000 MXN", "$630,000+ MXN", "Retainer Mensual"],
      sendMessage: "Enviar Mensaje",
      sending: "Enviando...",
      successTitle: "¡Mensaje Enviado Exitosamente!",
      successBody: "Te responderemos en menos de 24 horas. ¡Hablamos pronto!",
      errorMessage: "Algo salió mal. Inténtalo de nuevo o escríbenos directamente.",
      privacyConsent: "Al enviar, aceptas nuestra",
      privacyLink: "Política de Privacidad",
    },
  },

  // ─── Footer ───────────────────────────────────────────────────
  footer: {
    en: {
      workTogether: "Let's work together",
      readyStart: "Ready to start your next project?",
      getInTouch: "Get in Touch",
      description: "Full-stack digital agency helping businesses build products that convert, scale, and dominate.",
      servicesTitle: "Services",
      contactTitle: "Contact",
      copyright: "© 2025 FullStack Studio Design. All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
    },
    es: {
      workTogether: "Trabajemos juntos",
      readyStart: "¿Listo para iniciar tu próximo proyecto?",
      getInTouch: "Contáctanos",
      description: "Agencia digital full-stack que ayuda a negocios a construir productos que convierten, escalan y dominan.",
      servicesTitle: "Servicios",
      contactTitle: "Contacto",
      copyright: "© 2025 FullStack Studio Design. Todos los derechos reservados.",
      privacy: "Privacidad",
      terms: "Términos",
    },
  },

  // ─── Promo Banner ─────────────────────────────────────────────
  promo: {
    en: {
      headline: "20% OFF",
      headlineSuffix: "Your First Project!",
      body: "Limited time offer. Code",
      code: "WELCOME20",
      cta: "Claim Offer",
    },
    es: {
      headline: "20% DE DESCUENTO",
      headlineSuffix: "¡En Tu Primer Proyecto!",
      body: "Oferta por tiempo limitado. Código",
      code: "WELCOME20",
      cta: "Obtener Oferta",
    },
  },

  // ─── Package Details Page ─────────────────────────────────────
  packageDetails: {
    en: {
      startingAt: "Starting at",
      whatsIncluded: "What's Included",
      getPackage: "Get",
      freeConsultation: "Free consultation • No commitment required",
      mostPopular: "Most Popular",
      items: [
        {
          name: "Starter",
          price: "$2,500 USD",
          tagline: "Launch Your Digital Presence",
          description: "Perfect for startups and small businesses ready to establish a professional online presence. Get everything you need to start attracting customers online.",
          features: [
            { title: "5-Page Responsive Website", description: "Home, About, Services, Contact, and one custom page designed to convert visitors into leads." },
            { title: "Basic SEO Setup", description: "On-page optimization, meta tags, sitemap, and Google Search Console integration." },
            { title: "Social Media Starter Kit", description: "Profile setup and branding for 2 platforms with 10 post templates." },
            { title: "AI Chatbot", description: "24/7 FAQ automation to handle common questions while you sleep." },
          ],
          stats: [
            { label: "Pages", value: "5" },
            { label: "Support", value: "30 Days" },
            { label: "Delivery", value: "2-3 Weeks" },
          ],
        },
        {
          name: "Growth",
          price: "$7,500 USD",
          tagline: "Scale Your Business",
          description: "For established businesses ready to accelerate growth. A comprehensive solution combining development, marketing, and AI to drive measurable results.",
          popular: true,
          features: [
            { title: "10-Page Website or Web App", description: "Full-featured website with blog, integrations, or a custom web application." },
            { title: "Full SEO Campaign (90 Days)", description: "Keyword research, content optimization, link building, and monthly reports." },
            { title: "Google & Meta Ads", description: "Campaign setup, optimization, and management for maximum ROI." },
            { title: "AI Lead Qualification", description: "Smart chatbot that qualifies leads and books meetings automatically." },
            { title: "Content Marketing", description: "Blog posts, social media content, and email newsletter setup." },
            { title: "Analytics Dashboard", description: "Real-time metrics tracking with custom KPI dashboard." },
          ],
          stats: [
            { label: "Conversion", value: "+127%" },
            { label: "Traffic", value: "3.2x" },
            { label: "ROAS", value: "4.8x" },
          ],
        },
        {
          name: "Enterprise",
          price: "$360,000+ MXN",
          tagline: "Dominate Your Market",
          description: "Full-scale digital transformation for market leaders. Custom platforms, advanced AI, and comprehensive marketing to establish industry dominance.",
          features: [
            { title: "Custom Software Platform", description: "Bespoke application built from scratch for your unique business needs." },
            { title: "Advanced AI Suite", description: "Custom AI models, automation workflows, and intelligent integrations." },
            { title: "Enterprise SEO Strategy", description: "Comprehensive SEO including technical audits, content strategy, and authority building." },
            { title: "Multi-Channel Advertising", description: "Google, Meta, LinkedIn, TikTok - wherever your audience is." },
            { title: "Marketing Automation", description: "End-to-end automation from lead capture to customer nurturing." },
            { title: "Dedicated Success Manager", description: "Your personal point of contact for strategy, support, and growth." },
          ],
          stats: [
            { label: "Support", value: "6 Months" },
            { label: "Channels", value: "4+" },
            { label: "Custom", value: "100%" },
          ],
        },
      ],
    },
    es: {
      startingAt: "Desde",
      whatsIncluded: "Qué Incluye",
      getPackage: "Obtener",
      freeConsultation: "Consulta gratuita • Sin compromiso",
      mostPopular: "Más Popular",
      items: [
        {
          name: "Starter",
          price: "$45,000 MXN",
          tagline: "Lanza Tu Presencia Digital",
          description: "Perfecto para startups y pequeños negocios listos para establecer una presencia profesional en línea. Obtén todo lo que necesitas para empezar a atraer clientes.",
          features: [
            { title: "Sitio Web Responsivo de 5 Páginas", description: "Inicio, Nosotros, Servicios, Contacto y una página personalizada diseñada para convertir visitantes en leads." },
            { title: "Configuración SEO Básica", description: "Optimización on-page, meta tags, sitemap e integración con Google Search Console." },
            { title: "Kit de Redes Sociales", description: "Configuración de perfil y branding para 2 plataformas con 10 plantillas de publicaciones." },
            { title: "Chatbot con IA", description: "Automatización de FAQ 24/7 para manejar preguntas frecuentes mientras duermes." },
          ],
          stats: [
            { label: "Páginas", value: "5" },
            { label: "Soporte", value: "30 Días" },
            { label: "Entrega", value: "2-3 Semanas" },
          ],
        },
        {
          name: "Growth",
          price: "$135,000 MXN",
          tagline: "Escala Tu Negocio",
          description: "Para negocios establecidos listos para acelerar su crecimiento. Una solución integral que combina desarrollo, marketing e IA para generar resultados medibles.",
          popular: true,
          features: [
            { title: "Sitio Web o App de 10 Páginas", description: "Sitio web completo con blog, integraciones, o una aplicación web personalizada." },
            { title: "Campaña SEO Completa (90 Días)", description: "Investigación de palabras clave, optimización de contenido, link building y reportes mensuales." },
            { title: "Anuncios en Google y Meta", description: "Configuración, optimización y gestión de campañas para máximo ROI." },
            { title: "Calificación de Leads con IA", description: "Chatbot inteligente que califica leads y agenda reuniones automáticamente." },
            { title: "Marketing de Contenidos", description: "Blog posts, contenido para redes sociales y configuración de newsletter." },
            { title: "Dashboard de Analítica", description: "Seguimiento de métricas en tiempo real con dashboard de KPIs personalizado." },
          ],
          stats: [
            { label: "Conversión", value: "+127%" },
            { label: "Tráfico", value: "3.2x" },
            { label: "ROAS", value: "4.8x" },
          ],
        },
        {
          name: "Enterprise",
          price: "$360,000+ MXN",
          tagline: "Domina Tu Mercado",
          description: "Transformación digital completa para líderes del mercado. Plataformas personalizadas, IA avanzada y marketing integral para dominar tu industria.",
          features: [
            { title: "Plataforma de Software a la Medida", description: "Aplicación hecha desde cero para las necesidades únicas de tu negocio." },
            { title: "Suite de IA Avanzada", description: "Modelos de IA personalizados, flujos de automatización e integraciones inteligentes." },
            { title: "Estrategia SEO Empresarial", description: "SEO integral incluyendo auditorías técnicas, estrategia de contenido y construcción de autoridad." },
            { title: "Publicidad Multicanal", description: "Google, Meta, LinkedIn, TikTok - donde sea que esté tu audiencia." },
            { title: "Automatización de Marketing", description: "Automatización de punta a punta, desde captura de leads hasta nutrición de clientes." },
            { title: "Gerente de Éxito Dedicado", description: "Tu punto de contacto personal para estrategia, soporte y crecimiento." },
          ],
          stats: [
            { label: "Soporte", value: "6 Meses" },
            { label: "Canales", value: "4+" },
            { label: "Personalizado", value: "100%" },
          ],
        },
      ],
    },
  },

  // ─── Package Comparison ───────────────────────────────────────
  packageComparison: {
    en: {
      label: "Compare Packages",
      headline: "Find your perfect fit",
      body: "See exactly what's included in each package at a glance.",
      mostPopular: "Most Popular",
      getPackage: "Get",
      mobileNote: "Scroll horizontally to see all packages →",
      categories: [
        {
          name: "Development",
          features: [
            { name: "Website Pages", starter: "5 pages", growth: "10 pages", enterprise: "Unlimited" },
            { name: "Custom Web App", starter: false, growth: true, enterprise: true },
            { name: "Custom Software", starter: false, growth: "Integration", enterprise: "Full Build" },
            { name: "Mobile Responsive", starter: true, growth: true, enterprise: true },
            { name: "CMS Integration", starter: "Basic", growth: "Advanced", enterprise: "Custom" },
            { name: "API Development", starter: false, growth: "Basic", enterprise: "Custom" },
          ],
        },
        {
          name: "Marketing",
          features: [
            { name: "SEO Optimization", starter: "Basic Setup", growth: "90-Day Campaign", enterprise: "Enterprise Strategy" },
            { name: "Google Ads", starter: false, growth: true, enterprise: true },
            { name: "Meta Ads", starter: false, growth: true, enterprise: true },
            { name: "LinkedIn Ads", starter: false, growth: false, enterprise: true },
            { name: "Content Marketing", starter: false, growth: true, enterprise: true },
            { name: "Email Marketing", starter: false, growth: "Setup", enterprise: "Full Management" },
          ],
        },
        {
          name: "AI & Automation",
          features: [
            { name: "AI Chatbot", starter: "FAQ Only", growth: "Lead Qualification", enterprise: "Custom AI" },
            { name: "Marketing Automation", starter: false, growth: "Basic", enterprise: "Advanced" },
            { name: "Custom AI Models", starter: false, growth: false, enterprise: true },
            { name: "Workflow Automation", starter: false, growth: true, enterprise: true },
          ],
        },
        {
          name: "Support & Analytics",
          features: [
            { name: "Support Period", starter: "30 Days", growth: "90 Days", enterprise: "6 Months" },
            { name: "Analytics Dashboard", starter: "Basic", growth: "Custom", enterprise: "Enterprise" },
            { name: "Dedicated Manager", starter: false, growth: false, enterprise: true },
            { name: "Priority Support", starter: false, growth: true, enterprise: "Same Day" },
            { name: "Strategy Sessions", starter: false, growth: "Monthly", enterprise: "Weekly" },
          ],
        },
      ],
      packages: [
        { name: "Starter", price: "$2,500 USD" },
        { name: "Growth", price: "$7,500 USD" },
        { name: "Enterprise", price: "$20,000+ USD" },
      ],
    },
    es: {
      label: "Comparar Paquetes",
      headline: "Encuentra tu opción ideal",
      body: "Ve exactamente qué incluye cada paquete de un vistazo.",
      mostPopular: "Más Popular",
      getPackage: "Obtener",
      mobileNote: "Desliza horizontalmente para ver todos los paquetes →",
      categories: [
        {
          name: "Desarrollo",
          features: [
            { name: "Páginas del Sitio", starter: "5 páginas", growth: "10 páginas", enterprise: "Ilimitadas" },
            { name: "App Web Personalizada", starter: false, growth: true, enterprise: true },
            { name: "Software a la Medida", starter: false, growth: "Integración", enterprise: "Desarrollo Completo" },
            { name: "Diseño Responsivo", starter: true, growth: true, enterprise: true },
            { name: "Integración CMS", starter: "Básica", growth: "Avanzada", enterprise: "Personalizada" },
            { name: "Desarrollo de API", starter: false, growth: "Básico", enterprise: "Personalizado" },
          ],
        },
        {
          name: "Marketing",
          features: [
            { name: "Optimización SEO", starter: "Config. Básica", growth: "Campaña de 90 Días", enterprise: "Estrategia Empresarial" },
            { name: "Google Ads", starter: false, growth: true, enterprise: true },
            { name: "Meta Ads", starter: false, growth: true, enterprise: true },
            { name: "LinkedIn Ads", starter: false, growth: false, enterprise: true },
            { name: "Marketing de Contenidos", starter: false, growth: true, enterprise: true },
            { name: "Email Marketing", starter: false, growth: "Configuración", enterprise: "Gestión Completa" },
          ],
        },
        {
          name: "IA y Automatización",
          features: [
            { name: "Chatbot con IA", starter: "Solo FAQ", growth: "Calificación de Leads", enterprise: "IA Personalizada" },
            { name: "Automatización de Marketing", starter: false, growth: "Básica", enterprise: "Avanzada" },
            { name: "Modelos de IA Personalizados", starter: false, growth: false, enterprise: true },
            { name: "Automatización de Flujos", starter: false, growth: true, enterprise: true },
          ],
        },
        {
          name: "Soporte y Analítica",
          features: [
            { name: "Periodo de Soporte", starter: "30 Días", growth: "90 Días", enterprise: "6 Meses" },
            { name: "Dashboard de Analítica", starter: "Básico", growth: "Personalizado", enterprise: "Empresarial" },
            { name: "Gerente Dedicado", starter: false, growth: false, enterprise: true },
            { name: "Soporte Prioritario", starter: false, growth: true, enterprise: "Mismo Día" },
            { name: "Sesiones de Estrategia", starter: false, growth: "Mensual", enterprise: "Semanal" },
          ],
        },
      ],
      packages: [
        { name: "Starter", price: "$45,000 MXN" },
        { name: "Growth", price: "$135,000 MXN" },
        { name: "Enterprise", price: "$360,000+ MXN" },
      ],
    },
  },

  // ─── Package FAQ ──────────────────────────────────────────────
  packageFaqs: {
    en: [
      { q: "Can I upgrade my package later?", a: "Absolutely! You can upgrade at any time. We'll credit what you've already paid toward your new package, and seamlessly transition your project to include the additional services." },
      { q: "What if I need something not listed in any package?", a: "We're flexible! Every business is unique. Contact us for a custom quote tailored to your specific needs. We can mix and match services or create entirely custom solutions." },
      { q: "How long does each package take to complete?", a: "Starter packages typically complete in 2-3 weeks. Growth packages take 6-8 weeks due to the expanded scope and marketing campaigns. Enterprise projects vary based on complexity, but we'll provide a detailed timeline during our initial consultation." },
      { q: "Do you offer payment plans?", a: "Yes! We offer flexible payment options. Typically, we work with 50% upfront and 50% upon completion for Starter and Growth packages. Enterprise projects can be structured with monthly payments over the project duration." },
      { q: "What happens after the support period ends?", a: "You own everything we build. After the support period, you can continue independently, hire us for ongoing maintenance (starting at $500/month), or upgrade to a package with extended support." },
      { q: "Can I cancel or pause my project?", a: "We understand plans change. For milestone-based projects, you can pause between milestones. Refund policies vary by project stage - typically, completed work is non-refundable, but unused portions can be credited toward future work." },
      { q: "Do you work with businesses outside the US and Canada?", a: "Yes! While we're based in North America, we work with clients globally. We use async communication tools and schedule calls that work across time zones." },
      { q: "What's included in the 'support' period?", a: "Support includes bug fixes, minor content updates, performance monitoring, and technical assistance. It doesn't include new feature development or major redesigns - those would be scoped as additional work." },
    ],
    es: [
      { q: "¿Puedo mejorar mi paquete después?", a: "¡Por supuesto! Puedes hacer upgrade en cualquier momento. Acreditamos lo que ya pagaste hacia tu nuevo paquete y hacemos la transición sin complicaciones." },
      { q: "¿Y si necesito algo que no está en ningún paquete?", a: "¡Somos flexibles! Cada negocio es único. Contáctanos para una cotización personalizada. Podemos mezclar servicios o crear soluciones completamente a la medida." },
      { q: "¿Cuánto tiempo toma completar cada paquete?", a: "Los paquetes Starter se completan típicamente en 2-3 semanas. Los paquetes Growth toman 6-8 semanas por el alcance expandido y campañas de marketing. Los proyectos Enterprise varían según la complejidad, pero daremos un cronograma detallado en la consulta inicial." },
      { q: "¿Ofrecen planes de pago?", a: "¡Sí! Ofrecemos opciones flexibles de pago. Típicamente, trabajamos con 50% al inicio y 50% al finalizar para paquetes Starter y Growth. Proyectos Enterprise se pueden estructurar con pagos mensuales durante la duración del proyecto." },
      { q: "¿Qué pasa cuando termina el periodo de soporte?", a: "Todo lo que construimos es tuyo. Después del periodo de soporte, puedes continuar de forma independiente, contratarnos para mantenimiento continuo (desde $9,000 MXN/mes), o hacer upgrade a un paquete con soporte extendido." },
      { q: "¿Puedo cancelar o pausar mi proyecto?", a: "Entendemos que los planes cambian. Para proyectos por hitos, puedes pausar entre hitos. Las políticas de reembolso varían según la etapa del proyecto—generalmente, el trabajo completado no es reembolsable, pero las porciones no utilizadas se pueden acreditar para trabajo futuro." },
      { q: "¿Trabajan con negocios fuera de EE.UU. y Canadá?", a: "¡Sí! Aunque estamos basados en Norteamérica, trabajamos con clientes a nivel mundial. Usamos herramientas de comunicación asíncrona y agendamos llamadas que funcionen para diferentes zonas horarias." },
      { q: "¿Qué incluye el periodo de 'soporte'?", a: "El soporte incluye corrección de errores, actualizaciones menores de contenido, monitoreo de rendimiento y asistencia técnica. No incluye desarrollo de nuevas funcionalidades o rediseños importantes—esos se cotizan como trabajo adicional." },
    ],
  },

  // ─── Services Page ────────────────────────────────────────────
  servicesPage: {
    en: {
      badge: "Our Services",
      headline: "Full-Service Digital",
      headlineAccent: "Agency Solutions",
      body: "Development, design, AI, and marketing—all under one roof. We're your complete partner for digital success.",
      startingAt: "Starting at",
      learnMore: "Learn More",
      more: "more",
      whyLabel: "Why Choose Us",
      whyHeadline: "One Partner, Complete Solution",
      whyItems: [
        { title: "Integrated Approach", desc: "All services work together seamlessly. Your website, marketing, and software are designed as one cohesive system." },
        { title: "Single Point of Contact", desc: "No more juggling multiple agencies. One team, one vision, one point of accountability for your entire digital presence." },
        { title: "Results-Driven", desc: "We measure success by your metrics. Every service is optimized for ROI, conversions, and real business growth." },
      ],
      ctaHeadline: "Not Sure Which Service",
      ctaAccent: "Fits Your Needs?",
      ctaBody: "Let's talk. We'll help you identify the right solution for your business goals and budget.",
      ctaButton: "Schedule a Free Consultation",
      ctaPackages: "View Packages",
    },
    es: {
      badge: "Nuestros Servicios",
      headline: "Soluciones Digitales",
      headlineAccent: "de Agencia Integral",
      body: "Desarrollo, diseño, IA y marketing—todo bajo un mismo techo. Somos tu socio completo para el éxito digital.",
      startingAt: "Desde",
      learnMore: "Conocer Más",
      more: "más",
      whyLabel: "Por Qué Elegirnos",
      whyHeadline: "Un Solo Socio, Solución Completa",
      whyItems: [
        { title: "Enfoque Integrado", desc: "Todos los servicios trabajan juntos sin problemas. Tu sitio web, marketing y software se diseñan como un sistema cohesivo." },
        { title: "Un Solo Punto de Contacto", desc: "Deja de coordinar múltiples agencias. Un equipo, una visión, un solo responsable para toda tu presencia digital." },
        { title: "Orientado a Resultados", desc: "Medimos el éxito con tus métricas. Cada servicio está optimizado para ROI, conversiones y crecimiento real del negocio." },
      ],
      ctaHeadline: "¿No Estás Seguro de Qué Servicio",
      ctaAccent: "Se Ajusta a Tus Necesidades?",
      ctaBody: "Hablemos. Te ayudaremos a identificar la solución correcta para tus objetivos y presupuesto.",
      ctaButton: "Agenda una Consulta Gratuita",
      ctaPackages: "Ver Paquetes",
    },
  },

  // ─── Service Detail Page ──────────────────────────────────────
  serviceDetail: {
    en: {
      startingAt: "Starting at",
      getStarted: "Get Started",
      noHiddenFees: "No hidden fees",
      freeConsultation: "Free consultation",
      resultsGuaranteed: "Results guaranteed",
      techTitle: "Technologies We Use",
      whatsIncluded: "What's Included",
      everythingYouNeed: "Everything You Need",
      includesBody: "Hover over each item to explore the details. Every service includes comprehensive features designed to deliver real results.",
      whyLabel: "Why Choose Us",
      builtFor: "Built for",
      results: "Results",
      processLabel: "Our Process",
      processHeadline: "From concept to launch in four simple steps",
      processBody: "We've refined our process over hundreds of projects to deliver results efficiently without compromising on quality.",
      processSteps: [
        { step: "01", title: "Discovery", desc: "Deep dive into your business goals and challenges" },
        { step: "02", title: "Strategy", desc: "Custom roadmap tailored to your needs" },
        { step: "03", title: "Execution", desc: "Our team builds with precision and speed" },
        { step: "04", title: "Launch", desc: "Go live and optimize for results" },
      ],
      moreSolutions: "More Solutions",
      exploreOther: "Explore Other Services",
      exploreOtherBody: "Discover how our full suite of services can work together to accelerate your growth",
      learnMore: "Learn more",
      viewAllServices: "View All Services",
      ctaHeadline: "Ready to Get Started?",
      ctaBody: "Let's discuss your project and create a custom solution that drives real results.",
      startProject: "Start Your Project",
      backToServices: "Back to all services",
      serviceNotFound: "Service Not Found",
      backToServicesLink: "Back to Services",
    },
    es: {
      startingAt: "Desde",
      getStarted: "Comenzar",
      noHiddenFees: "Sin costos ocultos",
      freeConsultation: "Consulta gratuita",
      resultsGuaranteed: "Resultados garantizados",
      techTitle: "Tecnologías Que Usamos",
      whatsIncluded: "Qué Incluye",
      everythingYouNeed: "Todo Lo Que Necesitas",
      includesBody: "Pasa el cursor sobre cada elemento para explorar los detalles. Cada servicio incluye funcionalidades integrales diseñadas para entregar resultados reales.",
      whyLabel: "Por Qué Elegirnos",
      builtFor: "Construido para",
      results: "Resultados",
      processLabel: "Nuestro Proceso",
      processHeadline: "Del concepto al lanzamiento en cuatro simples pasos",
      processBody: "Hemos refinado nuestro proceso en cientos de proyectos para entregar resultados eficientemente sin comprometer la calidad.",
      processSteps: [
        { step: "01", title: "Descubrimiento", desc: "Análisis profundo de tus objetivos y retos de negocio" },
        { step: "02", title: "Estrategia", desc: "Hoja de ruta personalizada a tus necesidades" },
        { step: "03", title: "Ejecución", desc: "Nuestro equipo construye con precisión y velocidad" },
        { step: "04", title: "Lanzamiento", desc: "Publicamos y optimizamos para resultados" },
      ],
      moreSolutions: "Más Soluciones",
      exploreOther: "Explora Otros Servicios",
      exploreOtherBody: "Descubre cómo nuestra suite completa de servicios puede trabajar en conjunto para acelerar tu crecimiento",
      learnMore: "Conocer más",
      viewAllServices: "Ver Todos los Servicios",
      ctaHeadline: "¿Listo para Empezar?",
      ctaBody: "Platiquemos sobre tu proyecto y creemos una solución personalizada que genere resultados reales.",
      startProject: "Inicia Tu Proyecto",
      backToServices: "Volver a todos los servicios",
      serviceNotFound: "Servicio No Encontrado",
      backToServicesLink: "Volver a Servicios",
    },
  },

  // ─── Service titles/headlines/descriptions (per slug) ─────────
  serviceData: {
    en: {
      "web-development": { title: "Web Development & Design", headline: "Websites That Turn Clicks Into Customers", price: "$2,500 USD" },
      "software-development": { title: "Custom Software Development", headline: "Build the Tool Your Business Actually Needs", price: "$5,000 USD" },
      "ai-solutions": { title: "AI & Automation", headline: "Put AI to Work for Your Business", price: "$1,500 USD" },
      "digital-marketing": { title: "Digital Marketing", headline: "Marketing That Drives Revenue, Not Vanity Metrics", price: "$1,500 USD/month" },
      "paid-advertising": { title: "Paid Advertising", headline: "Ads That Pay for Themselves", price: "$1,000 USD/month + ad spend" },
      seo: { title: "Search Engine Optimization", headline: "Rank Higher. Get Found. Stay There.", price: "$1,200 USD/month" },
    },
    es: {
      "web-development": { title: "Desarrollo y Diseño Web", headline: "Sitios Web que Convierten Clics en Clientes", price: "$45,000 MXN" },
      "software-development": { title: "Desarrollo de Software a la Medida", headline: "Construye la Herramienta que Tu Negocio Necesita", price: "$90,000 MXN" },
      "ai-solutions": { title: "IA y Automatización", headline: "Pon la IA a Trabajar para Tu Negocio", price: "$27,000 MXN" },
      "digital-marketing": { title: "Marketing Digital", headline: "Marketing que Genera Ingresos, No Métricas de Vanidad", price: "$27,000 MXN/mes" },
      "paid-advertising": { title: "Publicidad de Pago", headline: "Anuncios que Se Pagan Solos", price: "$18,000 MXN/mes + pauta" },
      seo: { title: "Optimización en Motores de Búsqueda", headline: "Posiciónate Más Alto. Que Te Encuentren. Quédate Ahí.", price: "$21,600 MXN/mes" },
    },
  },

  // Service card titles for carousel
  serviceCardTitles: {
    en: {
      "web-development": "Web Design",
      "software-development": "Custom Software",
      "ai-solutions": "AI & Automation",
      "digital-marketing": "Digital Marketing",
      "paid-advertising": "Paid Ads",
      seo: "SEO",
    },
    es: {
      "web-development": "Diseño Web",
      "software-development": "Software a la Medida",
      "ai-solutions": "IA y Automatización",
      "digital-marketing": "Marketing Digital",
      "paid-advertising": "Publicidad",
      seo: "SEO",
    },
  },

  serviceCardDescriptions: {
    en: {
      "web-development": "Beautiful, fast websites that convert visitors into customers.",
      "software-development": "Custom apps and platforms built to scale with your business.",
      "ai-solutions": "Automate tasks and unlock insights with AI-powered tools.",
      "digital-marketing": "Data-driven strategies that grow your audience and revenue.",
      "paid-advertising": "Targeted campaigns that maximize your ad spend ROI.",
      seo: "Rank higher and drive organic traffic that converts.",
    },
    es: {
      "web-development": "Sitios web hermosos y rápidos que convierten visitantes en clientes.",
      "software-development": "Apps y plataformas personalizadas que escalan con tu negocio.",
      "ai-solutions": "Automatiza tareas y obtén insights con herramientas impulsadas por IA.",
      "digital-marketing": "Estrategias basadas en datos que hacen crecer tu audiencia e ingresos.",
      "paid-advertising": "Campañas dirigidas que maximizan el retorno de tu inversión publicitaria.",
      seo: "Posiciónate más alto y genera tráfico orgánico que convierte.",
    },
  },

  // ─── Blog Page ────────────────────────────────────────────────
  blog: {
    en: {
      headline: "Insights & Resources",
      readMore: "Read More",
      posts: [
        { title: "Why Your Website Isn't Converting (And How to Fix It)", category: "Conversion", date: "15 January 2025", excerpt: "The 5 most common conversion killers we see—and the quick wins that can double your leads." },
        { title: "AI in 2025: What's Actually Useful for Your Business", category: "AI & Automation", date: "8 January 2025", excerpt: "Cutting through the hype to show you practical AI applications that deliver real ROI today." },
        { title: "The Death of the Traditional Agency Model", category: "Industry", date: "2 January 2025", excerpt: "Why the old agency playbook is broken—and what the future of digital partnerships looks like." },
      ],
    },
    es: {
      headline: "Recursos e Insights",
      readMore: "Leer Más",
      posts: [
        { title: "Por Qué Tu Sitio Web No Convierte (Y Cómo Solucionarlo)", category: "Conversión", date: "15 de Enero 2025", excerpt: "Los 5 asesinos de conversión más comunes que vemos—y las soluciones rápidas que pueden duplicar tus leads." },
        { title: "IA en 2025: Lo Que Realmente Sirve para Tu Negocio", category: "IA y Automatización", date: "8 de Enero 2025", excerpt: "Cortando el ruido para mostrarte aplicaciones prácticas de IA que generan ROI real hoy." },
        { title: "La Muerte del Modelo Tradicional de Agencia", category: "Industria", date: "2 de Enero 2025", excerpt: "Por qué el viejo manual de agencia está roto—y cómo se ven las alianzas digitales del futuro." },
      ],
    },
  },

  // ─── Privacy Page ─────────────────────────────────────────────
  privacy: {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: 2024. This privacy policy describes how",
      lastUpdatedSuffix: "collects, uses, and protects your information when you use our website and services.",
      infoCollect: "Information We Collect",
      infoCollectBody: "We may collect your name, email address, phone number, company name, and project details when you contact us or submit a form.",
      howUse: "How We Use Your Information",
      howUseBody: "We use your information to respond to inquiries, provide services, and improve our offerings. We do not sell your personal information to third parties.",
      contactTitle: "Contact",
      contactBody: "For privacy-related questions, contact us at",
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: 2024. Esta política de privacidad describe cómo",
      lastUpdatedSuffix: "recopila, usa y protege tu información cuando usas nuestro sitio web y servicios.",
      infoCollect: "Información que Recopilamos",
      infoCollectBody: "Podemos recopilar tu nombre, correo electrónico, número telefónico, nombre de empresa y detalles del proyecto cuando nos contactas o envías un formulario.",
      howUse: "Cómo Usamos Tu Información",
      howUseBody: "Usamos tu información para responder consultas, brindar servicios y mejorar nuestras ofertas. No vendemos tu información personal a terceros.",
      contactTitle: "Contacto",
      contactBody: "Para preguntas relacionadas con privacidad, contáctanos en",
    },
  },

  // ─── Terms Page ───────────────────────────────────────────────
  terms: {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: 2024. By using our website and services, you agree to these terms.",
      servicesTitle: "Services",
      servicesBody: "provides web development, software development, AI solutions, and digital marketing services. Scope and deliverables are defined in individual agreements.",
      paymentTitle: "Payment",
      paymentBody: "Payment terms are specified in your project agreement. Typically 50% upfront and 50% upon completion unless otherwise agreed.",
      contactTitle: "Contact",
      contactBody: "For questions about these terms, contact us at",
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización: 2024. Al usar nuestro sitio web y servicios, aceptas estos términos.",
      servicesTitle: "Servicios",
      servicesBody: "ofrece servicios de desarrollo web, desarrollo de software, soluciones de IA y marketing digital. El alcance y entregables se definen en acuerdos individuales.",
      paymentTitle: "Pago",
      paymentBody: "Los términos de pago se especifican en el acuerdo de tu proyecto. Típicamente 50% al inicio y 50% al finalizar, salvo acuerdo diferente.",
      contactTitle: "Contacto",
      contactBody: "Para preguntas sobre estos términos, contáctanos en",
    },
  },

  // ─── FAQ Page (breadcrumb section) ────────────────────────────
  faqPage: {
    en: {
      title: "Frequently Asked Questions",
      notFoundAnswer: "Haven't found an answer to your query?",
      contactUs: "Contact Us",
    },
    es: {
      title: "Preguntas Frecuentes",
      notFoundAnswer: "¿No encontraste respuesta a tu pregunta?",
      contactUs: "Contáctanos",
    },
  },

  // ─── Not Found Page ───────────────────────────────────────────
  notFound: {
    en: {
      code: "404",
      headline: "This Page Doesn't Exist",
      description: "Looks like you've found a broken link or typed something wrong. No worries—let's get you back on track.",
      backHome: "Go Home",
      contactMe: "Get in Touch",
    },
    es: {
      code: "404",
      headline: "Esta Página No Existe",
      description: "Parece que encontraste un enlace roto o escribiste algo incorrecto. No te preocupes—vamos a redirigirte.",
      backHome: "Ir al Inicio",
      contactMe: "Contáctanos",
    },
  },

  // ─── Scrolling marquee texts ──────────────────────────────────
  marquee: {
    en: {
      scrollingWords: ["Create", "Code", "Connect"],
      bottomText: "Have a project in mind? Let's work together.",
    },
    es: {
      scrollingWords: ["Crea", "Programa", "Conecta"],
      bottomText: "¿Tienes un proyecto en mente? Trabajemos juntos.",
    },
  },

  // ─── Language toggle ──────────────────────────────────────────
  langToggle: {
    en: { label: "ES", tooltip: "Cambiar a Español" },
    es: { label: "EN", tooltip: "Switch to English" },
  },
} as const;

// Type-safe accessor
export function t<K extends keyof typeof translations>(
  section: K,
  locale: Locale
): (typeof translations)[K]["en"] {
  const s = translations[section];
  return (s as Record<string, unknown>)[locale] as (typeof translations)[K]["en"];
}

export default translations;
