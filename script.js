document.addEventListener('DOMContentLoaded', function() {
    // Add no-transition class initially
    document.documentElement.classList.add('no-tab-transition');
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Function to activate a specific tab
    function activateTab(tabId) {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab
        const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
            
            // On mobile, close the menu when a tab is selected
            if (window.innerWidth <= 768) {
                toggleMobileMenu(false);
            }
        }
    }
    
    // Handle tab button clicks
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            window.location.hash = tabId; // Update URL hash
        });
    });
    
    // Handle URL hash changes
    function handleHashChange() {
        let tabId = window.location.hash.slice(1); // Remove the # from the hash
        
        // If no hash or invalid tab, default to 'home'
        if (!tabId || !document.getElementById(tabId)) {
            tabId = 'home';
            // Only update URL if it's not already at the default
            if (window.location.hash !== '#home') {
                window.location.hash = tabId;
                return; // handleHashChange will be called again by the hash change
            }
        }
        
        activateTab(tabId);
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial tab setup
    handleHashChange();
    
    // Remove no-transition class after a brief delay
    setTimeout(() => {
        document.documentElement.classList.remove('no-tab-transition');
    }, 100);
    
    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    
    // Toggle menu function
    function toggleMobileMenu(show) {
        if (show === undefined) {
            // Toggle based on current state if no parameter passed
            menuToggle.classList.toggle('active');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        } else {
            // Set specific state
            if (show) {
                menuToggle.classList.add('active');
                sidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    
    // Menu toggle button click
    menuToggle.addEventListener('click', () => {
        toggleMobileMenu();
    });
    
    // Close menu when overlay is clicked
    overlay.addEventListener('click', () => {
        toggleMobileMenu(false);
    });
    
    // Close menu when window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toggleMobileMenu(false);
        }
    });
    
    // Theme detection based on system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
    
    // Set initial theme based on system preference
    setTheme(prefersDarkScheme.matches);
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', e => {
        setTheme(e.matches);
    });
});