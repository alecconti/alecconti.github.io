// content.js - Content loader for Windows 95 themed portfolio

// Initialize window contents when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update About Me content with personal info
    updateAboutMeContent();
});

// Update the About Me window content
function updateAboutMeContent() {
    const aboutMeWindow = document.getElementById('about-me-window');
    if (!aboutMeWindow) return;
    
    const notepadText = aboutMeWindow.querySelector('.notepad-text');
    if (notepadText) {
        notepadText.innerHTML = `
            <p>Hello World! I'm J. Alec Conti,</p>
            <p>Welcome to my Windows 95-themed portfolio website! I'm a passionate developer with interests in Data Analytics, Machine Learning, and Finance. This interactive portfolio showcases my work, experience, and projects in a nostalgic Windows 95 interface.</p>
            <p>Feel free to explore the desktop and open different folders to learn more about me!</p>
            <p>Current status: Expected to graduate in May 2025, looking for full-time opportunities in Data Analytics, ML Engineering, and Quantitative Finance.</p>
            <p>Location: University Park, PA</p>
            <p>Contact: johnalecconti@gmail.com | 412-477-1878</p>
            <p>Links: <a href="https://alecconti.github.io" target="_blank">alecconti.github.io</a> | <a href="https://linkedin.com/in/alecconti" target="_blank">linkedin.com/in/alecconti</a></p>
        `;
    }
}

