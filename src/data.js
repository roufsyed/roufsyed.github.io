export const portfolioData = {
  identity: {
    name: 'Rouf Syed',
    title: 'SWE @ Pine Labs',
    location: 'Mumbai, India',
    headline:
      'Software Engineer with hands-on experience building secure payment systems, ISO 8583, e-commerce, and ride-sharing applications.',
    personality:
      'I build the software between your tap and the bank\'s approval — backend services, terminals, Android, and the occasional security rabbit hole.',
    subtitle:
      'Experience in Spring Boot, Golang back-end services, Native Android development, Kotlin Multiplatform and software architecture fundamentals (OOP, LLD, DSA).',
    availability: 'Open to opportunities',
    contact: {
      email: 'roufsyed99@gmail.com',
      phone: '+91 70210 85718',
      location: 'Mumbai, India',
      linkedin: 'https://www.linkedin.com/in/roufsyed',
      github: 'https://github.com/roufsyed'
    }
  },
  focusAreas: [
    'Golang + GraphQL',
    'Spring Boot',
    'Native Android',
    'Android/iOS SDK',
    'Payment Security',
    'mPOS Architecture'
  ],
  career: [
    {
      role: 'Software Engineer — Full Stack',
      org: 'Mosambee (Pine Labs)',
      period: 'Sep 2024 – Present',
      summary:
        'Architecting secure and scalable mPOS solutions for international clients, building BNPL services in Golang + GraphQL, implementing ISO 8583 payment flows, developing Matrix UI SDK for SDUI, shipping payment SDKs for Android/iOS terminals, and building root-detection and merchant-tracking platforms.'
    },
    {
      role: 'Software Engineer — Android',
      org: 'XPayBack',
      period: 'Feb 2023 – May 2024',
      summary:
        'Led revamp of the XPayBack app, defined MVVM + LiveData + Coroutines architecture with PaperDb persistence, and delivered an internal CRM app with customer analytics and reporting.'
    },
    {
      role: 'Software Engineer — Android',
      org: 'Novo Cabs',
      period: 'Nov 2022 – Jan 2023',
      summary:
        'Improved driver app reliability, migrated MVP to MVVM and Java to Kotlin, and introduced open-source maps for asynchronous ride tracking to reduce Google Maps API cost.'
    },
    {
      role: 'SDE — Android',
      org: 'LetsUpgrade',
      period: 'Jan 2022 – Mar 2022',
      summary:
        'Built the early-release app from scratch for technical courses plus a social feed where users could post/read articles and ask/answer questions.'
    },
    {
      role: 'Software Engineer Intern',
      org: 'Techsoyd',
      period: 'May 2020 – Jul 2020',
      summary:
        'Worked on testing (black-box, white-box, smoke), bug discovery, UI/UX improvements, and documentation for a native Windows secure editor product (C#, .NET, SQL).'
    },
    {
      role: 'Web Developer',
      org: 'SuperX Learning',
      period: 'Feb 2020',
      summary:
        'Designed and developed a business website for an EdTech startup using HTML5, CSS3, JavaScript, and Bootstrap.'
    }
  ],
  projects: [
    {
      title: 'International mPOS Platform',
      category: 'Payments',
      impact:
        'Designed secure payment processing foundations for international markets and enterprise clients including Network International, Bank Dhofar, Bank Muscat, and Magnati Payment Solutions.',
      stack: ['Golang', 'GraphQL', 'Security', 'Fintech']
    },
    {
      title: 'BNPL Service Engine',
      category: 'Payments',
      impact:
        'Led implementation of Buy Now Pay Later service logic with backend workflows and API contracts for scalable fintech transactions.',
      stack: ['Go', 'GraphQL', 'Service Design', 'Payments']
    },
    {
      title: 'Cross-Platform Payment SDK',
      category: 'Payments',
      impact:
        'Developed payment SDK integration flow for Android and iOS apps used across terminal and PoS machine ecosystems.',
      stack: ['Android', 'iOS', 'SDK', 'Payments']
    },
    {
      title: 'Matrix UI SDK for SDUI',
      category: 'Android',
      impact:
        'Built UI SDK for server-driven UI architecture, enabling remotely controlled interface updates without full app-release dependency.',
      stack: ['Android', 'SDK', 'SDUI', 'Architecture']
    },
    {
      title: 'Root Detection Security Library',
      category: 'Android',
      impact:
        'Built root-detection library from scratch to protect high-risk application environments against malicious tampering.',
      stack: ['Android', 'Security', 'Library Design']
    },
    {
      title: 'Merchant Tracking Service',
      category: 'Backend',
      impact:
        'Built Vodafone-Idea merchant tracking backend and web dashboard from scratch for operational visibility and management.',
      stack: ['Spring Boot', 'Thymeleaf', 'Java', 'Dashboard']
    }
  ],
  openSource: [
    {
      title: 'BP Tools',
      description:
        'Desktop toolkit for fintech professionals — EMV tag browsing, TLV decoding, cryptogram calculations, and transaction simulation.',
      category: 'Desktop',
      stack: ['Kotlin', 'Jetpack Compose', 'EMV', 'Cryptography'],
      stars: 16,
      url: 'https://github.com/roufsyed/BankingAndPaymentsTool',
      thumbnail:
        'https://raw.githubusercontent.com/roufsyed/BankingAndPaymentsTool/main/docs/screenshots/img.png'
    },
    {
      title: 'Employee Management',
      description:
        'Spring Boot REST API with versioned endpoints (V1/V2) for employee CRUD operations, built on Hibernate + MySQL.',
      category: 'Backend',
      stack: ['Java', 'Spring Boot', 'Hibernate', 'MySQL'],
      stars: 14,
      url: 'https://github.com/roufsyed/employee-management',
      thumbnail: null
    },
    {
      title: 'FreeView',
      description:
        'Lightweight Android app that renders Freedium pages in a clean WebView — read Medium articles without ads or clutter.',
      category: 'Android',
      stack: ['Kotlin', 'MVVM', 'WebView', 'Material Design'],
      stars: 8,
      url: 'https://github.com/roufsyed/FreeView',
      thumbnail:
        'https://raw.githubusercontent.com/roufsyed/FreeView/master/images/homepage.jpeg'
    },
    {
      title: 'AlphaSecure',
      description:
        'Encrypted Android vault for passwords, bank details, and notes — local-only storage with zero network access.',
      category: 'Android',
      stack: ['Java', 'Encryption', 'Android'],
      stars: 4,
      url: 'https://github.com/roufsyed/AlphaSecure',
      thumbnail:
        'https://user-images.githubusercontent.com/51513765/115528582-cdc2bc00-a2af-11eb-968f-713c6a338c43.png'
    },
    {
      title: 'Sehat',
      description:
        'Android health tracker monitoring physical activity, BMI, and heart rate in one place.',
      category: 'Android',
      stack: ['Kotlin', 'Android', 'Health'],
      stars: 3,
      url: 'https://github.com/roufsyed/Sehat',
      thumbnail: null
    },
    {
      title: 'Slate Launcher',
      description:
        'Text-only Android launcher for focus — no icons, no widgets, just apps listed by name. Privacy-first with local-only preferences.',
      category: 'Android',
      stack: ['Kotlin', 'Android', 'Productivity'],
      stars: 1,
      url: 'https://github.com/roufsyed/Slate-Minimal-Launcher',
      thumbnail:
        'https://raw.githubusercontent.com/roufsyed/Slate-Minimal-Launcher/master/screenshots/slate_home_black.jpg'
    }
  ],
  articles: [
    {
      title: 'Stock Market Prediction Using LSTM',
      platform: 'IJRASET Publication',
      url: 'https://www.ijraset.com/best-journal/stock-market-prediction-using-lstm'
    }
  ]
};
