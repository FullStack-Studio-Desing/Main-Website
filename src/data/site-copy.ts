export const brand = {
  name: "FullStack Studio Design",
  shortName: "FullStack Studio",
  email: "info@fullstackstudiodesign.com",
  hours: "Monday to Friday, 9:00 AM to 6:00 PM EST",
  location: "Serving US, Canada & Beyond",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const hero = {
  headlineStart: "Growth systems that",
  headlineEmphasis: "actually sell",
  subheadline:
    "Websites, marketing, sales, AI, and CRMs — one team, one monthly plan.",
  primaryCta: "See services",
  primaryHref: "/services",
  secondaryCta: "Client results",
  secondaryHref: "/#testimonials",
  highlights: [
    "One partner across web, marketing, sales, AI, and CRM",
    "Monthly plans from $999 — start on Starter, upgrade as you grow",
    "Weekly performance reporting on every plan",
  ],
  lead: {
    eyebrow: "Live chat",
    title: "Want an agent to reach out?",
    body: "Leave a few details — someone from our team will contact you within one business day. No tickets, no black hole.",
    submit: "Have someone contact me",
    trust: "Real humans. Reply in 1 business day.",
    successTitle: "You're on our list.",
    successBody:
      "A teammate will reach out soon — usually within one business day.",
    chat: {
      statusOnline: "Online now",
      greeting:
        "Hey! I'm {agent} from the team. I'm here now and can get someone to reach out to you.",
      greetingWithCity:
        "Hey! I'm {agent} from the team. I can see you're in {city}.",
      greetingCityPitch:
        "We're actively taking on clients in {city} right now. I can get someone from our side on your case.",
      askName: "What's your name?",
      askEmail: "Nice to meet you, {name}. What's the best email to reach you?",
      askPhone:
        "Got a phone number we can use? Totally optional, you can skip.",
      askNote:
        "Last one. What should we talk about when we call? A sentence is enough.",
      closing:
        "Perfect. I've got your details. A teammate will reach out within one business day. You're not in a ticket queue.",
      schedulePrompt: "Want to pick a time yourself instead?",
      placeholderName: "Type your name…",
      placeholderEmail: "you@company.com",
      placeholderPhone: "Best number to reach you",
      placeholderNote: "Website, ads, CRM, whatever's on your mind…",
      next: "Next",
      send: "Send",
      skip: "Skip",
      skipPhoneLabel: "I'd rather skip the phone",
      skipNoteLabel: "Just have someone contact me",
    },
  },
} as const;

export const services = [
  {
    slug: "websites",
    title: "Websites that sell",
    shortLabel: "Websites",
    description:
      "Fast, conversion-focused sites designed and built in-house. Your hardest-working salesperson, live 24/7.",
    icon: "browser",
    category: "Build",
    page: {
      headline: "A website built to close,",
      headlineEmphasis: "not just look good",
      intro:
        "Most business sites explain. Ours sell. We design and build conversion-focused websites in-house — clear offers, fast load, and paths that lead to booked calls and revenue.",
      body: [
        "A website is often the first salesperson a buyer meets. If it is slow, vague, or built around the wrong offer, every ad dollar and every referral arrives colder than it should.",
        "We start from your revenue goal, not from a template gallery. Information architecture, copy hierarchy, and design decisions all point at one job: make the next step obvious and easy.",
        "After launch we stay on the site. Monthly updates, performance checks, and conversion tweaks mean the site improves with your business instead of going stale in month two.",
      ],
      outcomes: [
        "A site that loads fast and reads clearly on every device",
        "Pages structured around your offer, not a generic template",
        "Conversion paths for inquiries, bookings, and sales",
        "Ongoing updates so the site stays sharp after launch",
      ],
      includes: [
        "Strategy and information architecture",
        "Custom design and front-end build",
        "Mobile-first performance and SEO basics",
        "Analytics and conversion tracking setup",
        "Copy collaboration on key conversion pages",
        "Monthly updates and maintenance on plan",
      ],
      howItWorks: [
        {
          title: "Map the offer",
          detail:
            "We clarify who you sell to, what they buy, and which pages have to do the heavy lifting.",
        },
        {
          title: "Design and build",
          detail:
            "Custom layout and front-end, optimized for speed, clarity, and mobile — no theme soup.",
        },
        {
          title: "Launch and iterate",
          detail:
            "Tracking goes live with the site. We adjust based on real behavior, not guesswork.",
        },
      ],
      faqs: [
        {
          q: "Do you rebuild from scratch or improve what we have?",
          a: "Both. Sometimes a focused redesign of key pages is enough. When the foundation is broken, we rebuild. We will tell you which path fits before you spend.",
        },
        {
          q: "Who writes the copy?",
          a: "We structure the pages and draft conversion copy with you. You bring the product truth; we shape it so visitors know what to do next.",
        },
      ],
      planNote:
        "Website updates and maintenance ship with every plan. Full redesigns and new builds are scoped into Growth and Scale.",
    },
  },
  {
    slug: "marketing",
    title: "Marketing that compounds",
    shortLabel: "Marketing & SEO",
    description:
      "SEO and managed campaigns that bring in qualified traffic month after month, not just while the ads run.",
    icon: "trend",
    category: "Grow",
    page: {
      headline: "Traffic that keeps working",
      headlineEmphasis: "after the ad stops",
      intro:
        "We run SEO and paid campaigns as one system. Search brings compounding organic demand; ads fill the gaps and test offers. You get weekly reporting on what actually moved.",
      body: [
        "Paid ads alone are a faucet — turn them off and the leads stop. SEO alone can take months to pay off. Together they cover the short game and the long game.",
        "We do not optimize for vanity metrics. Traffic matters when it is qualified, attributable, and tied to inquiries or revenue. That is what shows up in your weekly report.",
        "Campaigns and organic work share the same offer logic as your site and funnels, so messaging stays consistent across every touchpoint.",
      ],
      outcomes: [
        "Qualified traffic from search and paid channels",
        "Local and on-page SEO that compounds over months",
        "Campaigns managed against real leads, not vanity metrics",
        "A clear weekly read on what earned your spend",
      ],
      includes: [
        "SEO audit, on-page, and local optimization",
        "Managed Google and Meta campaigns (by plan)",
        "Landing page recommendations tied to campaigns",
        "Keyword and competitor tracking",
        "Creative testing and budget pacing",
        "Weekly performance report",
      ],
      howItWorks: [
        {
          title: "Baseline the demand",
          detail:
            "Audit search presence, competitors, and where paid spend can produce leads quickly.",
        },
        {
          title: "Launch the mix",
          detail:
            "On-page and local SEO start compounding while campaigns fill the pipeline.",
        },
        {
          title: "Report and reallocate",
          detail:
            "Every week we show what worked, what did not, and where the next dollar goes.",
        },
      ],
      faqs: [
        {
          q: "How fast will SEO show results?",
          a: "Meaningful organic movement usually takes a few months. Paid campaigns can produce leads much sooner. We set expectations clearly in the first audit.",
        },
        {
          q: "Do you manage the ad budget?",
          a: "Yes on Growth and Scale. You fund the media spend; we manage targeting, creative tests, and pacing against lead quality.",
        },
      ],
      planNote:
        "Starter includes basic SEO and one managed campaign. Growth and Scale unlock the full SEO program plus Google and Meta ads management.",
    },
  },
  {
    slug: "sales-growth",
    title: "Sales growth",
    shortLabel: "Sales growth",
    description:
      "Funnels, follow-up sequences, and conversion tracking that turn visitors into booked revenue.",
    icon: "chart",
    category: "Grow",
    page: {
      headline: "From visitor to booked",
      headlineEmphasis: "revenue",
      intro:
        "Traffic without a sales system leaks money. We design funnels, follow-up sequences, and conversion tracking so every lead has a next step — and you can see what closed.",
      body: [
        "Most businesses lose revenue between the first click and the closed deal: unclear offers, slow follow-up, and no visibility into where leads stall.",
        "We treat sales growth as a system. Landing pages, sequences, and tracking are designed together so you always know which step is working and which one is leaking.",
        "When the funnel is clear, marketing spend gets more efficient and your team spends time on conversations that are ready to close.",
      ],
      outcomes: [
        "Funnels that match how your buyers actually decide",
        "Follow-up sequences that keep warm leads moving",
        "Tracking from click to booked call or closed deal",
        "Fewer dropped inquiries and stalled pipelines",
      ],
      includes: [
        "Funnel and offer mapping",
        "Landing pages and conversion paths",
        "Email or SMS follow-up sequences",
        "Conversion tracking and attribution",
        "Calendar and booking flow optimization",
        "Monthly optimization against the data",
      ],
      howItWorks: [
        {
          title: "Trace the path",
          detail:
            "We map every step from first visit to booked call or purchase and mark the drop-off points.",
        },
        {
          title: "Rebuild the weak links",
          detail:
            "New landing pages, clearer CTAs, and follow-up sequences close the gaps.",
        },
        {
          title: "Measure the close",
          detail:
            "Attribution and conversion tracking show what turned into revenue — not just clicks.",
        },
      ],
      faqs: [
        {
          q: "Do we need a big sales team for this to work?",
          a: "No. Solo operators and small teams often see the biggest lift because every lead matters more when capacity is limited.",
        },
        {
          q: "Can this connect to our existing CRM?",
          a: "Yes. Sequences and tracking can feed the tools you already use, or we can pair this with a custom CRM on Scale.",
        },
      ],
      planNote:
        "Landing pages and conversion tracking land in Growth. Full sales funnel design and optimization is included on Scale.",
    },
  },
  {
    slug: "ai-automation",
    title: "AI automation",
    shortLabel: "AI automation",
    description:
      "Chatbots, lead qualification, and workflow automation that handle the busywork while your team closes.",
    icon: "robot",
    category: "Automate",
    page: {
      headline: "Automate the busywork,",
      headlineEmphasis: "keep the close",
      intro:
        "AI should free your team to sell — not create another tool to babysit. We build chatbots, lead qualification, and workflow automation that fit how you already work.",
      body: [
        "Automation fails when it is bolted on for novelty. It works when it removes real friction: repeated questions, manual data entry, and leads that sit untouched overnight.",
        "We start with your process. Then we automate the steps that waste time and leave the judgment calls — pricing nuance, relationship closes — with your people.",
        "Every automation has a clear handoff. When a lead is ready for a human, the right person gets the context they need without digging through threads.",
      ],
      outcomes: [
        "Leads qualified before they hit your calendar",
        "Chat and intake that answer the common questions",
        "Workflows that move data without manual copy-paste",
        "Hours back every week for closing and delivery",
      ],
      includes: [
        "Automation audit of your current process",
        "Chatbot and lead-qualification flows",
        "Workflow automation across your tools",
        "Handoff rules so humans get the right leads",
        "Safeguards and review points for edge cases",
        "Iteration based on real conversation data",
      ],
      howItWorks: [
        {
          title: "Find the drag",
          detail:
            "We list the repetitive tasks and response delays that cost you hours or missed leads.",
        },
        {
          title: "Build the flows",
          detail:
            "Chat, qualification, and workflow automation go live with clear ownership and fallbacks.",
        },
        {
          title: "Tune from reality",
          detail:
            "Conversation logs and outcomes tell us what to refine each month.",
        },
      ],
      faqs: [
        {
          q: "Will this replace our team?",
          a: "No. It removes busywork so your team can sell and deliver. Humans stay in the loop for anything that needs judgment.",
        },
        {
          q: "What tools do you automate with?",
          a: "We meet you where you already work — site chat, CRM, email, calendars, and common ops tools. We recommend stack changes only when they clearly help.",
        },
      ],
      planNote:
        "AI automation builds are included on the Scale plan. Growth clients can add scoped automation projects as needed.",
    },
  },
  {
    slug: "custom-crm",
    title: "Custom CRM",
    shortLabel: "Custom CRM",
    description:
      "Pipeline and operations tooling built around how your business actually runs, not the other way around.",
    icon: "database",
    category: "Automate",
    page: {
      headline: "A CRM that matches",
      headlineEmphasis: "how you sell",
      intro:
        "Off-the-shelf CRMs force your process into their boxes. We build pipeline and operations tooling around how your team actually sells, delivers, and reports.",
      body: [
        "If your team lives in spreadsheets, side chats, and a half-configured CRM, pipeline truth is always somewhere else. That slows follow-up and hides forecast reality.",
        "A custom CRM is not about more fields. It is about stages, ownership, and reporting that match how you already win work — so people actually use it.",
        "We integrate the site, ads, and inbox so leads land in the right place with context, and leadership can see the pipeline without chasing updates.",
      ],
      outcomes: [
        "A pipeline that mirrors your real stages",
        "Less spreadsheet chaos and missed follow-ups",
        "Reporting your team will actually open",
        "Tools that fit your workflow instead of fighting it",
      ],
      includes: [
        "Process mapping with your sales and ops leads",
        "Custom pipeline and contact workflows",
        "Integrations with your site, ads, and inbox",
        "Role-based views for sales, ops, and leadership",
        "Training for the people who will live in it",
        "Iteration after go-live based on real use",
      ],
      howItWorks: [
        {
          title: "Document the real process",
          detail:
            "We sit with sales and ops to capture stages, handoffs, and the data you actually need.",
        },
        {
          title: "Build and connect",
          detail:
            "Pipeline, contacts, and integrations go live against your site and marketing systems.",
        },
        {
          title: "Train and tighten",
          detail:
            "Your team adopts the tool, then we refine stages and reporting from live usage.",
        },
      ],
      faqs: [
        {
          q: "Why not just configure HubSpot or Salesforce?",
          a: "Sometimes that is the right answer. When your process is unusual or the off-the-shelf path costs more in workarounds than a focused build, custom wins. We will say which side you are on.",
        },
        {
          q: "How long does a CRM build take?",
          a: "Most first versions land in weeks, not quarters, because we scope to the pipeline you need now and expand from there.",
        },
      ],
      planNote:
        "Custom CRM development is included on the Scale plan, with a dedicated account manager for rollout.",
    },
  },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const audience = {
  headline: "Who this is",
  headlineEmphasis: "for",
  intro:
    "If you already sell something real and want more of the right customers — without guessing where the money went — you are in the right place.",
  fits: [
    {
      label: "You run",
      title: "A service business",
      detail:
        "Contractors, agencies, clinics, consultants, and local brands that need a steady flow of qualified inquiries.",
    },
    {
      label: "You want",
      title: "One team, not vendors",
      detail:
        "Site, marketing, sales systems, and automation in one place — so nothing falls between hand-offs.",
    },
    {
      label: "You expect",
      title: "Weekly proof",
      detail:
        "A clear report on what your money earned, not a slide deck of impressions and vague progress.",
    },
  ],
  notFitsLabel: "Not a fit if",
  notFits: [
    "You only need a cheap logo-and-brochure site",
    "You want six months of strategy before any work ships",
    "You will not act on the data once you have it",
  ],
} as const;

export const process = [
  {
    title: "Audit",
    timing: "Week 1",
    description:
      "We review your site, traffic, and sales process, then show you exactly where revenue is leaking.",
    details: [
      "Site, SEO, and conversion review",
      "Traffic and campaign baseline",
      "Sales path and follow-up gaps",
      "A clear priority list for the first 30 days",
    ],
  },
  {
    title: "Launch",
    timing: "Month 1",
    description:
      "Your plan goes live in the first month: site fixes, campaigns, tracking, and reporting in place.",
    details: [
      "Priority fixes and campaign setup",
      "Tracking and conversion goals live",
      "First weekly report cadence starts",
      "Shared channel for questions and approvals",
    ],
  },
  {
    title: "Grow",
    timing: "Ongoing",
    description:
      "We iterate on what the data shows, and you get a clear report on your desk every single week.",
    details: [
      "Weekly performance report",
      "Monthly strategy adjustments",
      "Tests on pages, ads, and follow-up",
      "Plan upgrades when the business is ready",
    ],
  },
] as const;

export const weeklyReport = {
  headline: "Every week you see",
  headlineEmphasis: "what your money earned",
  intro:
    "No mystery retainers. The weekly report is the heartbeat of the engagement — plain language, the numbers that matter, and the next moves.",
  items: [
    {
      title: "Traffic and lead quality",
      detail: "Where visitors came from and which sources produced real inquiries.",
    },
    {
      title: "Campaign and SEO movement",
      detail: "What spend did, what organic work moved, and what we are changing next.",
    },
    {
      title: "Conversion and pipeline",
      detail: "Form fills, booked calls, and where leads stalled in the path.",
    },
    {
      title: "Actions for the coming week",
      detail: "A short list of what we are shipping — not a vague promise to optimize.",
    },
  ],
} as const;

export const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$999",
    period: "/month",
    tagline: "For businesses getting serious about being found online.",
    bestFor: "Local and early-stage brands that need a steady baseline.",
    features: [
      "Basic SEO, on-page and local",
      "One managed marketing campaign",
      "Weekly performance report",
      "Website updates and maintenance",
      "Email support",
    ],
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$1,500",
    period: "/month",
    tagline: "For businesses ready to outpace their competition.",
    bestFor: "Teams that want paid + organic working as one system.",
    features: [
      "Everything in Starter",
      "Full SEO program",
      "Google and Meta ads management",
      "Landing pages and conversion tracking",
      "Monthly strategy call",
    ],
    highlighted: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: "$2,500",
    period: "/month",
    tagline: "For businesses building a full growth engine.",
    bestFor: "Operators who need automation, CRM, and a dedicated lead.",
    features: [
      "Everything in Growth",
      "AI automation builds",
      "Custom CRM development",
      "Sales funnel design and optimization",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
] as const;

export const proofCapsules = [
  { text: "200+ projects", fill: "mint" },
  { text: "98% happy clients", fill: "neon" },
  { text: "3x average ROI", fill: "mint" },
] as const;

export const testimonialsSection = {
  headline: "Operators who stopped",
  headlineEmphasis: "guessing",
  intro:
    "Real businesses. Clear outcomes. The kind of proof buyers ask for before they book a call.",
} as const;

export const testimonials = [
  {
    quote:
      "They rebuilt our site and launch funnel in eight weeks — our last shop quoted six months. Qualified inquiries tripled in the first quarter, and we finally know which pages earn the spend.",
    author: "Sarah Mitchell",
    role: "CEO, Harborline Logistics",
    result: "3× qualified inquiries",
  },
  {
    quote:
      "The weekly reports alone changed how we run the business. For the first time we see which campaigns produce booked jobs — not vanity clicks — and what to cut next Monday.",
    author: "Marcus Delgado",
    role: "Owner, Delgado & Sons Contracting",
    result: "Clear cost-per-lead every week",
  },
  {
    quote:
      "We dropped the web shop, ads freelancer, and half-configured CRM. One team, one plan, and the pipeline finally matches how we sell. Follow-up stopped falling through the cracks.",
    author: "Priya Nair",
    role: "Founder, Northline Wellness",
    result: "One growth stack, zero vendor hand-offs",
  },
  {
    quote:
      "Our old site looked fine and converted almost nothing. After the rebuild and tracking cleanup, booked consults jumped and we stopped guessing which landing pages deserved the budget.",
    author: "James Okonkwo",
    role: "Managing Partner, Okonkwo Law Group",
    result: "Booked consults up sharply",
  },
  {
    quote:
      "They connected our ads, CRM, and follow-up so the sales team finally gets warm leads the same day. Pipeline is cleaner, and Monday meetings start with numbers instead of opinions.",
    author: "Elena Vargas",
    role: "VP Growth, Rivermark Home Services",
    result: "Same-day warm lead handoff",
  },
  {
    quote:
      "We needed SEO that actually tied to revenue. Within a quarter the priority pages were ranking, and the weekly report showed which keywords turned into real inquiries.",
    author: "Daniel Cho",
    role: "Owner, Cho Dental Group",
    result: "SEO tied to real inquiries",
  },
  {
    quote:
      "Campaign spend used to feel like a black hole. Now every dollar is tagged to a form fill or booked call, and we know what to scale before the week is over.",
    author: "Amanda Reyes",
    role: "Marketing Director, BrightPath Clinics",
    result: "Spend tied to booked calls",
  },
  {
    quote:
      "They shipped fast without the agency theater. Site fixes, ads, and reporting went live in the first month — and we still get a clear action list every single week.",
    author: "Tom Brennan",
    role: "Founder, Brennan Supply Co.",
    result: "Live in month one, report every week",
  },
] as const;

export const faq = [
  {
    q: "What happens in the first 30 days?",
    a: "Week one is the audit: site, traffic, and sales path. Then we ship the highest-leverage fixes, get tracking live, and start your weekly report cadence before the month is out.",
  },
  {
    q: "Do I need all five services?",
    a: "No. Plans bundle the work that fits your stage. Starter focuses on SEO, one campaign, and site care. Growth and Scale add deeper marketing, funnels, automation, and CRM as you need them.",
  },
  {
    q: "Is media spend included in the monthly fee?",
    a: "No. The plan covers strategy, build, and management. Ad platforms bill media spend separately so you keep full visibility on what you are buying.",
  },
  {
    q: "Will this work if we already have a website?",
    a: "Yes. Most clients come in with an existing site. We keep what converts, fix what leaks, and rebuild only when the foundation is holding growth back — you will know which path we recommend before you spend.",
  },
  {
    q: "Can we start on Starter and upgrade later?",
    a: "Yes. Most clients begin where the gaps are loudest and move up when the foundation is working and they want more channels or automation.",
  },
  {
    q: "Who do we talk to week to week?",
    a: "You have a direct channel with the team doing the work. Scale adds a dedicated account manager. You are never stuck in a ticket queue guessing who owns the next step.",
  },
  {
    q: "How long is the commitment?",
    a: "Growth work compounds. We recommend staying long enough to see the system work — especially SEO — but we will outline expectations clearly on the first call so there are no surprises.",
  },
  {
    q: "What do I need to provide to get started?",
    a: "Access to your site, analytics, and ad accounts (if you have them), plus a short walkthrough of how you currently sell. We handle the rest and keep asks tight so you are not buried in homework.",
  },
] as const;

export const closing = {
  lineStart: "Less guesswork,",
  lineEmphasis: "more growth",
  cta: "Book a call",
} as const;

export const contact = {
  headlineStart: "Tell us where you want to be in",
  headlineEmphasis: "90 days",
  body: "Book a call or send a few details — we'll come back within one business day with an honest read on how we can help.",
  bookingPrompt: "Prefer to talk live?",
  bookingBody: "Pick a time that works — we’ll walk through goals, fit, and next steps.",
  bookingLabel: "Book an appointment",
  formDivider: "Or send a message",
} as const;

export const footer = {
  columns: [
    {
      label: "Services",
      links: [
        { href: "/services/websites", label: "Websites" },
        { href: "/services/marketing", label: "Marketing & SEO" },
        { href: "/services/sales-growth", label: "Sales growth" },
        { href: "/services/ai-automation", label: "AI automation" },
        { href: "/services/custom-crm", label: "Custom CRM" },
      ],
    },
    {
      label: "Plans",
      links: [
        { href: "/#pricing", label: "Starter" },
        { href: "/#pricing", label: "Growth" },
        { href: "/#pricing", label: "Scale" },
      ],
    },
    {
      label: "Company",
      links: [
        { href: "/#faq", label: "FAQ" },
        { href: "/contact", label: "Contact" },
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ],
} as const;