// Initialize Internships window with emojis
function initializeInternshipsWindow(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    contentContainer.innerHTML = `
        <div class="explorer-content">
            <div class="explorer-toolbar">
                <button><span class="toolbar-emoji">⬅️</span> Back</button>
                <button><span class="toolbar-emoji">➡️</span> Forward</button>
                <button><span class="toolbar-emoji">⬆️</span> Up</button>
            </div>
            <div class="explorer-address-bar">
                <span>Address:</span>
                <div class="explorer-address">C:\\My Portfolio\\Internships</div>
            </div>
            <div class="explorer-view">
                <div class="explorer-sidebar">
                    <div class="folder-tree">
                        <div><span class="sidebar-emoji">💻</span> My Computer</div>
                        <div><span class="sidebar-emoji">🌐</span> Network</div>
                        <div><span class="sidebar-emoji">🗑️</span> Recycle Bin</div>
                        <div><span class="sidebar-emoji">📁</span> My Portfolio</div>
                    </div>
                </div>
                <div class="explorer-main">
                    <div class="explorer-item" data-content="avanade">
                        <div class="explorer-emoji">💼</div>
                        <span>Avanade (2024)</span>
                    </div>
                    <div class="explorer-item" data-content="federated">
                        <div class="explorer-emoji">💼</div>
                        <span>Federated Hermes (2023)</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers for internship items
    contentContainer.querySelectorAll('.explorer-item').forEach(item => {
        item.addEventListener('click', () => {
            const contentId = item.getAttribute('data-content');
            openInternshipDetails(contentId);
        });
    });
}

// Open internship details in a new window
// Open internship details in a new window
function openInternshipDetails(internshipId) {
    // Create new window for internship details
    const detailWindow = document.createElement('div');
    detailWindow.className = 'window';
    detailWindow.id = `${internshipId}-details-window`;
    detailWindow.style.width = '500px';
    detailWindow.style.height = '400px';
    detailWindow.style.top = '100px';
    detailWindow.style.left = '150px';
    detailWindow.style.zIndex = ++windowZIndex;
    
    // Add window content based on internship ID
    let title, content;
    
    if (internshipId === 'avanade') {
        title = 'Avanade - Data Analytics Intern (2024)';
        content = `
            <div style="padding: 15px; overflow: auto; height: 100%;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 32px; margin-right: 10px;">💼</div>
                    <h3 style="margin: 0;">Avanade - Data Analytics Intern</h3>
                </div>
                <p style="margin-bottom: 5px;"><strong>Period:</strong> May 2024 - August 2024</p>
                <p style="margin-bottom: 5px;"><strong>Location:</strong> Philadelphia</p>
                <p style="margin-bottom: 15px;">A leading digital innovator specializing in technology solutions and consulting services, with a focus on Microsoft platforms and enterprise applications.</p>
                
                <h4 style="margin-bottom: 10px;">Key Achievements:</h4>
                <ul style="list-style-type: none; margin-left: 5px; margin-bottom: 15px;">
                    <li><span style="display: inline-block; width: 20px;">🤖</span> Developed a Service Request Classification System using prompt engineering with Azure OpenAI's GPT models</li>
                    <li><span style="display: inline-block; width: 20px;">⚡</span> Applied tokenization and fine-tuning techniques to enhance categorization speed</li>
                    <li><span style="display: inline-block; width: 20px;">📈</span> Reduced request processing time by 15% and improved classification accuracy by 10%</li>
                    <li><span style="display: inline-block; width: 20px;">🧠</span> Streamlined customer support by designing a tailored Natural Language Support Assistant</li>
                    <li><span style="display: inline-block; width: 20px;">🐍</span> Used Python, Retrieval-Augmented Generation (RAG) frameworks, and OpenAI's GPT-3</li>
                    <li><span style="display: inline-block; width: 20px;">📊</span> Achieved 70% increase in response accuracy and 25% reduction in average handling time</li>
                    <li><span style="display: inline-block; width: 20px;">👥</span> Collaborated with client executives and cross-functional teams using Agile practices</li>
                    <li><span style="display: inline-block; width: 20px;">🎯</span> Ensured project alignment with 100% client satisfaction through rapid adjustments</li>
                </ul>
                
                <h4 style="margin-bottom: 10px;">Technologies Used:</h4>
                <p>Python, Azure OpenAI, GPT Models, RAG Frameworks, Agile Methodologies</p>
            </div>
        `;
    } else if (internshipId === 'federated') {
        title = 'Federated Hermes - Data Engineering Intern (2023)';
        content = `
            <div style="padding: 15px; overflow: auto; height: 100%;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 32px; margin-right: 10px;">💼</div>
                    <h3 style="margin: 0;">Federated Hermes - Data Engineering Intern</h3>
                </div>
                <p style="margin-bottom: 5px;"><strong>Period:</strong> May 2023 - August 2023</p>
                <p style="margin-bottom: 5px;"><strong>Location:</strong> Pittsburgh</p>
                <p style="margin-bottom: 15px;">A global leader in active, responsible investment providing equity, fixed-income, multi-asset, and liquidity management services.</p>
                
                <h4 style="margin-bottom: 10px;">Key Achievements:</h4>
                <ul style="list-style-type: none; margin-left: 5px; margin-bottom: 15px;">
                    <li><span style="display: inline-block; width: 20px;">🏆</span> Led a multidisciplinary team to win 1st place in the Intern Hackathon</li>
                    <li><span style="display: inline-block; width: 20px;">📊</span> Developed a Python-based real-time sentiment analysis platform with 90% accuracy</li>
                    <li><span style="display: inline-block; width: 20px;">🧠</span> Leveraged pre-trained Transformers models and real-time NewsAPI integration</li>
                    <li><span style="display: inline-block; width: 20px;">👨‍💼</span> Presented the solution to the CTO, demonstrating effective communication</li>
                    <li><span style="display: inline-block; width: 20px;">⚙️</span> Designed and optimized data pipelines using Python (Pandas, PySpark), SQL, and Azure Databricks</li>
                    <li><span style="display: inline-block; width: 20px;">🚀</span> Enhanced processing speed and accuracy by 20%, supporting data needs across 5 departments</li>
                    <li><span style="display: inline-block; width: 20px;">🏗️</span> Built and maintained scalable data lakes and warehouses using Python with Apache Spark</li>
                    <li><span style="display: inline-block; width: 20px;">📈</span> Improved reporting efficiency by 30% and facilitated faster decision-making</li>
                    <li><span style="display: inline-block; width: 20px;">👥</span> Worked within an Agile framework to enhance team collaboration and deliver projects on time</li>
                </ul>
                
                <h4 style="margin-bottom: 10px;">Technologies Used:</h4>
                <p>Python, Pandas, PySpark, SQL, Azure Databricks, Apache Spark, Transformers, NewsAPI, Agile Methodologies</p>
            </div>
        `;
    }
    
    // Create window HTML
    detailWindow.innerHTML = `
        <div class="window-header">
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <button class="minimize-button">_</button>
                <button class="maximize-button">□</button>
                <button class="close-button">✕</button>
            </div>
        </div>
        <div class="window-menu-bar">
            <ul>
                <li>File</li>
                <li>Edit</li>
                <li>View</li>
                <li>Help</li>
            </ul>
        </div>
        <div class="window-content">
            ${content}
        </div>
    `;
    
    // Add to DOM
    document.getElementById('desktop').appendChild(detailWindow);
    
    // Add functionality
    const header = detailWindow.querySelector('.window-header');
    const closeBtn = detailWindow.querySelector('.close-button');
    
    // Enable dragging
    enableDragging(detailWindow, header);
    
    // Add close handler
    closeBtn.addEventListener('click', () => {
        detailWindow.remove();
        playSound('click-sound');
    });
    
    // Make window active
    setActiveWindow(detailWindow.id);
    
    // Play sound
    playSound('click-sound');
}

// Update search window with emojis
function initializeSearchWindow(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    contentContainer.innerHTML = `
        <div class="search-content">
            <div class="search-bar">
                <span>Search:</span>
                <input type="text" class="search-input" placeholder="Type search terms..." id="search-input">
                <button id="search-button"><span class="search-emoji">🔍</span> Search</button>
            </div>
            <div class="search-results" id="search-results">
                <div style="text-align: center; padding: 50px;">
                    <div class="large-emoji">🔍</div>
                    <p>Enter a search term above to find information in my portfolio.</p>
                    <p style="margin-top: 10px; font-size: 10px;">Search across projects, skills, experiences, and more!</p>
                </div>
            </div>
        </div>
    `;
    
    // Add search functionality
    const searchInput = contentContainer.querySelector('#search-input');
    const searchButton = contentContainer.querySelector('#search-button');
    const searchResults = contentContainer.querySelector('#search-results');
    
    // Function to perform search - same as before but with emojis in the results
    const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;
        
        // Simulate search loading
        searchResults.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <div class="large-emoji">⏳</div>
                <p>Searching for "${query}"...</p>
                <p style="margin-top: 10px;">Please wait...</p>
            </div>
        `;
        
        // Define emoji mapping for search results
        const categoryEmojis = {
            'Programming': '💻',
            'Skills': '🧠',
            'Projects': '🚀',
            'Interests': '🌟',
            'Experience': '💼'
        };
        
        const itemEmojis = {
            'internships': '💼',
            'projects': '🚀',
            'resume': '📄',
            'company.png': '💼',
            'project.png': '🚀',
            'document.png': '📄'
        };
        
        // Keywords remain the same as in your original code
        // Rest of the search logic...
        
        // Simulate search delay with emoji-based results...
    };
    
    // Add event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Update the control panel with emojis
