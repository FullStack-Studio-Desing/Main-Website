export const brand = {
  name: "FullStack Studio Design",
  tagline: "Build. Scale. Dominate.",
  email: "info@fullstackstudiodesign.com",
  phone: "+1 (555) 123-4567",
  location: "Serving US, Canada & Beyond",
  hours: "Monday - Friday: 9:00 AM - 6:00 PM EST",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
] as const;

export const hero = {
  headline: "We Build Digital Products That",
  flipWords: ["Convert", "Scale", "Dominate", "Perform"],
  subheadline:
    "From pixel-perfect websites to AI-powered platforms and revenue-driving marketing—we're the full-stack team that turns your vision into measurable results.",
  cta: "Start Your Free Strategy Call",
  stats: [
    { value: "200+", label: "Projects Delivered" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "3x", label: "Average ROI" },
  ],
} as const;

export const about = {
  headline: "More Than an Agency—Your Growth Partner",
  body: "We're a team of engineers, designers, and marketers who believe great digital products shouldn't cost you six months and a fortune. We move fast, build smart, and obsess over the details that make users convert.\n\nFrom startups launching their first MVP to enterprises scaling globally, we've helped 200+ businesses turn ideas into revenue. No fluff, no endless meetings—just exceptional work delivered on time.",
  mission:
    "To help ambitious businesses punch above their weight with technology that performs and marketing that converts.",
  values: [
    { title: "Ship Fast, Ship Right", desc: "Speed without sacrificing quality—we deliver in weeks, not months" },
    { title: "Outcomes Over Output", desc: "We measure success by your metrics, not our hours billed" },
    { title: "Radically Transparent", desc: "Real-time updates, honest feedback, no hidden surprises" },
    { title: "Built to Scale", desc: "Every line of code and campaign is designed to grow with you" },
  ],
} as const;

