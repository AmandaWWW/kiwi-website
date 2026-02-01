// Site Configuration Data
const siteData = {
    // Shared elements that don't change between languages
    hero: {
        title: "KIWI",
        avatarImage: "portrait.png"
    },

    socialLinks: [
        {
            names: { en: "Red Note", cn: "小红书" },
            url: "https://xhslink.com/m/j1yyS2NG1s",
            icon: "instagram",
            color: "#FF0055",
            glow: "rgba(255, 0, 85, 0.4)",
            svgPath: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>'
        },
        {
            names: { en: "LinkedIn", cn: "领英" },
            url: "https://www.linkedin.com/in/huahan-wang-b70243254/",
            icon: "linkedin",
            color: "#00D4FF",
            glow: "rgba(0, 212, 255, 0.4)",
            svgPath: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>'
        },
        {
            names: { en: "GitHub", cn: "GitHub" },
            url: "https://github.com/AmandaWWW",
            icon: "github",
            color: "#39FF14",
            glow: "rgba(57, 255, 20, 0.4)",
            svgPath: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>'
        }
    ],

    // AI Configuration
    aiConfig: AI_PROMPTS,

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

        chat: {
            hoverPrompt: "Say Hi to Kiwi 👋",
            windowTitle: "KIWI // LINK",
            welcomeMessage: "Hello! I'm Kiwi's digital twin. Accessing memory banks... Ask me about my projects or background!",
            placeholder: "Type a message...",
            send: "SEND"
        },

        longBio: "Hi, I'm Kiwi. A Neuroscience student at UCL with a passion for AI. I bridge the gap between biological intelligence and artificial systems, building tools that feel organic and intuitive.",

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
        ],

        timeline: [
            {
                date: "2026.06",
                title: "University Journey End",
                description: "UCL Neuroscience BSc. GPA 4.0/4.0, First Class Honours.",
                side: "left",
                tags: ["Education", "Graduation"]
            },
            {
                date: "2025.09 - Present",
                title: "Meituan - AI Product Intern",
                description: "Led search strategy upgrade (35%->86% accuracy) & Search Agent eval system.",
                side: "right",
                tags: ["Internship", "AI Product"]
            },
            {
                date: "2024.09 - 2025.06",
                title: "Roche - Mentorship Mentee",
                description: "One-on-one mentorship on healthcare career paths & industry trends.",
                side: "right",
                tags: ["Mentorship", "Bio-Tech"]
            },
            {
                date: "2025.04 - 2025.05",
                title: "Bain Cup - Team Captain",
                description: "AI+ESG Strategy. Won 'Outstanding Case Report' (Top 10%).",
                side: "right",
                tags: ["Competition", "Strategy"]
            },
            {
                date: "2024.08 - 2025.05",
                title: "Grid Cell Comp-Model",
                description: "Undergrad Dissertation. Systematic review of CAN & Oscillatory interference models.",
                side: "left",
                tags: ["Research", "Computational Neuro"]
            },
            {
                date: "2024.11",
                title: "Dean's List",
                description: "Top 5% academic performance in Faculty of Life Sciences.",
                side: "left",
                tags: ["Award", "Academic"]
            },
            {
                date: "2024.08",
                title: "Burnstock's Prize",
                description: "Year 1 Top 1 Student (Avg 78.6%) in Neuroscience.",
                side: "left",
                tags: ["Award", "Top Achievement"]
            },
            {
                date: "2024.06 - 2024.09",
                title: "MPIBR - Research Intern",
                description: "Built Python pipeline for transcriptomics data, boosting efficiency by 30%.",
                side: "right",
                tags: ["Internship", "Research", "Coding"]
            },
            {
                date: "2023.09 - 2023.12",
                title: "Business Data Modeling",
                description: "Built profit prediction models (GAM) with 72% explainability for retail optimization.",
                side: "left",
                tags: ["Project", "Data Science"]
            },
            {
                date: "2023.07 - 2023.09",
                title: "CIBR - Research Intern",
                description: "Researched BCI commercialization & ECoG electrode design.",
                side: "right",
                tags: ["Internship", "BCI"]
            },
            {
                date: "2023.05 - 2024.06",
                title: "UCL Neuro Soc - Officer",
                description: "Co-organized events with Parkinson's UK (200+ attendees).",
                side: "right",
                tags: ["Leadership", "Volunteering"]
            },
            {
                date: "2022.09 - 2023.06",
                title: "UCL Student Rep",
                description: "Facilitated integration of Python into the year 2 curriculum.",
                side: "right",
                tags: ["Leadership", "Curriculum"]
            },
            {
                date: "2022.09",
                title: "University Journey Start",
                description: "BSc Neuroscience at UCL.",
                side: "left",
                tags: ["Education"]
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

        chat: {
            hoverPrompt: "快来和Kiwi打个招呼 👋",
            windowTitle: "KIWI // 神经链接",
            welcomeMessage: "你好！我是Kiwi的数字分身。正在读取记忆库... 你可以问我任何关于项目或经历的问题！",
            placeholder: "输入指令...",
            send: "发送"
        },

        longBio: "你好，我是 Kiwi。UCL 神经科学在读，AI 领域的探索者。致力于连接生物智能与人工系统，打造既具生物直觉又功能强大的数字产品。",

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
        ],

       timeline: [
            {
                date: "2026.06",
                title: "本科毕业",
                description: "UCL 神经科学学士。GPA 4.0/4.0，一等荣誉学位。",
                side: "left",
                tags: ["教育", "毕业"]
            },
            {
                date: "2025.09 - 至今",
                title: "美团小美 - AI产品实习生",
                description: "主导搜索策略升级（准确率35%->86%），搭建Search Agent评估体系。",
                side: "right",
                tags: ["实习", "AI产品"]
            },
            {
                date: "2024.09 - 2025.06",
                title: "罗氏制药 - 导师计划学员",
                description: "接受行业专家辅导，深入洞察医疗健康领域职业路径。",
                side: "right",
                tags: ["导师计划", "生物科技"]
            },
            {
                date: "2025.04 - 2025.05",
                title: "贝恩杯案例大赛 - 队长",
                description: "AI+ESG 增长战略。荣获“优秀案例报告”奖（前10%）。",
                side: "right",
                tags: ["竞赛", "战略分析"]
            },
            {
                date: "2024.08 - 2025.05",
                title: "网格细胞计算模型",
                description: "本科毕业论文。系统综述CAN及振荡干涉模型在神经生理学中的应用。",
                side: "left",
                tags: ["研究", "计算神经"]
            },
            {
                date: "2024.11",
                title: "院长名单 (Dean's List)",
                description: "因卓越学术表现入选生命科学院前5%名单。",
                side: "left",
                tags: ["奖项", "学术"]
            },
            {
                date: "2024.08",
                title: "Burnstock 专业第一名",
                description: "以平均分78.6%的成绩获UCL神经科学专业年度第一。",
                side: "left",
                tags: ["奖项", "最高荣誉"]
            },
            {
                date: "2024.06 - 2024.09",
                title: "德国马普所 - 研究实习生",
                description: "搭建转录组数据Python自动化管线，预处理效率提升30%。",
                side: "right",
                tags: ["实习", "科研", "代码"]
            },
            {
                date: "2023.09 - 2023.12",
                title: "商业数据建模项目",
                description: "构建利润预测模型（GAM），解释力达72%，提供成本优化建议。",
                side: "left",
                tags: ["课内项目", "数据科学"]
            },
            {
                date: "2023.07 - 2023.09",
                title: "北京脑科所 - 研究实习生",
                description: "参与ECoG电极设计流程及BCI商业化挑战研究。",
                side: "right",
                tags: ["实习", "脑机接口"]
            },
            {
                date: "2023.05 - 2024.06",
                title: "UCL神经科学学会 - 外联官",
                description: "联合Parkinson's UK策划科普活动（200+参与者）。",
                side: "right",
                tags: ["社团", "领导力"]
            },
            {
                date: "2022.09 - 2023.06",
                title: "UCL 学生代表",
                description: "成功推动Python课程纳入大二必修体系。",
                side: "right",
                tags: ["领导力", "课程改革"]
            },
            {
                date: "2022.09",
                title: "本科入学",
                description: "伦敦大学学院 (UCL) 神经科学专业。",
                side: "left",
                tags: ["教育"]
            }
        ]
    }
};