function initializeControlPanelWindow(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    contentContainer.innerHTML = `
        <div class="control-panel-content">
            <div class="control-panel-item" id="cp-display">
                <div class="control-panel-emoji">🖥️</div>
                <span>Display</span>
            </div>
            <div class="control-panel-item" id="cp-sound">
                <div class="control-panel-emoji">🔊</div>
                <span>Sound</span>
            </div>
            <div class="control-panel-item" id="cp-wallpaper">
                <div class="control-panel-emoji">🏞️</div>
                <span>Wallpaper</span>
            </div>
            <div class="control-panel-item" id="cp-about">
                <div class="control-panel-emoji">ℹ️</div>
                <span>About</span>
            </div>
            <div class="control-panel-item" id="cp-skills">
                <div class="control-panel-emoji">🧠</div>
                <span>Skills</span>
            </div>
            <div class="control-panel-item" id="cp-education">
                <div class="control-panel-emoji">🎓</div>
                <span>Education</span>
            </div>
            <div class="control-panel-item" id="cp-contact">
                <div class="control-panel-emoji">📞</div>
                <span>Contact</span>
            </div>
            <div class="control-panel-item" id="cp-easteregg">
                <div class="control-panel-emoji">🥚</div>
                <span>???</span>
            </div>
        </div>
    `;
    
    // Add click handlers for control panel items
    const displayItem = contentContainer.querySelector('#cp-display');
    const soundItem = contentContainer.querySelector('#cp-sound');
    const wallpaperItem = contentContainer.querySelector('#cp-wallpaper');
    const aboutItem = contentContainer.querySelector('#cp-about');
    const skillsItem = contentContainer.querySelector('#cp-skills');
    const educationItem = contentContainer.querySelector('#cp-education');
    const contactItem = contentContainer.querySelector('#cp-contact');
    const easterEggItem = contentContainer.querySelector('#cp-easteregg');
    
    // Same event handlers as before...
    // Display settings
    displayItem.addEventListener('click', () => {
        alert('Display settings functionality coming soon!');
    });
    
    // Sound settings
    soundItem.addEventListener('click', () => {
        playSound('click-sound');
        alert('Sound settings functionality coming soon!');
    });
    
    // Wallpaper settings
    wallpaperItem.addEventListener('click', () => {
        changeWallpaper();
    });
    
    // About dialog
    aboutItem.addEventListener('click', () => {
        openWindow('about-me');
    });
    
    // Skills window
    skillsItem.addEventListener('click', () => {
        openSkillsWindow();
    });
    
    // Education window
    educationItem.addEventListener('click', () => {
        openEducationWindow();
    });
    
    // Contact window
    contactItem.addEventListener('click', () => {
        openContactWindow();
    });
    
    // Easter egg
    easterEggItem.addEventListener('click', () => {
        triggerBlueScreen();
    });
}


// Open Skills window
function openSkillsWindow() {
    // Create new window for skills
    const skillsWindow = document.createElement('div');
    skillsWindow.className = 'window';
    skillsWindow.id = 'skills-window';
    skillsWindow.style.width = '450px';
    skillsWindow.style.height = '350px';
    skillsWindow.style.top = '100px';
    skillsWindow.style.left = '150px';
    skillsWindow.style.zIndex = ++windowZIndex;
    
    // Create window HTML
    skillsWindow.innerHTML = `
        <div class="window-header">
            <div class="window-title">Skills</div>
            <div class="window-controls">
                <button class="minimize-button">_</button>
                <button class="maximize-button">□</button>
                <button class="close-button">✕</button>
            </div>
        </div>
        <div class="window-menu-bar">
            <ul>
                <li>File</li>
                <li>Edit</li>
                <li>View</li>
                <li>Help</li>
            </ul>
        </div>
        <div class="window-content" style="padding: 15px; overflow: auto;">
            <h3 style="margin-bottom: 15px;">Technical Skills</h3>
            
            <h4 style="margin-top: 10px; margin-bottom: 5px;">Programming Languages</h4>
            <p>Python, Java, SQL, C</p>
            
            <h4 style="margin-top: 15px; margin-bottom: 5px;">Libraries</h4>
            <p>Pandas, NumPy, scikit-learn, Matplotlib</p>
            
            <h4 style="margin-top: 15px; margin-bottom: 5px;">Frameworks/Tools</h4>
            <p>Databricks, TensorFlow, PowerBI, Streamlit</p>
            
            <h4 style="margin-top: 15px; margin-bottom: 5px;">Data Engineering/Cloud</h4>
            <p>Apache Spark, Azure, Docker</p>
            
            <h3 style="margin-top: 20px; margin-bottom: 15px;">Relevant Coursework</h3>
            <ul style="list-style-type: disc; margin-left: 20px;">
                <li>Mathematics of Finance</li>
                <li>Mathematics of Machine Learning</li>
                <li>Statistical Inference</li>
                <li>Data Structures & Algorithms</li>
                <li>Probability Theory</li>
                <li>Game Theory</li>
            </ul>
        </div>
    `;
    
    // Add to DOM
    document.getElementById('desktop').appendChild(skillsWindow);
    
    // Add functionality
    const header = skillsWindow.querySelector('.window-header');
    const closeBtn = skillsWindow.querySelector('.close-button');
    
    // Enable dragging
    enableDragging(skillsWindow, header);
    
    // Add close handler
    closeBtn.addEventListener('click', () => {
        skillsWindow.remove();
        playSound('click-sound');
    });
    
    // Make window active
    setActiveWindow(skillsWindow.id);
    
    // Play sound
    playSound('click-sound');
}

