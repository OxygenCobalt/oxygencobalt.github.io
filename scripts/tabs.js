document.addEventListener('DOMContentLoaded', function() {
    // Add no-transition class initially
    document.documentElement.classList.add('no-tab-transition');

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