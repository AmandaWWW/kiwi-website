// Language state
let currentLanguage = 'en';
let chatHistory = [];

// Initialize the page with data from config.js
function initializePage() {
    try {
        // Critical safety check for config data
        if (typeof siteData === 'undefined') {
            console.error('Config not loaded - siteData is undefined');
            alert('Error: Configuration data failed to load. Please check if config.js exists and has no syntax errors.');
            return;
        }

        if (!siteData.hero) {
            console.error('Config structure invalid - missing hero data');
            alert('Error: Configuration data structure is invalid. Please check config.js format.');
            return;
        }

        console.log('Config loaded successfully, initializing page...');

        // Set hero content with safety checks
        const heroTitle = document.getElementById('heroTitle');
        if (heroTitle) {
            heroTitle.textContent = siteData.hero.title;
        }

        const heroAvatar = document.getElementById('heroAvatar');
        if (heroAvatar && siteData.hero.avatarImage) {
            heroAvatar.src = siteData.hero.avatarImage;
        }

        // Generate social links (shared across languages)
        renderSocialLinks('en');

        // Render initial content
        renderContent('en');

        // Setup language toggle
        setupLanguageToggle();

        // Initialize chat interface
        initializeChat();
    } catch (error) {
        console.error('Fatal error initializing page:', error);
        console.error('Error stack:', error.stack);

        // User-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: monospace;
            z-index: 9999;
            text-align: center;
        `;
        errorMessage.innerHTML = `
            <h3>⚠️ Page Error</h3>
            <p>Failed to load page content.</p>
            <p style="font-size: 12px; margin-top: 10px;">Check browser console for details</p>
        `;
        document.body.appendChild(errorMessage);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.parentNode.removeChild(errorMessage);
            }
        }, 5000);
    }
}

// Render content based on language
function renderContent(language) {
    try {
        // Update active language state FIRST - this is crucial!
        currentLanguage = language;

        // Clear existing content
        clearContent();

        // Generate navigation
        const navigation = document.getElementById('navigation');
        if (navigation && siteData[language]?.navigation) {
            siteData[language].navigation.forEach(navItem => {
                const link = document.createElement('a');
                link.href = navItem.url;
                link.className = 'nav-link';
                link.textContent = navItem.text;
                navigation.appendChild(link);
            });
        }

        // Get the correct tags data for the selected language
        const currentTags = siteData[language]?.tags;

        // Initialize floating tags with the correct language data
        if (currentTags && Array.isArray(currentTags)) {
            initializeFloatingTags(currentTags);
        } else {
            console.warn('No tags found for language:', language);
        }

        // Initialize typewriter effect with new language (now uses correct currentLanguage)
        initializeTypewriter();

        // Force update the timeline immediately when language changes
        renderTimeline();

        // Update social links with new language
        renderSocialLinks(language);

        // Update chat interface text with new language
        updateChatText();
    } catch (error) {
        console.error('Error rendering content:', error);
    }
}

// Render social links with language support
function renderSocialLinks(language) {
    const socialSection = document.getElementById('socialSection');
    if (!socialSection) return;

    // Clear existing social links
    socialSection.innerHTML = '';

    if (siteData.socialLinks) {
        siteData.socialLinks.forEach(social => {
            const socialCard = document.createElement('a');
            socialCard.href = social.url;
            socialCard.className = `social-card ${social.icon}`;
            socialCard.style.setProperty('--social-color', social.color);
            socialCard.style.setProperty('--social-glow', social.glow);

            // Get the correct name based on language
            const displayName = social.names[language] || social.names.en;

            socialCard.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${social.svgPath}
                </svg>
                <span class="text">${displayName}</span>
            `;

            socialSection.appendChild(socialCard);
        });
    }
}