// Open Education window
function openEducationWindow() {
    // Create new window for education
    const educationWindow = document.createElement('div');
    educationWindow.className = 'window';
    educationWindow.id = 'education-window';
    educationWindow.style.width = '450px';
    educationWindow.style.height = '300px';
    educationWindow.style.top = '120px';
    educationWindow.style.left = '170px';
    educationWindow.style.zIndex = ++windowZIndex;
    
    // Create window HTML
    educationWindow.innerHTML = `
        <div class="window-header">
            <div class="window-title">Education</div>
            <div class="window-controls">
                <button class="minimize-button">_</button>
                <button class="maximize-button">□</button>
                <button class="close-button">✕</button>
            </div>
        </div>
        <div class="window-menu-bar">
            <ul>
                <li>File</li>
                <li>Edit</li>
                <li>View</li>
                <li>Help</li>
            </ul>
        </div>
        <div class="window-content" style="padding: 15px; overflow: auto;">
            <h3 style="margin-bottom: 10px;">Pennsylvania State University</h3>
            <p style="margin-bottom: 5px;"><strong>Degree:</strong> Bachelor of Science in Computer Science</p>
            <p style="margin-bottom: 5px;"><strong>Expected Graduation:</strong> May 2025</p>
            <p style="margin-bottom: 5px;"><strong>Location:</strong> University Park, PA</p>
            <p style="margin-bottom: 15px;"><strong>Minor:</strong> Mathematics</p>
            
            <h4 style="margin-top: 15px; margin-bottom: 10px;">Relevant Coursework</h4>
            <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 15px;">
                <li>Mathematics of Finance</li>
                <li>Mathematics of Machine Learning</li>
                <li>Statistical Inference</li>
                <li>Data Structures & Algorithms</li>
                <li>Probability Theory</li>
                <li>Game Theory</li>
            </ul>
        </div>
    `;
    
    // Add to DOM
    document.getElementById('desktop').appendChild(educationWindow);
    
    // Add functionality
    const header = educationWindow.querySelector('.window-header');
    const closeBtn = educationWindow.querySelector('.close-button');
    
    // Enable dragging
    enableDragging(educationWindow, header);
    
    // Add close handler
    closeBtn.addEventListener('click', () => {
        educationWindow.remove();
        playSound('click-sound');
    });
    
    // Make window active
    setActiveWindow(educationWindow.id);
    
    // Play sound
    playSound('click-sound');
}

// Open Contact window
function openContactWindow() {
    // Create new window for contact
    const contactWindow = document.createElement('div');
    contactWindow.className = 'window';
    contactWindow.id = 'contact-window';
    contactWindow.style.width = '400px';
    contactWindow.style.height = '300px';
    contactWindow.style.top = '150px';
    contactWindow.style.left = '200px';
    contactWindow.style.zIndex = ++windowZIndex;
    
    // Create window HTML
    contactWindow.innerHTML = `
        <div class="window-header">
            <div class="window-title">Contact Information</div>
            <div class="window-controls">
                <button class="minimize-button">_</button>
                <button class="maximize-button">□</button>
                <button class="close-button">✕</button>
            </div>
        </div>
        <div class="window-menu-bar">
            <ul>
                <li>File</li>
                <li>Edit</li>
                <li>View</li>
                <li>Help</li>
            </ul>
        </div>
        <div class="window-content" style="padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <img src="img/icons/contact-large.png" alt="Contact" style="width: 64px; height: 64px; margin-bottom: 20px;">
            
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">J. Alec Conti</h3>
                <p style="margin-bottom: 5px;"><strong>Email:</strong> johnalecconti@gmail.com</p>
                <p style="margin-bottom: 5px;"><strong>Phone:</strong> 412-477-1878</p>
                <p style="margin-bottom: 5px;"><strong>Website:</strong> <a href="https://alecconti.github.io" target="_blank">alecconti.github.io</a></p>
                <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/alecconti" target="_blank">linkedin.com/in/alecconti</a></p>
            </div>
            
            <div>
                <button id="email-button" style="margin-right: 10px;">Send Email</button>
                <button id="linkedin-button">Visit LinkedIn</button>
            </div>
        </div>
    `;
    
    // Add to DOM
    document.getElementById('desktop').appendChild(contactWindow);
    
    // Add functionality
    const header = contactWindow.querySelector('.window-header');
    const closeBtn = contactWindow.querySelector('.close-button');
    const emailBtn = contactWindow.querySelector('#email-button');
    const linkedinBtn = contactWindow.querySelector('#linkedin-button');
    
    // Enable dragging
    enableDragging(contactWindow, header);
    
    // Add close handler
    closeBtn.addEventListener('click', () => {
        contactWindow.remove();
        playSound('click-sound');
    });
    
    // Email button
    emailBtn.addEventListener('click', () => {
        window.open('mailto:johnalecconti@gmail.com', '_blank');
    });
    
    // LinkedIn button
    linkedinBtn.addEventListener('click', () => {
        window.open('https://linkedin.com/in/alecconti', '_blank');
    });
    
    // Make window active
    setActiveWindow(contactWindow.id);
    
    // Play sound
    playSound('click-sound');
}

