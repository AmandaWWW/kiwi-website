// Site Configuration Data
const siteData = {
    // Shared elements that don't change between languages
    hero: {
        title: "KIWI",
        avatarImage: "portrait.png"
    },

    socialLinks: [
        {
            name: "小红书",
            url: "https://xhslink.com/m/j1yyS2NG1s",
            icon: "instagram",
            color: "#FF0055",
            glow: "rgba(255, 0, 85, 0.4)",
            svgPath: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>'
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/huahan-wang-b70243254/",
            icon: "linkedin",
            color: "#00D4FF",
            glow: "rgba(0, 212, 255, 0.4)",
            svgPath: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>'
        },
        {
            name: "GitHub",
            url: "#",
            icon: "github",
            color: "#39FF14",
            glow: "rgba(57, 255, 20, 0.4)",
            svgPath: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>'
        }
    ],

    // Timeline data
    timeline: [
        {
            date: "2026.06",
            title: "University Journey End",
            description: "GPA 4.0/4.0, First Class Honours. Core Modules: Computational Neuroscience, Neural Informatics.",
            side: "left",
            tags: ["Education", "Graduation"]
        },
        {
            date: "2024.09 - 2026.06",
            title: "Roche Pharmaceutical Mentorship",
            description: "Industry insights & career path guidance.",
            side: "left",
            tags: ["Mentorship", "Industry"]
        },
        {
            date: "2022.09",
            title: "University Journey Start",
            description: "",
            side: "left",
            tags: ["Education"]
        },
        {
            date: "2025.09",
            title: "AI Product Intern",
            description: "Led search strategy upgrade (35%->86% accuracy), Agent tool refactoring.",
            side: "right",
            tags: ["Internship", "AI", "Product"]
        },
        {
            date: "2025.04",
            title: "Horizon Four Captain",
            description: "AI+ESG Strategy, Top 10% Award.",
            side: "right",
            tags: ["Competition", "Leadership"]
        },
        {
            date: "2024.11",
            title: "Dean's List",
            description: "Top 5% academic achievement.",
            side: "right",
            tags: ["Award", "Academic"]
        },
        {
            date: "2024.08",
            title: "Burnstock Prize",
            description: "Year 1 Top 1% achievement.",
            side: "right",
            tags: ["Award", "Top Achievement"]
        },
        {
            date: "2024.06",
            title: "Max Planck Institute Intern",
            description: "Transcriptomics data pipeline, efficiency up 30%.",
            side: "right",
            tags: ["Internship", "Research"]
        },
        {
            date: "2024.08",
            title: "Grid Cell Model",
            description: "Dissertation project on neural grid cells.",
            side: "right",
            tags: ["Project", "Research"]
        },
        {
            date: "2023.09",
            title: "Business Data Modeling",
            description: "Commercial data analysis project.",
            side: "right",
            tags: ["Project", "Data Science"]
        }
    ],

    // Language-specific content
    en: {
        introText: [
            "Hi, this is Kiwi.",
            "Neuroscience student.",
            "Building in the AI space."
        ],

        navigation: [
            { text: "Home", url: "#" },
            { text: "About me", url: "#" },
            { text: "Projects", url: "#" },
            { text: "Articles", url: "#" }
        ],

        tags: [
            {
                label: "Grid Cells",
                description: "Neural cells that fire in a hexagonal grid pattern, essential for spatial navigation and memory.",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "Product Manager",
                description: "Bridging technical vision with user needs to build impactful products.",
                image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "Vibe Coding",
                description: "Writing code that feels right - intuitive, aesthetic, and functionally elegant.",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "Neural Networks",
                description: "Deep learning architectures inspired by biological brain networks.",
                image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "Neuroscience",
                description: "Understanding the biological basis of cognition, behavior, and consciousness.",
                image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "Transcriptomics",
                description: "Studying gene expression patterns to understand cellular function and disease.",
                image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "AI",
                description: "Artificial Intelligence systems that learn, reason, and create.",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "LLMs",
                description: "Large Language Models transforming how we interact with information.",
                image: "https://images.unsplash.com/photo-1675271591211-ce12a6d0d181?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "Brain Computer Interface",
                description: "Direct communication pathways between the brain and external devices.",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60"
            }
        ]
    },

    cn: {
        introText: [
            "你好，我是 Kiwi。",
            "神经科学学生。",
            "在AI领域探索。"
        ],

        navigation: [
            { text: "首页", url: "#" },
            { text: "关于我", url: "#" },
            { text: "项目经历", url: "#" },
            { text: "文章", url: "#" }
        ],

        tags: [
            {
                label: "网格细胞",
                description: "以六边形网格模式放电的神经细胞，对空间导航和记忆至关重要。",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "产品经理",
                description: "连接技术愿景与用户需求，构建有影响力的产品。",
                image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "氛围编程",
                description: "编写感觉对路的代码——直观、美观且功能优雅。",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "神经网络",
                description: "受生物大脑网络启发的深度学习架构。",
                image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "神经科学",
                description: "理解认知、行为和意识的生物学基础。",
                image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "转录组学",
                description: "研究基因表达模式以理解细胞功能和疾病。",
                image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "人工智能",
                description: "能够学习、推理和创造的人工智能系统。",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "大语言模型",
                description: "改变我们与信息交互方式的大型语言模型。",
                image: "https://images.unsplash.com/photo-1675271591211-ce12a6d0d181?w=500&auto=format&fit=crop&q=60"
            },
            {
                label: "脑机接口",
                description: "大脑与外部设备之间的直接通信通道。",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60"
            }
        ]
    }
};