// Initialize Chat Interface
function initializeChat() {
    const avatar = document.getElementById('heroAvatar');
    const chatDrawer = document.getElementById('chatDrawer');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');

    // Avatar click to open chat
    if (avatar) {
        avatar.addEventListener('click', () => {
            chatDrawer.classList.add('open');
        });
    }

    // Close button
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatDrawer.classList.remove('open');
        });
    }

    // Send message functions
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (message) {
            // 1. Show user message
            addMessage(message, 'user');
            chatInput.value = '';

            // 2. Create placeholder Bot Message
            const botMsgContent = addMessage('', 'bot');

            if (!botMsgContent) {
                console.error('Failed to create bot message element');
                return;
            }

            // 3. Stream the response
            await streamAIResponse(message, (chunk) => {
                // Append text directly to the DOM element
                botMsgContent.textContent += chunk;

                // Auto-scroll
                const chatMessages = document.getElementById('chatMessages');
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }
    };

    // Send button click
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    // Enter key to send
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Update chat text with language
    updateChatText();
}

// Add message to chat
function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const messageText = document.createElement('span');
    messageText.className = 'message-text';
    messageText.textContent = text;

    messageDiv.appendChild(messageText);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Return the text element for streaming updates
    return messageText;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Stream AI response by calling the backend API
async function streamAIResponse(userMessage, onChunk) {
    // 1. Initialize System Prompt if history is empty
    if (chatHistory.length === 0) {
        // Safely access system prompt or fallback
        const systemPrompt = (typeof siteData !== 'undefined' && siteData.aiConfig?.systemPrompt)
            ? siteData.aiConfig.systemPrompt
            : "You are a helpful assistant.";
        chatHistory.push({ role: "system", content: systemPrompt });
    }

    // 2. Add user message to history
    chatHistory.push({ role: "user", content: userMessage });

    try {
        // 3. Call the Vercel Backend (The "Bodyguard")
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: chatHistory })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // 4. Stream Reader Setup
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode chunk and trigger callback
            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            onChunk(chunk); // <--- Update UI immediately
        }

        // 5. Save full response to history
        chatHistory.push({ role: "assistant", content: fullText });
        return fullText;

    } catch (error) {
        console.error("Stream Error:", error);
        onChunk("\n[Connection Error. Please try again.]");
        // Remove the failed user message to prevent context corruption
        chatHistory.pop();
        return null;
    }
}

// Update chat text based on current language
function updateChatText() {
    const chatData = siteData[currentLanguage]?.chat;
    if (!chatData) return;

    // Update hover prompt
    const hoverPrompt = document.getElementById('avatarHoverPrompt');
    if (hoverPrompt) {
        hoverPrompt.textContent = chatData.hoverPrompt;
    }

    // Update chat title
    const chatTitle = document.getElementById('chatTitle');
    if (chatTitle) {
        chatTitle.textContent = chatData.windowTitle;
    }

    // Update welcome message if it's the only message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage && document.querySelectorAll('.message').length === 1) {
        welcomeMessage.textContent = chatData.welcomeMessage;
    }

    // Update input placeholder
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.placeholder = chatData.placeholder;
    }

    // Update send button
    const chatSend = document.getElementById('chatSend');
    if (chatSend) {
        chatSend.textContent = chatData.send;
    }
}

// Clear existing dynamic content
function clearContent() {
    // Clear navigation links
    const navigation = document.getElementById('navigation');
    if (navigation) {
        navigation.innerHTML = '';
    }

    // Clear floating tags
    if (floatingTags && floatingTags.length > 0) {
        floatingTags.forEach(tag => {
            if (tag.element && tag.element.parentNode) {
                tag.element.parentNode.removeChild(tag.element);
            }
            tag.hideInfoCard();
        });
        floatingTags = [];
    }

    // Clear floating tags container - this is crucial!
    const container = document.getElementById('floatingTagsContainer');
    if (container) {
        container.innerHTML = '';
    }

    // Clear typewriter
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }
    const typewriterText = document.getElementById('typewriterText');
    if (typewriterText) {
        typewriterText.textContent = '';
    }
}