// Initialize Resume window
function initializeResumeWindow(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    contentContainer.innerHTML = `
        <div class="notepad-content">
            <div class="notepad-text">
                <h3 style="text-align: center; margin-bottom: 15px;">J. Alec Conti</h3>
                <p style="text-align: center; margin-bottom: 15px;">johnalecconti@gmail.com | 412-477-1878 | alecconti.github.io | linkedin.com/in/alecconti</p>
                
                <h4 style="margin-top: 20px; margin-bottom: 5px;">EDUCATION</h4>
                <p><strong>Pennsylvania State University, Bachelor of Science in Computer Science</strong></p>
                <p>Expected May 2025 | University Park, PA</p>
                <p>Minor: Mathematics</p>
                <p>Relevant Coursework: Mathematics of Finance; Mathematics of Machine Learning; Statistical Inference; Data Structures & Algorithms; Probability Theory; Game Theory</p>
                
                <h4 style="margin-top: 20px; margin-bottom: 5px;">EXPERIENCE</h4>
                <p><strong>Avanade, Data Analytics Intern</strong> 05-2024 – 08-2024 | Philadelphia</p>
                <p>A leading digital innovator specializing in technology solutions and consulting services, with a focus on Microsoft platforms and enterprise applications.</p>
                <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 10px;">
                    <li>Developed a Service Request Classification System using prompt engineering with Azure OpenAI's GPT models, applying tokenization and fine-tuning techniques to enhance categorization speed, reducing request processing time by 15% and improving classification accuracy by 10%.</li>
                    <li>Streamlined customer support by designing a tailored Natural Language Support Assistant using Python, Retrieval-Augmented Generation (RAG) frameworks, and OpenAI's GPT-3, resulting in a 70% increase in response accuracy and a 25% reduction in average handling time.</li>
                    <li>Collaborated with client executives and cross-functional teams using Agile practices (e.g., daily stand-ups, sprint planning) to ensure project alignment, achieving 100% client satisfaction through rapid adjustments to evolving requirements.</li>
                </ul>
                
                <p><strong>Federated Hermes, Data Engineering Intern</strong> 05-2023 – 08-2023 | Pittsburgh</p>
                <p>A global leader in active, responsible investment providing equity, fixed-income, multi-asset, and liquidity management services.</p>
                <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 10px;">
                    <li>Led a multidisciplinary team to win 1st place in the Intern Hackathon by developing a Python-based real-time sentiment analysis platform with 90% accuracy, leveraging pre-trained Transformers models and real-time NewsAPI integration. Presented the solution to the CTO, demonstrating effective communication and technical storytelling skills at the executive level.</li>
                    <li>Designed and optimized data pipelines using Python (Pandas, PySpark), SQL, and Azure Databricks, enhancing processing speed and accuracy by 20%, supporting data needs across 5 departments.</li>
                    <li>Built and maintained scalable data lakes and warehouses using Python with Apache Spark, enabling data transformation that improved reporting efficiency by 30% and facilitated faster decision-making for cross-team stakeholders.</li>
                    <li>Worked within an Agile framework to enhance team collaboration and deliver projects on time, ensuring rapid iterations and smooth integration of feedback.</li>
                </ul>
                
                <h4 style="margin-top: 20px; margin-bottom: 5px;">PROJECTS</h4>
                <p><strong>Unsupervised Stock Trading Strategy, Lead Developer</strong> 08-2024</p>
                <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 10px;">
                    <li>Implemented a Python-based machine learning trading strategy using K-Means Clustering to optimize portfolios for maximum Sharpe ratio, utilizing libraries like Scikit-learn and Pandas to handle large-scale financial data effectively.</li>
                    <li>Conducted extensive data preprocessing and feature engineering using Python (Pandas, NumPy) on S&P 500 stock price data, calculating technical indicators and performing Fama-French factor analysis for quantitative problem-solving.</li>
                    <li>Optimized portfolios using Efficient Frontier analysis, combining historical factor exposures with clustering results to address real-world financial challenges, utilizing tools like PyPortfolioOpt and Matplotlib for visualization.</li>
                </ul>
                
                <p><strong>Stock Sentiment Analysis Website, Lead Developer</strong> 07-2023</p>
                <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 10px;">
                    <li>Developed an end-to-end stock sentiment analysis website using Python during the Intern Hackathon.</li>
                    <li>Designed the backend fine-tuned pre-trained natural language models, achieving 90% sentiment accuracy for stock sentiment analysis—demonstrating hands-on coding skills and collaborative software development.</li>
                    <li>Integrated real-time data processing using Python (NewsAPI) and built a user-friendly interface with Streamlit, enabling dynamic sentiment analysis and enhancing platform capabilities.</li>
                    <li>Demonstrated technical leadership by refining user requirements, optimizing backend performance, and enhancing data processing for better user insights.</li>
                </ul>
                
                <h4 style="margin-top: 20px; margin-bottom: 5px;">SKILLS</h4>
                <p><strong>Programming Languages:</strong> Python, Java, SQL, & C</p>
                <p><strong>Libraries:</strong> Pandas, Numpy, scikit-learn, & Matplotlib</p>
                <p><strong>Frameworks/Tools:</strong> Databricks, TensorFlow, PowerBI, & Streamlit</p>
                <p><strong>Data Engineering/Cloud:</strong> Apache Spark, Azure, & Docker</p>
            </div>
        </div>
    `;
}