export const serviceSlugs = [
  "web-development",
  "software-development",
  "ai-solutions",
  "digital-marketing",
  "paid-advertising",
  "seo",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export interface ServiceIncludeItem {
  title: string;
  description: string;
  icon: "design" | "mobile" | "cms" | "ecommerce" | "speed" | "security" | "code" | "api" | "database" | "cloud" | "support" | "bot" | "automation" | "analytics" | "brain" | "strategy" | "social" | "content" | "email" | "brand" | "chart" | "conversion" | "search" | "target" | "testing" | "report" | "local" | "link";
  features?: string[];
}

export interface ServiceData {
  slug: ServiceSlug;
  title: string;
  headline: string;
  description: string;
  longDescription: string;
  idealFor: string[];
  results: { metric: string; value: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  includes: ServiceIncludeItem[];
  price: string;
  faqs: { q: string; a: string }[];
}

export const services: ServiceData[] = [
  {
    slug: "web-development",
    title: "Web Development & Design",
    headline: "Websites That Turn Clicks Into Customers",
    description:
      "Your website is your hardest-working salesperson. We build blazing-fast, conversion-optimized sites that look stunning on every device and rank where your customers are searching.",
    longDescription:
      "In today's digital-first world, your website isn't just a brochure—it's your most powerful sales tool, operating 24/7 without breaks. We don't just build websites; we engineer digital experiences that guide visitors through a carefully crafted journey from curiosity to conversion. Every element, from the hero section to the footer CTA, is strategically designed based on user behavior data and conversion psychology. Our development process combines stunning visual design with rock-solid technical architecture, ensuring your site not only looks premium but performs flawlessly under any traffic load. We obsess over the details that most agencies ignore: micro-interactions that delight users, page speeds that keep Google happy, and accessibility standards that ensure everyone can engage with your brand.",
    idealFor: [
      "Startups launching their first professional web presence",
      "Established businesses with outdated websites losing conversions",
      "E-commerce brands ready to scale their online sales",
      "Service businesses wanting to generate more qualified leads",
      "Companies rebranding and need a fresh digital identity",
    ],
    results: [
      { metric: "Average Load Time", value: "< 2s", description: "Google recommends under 3 seconds—we aim for half that" },
      { metric: "Conversion Rate Increase", value: "150%", description: "Average improvement over previous client websites" },
      { metric: "Mobile Performance", value: "95+", description: "Lighthouse mobile score across all projects" },
      { metric: "SEO Ready", value: "100%", description: "Every site ships with technical SEO fundamentals in place" },
    ],
    process: [
      { step: "01", title: "Discovery & Strategy", description: "We dive deep into your business goals, target audience, and competitive landscape to create a strategic blueprint for your website." },
      { step: "02", title: "Design & Prototyping", description: "Our designers create high-fidelity mockups and interactive prototypes, iterating based on your feedback until every pixel is perfect." },
      { step: "03", title: "Development & Testing", description: "We build your site using modern, scalable technologies, rigorously testing across devices and browsers to ensure flawless performance." },
      { step: "04", title: "Launch & Optimize", description: "We handle deployment, set up analytics, and provide training. Post-launch, we monitor performance and make data-driven optimizations." },
    ],
    includes: [
      {
        title: "Conversion-Focused UI/UX Design",
        description: "Every pixel engineered to guide visitors toward action. We design interfaces that feel intuitive and drive measurable results.",
        icon: "design",
        features: ["User journey mapping", "A/B tested layouts", "Strategic CTA placement", "Heatmap analysis"]
      },
      {
        title: "Mobile-First Responsive Development",
        description: "60% of traffic is mobile. We build mobile-first, then scale up—ensuring flawless experiences across all devices.",
        icon: "mobile",
        features: ["Touch-optimized interactions", "Adaptive layouts", "Cross-browser testing", "Progressive enhancement"]
      },
      {
        title: "CMS Integration",
        description: "Take control of your content with powerful, user-friendly content management systems tailored to your workflow.",
        icon: "cms",
        features: ["WordPress", "Webflow", "Custom headless CMS", "Easy content updates"]
      },
      {
        title: "E-commerce Solutions",
        description: "Sell online with confidence. From product catalogs to checkout, we build stores that convert browsers into buyers.",
        icon: "ecommerce",
        features: ["Shopify & WooCommerce", "Payment gateway setup", "Inventory management", "Order automation"]
      },
      {
        title: "Core Web Vitals Optimization",
        description: "Speed matters. We optimize every millisecond to improve user experience and boost your Google rankings.",
        icon: "speed",
        features: ["Sub-2s load times", "Image optimization", "Code splitting", "CDN configuration"]
      },
      {
        title: "SSL Security & Cloud Hosting",
        description: "Enterprise-grade security and 99.9% uptime. Your site stays fast, secure, and always online.",
        icon: "security",
        features: ["SSL certificates", "DDoS protection", "Auto-scaling", "Daily backups"]
      },
    ],
    price: "$2,500",
    faqs: [
      { q: "How long does a typical website project take?", a: "Most websites are completed in 4-6 weeks from kickoff to launch. Complex e-commerce sites or custom functionality may take 8-10 weeks. We'll provide a detailed timeline during our discovery call." },
      { q: "Do I need to provide content and images?", a: "We can work with what you have or help create everything from scratch. Our packages can include professional copywriting and stock photography, or we can coordinate with your team for brand-specific assets." },
      { q: "Will my website work on mobile devices?", a: "Absolutely. Every site we build is mobile-first, meaning we design for smartphones first and scale up. With 60%+ of web traffic coming from mobile, this isn't optional—it's essential." },
      { q: "Can I update the website myself after launch?", a: "Yes! We build on user-friendly CMS platforms and provide training so you can make updates confidently. For clients who prefer hands-off management, we offer maintenance retainers." },
    ],
  },
  {
    slug: "software-development",
    title: "Custom Software Development",
    headline: "Build the Tool Your Business Actually Needs",
    description:
      "Off-the-shelf software holding you back? We architect and build custom applications, SaaS platforms, and internal tools that scale with your ambition—using battle-tested tech that won't become legacy tomorrow.",
    longDescription:
      "Generic software forces you to adapt your business to its limitations. Custom software adapts to your business, automating your unique workflows, integrating your specific tools, and scaling exactly how you need it to. We've built everything from MVP products that secured millions in funding to enterprise platforms processing millions of transactions daily. Our engineering team brings experience from top tech companies, applying Silicon Valley best practices to projects of any size. We don't just write code—we architect systems that remain maintainable, testable, and scalable years down the road. Every project includes comprehensive documentation, clean codebases, and knowledge transfer so you're never locked into depending on us (though most clients choose to stay).",
    idealFor: [
      "Founders building their MVP to validate and raise funding",
      "Companies with complex workflows that off-the-shelf tools can't handle",
      "Businesses looking to build proprietary technology as a competitive advantage",
      "Organizations needing to integrate multiple systems into one platform",
      "Enterprises replacing legacy systems with modern architecture",
    ],
    results: [
      { metric: "On-Time Delivery", value: "94%", description: "Projects delivered on or ahead of schedule" },
      { metric: "Code Quality", value: "A+", description: "Average score on code quality audits and security reviews" },
      { metric: "Client Retention", value: "87%", description: "Clients who continue working with us after initial project" },
      { metric: "Uptime", value: "99.9%", description: "Average uptime across all platforms we've built and maintain" },
    ],
    process: [
      { step: "01", title: "Requirements & Architecture", description: "We document every feature, user flow, and integration requirement, then design a technical architecture built for scale." },
      { step: "02", title: "Sprint Planning & MVP Definition", description: "We identify the minimum viable feature set to get you to market fast, then plan development sprints with clear milestones." },
      { step: "03", title: "Agile Development", description: "Two-week sprints with demos and feedback loops. You see progress constantly and can adjust priorities as you learn." },
      { step: "04", title: "QA, Launch & Iteration", description: "Rigorous testing, staged rollout, and post-launch monitoring. We iterate based on real user behavior and feedback." },
    ],
    includes: [
      {
        title: "Web Apps (React, Next.js, Node.js)",
        description: "Modern, performant web applications built with the technologies that power the world's best products.",
        icon: "code",
        features: ["Server-side rendering", "Real-time updates", "Offline support", "TypeScript"]
      },
      {
        title: "Mobile Apps (React Native, Flutter)",
        description: "Native-quality mobile experiences for iOS and Android from a single codebase. Ship faster, maintain easier.",
        icon: "mobile",
        features: ["Cross-platform", "Native performance", "Push notifications", "App store deployment"]
      },
      {
        title: "API Development & Third-Party Integrations",
        description: "Connect your systems seamlessly. We build robust APIs and integrate with any service you need.",
        icon: "api",
        features: ["RESTful & GraphQL", "Webhook handlers", "OAuth integration", "API documentation"]
      },
      {
        title: "Database Design & Architecture",
        description: "Data structures that scale. We design schemas that perform whether you have 100 or 100 million records.",
        icon: "database",
        features: ["PostgreSQL & MongoDB", "Query optimization", "Data modeling", "Migration strategies"]
      },
      {
        title: "Cloud Infrastructure (AWS, GCP, Azure)",
        description: "Deploy anywhere, scale everywhere. Infrastructure that grows with your business without breaking the bank.",
        icon: "cloud",
        features: ["Auto-scaling", "Load balancing", "CI/CD pipelines", "Infrastructure as code"]
      },
      {
        title: "Ongoing Maintenance & Support",
        description: "We don't build and disappear. Continuous monitoring, updates, and improvements keep your software running smoothly.",
        icon: "support",
        features: ["24/7 monitoring", "Security patches", "Performance tuning", "Feature updates"]
      },
    ],
    price: "$10,000",
    faqs: [
      { q: "How do you handle intellectual property and code ownership?", a: "You own 100% of the code we write for you. Upon final payment, all source code, documentation, and assets transfer to you completely. We can sign NDAs and custom IP agreements as needed." },
      { q: "What technologies do you use?", a: "We select the best tech stack for each project. Our core expertise includes React, Next.js, Node.js, Python, PostgreSQL, MongoDB, and cloud platforms (AWS, GCP, Azure). We prioritize proven technologies over trendy ones." },
      { q: "Can you take over an existing codebase?", a: "Yes, we regularly inherit and improve existing projects. We start with a code audit to assess quality, identify technical debt, and create a remediation plan before adding new features." },
      { q: "How do you handle ongoing maintenance?", a: "We offer flexible maintenance retainers starting at 10 hours/month. This covers bug fixes, security updates, minor enhancements, and monitoring. Many clients find this more cost-effective than hiring in-house." },
    ],
  },
  {
    slug: "ai-solutions",
    title: "AI & Automation",
    headline: "Put AI to Work for Your Business",
    description:
      "Stop doing manually what machines can do better. We implement practical AI solutions—from intelligent chatbots to workflow automation—that save hours, cut costs, and unlock capabilities you didn't know were possible.",
    longDescription:
      "AI isn't science fiction anymore—it's a practical business tool that's reshaping industries right now. But cutting through the hype to find real, implementable solutions is challenging. That's where we come in. We've helped businesses automate customer support, generate content at scale, analyze data in seconds instead of days, and build AI-powered products that create entirely new revenue streams. Our approach is pragmatic: we start with your business problems, not the technology. We identify where AI can deliver measurable ROI, then implement solutions using proven models and frameworks—whether that's GPT-4, Claude, open-source models, or custom-trained systems. We handle the complexity of prompt engineering, fine-tuning, RAG architectures, and integration so you can focus on the results.",
    idealFor: [
      "Customer service teams drowning in repetitive inquiries",
      "Sales teams wanting AI-powered lead qualification and outreach",
      "Operations managers looking to automate manual processes",
      "Content teams needing to scale output without scaling headcount",
      "Product leaders wanting to add AI features to their offerings",
    ],
    results: [
      { metric: "Support Tickets Automated", value: "70%", description: "Average percentage of inquiries handled without human intervention" },
      { metric: "Time Saved", value: "25hrs/week", description: "Average time reclaimed per team through automation" },
      { metric: "Cost Reduction", value: "40%", description: "Typical operational cost savings in automated workflows" },
      { metric: "Response Time", value: "< 30sec", description: "Average AI chatbot response time vs. minutes for human agents" },
    ],
    process: [
      { step: "01", title: "AI Opportunity Audit", description: "We analyze your operations to identify the highest-impact AI opportunities, prioritizing by ROI potential and implementation complexity." },
      { step: "02", title: "Solution Design", description: "We architect the right AI approach—whether that's off-the-shelf APIs, fine-tuned models, or custom ML systems—with clear cost projections." },
      { step: "03", title: "Build & Train", description: "We implement the solution, training models on your data, engineering prompts, and integrating with your existing systems." },
      { step: "04", title: "Deploy & Optimize", description: "We launch with monitoring in place, continuously improving accuracy and performance based on real-world feedback." },
    ],
    includes: [
      {
        title: "AI Chatbots & Virtual Assistants",
        description: "24/7 customer support that never sleeps. Our chatbots handle inquiries, qualify leads, and escalate intelligently.",
        icon: "bot",
        features: ["Natural language understanding", "Multi-language support", "CRM integration", "Human handoff"]
      },
      {
        title: "Custom GPT & LLM Integrations",
        description: "Harness the power of large language models tailored to your business data and use cases.",
        icon: "brain",
        features: ["Fine-tuned models", "RAG systems", "Prompt engineering", "Cost optimization"]
      },
      {
        title: "Workflow Automation",
        description: "Eliminate repetitive tasks. We connect your tools and automate processes that eat up your team's time.",
        icon: "automation",
        features: ["Zapier & Make", "Custom scripts", "Trigger-based actions", "Error handling"]
      },
      {
        title: "Intelligent Data Analysis & Reporting",
        description: "Turn raw data into actionable insights. AI-powered analytics that surface what matters most.",
        icon: "analytics",
        features: ["Automated reports", "Anomaly detection", "Trend analysis", "Natural language queries"]
      },
      {
        title: "Predictive Analytics & ML Models",
        description: "See the future before it happens. Machine learning models that predict customer behavior and business outcomes.",
        icon: "chart",
        features: ["Churn prediction", "Demand forecasting", "Lead scoring", "Price optimization"]
      },
      {
        title: "AI Strategy & Implementation Roadmaps",
        description: "Not sure where to start? We audit your operations and create a practical AI adoption plan with measurable ROI.",
        icon: "strategy",
        features: ["Use case identification", "ROI modeling", "Build vs. buy analysis", "Phased rollout plans"]
      },
    ],
    price: "$5,000",
    faqs: [
      { q: "Is AI actually ready for business use, or is it still experimental?", a: "AI is production-ready today for many use cases. We focus on proven applications—chatbots, content generation, data analysis, workflow automation—where the technology is mature and ROI is predictable. We'll be honest about what's ready now vs. what's still emerging." },
      { q: "How do you handle data privacy and security with AI?", a: "Very seriously. We can deploy models on your own infrastructure, use enterprise-grade APIs with data processing agreements, or implement on-premise solutions for sensitive industries. We follow SOC 2 practices and can work within HIPAA, GDPR, and other compliance frameworks." },
      { q: "What AI models do you work with?", a: "We're model-agnostic and choose based on your needs. We work with OpenAI (GPT-4), Anthropic (Claude), open-source models (Llama, Mistral), and can fine-tune or train custom models when off-the-shelf doesn't cut it." },
      { q: "What ROI can I realistically expect from AI implementation?", a: "It varies by use case, but we only recommend projects with clear ROI paths. Chatbots typically save $50-200K annually in support costs. Automation projects often pay for themselves within 3-6 months. We provide ROI projections before you commit." },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    headline: "Marketing That Drives Revenue, Not Vanity Metrics",
    description:
      "Likes don't pay the bills. We build data-driven marketing engines that generate qualified leads, nurture them into customers, and turn customers into advocates—all while you focus on running your business.",
    longDescription:
      "Most marketing agencies will show you impressive follower counts and engagement rates while your revenue stays flat. We're different. Every strategy we build starts with one question: how does this generate revenue? We've helped startups go from zero to six-figure MRR and helped established brands double their customer acquisition. Our approach combines the creativity needed to stand out with the analytical rigor to know what's actually working. We don't believe in set-it-and-forget-it marketing. We're constantly testing, measuring, and optimizing across channels—social media, email, content, and beyond—to find the combinations that drive real business growth. When something's not working, we pivot fast. When something is working, we double down.",
    idealFor: [
      "Startups ready to build brand awareness and acquire first customers",
      "Growing businesses that have product-market fit but need scale",
      "Established companies with stagnant growth looking for new channels",
      "B2B companies needing to build thought leadership and pipeline",
      "E-commerce brands wanting to build community beyond transactions",
    ],
    results: [
      { metric: "Lead Generation", value: "3x", description: "Average increase in qualified leads within 6 months" },
      { metric: "Email Revenue", value: "28%", description: "Average percentage of client revenue from email marketing" },
      { metric: "Social Growth", value: "10K+", description: "Average followers gained in first 90 days of management" },
      { metric: "Content ROI", value: "5:1", description: "Average return on content marketing investment" },
    ],
    process: [
      { step: "01", title: "Brand & Market Audit", description: "We analyze your brand positioning, competitive landscape, audience behavior, and current marketing performance to find opportunities." },
      { step: "02", title: "Strategy Development", description: "We build a comprehensive marketing strategy with channel priorities, content pillars, campaign calendars, and KPI targets." },
      { step: "03", title: "Execution & Creation", description: "Our team creates content, manages channels, builds campaigns, and executes the strategy while you focus on your business." },
      { step: "04", title: "Measure & Optimize", description: "Weekly performance reviews, monthly strategy sessions, and continuous optimization to improve results over time." },
    ],
    includes: [
      {
        title: "Social Media Strategy & Management",
        description: "Build a brand people actually follow. Strategic content, consistent posting, and community engagement that grows your audience.",
        icon: "social",
        features: ["Platform strategy", "Content calendar", "Community management", "Influencer outreach"]
      },
      {
        title: "Content Strategy & Creation",
        description: "Content that ranks, engages, and converts. From blogs to videos, we create assets that work for you 24/7.",
        icon: "content",
        features: ["SEO-optimized writing", "Video production", "Infographics", "Case studies"]
      },
      {
        title: "Email Marketing & Automation",
        description: "The highest ROI channel in marketing. Automated sequences that nurture leads while you sleep.",
        icon: "email",
        features: ["Drip campaigns", "Segmentation", "A/B testing", "Deliverability optimization"]
      },
      {
        title: "Brand Positioning & Messaging",
        description: "Stand out in a crowded market. We craft brand stories and messaging that resonate with your ideal customers.",
        icon: "brand",
        features: ["Brand voice development", "Messaging frameworks", "Competitive differentiation", "Value propositions"]
      },
      {
        title: "Analytics & Performance Dashboards",
        description: "Know exactly what's working. Real-time dashboards that track the metrics that matter to your business.",
        icon: "analytics",
        features: ["Custom dashboards", "Attribution modeling", "Goal tracking", "Monthly reporting"]
      },
      {
        title: "Conversion Rate Optimization",
        description: "Get more from your existing traffic. Data-driven experiments that systematically improve your conversion rates.",
        icon: "conversion",
        features: ["A/B testing", "User recordings", "Funnel analysis", "Landing page optimization"]
      },
    ],
    price: "$1,500/month",
    faqs: [
      { q: "How long before I see results from digital marketing?", a: "Some channels produce faster results than others. Email and paid campaigns can generate leads within days. Social media growth typically takes 2-3 months to gain momentum. Content/SEO is a longer play (3-6 months) but compounds over time. We set realistic expectations upfront." },
      { q: "Do you create the content or do we need to provide it?", a: "We handle end-to-end content creation—strategy, writing, design, video, and distribution. We'll need your input and approval, but we do the heavy lifting. If you have an in-house team, we can also collaborate or provide strategy-only services." },
      { q: "How much should I budget for digital marketing?", a: "It depends on your goals and competitive landscape. Most of our clients invest $2,000-10,000/month in marketing services plus ad spend. We'll recommend a budget during our strategy call based on your specific situation." },
      { q: "What metrics do you track and report on?", a: "We focus on business metrics, not vanity metrics. That means revenue, leads, conversion rates, customer acquisition cost, and lifetime value—not just likes and impressions. You'll get weekly dashboards and monthly strategy reviews." },
    ],
  },
  {
    slug: "paid-advertising",
    title: "Paid Advertising",
    headline: "Ads That Pay for Themselves",
    description:
      "Tired of burning ad budget with nothing to show? Our performance marketing team builds, tests, and optimizes campaigns across every major platform—obsessing over ROAS so every dollar works harder.",
    includes: [
      {
        title: "Google Ads",
        description: "Capture high-intent searchers at the moment they're looking for your solution. Search, Display, Shopping, and YouTube.",
        icon: "search",
        features: ["Search campaigns", "Display network", "Shopping ads", "YouTube pre-roll"]
      },
      {
        title: "Meta Ads (Facebook & Instagram)",
        description: "Reach billions of users with precision targeting. Visual campaigns that stop the scroll and drive action.",
        icon: "social",
        features: ["Audience building", "Creative testing", "Catalog sales", "Lead generation"]
      },
      {
        title: "LinkedIn Ads for B2B",
        description: "Target decision-makers by job title, company, and industry. The B2B platform for high-value leads.",
        icon: "target",
        features: ["Sponsored content", "InMail campaigns", "Account-based targeting", "Lead gen forms"]
      },
      {
        title: "TikTok & Emerging Platforms",
        description: "Stay ahead of the curve. We test and scale on emerging platforms before your competitors catch on.",
        icon: "brand",
        features: ["TikTok ads", "Pinterest", "Reddit", "Programmatic"]
      },
      {
        title: "Retargeting & Lookalike Audiences",
        description: "Bring back visitors who didn't convert and find more people just like your best customers.",
        icon: "target",
        features: ["Pixel setup", "Custom audiences", "Lookalike modeling", "Sequential retargeting"]
      },
      {
        title: "A/B Testing & Creative Optimization",
        description: "Never stop improving. Continuous testing of ads, audiences, and landing pages to maximize ROAS.",
        icon: "testing",
        features: ["Multivariate testing", "Creative iteration", "Copy testing", "Landing page experiments"]
      },
      {
        title: "Weekly Performance Reports",
        description: "Full transparency on where your money goes. Clear reports with insights and recommendations, not just data dumps.",
        icon: "report",
        features: ["Spend tracking", "ROAS analysis", "Competitor insights", "Optimization recommendations"]
      },
    ],
    price: "$1,000/month + ad spend",
    longDescription:
      "Paid advertising done wrong is burning money. Done right, it's a predictable growth engine that scales your business on demand. We manage millions in ad spend annually across Google, Meta, LinkedIn, TikTok, and emerging platforms—obsessing over every click, conversion, and dollar of return. Our approach combines data-driven strategy with creative excellence. We build campaigns that not only reach your ideal customers but compel them to act. Through relentless testing of audiences, creatives, and landing pages, we continuously improve performance while you focus on closing deals and serving customers.",
    idealFor: [
      "E-commerce brands wanting to scale profitably",
      "B2B companies needing qualified lead generation",
      "Local businesses targeting specific geographic areas",
      "SaaS companies optimizing customer acquisition cost",
      "Any business with product-market fit ready to pour fuel on the fire",
    ],
    results: [
      { metric: "Average ROAS", value: "4.2x", description: "Return on ad spend across all client campaigns" },
      { metric: "Cost Per Lead Reduction", value: "35%", description: "Average CPL improvement within first 90 days" },
      { metric: "Ad Spend Managed", value: "$10M+", description: "Total annual ad budget under management" },
      { metric: "Conversion Rate", value: "3.8%", description: "Average landing page conversion rate" },
    ],
    process: [
      { step: "01", title: "Audit & Strategy", description: "We analyze your current campaigns, competitors, and market to identify the highest-ROI opportunities." },
      { step: "02", title: "Campaign Architecture", description: "We build campaign structures designed for testing, learning, and scaling—not just launching and hoping." },
      { step: "03", title: "Creative Production", description: "We develop ad creatives that stop the scroll, from static images to video ads, with systematic testing." },
      { step: "04", title: "Launch & Optimize", description: "We launch with close monitoring, making daily optimizations to maximize performance and minimize wasted spend." },
    ],
    faqs: [
      { q: "How much should I budget for ad spend?", a: "It depends on your goals, industry, and competition. Most of our clients invest $3,000-50,000/month in ad spend. We'll recommend a starting budget based on your target CPA and growth goals during our strategy call." },
      { q: "How long before campaigns become profitable?", a: "Most campaigns need 2-4 weeks of data collection and optimization before we can scale profitably. Some see positive ROAS within days; others with longer sales cycles may take 60-90 days. We set realistic expectations upfront." },
      { q: "Do you create the ad creatives?", a: "Yes, creative production is included. We handle copywriting, image creation, and can produce video ads. For brands with strong existing creative, we can also work with your assets or creative team." },
      { q: "What platforms do you specialize in?", a: "We're platform-agnostic and go where your customers are. Our core expertise is Google Ads and Meta (Facebook/Instagram), but we also run LinkedIn, TikTok, Pinterest, Reddit, and programmatic campaigns." },
    ],
  },
  {
    slug: "seo",
    title: "Search Engine Optimization",
    headline: "Rank Higher. Get Found. Stay There.",
    description:
      "SEO isn't a dark art—it's a growth engine. We combine technical excellence with content strategy to build organic traffic that compounds month over month, turning Google into your best source of qualified leads.",
    includes: [
      {
        title: "Technical SEO Audit & Fixes",
        description: "Find and fix everything holding your site back. Crawlability, indexation, site speed, and more.",
        icon: "code",
        features: ["Site crawl analysis", "Indexation fixes", "Speed optimization", "Schema markup"]
      },
      {
        title: "Keyword Research & Content Strategy",
        description: "Target the searches your customers actually make. Data-driven keyword selection with clear content roadmaps.",
        icon: "search",
        features: ["Search volume analysis", "Competitor gap analysis", "Topic clusters", "Content calendar"]
      },
      {
        title: "On-Page & Schema Optimization",
        description: "Make every page crystal clear to search engines. Optimized titles, metas, headers, and structured data.",
        icon: "content",
        features: ["Title & meta optimization", "Header structure", "Internal linking", "Rich snippets"]
      },
      {
        title: "High-Quality Content Creation",
        description: "Content that ranks and resonates. Expert writers create pieces that establish authority and earn links naturally.",
        icon: "content",
        features: ["Blog articles", "Pillar pages", "Resource guides", "Expert interviews"]
      },
      {
        title: "Authority Building & Link Acquisition",
        description: "Earn the backlinks that move rankings. White-hat outreach and digital PR that builds real authority.",
        icon: "link",
        features: ["Guest posting", "Digital PR", "Resource link building", "Broken link reclamation"]
      },
      {
        title: "Local SEO & Google Business Profile",
        description: "Dominate your local market. Optimize for 'near me' searches and turn Google into your storefront.",
        icon: "local",
        features: ["GBP optimization", "Local citations", "Review management", "Local content"]
      },
      {
        title: "Monthly Rankings & Traffic Reports",
        description: "Track your climb up the rankings. Transparent reporting on positions, traffic, and the work being done.",
        icon: "report",
        features: ["Ranking tracking", "Traffic analysis", "Conversion tracking", "Competitive monitoring"]
      },
    ],
    price: "$1,200/month",
    longDescription:
      "While paid ads stop the moment you stop paying, SEO builds an asset that compounds over time. We've helped businesses go from page 10 to page 1, from invisible to industry authority. Our approach combines bulletproof technical foundations with strategic content creation and ethical link building. We don't chase algorithms—we build websites that genuinely deserve to rank because they provide the best answer to what searchers are looking for. The result? Sustainable organic traffic that drives leads and sales month after month without ongoing ad spend.",
    idealFor: [
      "Businesses tired of paying for every click via ads",
      "Companies in competitive industries wanting long-term advantage",
      "Local businesses wanting to dominate 'near me' searches",
      "Content-driven businesses ready to become thought leaders",
      "E-commerce brands wanting to reduce customer acquisition costs",
    ],
    results: [
      { metric: "Avg. Traffic Increase", value: "312%", description: "Organic traffic growth within first 12 months" },
      { metric: "Keywords Ranked", value: "500+", description: "Average new keyword rankings per client annually" },
      { metric: "Page 1 Rankings", value: "85%", description: "Target keywords reaching first page within 6 months" },
      { metric: "Lead Cost Reduction", value: "60%", description: "Average reduction in cost per lead vs. paid channels" },
    ],
    process: [
      { step: "01", title: "Deep Audit", description: "We crawl your site like Google does, identifying every technical issue, content gap, and missed opportunity." },
      { step: "02", title: "Strategy & Roadmap", description: "We create a prioritized action plan targeting keywords you can win, with realistic timelines." },
      { step: "03", title: "Execute & Build", description: "We fix technical issues, optimize existing content, create new content, and build authoritative backlinks." },
      { step: "04", title: "Monitor & Scale", description: "We track rankings, analyze performance, and continuously refine strategy based on what's working." },
    ],
    faqs: [
      { q: "How long does SEO take to work?", a: "SEO is a marathon, not a sprint. You'll typically see initial improvements in 3-4 months, with significant results in 6-12 months. The good news? Unlike ads, SEO results compound over time and continue even if you pause investment." },
      { q: "Can you guarantee first page rankings?", a: "Anyone who guarantees specific rankings is lying—Google's algorithm is proprietary and constantly changing. What we can guarantee is proven methodology, transparent reporting, and consistent progress. Our track record speaks for itself." },
      { q: "Do you build links? Is it safe?", a: "Yes, link building is essential for SEO. We only use white-hat methods: creating linkable content, digital PR, guest posting on real sites, and relationship-based outreach. No PBNs, no link farms, no tactics that risk penalties." },
      { q: "How do you handle local vs. national SEO?", a: "Different beasts requiring different strategies. Local SEO focuses on Google Business Profile, local citations, reviews, and location-specific content. National SEO emphasizes broader content strategy and link building. We tailor our approach to your market." },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export const packages = [
  {
    name: "Starter",
    price: "$2,500",
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
    popular: false,
  },
  {
    name: "Growth",
    price: "$7,500",
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
    price: "$10,000+",
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
    popular: false,
  },
] as const;

export const testimonials = [
  {
    quote:
      "They rebuilt our entire platform in 8 weeks—something our previous agency quoted 6 months for. Revenue is up 340% since launch.",
    author: "Sarah Mitchell",
    role: "CEO, TechStart Inc.",
  },
  {
    quote:
      "The AI chatbot they built handles 70% of our support tickets automatically. We saved $180K in the first year alone.",
    author: "Michael Rodriguez",
    role: "COO, ServicePro",
  },
  {
    quote:
      "Finally, an agency that speaks our language. They understood our business, not just our brief. Our CAC dropped 45% in 90 days.",
    author: "Jennifer Liu",
    role: "VP Marketing, GrowthCo",
  },
  {
    quote:
      "We've worked with agencies that over-promise. These folks under-promise and over-deliver. Every. Single. Time.",
    author: "David Chen",
    role: "Founder, Launchpad Ventures",
  },
  {
    quote:
      "The SEO results speak for themselves—we went from page 4 to position 2 for our main keyword. Organic leads tripled.",
    author: "Amanda Torres",
    role: "Director of Growth, ScaleUp",
  },
] as const;

export const faqs = [
  {
    q: "How fast can you actually deliver?",
    a: "We move fast without cutting corners. Most websites ship in 4-6 weeks. Custom software typically takes 8-12 weeks for an MVP. We'll give you a realistic timeline upfront—and we stick to it.",
  },
  {
    q: "What makes you different from other agencies?",
    a: "We're builders first, not salespeople. You work directly with the people doing the work—no account managers playing telephone. We're obsessed with outcomes, not billable hours.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. Standard terms are 50% to kick off, 50% at launch. For larger projects, we can structure milestone-based payments. We're flexible—let's find what works for you.",
  },
  {
    q: "What happens after launch?",
    a: "We don't disappear. Every project includes a support window (30-90 days depending on scope). For ongoing partnerships, our retainer model gives you a dedicated team without the overhead of hiring.",
  },
  {
    q: "What's your tech stack?",
    a: "We use modern, proven technologies: React, Next.js, Node.js, Python for backends, PostgreSQL/MongoDB for data, AWS/GCP/Vercel for infrastructure. We pick the right tool for the job, not whatever's trending.",
  },
  {
    q: "Do you work with international clients?",
    a: "Absolutely. We serve clients across North America, Europe, and beyond. We have dedicated teams familiar with different markets and can accommodate various time zones.",
  },
  {
    q: "How do we get started?",
    a: "Book a free strategy call. We'll discuss your goals, audit your current setup if relevant, and give you honest recommendations—even if that means we're not the right fit.",
  },
] as const;

export const contact = {
  headline: "Ready to Build Something That Actually Works?",
  subheadline:
    "No pitch decks, no fluff. Just a conversation about your goals and how we can help you hit them. Book your free strategy call.",
  formFields: {
    name: "Your Name",
    email: "Work Email",
    phone: "Phone (Optional)",
    company: "Company",
    service: "What Can We Help With?",
    budget: "Budget Range",
    message: "Tell Us About Your Project",
  },
} as const;

export const blog = {
  headline: "Insights & Resources",
  cta: "View All Articles",
  posts: [
    {
      title: "Why Your Website Isn't Converting (And How to Fix It)",
      category: "Conversion",
      date: "15 January 2025",
      excerpt:
        "The 5 most common conversion killers we see—and the quick wins that can double your leads.",
    },
    {
      title: "AI in 2025: What's Actually Useful for Your Business",
      category: "AI & Automation",
      date: "8 January 2025",
      excerpt:
        "Cutting through the hype to show you practical AI applications that deliver real ROI today.",
    },
    {
      title: "The Death of the Traditional Agency Model",
      category: "Industry",
      date: "2 January 2025",
      excerpt:
        "Why the old agency playbook is broken—and what the future of digital partnerships looks like.",
    },
  ],
} as const;

export const notFoundCopy = {
  code: "404",
  headline: "This Page Doesn't Exist",
  description:
    "Looks like you've found a broken link or typed something wrong. No worries—let's get you back on track.",
  backHome: "Go Home",
  contactMe: "Get in Touch",
} as const;

export const footer = {
  tagline: "Building digital products that perform.",
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Packages", href: "/packages" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  services: [
    "Web Development",
    "Custom Software",
    "AI & Automation",
    "Digital Marketing",
    "Paid Advertising",
    "SEO",
  ],
  connect: ["LinkedIn", "Twitter/X", "Instagram", "GitHub"],
  copyright: "© 2025 FullStack Studio Design. All rights reserved.",
} as const;
