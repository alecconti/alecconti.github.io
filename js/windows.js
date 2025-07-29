// windows.js - Window management for Windows 95 themed portfolio

// Global variables to keep track of window state
let activeWindowId = null;
let windowZIndex = 1000;
let windowInstances = {};

// Window templates
// Update this section in windows.js to use emoji icons

// Window templates
const windowTemplates = {
    'about-me': {
        title: 'About Me - Notepad',
        icon: '📝',
        emoji: '📝',
        template: 'about-me-window',
        width: 400,
        height: 350
    },
    'internships': {
        title: 'Internships',
        icon: '💼',
        emoji: '💼',
        width: 500,
        height: 400
    },
    'projects': {
        title: 'Projects',
        icon: '🚀',
        emoji: '🚀',
        width: 500,
        height: 400
    },
    'photos': {
        title: 'Photos',
        icon: '📸',
        emoji: '📸',
        width: 600,
        height: 450
    },
    'search': {
        title: 'Web Search',
        icon: '🌎',
        emoji: '🌎',
        width: 550,
        height: 400
    },
    'control-panel': {
        title: 'Control Panel',
        icon: '🛠️',
        emoji: '🛠️',
        width: 450,
        height: 350
    },
    'resume': {
        title: 'Resume - Notepad',
        icon: '📄',
        emoji: '📄',
        width: 550,
        height: 500
    },
    'minesweeper': {
        title: 'Minesweeper',
        icon: '💣',
        emoji: '💣',
        width: 200,
        height: 250
    },
    'recycle-bin': {
        title: 'Recycle Bin',
        icon: '🗑️',
        emoji: '🗑️',
        width: 400,
        height: 300
    }
};

// Initialize window system
document.addEventListener('DOMContentLoaded', () => {
    // Add window positioning and resizing functionality to each window
    setupWindowTemplate('about-me-window');
    
    // Load window content dynamically
    loadWindowContents();
});

// Setup window template with basic functionality
function setupWindowTemplate(templateId) {
    const template = document.getElementById(templateId);
    if (!template) return;
    
    // Add event listeners to the template
    const header = template.querySelector('.window-header');
    const minimizeBtn = template.querySelector('.minimize-button');
    const maximizeBtn = template.querySelector('.maximize-button');
    const closeBtn = template.querySelector('.close-button');
    
    // Window dragging
    enableDragging(template, header);
    
    // Window controls
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            minimizeWindow(template.id);
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            toggleMaximize(template.id);
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeWindow(template.id);
        });
    }
    
    // Make window active on click
    template.addEventListener('mousedown', () => {
        setActiveWindow(template.id);
    });
}

// Open a window by its ID
function openWindow(windowId) {
    // Check if window is already open
    if (windowInstances[windowId]) {
        // If minimized, restore it
        if (windowInstances[windowId].classList.contains('minimized')) {
            restoreWindow(windowId);
        }
        // Set as active window
        setActiveWindow(windowId);
        return;
    }
    
    const template = getWindowTemplate(windowId);
    if (!template) {
        console.error('Window template not found: ' + windowId);
        return;
    }
    
    // Create new window
    const newWindow = template.cloneNode(true);
    newWindow.id = windowId + '-window';
    newWindow.classList.remove('hidden');
    newWindow.style.display = 'flex';
    
    // Set window dimensions and position
    const config = windowTemplates[windowId] || {};
    newWindow.style.width = (config.width || 400) + 'px';
    newWindow.style.height = (config.height || 300) + 'px';
    newWindow.style.top = Math.floor(50 + Math.random() * 100) + 'px';
    newWindow.style.left = Math.floor(50 + Math.random() * 100) + 'px';
    
    // Set window title
    const titleElement = newWindow.querySelector('.window-title');
    if (titleElement && config.title) {
        titleElement.textContent = config.title;
    }
    
    // Setup window controls
    const header = newWindow.querySelector('.window-header');
    const minimizeBtn = newWindow.querySelector('.minimize-button');
    const maximizeBtn = newWindow.querySelector('.maximize-button');
    const closeBtn = newWindow.querySelector('.close-button');
    
    // Window dragging
    enableDragging(newWindow, header);
    
    // Window controls
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            minimizeWindow(newWindow.id);
            playSound('click-sound');
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            toggleMaximize(newWindow.id);
            playSound('click-sound');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeWindow(newWindow.id);
            playSound('click-sound');
        });
    }
    
    // Make window active on click
    newWindow.addEventListener('mousedown', () => {
        setActiveWindow(newWindow.id);
    });
    
    // Add window to the document
    document.getElementById('desktop').appendChild(newWindow);
    
    // Add to taskbar
    addTaskbarItem(windowId, newWindow.id);
    
    // Store window reference
    windowInstances[windowId] = newWindow;
    
    // Initialize window content
    initializeWindowContent(windowId, newWindow);
    
    // Set as active window
    setActiveWindow(newWindow.id);
    
    // Play sound
    playSound('click-sound');
    
    return newWindow;
}