// Initialize Recycle Bin window with emojis
function initializeRecycleBinWindow(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    contentContainer.innerHTML = `
        <div class="explorer-content">
            <div class="explorer-toolbar">
                <button><span class="toolbar-emoji">🧹</span> Empty Recycle Bin</button>
                <button><span class="toolbar-emoji">♻️</span> Restore</button>
            </div>
            <div class="explorer-address-bar">
                <span>Address:</span>
                <div class="explorer-address">C:\\Recycle Bin</div>
            </div>
            <div class="explorer-view">
                <div class="explorer-sidebar">
                    <div class="folder-tree">
                        <div><span class="sidebar-emoji">🗑️</span> Deleted Files</div>
                        <div><span class="sidebar-emoji">🧹</span> System Trash</div>
                    </div>
                </div>
                <div class="explorer-main">
                    <div class="explorer-item">
                        <div class="explorer-emoji">📝</div>
                        <span>rejected_ideas.txt</span>
                    </div>
                    <div class="explorer-item">
                        <div class="explorer-emoji">🌐</div>
                        <span>old_portfolio.html</span>
                    </div>
                    <div class="explorer-item">
                        <div class="explorer-emoji">📋</div>
                        <span>bugs.log</span>
                    </div>
                    <div class="explorer-item">
                        <div class="explorer-emoji">🖼️</div>
                        <span>bad_selfie.jpg</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// Initialize Projects window with emojis
function initializeProjectsWindow(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    contentContainer.innerHTML = `
        <div class="explorer-content">
            <div class="explorer-toolbar">
                <button><span class="toolbar-emoji">⬅️</span> Back</button>
                <button><span class="toolbar-emoji">➡️</span> Forward</button>
                <button><span class="toolbar-emoji">⬆️</span> Up</button>
            </div>
            <div class="explorer-address-bar">
                <span>Address:</span>
                <div class="explorer-address">C:\\My Portfolio\\Projects</div>
            </div>
            <div class="explorer-view">
                <div class="explorer-sidebar">
                    <div class="folder-tree">
                        <div><span class="sidebar-emoji">💻</span> My Computer</div>
                        <div><span class="sidebar-emoji">🌐</span> Network</div>
                        <div><span class="sidebar-emoji">🗑️</span> Recycle Bin</div>
                        <div><span class="sidebar-emoji">📁</span> My Portfolio</div>
                    </div>
                </div>
                <div class="explorer-main">
                    <div class="explorer-item" data-content="trading">
                        <div class="explorer-emoji">📊</div>
                        <span>Stock Trading Strategy</span>
                    </div>
                    <div class="explorer-item" data-content="sentiment">
                        <div class="explorer-emoji">📈</div>
                        <span>Stock Sentiment Analysis</span>
                    </div>
                    <div class="explorer-item" data-content="win95">
                        <div class="explorer-emoji">🖥️</div>
                        <span>Windows 95 Portfolio</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers for project items
    contentContainer.querySelectorAll('.explorer-item').forEach(item => {
        item.addEventListener('click', () => {
            const contentId = item.getAttribute('data-content');
            openProjectDetails(contentId);
        });
    });
}


