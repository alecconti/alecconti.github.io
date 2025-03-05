// win95.js - Core functionality for Windows 95 themed portfolio

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Windows 95 environment
    initializeDesktop();
    initializeTaskbar();
    initializeStartMenu();
    initializeContextMenu();
    initializeBlueScreen();
    
    // Play startup sound when the page loads
    setTimeout(() => {
        document.getElementById('startup-sound').play();
    }, 500);
    
    // Update clock
    updateClock();
    setInterval(updateClock, 60000); // Update clock every minute
});

// Initialize desktop functionality
function initializeDesktop() {
    const desktop = document.getElementById('desktop');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    
    // Add click event to desktop icons
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Deselect all icons
            desktopIcons.forEach(i => i.classList.remove('selected'));
            
            // Select clicked icon
            icon.classList.add('selected');
            
            // Handle double click to open window
            if (e.detail === 2) {
                const windowId = icon.getAttribute('data-window');
                if (windowId) {
                    openWindow(windowId);
                    playSound('click-sound');
                }
            }
        });
    });
    
    // Deselect icons when clicking on empty desktop area
    desktop.addEventListener('click', (e) => {
        if (e.target === desktop) {
            desktopIcons.forEach(icon => icon.classList.remove('selected'));
        }
    });
    
    // Desktop right-click context menu
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // Show context menu at click position
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.classList.remove('hidden');
        
        // Hide context menu when clicking elsewhere
        document.addEventListener('click', hideContextMenu);
    });
}

// Initialize taskbar functionality
function initializeTaskbar() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const activeWindows = document.getElementById('active-windows');
    
    // Toggle start menu when clicking start button
    startButton.addEventListener('click', () => {
        startMenu.classList.toggle('hidden');
        playSound('click-sound');
    });
    
    // Hide start menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
            startMenu.classList.add('hidden');
        }
    });
}

// Initialize start menu functionality
function initializeStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startItems = document.querySelectorAll('.start-item');
    
    // Add click event to start menu items
    startItems.forEach(item => {
        item.addEventListener('click', () => {
            const windowId = item.getAttribute('data-window');
            if (windowId) {
                openWindow(windowId);
                startMenu.classList.add('hidden');
                playSound('click-sound');
            } else if (item.id === 'blue-screen-trigger') {
                triggerBlueScreen();
                startMenu.classList.add('hidden');
            } else if (item.id === 'shutdown') {
                showShutdownDialog();
                startMenu.classList.add('hidden');
            }
        });
    });
}

// Initialize context menu functionality
function initializeContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    const refreshItem = document.getElementById('ctx-refresh');
    const createItem = document.getElementById('ctx-create');
    const wallpaperItem = document.getElementById('ctx-wallpaper');
    const propertiesItem = document.getElementById('ctx-properties');
    
    // Refresh desktop
    refreshItem.addEventListener('click', () => {
        hideContextMenu();
        location.reload();
    });
    
    // Create new item (placeholder)
    createItem.addEventListener('click', () => {
        hideContextMenu();
        alert('This feature is coming soon!');
    });
    
    // Change wallpaper
    wallpaperItem.addEventListener('click', () => {
        hideContextMenu();
        changeWallpaper();
    });
    
    // Properties dialog (placeholder)
    propertiesItem.addEventListener('click', () => {
        hideContextMenu();
        openWindow('control-panel');
    });
}

// Hide context menu
function hideContextMenu() {
    document.getElementById('context-menu').classList.add('hidden');
    document.removeEventListener('click', hideContextMenu);
}

// Change desktop wallpaper
function changeWallpaper() {
    const wallpapers = [
        'clouds.jpg',
        'hills.jpg'
    ];
    
    // Get a random wallpaper different from current
    let currentBg = document.getElementById('win95-app').style.backgroundImage;
    let newWallpaper;
    
    do {
        newWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    } while (currentBg.includes(newWallpaper));
    
    // Set new wallpaper
    document.getElementById('win95-app').style.backgroundImage = `url('../img/wallpapers/${newWallpaper}')`;
}

// Update clock in taskbar
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    
    // Format time (24-hour format with leading zeros)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}`;
}

// Initialize Blue Screen of Death functionality
function initializeBlueScreen() {
    const bsod = document.getElementById('bsod');
    const bluescreenTrigger = document.getElementById('blue-screen-trigger');
    
    // Clicking anywhere on BSOD reloads the page
    bsod.addEventListener('click', () => {
        location.reload();
    });
    
    // Pressing any key on BSOD reloads the page
    document.addEventListener('keydown', (e) => {
        if (!bsod.classList.contains('hidden')) {
            location.reload();
        }
    });
}

// Trigger Blue Screen of Death
function triggerBlueScreen() {
    playSound('error-sound');
    setTimeout(() => {
        document.getElementById('bsod').classList.remove('hidden');
    }, 500);
}

// Show shutdown dialog
function showShutdownDialog() {
    // Create shutdown dialog window
    const shutdownWindow = document.createElement('div');
    shutdownWindow.className = 'window';
    shutdownWindow.style.width = '300px';
    shutdownWindow.style.height = '150px';
    shutdownWindow.style.top = '50%';
    shutdownWindow.style.left = '50%';
    shutdownWindow.style.transform = 'translate(-50%, -50%)';
    shutdownWindow.style.zIndex = '10000';
    
    shutdownWindow.innerHTML = `
        <div class="window-header">
            <div class="window-title">Shut Down Windows</div>
            <div class="window-controls">
                <button class="close-button">✕</button>
            </div>
        </div>
        <div class="window-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 15px;">
            <p style="margin-bottom: 15px;">Are you sure you want to shut down?</p>
            <div style="display: flex; gap: 10px;">
                <button id="shutdown-yes">Yes</button>
                <button id="shutdown-no">No</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(shutdownWindow);
    
    // Add event listeners
    shutdownWindow.querySelector('.close-button').addEventListener('click', () => {
        document.body.removeChild(shutdownWindow);
    });
    
    shutdownWindow.querySelector('#shutdown-yes').addEventListener('click', () => {
        document.body.innerHTML = '<div style="height: 100vh; width: 100vw; background-color: #000; display: flex; justify-content: center; align-items: center; color: white; font-family: \'MS Sans Serif\', sans-serif; font-size: 20px;">It\'s now safe to turn off your computer.</div>';
    });
    
    shutdownWindow.querySelector('#shutdown-no').addEventListener('click', () => {
        document.body.removeChild(shutdownWindow);
    });
}

// Play a sound
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
}

// Expose functions to the global scope
window.openWindow = openWindow; // This will be defined in windows.js
window.playSound = playSound;