// Setup language toggle functionality with defensive checks
function setupLanguageToggle() {
    const langOptions = document.querySelectorAll('.lang-option');

    // Defensive check for language toggle elements
    if (langOptions.length === 0) {
        console.warn("No language toggle elements found (.lang-option)");
        // Continue anyway - language toggle is optional
    }

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const newLanguage = option.getAttribute('data-lang');
            if (newLanguage !== currentLanguage) {
                // Update active state
                langOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                // Re-render content with new language
                renderContent(newLanguage);
            }
        });
    });

    // Set initial active state
    const initialLang = document.querySelector(`.lang-option[data-lang="${currentLanguage}"]`);
    if (initialLang) {
        initialLang.classList.add('active');
    }

    // Setup SPA navigation
    setupSPANavigation();
}

// SPA Navigation System
function setupSPANavigation() {
    // Add event listeners to navigation links
    document.addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const linkText = navLink.textContent.trim().toLowerCase();

            // Handle navigation based on link text
            if (linkText === 'about me' || linkText === '关于我') {
                switchToView('about');
            } else if (linkText === 'home' || linkText === '首页') {
                switchToView('home');
            }
            // Other links can be handled similarly
        }
    });
}

// View switching function with comprehensive null checks
function switchToView(viewName) {
    console.log('switchToView called with:', viewName);

    const homeView = document.getElementById('home-view');
    const aboutView = document.getElementById('about-view');

    console.log('DOM elements found:', {
        homeView: homeView ? '✓' : '✗',
        aboutView: aboutView ? '✓' : '✗'
    });

    // CRITICAL NULL CHECKS - Prevent crashes completely
    if (!homeView) {
        console.error("CRITICAL ERROR: #home-view element not found in DOM!");
        console.error("Please check that index.html contains: <section class=\"view active\" id=\"home-view\">");
        showCriticalError("Home view missing", "Required #home-view element not found in HTML");
        return;
    }

    if (!aboutView) {
        console.error("CRITICAL ERROR: #about-view element not found in DOM!");
        console.error("Please check that index.html contains: <section class=\"view hidden-right\" id=\"about-view\">");
        showCriticalError("About view missing", "Required #about-view element not found in HTML");
        return;
    }

    console.log('Both view elements found, proceeding with transition...');

    try {
        if (viewName === 'about') {
            console.log('Switching to About view');
            // Switch to About view
            homeView.classList.remove('active');
            homeView.classList.add('hidden-left');

            aboutView.classList.remove('hidden-right');
            aboutView.classList.add('active');

            // Render timeline if not already rendered
            renderTimeline();
            addBackButton();

            // Morph social section to minimized toolbar
            const socialSection = document.getElementById('socialSection');
            if (socialSection) {
                socialSection.classList.add('minimized');
            }

            // Add scroll listener for smart sticky back button
            const handleScroll = () => {
                const backBtn = document.getElementById('backButton');
                if (!backBtn) return;

                if (aboutView.scrollTop > 100) {
                    backBtn.classList.add('sticky-mode');
                } else {
                    backBtn.classList.remove('sticky-mode');
                }
            };

            aboutView.addEventListener('scroll', handleScroll);

            // CRITICAL FIX: Trigger immediately to handle restored scroll position
            setTimeout(() => {
                handleScroll();
            }, 10);
        } else if (viewName === 'home') {
            console.log('Switching to Home view');
            // Switch to Home view
            aboutView.classList.remove('active');
            aboutView.classList.add('hidden-right');

            homeView.classList.remove('hidden-left');
            homeView.classList.add('active');

            // Remove back button
            removeBackButton();

            // Restore social section to full cards
            const socialSection = document.getElementById('socialSection');
            if (socialSection) {
                socialSection.classList.remove('minimized');
            }
        } else {
            console.warn('Unknown view name:', viewName);
        }
    } catch (error) {
        console.error('Error during view transition:', error);
        showCriticalError("View transition failed", error.message);
    }
}