function openProjectDetails(projectId) {
    // Create new window for project details
    const detailWindow = document.createElement('div');
    detailWindow.className = 'window';
    detailWindow.id = `${projectId}-details-window`;
    detailWindow.style.width = '500px';
    detailWindow.style.height = '400px';
    detailWindow.style.top = '120px';
    detailWindow.style.left = '170px';
    detailWindow.style.zIndex = ++windowZIndex;
    
    // Add window content based on project ID
    let title, content;
    
    if (projectId === 'trading') {
        title = 'Unsupervised Stock Trading Strategy';
        content = `
            <div style="padding: 15px; overflow: auto; height: 100%;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 32px; margin-right: 10px;">📊</div>
                    <h3 style="margin: 0;">Unsupervised Stock Trading Strategy</h3>
                </div>
                <p style="margin-bottom: 5px;"><strong>Period:</strong> August 2024</p>
                <p style="margin-bottom: 5px;"><strong>Role:</strong> Lead Developer</p>
                
                <h4 style="margin-bottom: 10px;">Project Description:</h4>
                <p style="margin-bottom: 15px;">An unsupervised machine learning approach to optimize stock portfolios for maximum Sharpe ratio using K-Means Clustering.</p>
                
                <h4 style="margin-bottom: 10px;">Key Achievements:</h4>
                <ul style="list-style-type: none; margin-left: 5px; margin-bottom: 15px;">
                    <li><span style="display: inline-block; width: 20px;">🐍</span> Implemented a Python-based machine learning trading strategy using K-Means Clustering</li>
                    <li><span style="display: inline-block; width: 20px;">📈</span> Optimized portfolios for maximum Sharpe ratio using Scikit-learn and Pandas</li>
                    <li><span style="display: inline-block; width: 20px;">💾</span> Handled large-scale financial data effectively</li>
                    <li><span style="display: inline-block; width: 20px;">🧹</span> Conducted extensive data preprocessing and feature engineering</li>
                    <li><span style="display: inline-block; width: 20px;">📐</span> Calculated technical indicators and performed Fama-French factor analysis</li>
                    <li><span style="display: inline-block; width: 20px;">⚡</span> Optimized portfolios using Efficient Frontier analysis</li>
                    <li><span style="display: inline-block; width: 20px;">🔄</span> Combined historical factor exposures with clustering results</li>
                    <li><span style="display: inline-block; width: 20px;">📊</span> Used PyPortfolioOpt and Matplotlib for visualization</li>
                </ul>
                
                <h4 style="margin-bottom: 10px;">Technologies Used:</h4>
                <p>Python, Scikit-learn, Pandas, NumPy, PyPortfolioOpt, Matplotlib</p>
            </div>
        `;
    } else if (projectId === 'sentiment') {
        title = 'Stock Sentiment Analysis Website';
        content = `
            <div style="padding: 15px; overflow: auto; height: 100%;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 32px; margin-right: 10px;">📈</div>
                    <h3 style="margin: 0;">Stock Sentiment Analysis Website</h3>
                </div>
                <p style="margin-bottom: 5px;"><strong>Period:</strong> July 2023</p>
                <p style="margin-bottom: 5px;"><strong>Role:</strong> Lead Developer</p>
                
                <h4 style="margin-bottom: 10px;">Project Description:</h4>
                <p style="margin-bottom: 15px;">An end-to-end stock sentiment analysis website developed during the Intern Hackathon, designed to analyze and visualize market sentiment in real-time.</p>
                
                <h4 style="margin-bottom: 10px;">Key Achievements:</h4>
                <ul style="list-style-type: none; margin-left: 5px; margin-bottom: 15px;">
                    <li><span style="display: inline-block; width: 20px;">🌐</span> Developed an end-to-end stock sentiment analysis website using Python</li>
                    <li><span style="display: inline-block; width: 20px;">🏆</span> Created during the Intern Hackathon at Federated Hermes</li>
                    <li><span style="display: inline-block; width: 20px;">🧠</span> Designed the backend with fine-tuned pre-trained natural language models</li>
                    <li><span style="display: inline-block; width: 20px;">📊</span> Achieved 90% sentiment accuracy for stock sentiment analysis</li>
                    <li><span style="display: inline-block; width: 20px;">👨‍💻</span> Demonstrated hands-on coding skills and collaborative software development</li>
                    <li><span style="display: inline-block; width: 20px;">⚡</span> Integrated real-time data processing using Python (NewsAPI)</li>
                    <li><span style="display: inline-block; width: 20px;">🖥️</span> Built a user-friendly interface with Streamlit</li>
                    <li><span style="display: inline-block; width: 20px;">📈</span> Enabled dynamic sentiment analysis and enhanced platform capabilities</li>
                    <li><span style="display: inline-block; width: 20px;">👑</span> Demonstrated technical leadership in refining user requirements</li>
                    <li><span style="display: inline-block; width: 20px;">🚀</span> Optimized backend performance and enhanced data processing</li>
                </ul>
                
                <h4 style="margin-bottom: 10px;">Technologies Used:</h4>
                <p>Python, Natural Language Processing, Streamlit, NewsAPI</p>
            </div>
        `;
    } else if (projectId === 'win95') {
        title = 'Windows 95 Portfolio Website';
        content = `
            <div style="padding: 15px; overflow: auto; height: 100%;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 32px; margin-right: 10px;">🖥️</div>
                    <h3 style="margin: 0;">Windows 95 Portfolio Website</h3>
                </div>
                <p style="margin-bottom: 5px;"><strong>Period:</strong> 2025</p>
                <p style="margin-bottom: 5px;"><strong>Role:</strong> Developer</p>
                
                <h4 style="margin-bottom: 10px;">Project Description:</h4>
                <p style="margin-bottom: 15px;">A nostalgic Windows 95-themed portfolio website showcasing my skills, projects, and experience in an interactive desktop environment.</p>
                
                <h4 style="margin-bottom: 10px;">Key Features:</h4>
                <ul style="list-style-type: none; margin-left: 5px; margin-bottom: 15px;">
                    <li><span style="display: inline-block; width: 20px;">🖥️</span> Fully interactive Windows 95 desktop experience</li>
                    <li><span style="display: inline-block; width: 20px;">🪟</span> Draggable, resizable windows with proper stacking</li>
                    <li><span style="display: inline-block; width: 20px;">🚀</span> Functioning Start menu and taskbar</li>
                    <li><span style="display: inline-block; width: 20px;">📁</span> Interactive desktop icons and folders</li>
                    <li><span style="display: inline-block; width: 20px;">💣</span> Minesweeper game implementation</li>
                    <li><span style="display: inline-block; width: 20px;">🎨</span> Authentic Windows 95 styling and aesthetics</li>
                    <li><span style="display: inline-block; width: 20px;">📱</span> Responsive design for different screen sizes</li>
                    <li><span style="display: inline-block; width: 20px;">🥚</span> Easter eggs and nostalgic elements</li>
                </ul>
                
                <h4 style="margin-bottom: 10px;">Technologies Used:</h4>
                <p>HTML, CSS, JavaScript, UI/UX Design</p>
                
                <p style="margin-top: 15px;"><i>Meta: You're actually using this project right now! 😊</i></p>
            </div>
        `;
    }
    
    // Create window HTML
    detailWindow.innerHTML = `
        <div class="window-header">
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <button class="minimize-button">_</button>
                <button class="maximize-button">□</button>
                <button class="close-button">✕</button>
            </div>
        </div>
        <div class="window-menu-bar">
            <ul>
                <li>File</li>
                <li>Edit</li>
                <li>View</li>
                <li>Help</li>
            </ul>
        </div>
        <div class="window-content">
            ${content}
        </div>
    `;
    
    // Add to DOM
    document.getElementById('desktop').appendChild(detailWindow);
    
    // Add functionality
    const header = detailWindow.querySelector('.window-header');
    const closeBtn = detailWindow.querySelector('.close-button');
    
    // Enable dragging
    enableDragging(detailWindow, header);
    
    // Add close handler
    closeBtn.addEventListener('click', () => {
        detailWindow.remove();
        playSound('click-sound');
    });
    
    // Make window active
    setActiveWindow(detailWindow.id);
    
    // Play sound
    playSound('click-sound');


// Initialize Photos window with emojis
function initializePhotosWindow(windowElement) {
    const contentContainer = windowElement.querySelector('.window-content');
    
    // Sample photos (would be replaced with actual portfolio photos)
    const photos = [
        { name: 'Windows 95', file: 'windows95.jpg', type: 'Nostalgia' },
        { name: 'Data Visualization', file: 'data-viz.jpg', type: 'Work' },
        { name: 'Code Sample', file: 'code.jpg', type: 'Work' },
        { name: 'GitHub', file: 'github.jpg', type: 'Project' },
        { name: 'Hackathon', file: 'hackathon.jpg', type: 'Experience' },
        { name: 'Penn State', file: 'pennstate.jpg', type: 'Education' }
    ];
    
    contentContainer.innerHTML = `
        <div class="explorer-content">
            <div class="explorer-toolbar">
                <button><span class="toolbar-emoji">👁️</span> View</button>
                <button><span class="toolbar-emoji">📶</span> Sort</button>
                <button><span class="toolbar-emoji">▶️</span> Slideshow</button>
            </div>
            <div class="explorer-address-bar">
                <span>Address:</span>
                <div class="explorer-address">C:\\My Portfolio\\Photos</div>
            </div>
            <div class="explorer-view">
                <div class="explorer-sidebar">
                    <div class="folder-tree">
                        <div><span class="sidebar-emoji">🖼️</span> All Photos</div>
                        <div><span class="sidebar-emoji">💼</span> Work</div>
                        <div><span class="sidebar-emoji">🚀</span> Projects</div>
                        <div><span class="sidebar-emoji">🎓</span> Education</div>
                        <div><span class="sidebar-emoji">🕰️</span> Nostalgia</div>
                    </div>
                </div>
                <div class="explorer-main">
                    ${photos.map(photo => `
                        <div class="explorer-item" data-photo="${photo.file}" data-type="${photo.type}">
                            <div class="explorer-emoji">🖼️</div>
                            <span>${photo.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers for photo items
    contentContainer.querySelectorAll('.explorer-item').forEach(item => {
        item.addEventListener('click', () => {
            const photoFile = item.getAttribute('data-photo');
            openPhotoViewer(photoFile);
        });
    });
}


// Open photo viewer
function openPhotoViewer(photoFile) {
    // Create new window for photo viewer
    const viewerWindow = document.createElement('div');
    viewerWindow.className = 'window';
    viewerWindow.id = `photo-viewer-window`;
    viewerWindow.style.width = '600px';
    viewerWindow.style.height = '450px';
    viewerWindow.style.top = '80px';
    viewerWindow.style.left = '150px';
    viewerWindow.style.zIndex = ++windowZIndex;
    
    // Create window HTML
    viewerWindow.innerHTML = `
        <div class="window-header">
            <div class="window-title">Photo Viewer - ${photoFile}</div>
            <div class="window-controls">
                <button class="minimize-button">_</button>
                <button class="maximize-button">□</button>
                <button class="close-button">✕</button>
            </div>
        </div>
        <div class="window-menu-bar">
            <ul>
                <li>File</li>
                <li>Edit</li>
                <li>View</li>
                <li>Help</li>
            </ul>
        </div>
        <div class="window-content image-viewer-content">
            <img src="img/photos/${photoFile}" alt="${photoFile}" onerror="this.src='img/photos/placeholder.jpg'">
        </div>
    `;
    
    // Add to DOM
    document.getElementById('desktop').appendChild(viewerWindow);
    
    // Add functionality
    const header = viewerWindow.querySelector('.window-header');
    const closeBtn = viewerWindow.querySelector('.close-button');
    
    // Enable dragging
    enableDragging(viewerWindow, header);
    
    // Add close handler
    closeBtn.addEventListener('click', () => {
        viewerWindow.remove();
        playSound('click-sound');
    });
    
    // Make window active
    setActiveWindow(viewerWindow.id);
    
    // Play sound
    playSound('click-sound');
}}