// Get window template
function getWindowTemplate(windowId) {
    // If there's a specific template defined
    const templateConfig = windowTemplates[windowId];
    if (templateConfig && templateConfig.template) {
        return document.getElementById(templateConfig.template);
    }
    
    // Otherwise, create a generic window template
    const genericTemplate = document.createElement('div');
    genericTemplate.className = 'window';
    genericTemplate.innerHTML = `
        <div class="window-header">
            <div class="window-title">${templateConfig?.title || windowId}</div>
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
            <div id="${windowId}-content" class="loading-content">
                Loading...
            </div>
        </div>
    `;
    
    return genericTemplate;
}

// Set the active window
function setActiveWindow(windowId) {
    // Remove active class from all windows
    Object.values(windowInstances).forEach(window => {
        window.classList.remove('active');
    });
    
    // Remove active class from all taskbar items
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Set active window
    const window = document.getElementById(windowId);
    if (window) {
        window.classList.add('active');
        window.style.zIndex = ++windowZIndex;
        
        // Set active in taskbar
        const originalId = windowId.replace('-window', '');
        const taskbarItem = document.querySelector(`.taskbar-item[data-window="${originalId}"]`);
        if (taskbarItem) {
            taskbarItem.classList.add('active');
        }
        
        activeWindowId = windowId;
    }
}

// Minimize a window
function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.classList.add('minimized');
        
        // Update active window if needed
        if (activeWindowId === windowId) {
            activeWindowId = null;
        }
    }
}

// Restore a minimized window
function restoreWindow(windowId) {
    const window = document.getElementById(windowId + '-window');
    if (window) {
        window.classList.remove('minimized');
        setActiveWindow(window.id);
    }
}

// Toggle maximize state of a window
function toggleMaximize(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.classList.toggle('maximized');
    }
}

// Close a window
function closeWindow(windowId) {
    const originalId = windowId.replace('-window', '');
    const window = windowInstances[originalId];
    
    if (window) {
        // Remove taskbar item
        const taskbarItem = document.querySelector(`.taskbar-item[data-window="${originalId}"]`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
        
        // Remove window from DOM
        window.remove();
        
        // Remove from instances
        delete windowInstances[originalId];
        
        // Update active window if needed
        if (activeWindowId === windowId) {
            activeWindowId = null;
        }
    }
}

// Add taskbar item for a window
// This function needs to be updated in windows.js to handle emoji icons

// Add taskbar item for a window
function addTaskbarItem(windowId, fullWindowId) {
    const activeWindows = document.getElementById('active-windows');
    const config = windowTemplates[windowId] || {};
    
    // Map windowId to appropriate emoji
    const emojiMap = {
        'internships': '💼',
        'projects': '🚀',
        'photos': '📸',
        'search': '🌎',
        'control-panel': '🛠️',
        'about-me': '📝',
        'resume': '📄',
        'minesweeper': '💣',
        'recycle-bin': '🗑️'
    };
    
    const emoji = emojiMap[windowId] || '📂';
    
    // Create taskbar item
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item';
    taskbarItem.setAttribute('data-window', windowId);
    
    // Add icon and title with emoji
    taskbarItem.innerHTML = `
        <div class="item-emoji">${emoji}</div>
        <span>${config.title || windowId}</span>
    `;
    
    // Add click handler to toggle window
    taskbarItem.addEventListener('click', () => {
        const window = windowInstances[windowId];
        
        if (window.classList.contains('minimized')) {
            restoreWindow(windowId);
        } else if (activeWindowId === fullWindowId) {
            minimizeWindow(fullWindowId);
        } else {
            setActiveWindow(fullWindowId);
        }
        
        playSound('click-sound');
    });
    
    // Add to taskbar
    activeWindows.appendChild(taskbarItem);
}
// Enable window dragging
function enableDragging(window, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.addEventListener('mousedown', startDragging);
    
    function startDragging(e) {
        e.preventDefault();
        
        // Set active window
        setActiveWindow(window.id);
        
        // Don't drag if maximized
        if (window.classList.contains('maximized')) {
            return;
        }
        
        // Get cursor position
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Add event listeners
        document.addEventListener('mousemove', dragWindow);
        document.addEventListener('mouseup', stopDragging);
    }
    
    function dragWindow(e) {
        e.preventDefault();
        
        // Calculate new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Set window position
        window.style.top = (window.offsetTop - pos2) + 'px';
        window.style.left = (window.offsetLeft - pos1) + 'px';
    }
    
    function stopDragging() {
        // Remove event listeners
        document.removeEventListener('mousemove', dragWindow);
        document.removeEventListener('mouseup', stopDragging);
    }
}

// Load window contents dynamically
function loadWindowContents() {
    // Content will be loaded from content.js
}

// Initialize specific window content
function initializeWindowContent(windowId, windowElement) {
    switch (windowId) {
        case 'minesweeper':
            initializeMinesweeper(windowElement);
            break;
        case 'internships':
            initializeInternshipsWindow(windowElement);
            break;
        case 'projects':
            initializeProjectsWindow(windowElement);
            break;
        case 'photos':
            initializePhotosWindow(windowElement);
            break;
        case 'search':
            initializeSearchWindow(windowElement);
            break;
        case 'control-panel':
            initializeControlPanelWindow(windowElement);
            break;
        case 'resume':
            initializeResumeWindow(windowElement);
            break;
        case 'recycle-bin':
            initializeRecycleBinWindow(windowElement);
            break;
    }
}

// Window specific initializations will be defined in content.js