// Helper function to show critical errors
function showCriticalError(title, message) {
    // Remove any existing error messages
    const existingErrors = document.querySelectorAll('.critical-error');
    existingErrors.forEach(error => error.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'critical-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(20, 0, 0, 0.95);
        border: 2px solid #ff0000;
        color: white;
        padding: 30px;
        border-radius: 12px;
        font-family: monospace;
        z-index: 99999;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 50px rgba(255, 0, 0, 0.8);
    `;

    errorDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 15px;">🚨 ${title}</div>
        <div style="font-size: 14px; line-height: 1.6;">${message}</div>
        <div style="margin-top: 20px; font-size: 12px; color: #ff9999;">
            Please check the browser console (F12) for detailed debugging information.
        </div>
    `;

    document.body.appendChild(errorDiv);
}

// Render timeline content
function renderTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');

    if (!timelineContainer) {
        console.error("Timeline container not found!");
        return;
    }

    console.log("Rendering timeline...");

    timelineContainer.innerHTML = '';

    const timeline = document.createElement('div');
    timeline.className = 'timeline';

    const getDate = (dateStr) => {
        if (!dateStr) return new Date(0);

        const cleanDate = dateStr.split(' - ')[0];
        const normalizedDate = cleanDate.replace(/\./g, '-');
        const parsed = new Date(normalizedDate);

        if (isNaN(parsed.getTime())) {
            console.warn(`Invalid date: ${dateStr}, using current date`);
            return new Date();
        }

        return parsed;
    };

    const timelineData = siteData[currentLanguage].timeline;
    const sortedTimeline = [...timelineData].sort((a, b) => {
        const dateA = getDate(a.date);
        const dateB = getDate(b.date);
        return dateB - dateA;
    });

    console.log(`Timeline sorted: ${sortedTimeline.length} items`);

    sortedTimeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${item.side}`;

        const node = document.createElement('div');
        node.className = 'timeline-node';

        const content = document.createElement('div');
        content.className = 'timeline-content';

        if (item.date) {
            const date = document.createElement('div');
            date.className = 'timeline-date';
            date.textContent = item.date;
            content.appendChild(date);
        }

        const title = document.createElement('h3');
        title.className = 'timeline-title';
        title.textContent = item.title;
        content.appendChild(title);

        if (item.description) {
            const description = document.createElement('p');
            description.className = 'timeline-description';
            description.textContent = item.description;
            content.appendChild(description);
        }

        if (item.tags && item.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'timeline-tags';

            item.tags.forEach(tagText => {
                const tagElement = document.createElement('span');
                tagElement.className = 'timeline-tag';
                tagElement.textContent = tagText;
                tagsContainer.appendChild(tagElement);
            });

            content.appendChild(tagsContainer);
        }

        timelineItem.appendChild(node);
        timelineItem.appendChild(content);
        timeline.appendChild(timelineItem);

        console.log(`Added timeline item ${index + 1}: ${item.title} (${item.side})`);
    });

    timelineContainer.appendChild(timeline);
    console.log("Timeline rendering complete!");
}

// Add back button to about view
function addBackButton() {
    let backButton = document.getElementById('backButton');
    if (!backButton) {
        backButton = document.createElement('button');
        backButton.id = 'backButton';
        backButton.className = 'back-button';

        // Set button text based on current language
        const buttonText = siteData[currentLanguage]?.backButtonText || '← Back to Home';
        backButton.textContent = buttonText;

        backButton.addEventListener('click', () => {
            switchToView('home');
        });
        document.body.appendChild(backButton);
    } else {
        // Update existing button text if language changed
        const buttonText = siteData[currentLanguage]?.backButtonText || '← Back to Home';
        backButton.textContent = buttonText;
    }
}

// Remove back button
function removeBackButton() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.remove();
    }
}

// Elliptical boundaries for the "donut" safe zone
function getEllipticalBoundaries() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Outer boundary (keep tags inside)
    const outerRadiusX = window.innerWidth * 0.4;   // 40% of screen width
    const outerRadiusY = window.innerHeight * 0.35; // 35% of screen height

    // Inner boundary (keep tags outside - avatar protection)
    const innerRadiusX = window.innerWidth * 0.15;   // 15% of screen width
    const innerRadiusY = window.innerHeight * 0.2;   // 20% of screen height

    // --- NEW LOGIC: Typewriter Box Protection ---
    const typewriter = document.getElementById('typewriterContainer');
    let typewriterBox = null;

    if (typewriter) {
        const rect = typewriter.getBoundingClientRect();
        // Add 20px buffer
        typewriterBox = {
            left: rect.left - 20,
            right: rect.right + 20,
            top: rect.top - 20,
            bottom: rect.bottom + 20
        };
    }
    // --- NEW LOGIC END ---

    return {
        centerX,
        centerY,
        outerRadiusX,
        outerRadiusY,
        innerRadiusX,
        innerRadiusY,
        typewriterBox: typewriterBox // Return the box
    };
}

// Check if a point is inside an ellipse
function isInsideEllipse(x, y, centerX, centerY, radiusX, radiusY) {
    const dx = x - centerX;
    const dy = y - centerY;

    // Normalized distance formula for ellipse
    const normalizedDistance = (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY);

    return normalizedDistance < 1;
}

// Smart positioning function to spawn tags in the elliptical "donut" zone
function getSmartPosition(tagWidth, tagHeight) {
    const bounds = getEllipticalBoundaries();
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        // Generate random position within viewport bounds
        x = Math.random() * (window.innerWidth - tagWidth - 40) + 20;
        y = Math.random() * (window.innerHeight - tagHeight - 40) + 20;

        // Check if position is in the valid "donut" zone
        const tagCenterX = x + tagWidth / 2;
        const tagCenterY = y + tagHeight / 2;

        // Must be OUTSIDE inner ellipse AND INSIDE outer ellipse
        const outsideInner = !isInsideEllipse(tagCenterX, tagCenterY, bounds.centerX, bounds.centerY, bounds.innerRadiusX, bounds.innerRadiusY);
        const insideOuter = isInsideEllipse(tagCenterX, tagCenterY, bounds.centerX, bounds.centerY, bounds.outerRadiusX, bounds.outerRadiusY);

        attempts++;

        // Use position if it's in the valid zone
        if ((outsideInner && insideOuter) || attempts >= maxAttempts) {
            break;
        }
    } while (attempts < maxAttempts);

    return { x, y };
}

// Floating Tag Class with smart positioning
class FloatingTag {
    constructor(tagData, container) {
        this.data = tagData;
        this.label = typeof tagData === 'string' ? tagData : tagData.label;
        this.container = container;
        this.element = this.createTag();
        this.position = this.getSmartPositionForTag();
        this.velocity = this.getRandomVelocity();
        this.baseVelocity = { ...this.velocity };
        this.isHovered = false;
        this.infoCard = null;

        this.setupEvents();
        this.updatePosition();
    }

    createTag() {
        const tag = document.createElement('div');
        tag.className = 'floating-tag';
        tag.textContent = this.label;
        this.container.appendChild(tag);
        return tag;
    }

    getSmartPositionForTag() {
        // Create a temporary element to measure dimensions
        const tempTag = this.element.cloneNode(true);
        tempTag.style.visibility = 'hidden';
        tempTag.style.position = 'absolute';
        document.body.appendChild(tempTag);

        const width = tempTag.offsetWidth;
        const height = tempTag.offsetHeight;
        document.body.removeChild(tempTag);

        const pos = getSmartPosition(width, height);
        return { x: pos.x, y: pos.y };
    }

    getRandomVelocity() {
        return {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.3
        };
    }

    setupEvents() {
        this.element.addEventListener('mouseenter', (e) => {
            this.isHovered = true;
            this.element.classList.add('paused');
            this.showInfoCard(e);
        });

        this.element.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.element.classList.remove('paused');
            this.hideInfoCard();
        });
    }

    showInfoCard(event) {
        // Check if tag has rich data
        if (typeof this.data !== 'object' || !this.data.description) {
            return;
        }

        // Remove existing info card if any
        this.hideInfoCard();

        // Create info card
        this.infoCard = document.createElement('div');
        this.infoCard.className = 'info-card';

        // Add image if available
        if (this.data.image) {
            const img = document.createElement('img');
            img.className = 'info-card-image';
            img.src = this.data.image;
            img.alt = this.label;
            this.infoCard.appendChild(img);
        } else {
            this.infoCard.classList.add('no-image');
        }

        // Create content container
        const content = document.createElement('div');
        content.className = 'info-card-content';

        const title = document.createElement('h3');
        title.className = 'info-card-title';
        title.textContent = this.label;

        const description = document.createElement('p');
        description.className = 'info-card-description';
        description.textContent = this.data.description;

        content.appendChild(title);
        content.appendChild(description);
        this.infoCard.appendChild(content);

        // Position card near cursor/tag
        const rect = this.element.getBoundingClientRect();
        const cardWidth = 280;
        const cardHeight = this.data.image ? 220 : 100;

        let posX = rect.right + 20;
        let posY = rect.top;

        // Keep card within viewport bounds
        if (posX + cardWidth > window.innerWidth - 20) {
            posX = rect.left - cardWidth - 20;
        }
        if (posY + cardHeight > window.innerHeight - 20) {
            posY = window.innerHeight - cardHeight - 20;
        }
        if (posY < 20) {
            posY = 20;
        }

        this.infoCard.style.left = `${posX}px`;
        this.infoCard.style.top = `${posY}px`;

        // Add to document and show
        document.body.appendChild(this.infoCard);

        // Trigger animation
        requestAnimationFrame(() => {
            this.infoCard.classList.add('visible');
        });
    }

    hideInfoCard() {
        if (this.infoCard) {
            this.infoCard.classList.remove('visible');
            setTimeout(() => {
                if (this.infoCard && this.infoCard.parentNode) {
                    this.infoCard.parentNode.removeChild(this.infoCard);
                }
                this.infoCard = null;
            }, 300); // Match transition duration
        }
    }

    updatePosition() {
        if (!this.isHovered) {
            const tagWidth = this.element.offsetWidth || 150;
            const tagHeight = this.element.offsetHeight || 50;

            // Calculate potential new position
            const newX = this.position.x + this.velocity.x;
            const newY = this.position.y + this.velocity.y;

            // Get elliptical boundaries
            const bounds = getEllipticalBoundaries();

            // Calculate tag center point
            const tagCenterX = newX + tagWidth / 2;
            const tagCenterY = newY + tagHeight / 2;

            // Check elliptical boundary collisions
            let collision = false;

            // Check if tag is OUTSIDE outer ellipse (needs to be pushed back in)
            const outsideOuter = !isInsideEllipse(tagCenterX, tagCenterY, bounds.centerX, bounds.centerY, bounds.outerRadiusX, bounds.outerRadiusY);

            // Check if tag is INSIDE inner ellipse (needs to be pushed out)
            const insideInner = isInsideEllipse(tagCenterX, tagCenterY, bounds.centerX, bounds.centerY, bounds.innerRadiusX, bounds.innerRadiusY);

            // --- NEW LOGIC: Rectangular Typewriter Box Collision ---
            let insideTypewriter = false;
            if (bounds.typewriterBox) {
                const box = bounds.typewriterBox;
                // Check if tag bounds intersect with typewriter box (proper rectangle collision)
                insideTypewriter = (
                    newX < box.right &&
                    newX + tagWidth > box.left &&
                    newY < box.bottom &&
                    newY + tagHeight > box.top
                );
            }
            // --- NEW LOGIC END ---

            if (outsideOuter || insideInner || insideTypewriter) {
                collision = true;

                if (insideTypewriter) {
                    // Simple bounce for box collision
                    this.velocity.x *= -1;
                    this.velocity.y *= -1;
                } else {
                    // Existing ellipse bounce logic
                    // Determine which direction to reverse velocity based on tag position relative to center
                    const dx = tagCenterX - bounds.centerX;
                    const dy = tagCenterY - bounds.centerY;

                    // Calculate normalized position to understand which boundary was hit
                    const normalizedX = Math.abs(dx) / bounds.outerRadiusX;
                    const normalizedY = Math.abs(dy) / bounds.outerRadiusY;

                    if (normalizedX > normalizedY) {
                        // Hit left/right boundary
                        this.velocity.x *= -1;
                    } else {
                        // Hit top/bottom boundary
                        this.velocity.y *= -1;
                    }
                }
            }

            // Update position if no collision
            if (!collision) {
                this.position.x = newX;
                this.position.y = newY;
            }

            // Add subtle "breathing" motion
            const time = Date.now() * 0.001;
            const breathingX = Math.sin(time + this.label.length) * 0.2;
            const breathingY = Math.cos(time + this.label.length) * 0.15;

            this.element.style.left = `${this.position.x + breathingX}px`;
            this.element.style.top = `${this.position.y + breathingY}px`;

            // Random rotation
            const rotation = Math.sin(time + this.label.length) * 3;
            this.element.style.transform = `rotate(${rotation}deg)`;
        }
    }

    applyParallax(mouseX, mouseY) {
        if (!this.isHovered) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const deltaX = (mouseX - centerX) / centerX;
            const deltaY = (mouseY - centerY) / centerY;

            // Much more subtle movement for smooth depth effect
            const parallaxX = -deltaX * 8;
            const parallaxY = -deltaY * 5;

            this.element.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
        }
    }
}

// Initialize floating tags
let floatingTags = [];

function initializeFloatingTags(tagsData) {
    const container = document.getElementById('floatingTagsContainer');

    // Clear the container completely - this is crucial!
    if (container) {
        container.innerHTML = '';
    }

    // Use the passed tagsData instead of reading from global
    if (container && tagsData && Array.isArray(tagsData)) {
        floatingTags = tagsData.map(tagData => new FloatingTag(tagData, container));
        console.log(`Initialized ${floatingTags.length} tags for language: ${currentLanguage}`);
    } else {
        console.warn('Could not initialize floating tags - container or tags data missing');
        floatingTags = [];
    }
}

// Mouse tracking for parallax effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation loop
function animate() {
    floatingTags.forEach(tag => {
        tag.updatePosition();
        tag.applyParallax(mouseX, mouseY);
    });
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    const tagWidth = 150;
    const tagHeight = 50;

    floatingTags.forEach(tag => {
        if (tag.position.x > window.innerWidth - tagWidth - 20) {
            tag.position.x = window.innerWidth - tagWidth - 20;
        }
        if (tag.position.y > window.innerHeight - tagHeight - 20) {
            tag.position.y = window.innerHeight - tagHeight - 20;
        }
    });
});

// Typewriter Effect
let typewriterTimeout;

function initializeTypewriter() {
    const typewriterText = document.getElementById('typewriterText');
    const introTextData = siteData[currentLanguage]?.introText;

    if (!typewriterText || !introTextData || !Array.isArray(introTextData)) {
        return;
    }

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    function type() {
        const currentText = introTextData[textIndex];

        if (isDeleting) {
            // Delete character
            typewriterText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Type character
            typewriterText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let timeout = typingSpeed;

        if (!isDeleting && charIndex === currentText.length) {
            // Finished typing, pause before deleting
            timeout = pauseDuration;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % introTextData.length;
            timeout = 500; // Short pause before typing next
        } else if (isDeleting) {
            timeout = deletingSpeed;
        }

        typewriterTimeout = setTimeout(type, timeout);
    }

    // Start typing
    type();
}

// Start everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializePage();
        animate();
    });
} else {
    initializePage();
    animate();
}