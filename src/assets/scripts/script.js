document.addEventListener('DOMContentLoaded', function() {
    // Add no-transition class initially
    document.documentElement.classList.add('no-tab-transition');
    
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
    
    // Close mobile menu when HTMX navigation occurs
    document.body.addEventListener('htmx:afterOnLoad', function() {
        if (window.innerWidth <= 768) {
            toggleMobileMenu(false);
        }
    });

    // Remove no-transition class after a brief delay
    setTimeout(() => {
        document.documentElement.classList.remove('no-tab-transition');
    }, 100);
    
    // Update active tab when navigation occurs
    document.body.addEventListener('htmx:afterSettle', function(event) {
        // Remove active class from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        
        // Get the current path
        const currentPath = window.location.pathname;
        
        // Find the button that matches the current URL and make it active
        let activeButton = document.querySelector(`.tab-button[hx-push-url="${currentPath}"]`);
        
        // If no exact match is found and the URL contains "/blog/", 
        // then make the Blog tab active
        if (!activeButton && currentPath.startsWith('/blog/')) {
            activeButton = document.querySelector(`.tab-button[hx-push-url="/"]`);
        }
        
        if (activeButton) {
            activeButton.classList.add('active');
        }
    });
});