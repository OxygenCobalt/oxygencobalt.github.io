document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // On mobile, close the menu when a tab is selected
            if (window.innerWidth <= 768) {
                toggleMobileMenu(false);
            }
        });
    });
    
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