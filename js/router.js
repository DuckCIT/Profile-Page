// Client-side router for handling page navigation
class Router {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/projects': 'projects/index.html',
            '/privacy-policy': 'privacy-policy/index.html',
            '/terms-of-use': 'terms-of-use/index.html'
        };
        
        this.contentContainer = document.querySelector('.content');
        this.init();
    }

    // Initialize router event listeners
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.loadContent(window.location.pathname));
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a') && !e.target.matches('.footer-icons a')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href && this.routes[href]) {
                    this.navigate(href);
                }
            }
        });

        // Handle initial page load
        this.handleInitialLoad();
    }

    // Handle initial page load
    async handleInitialLoad() {
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && this.routes[currentPath]) {
            await this.loadContent(currentPath);
        }
    }

    // Navigate to a new page
    async navigate(path) {
        history.pushState({}, '', path);
        await this.loadContent(path);
        // Scroll to top when navigating
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Load and update page content
    async loadContent(path) {
        try {
            const response = await fetch(this.routes[path]);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Update title based on the current path
            const titles = {
                '/': 'Duck CIT',
                '/projects': 'My Projects - Duck CIT',
                '/privacy-policy': 'Privacy Policy - Duck CIT',
                '/terms-of-use': 'Terms of Use - Duck CIT'
            };
            document.title = titles[path] || 'Duck CIT';
            
            // Update content
            const newContent = doc.querySelector('.content');
            if (newContent) {
                // Clear existing content
                this.contentContainer.innerHTML = '';
                
                // Add new content
                this.contentContainer.innerHTML = newContent.innerHTML;
                
                // Update content with current language
                if (typeof updateContent === 'function') {
                    updateContent(currentLang);
                }
                
                // If we're on the projects page, load the projects script and projects
                if (path === '/projects') {
                    await this.loadProjectsScript();
                    if (typeof window.loadProjects === 'function') {
                        await window.loadProjects();
                    }
                }
                
                // Reinitialize any necessary scripts
                this.reinitializeScripts();
            }
        } catch (error) {
            console.error('Error loading content:', error);
            this.contentContainer.innerHTML = '<h1>Page not found</h1>';
        }
    }

    // Load projects page script
    async loadProjectsScript() {
        return new Promise((resolve, reject) => {
            // Remove existing projects script if any
            const existingScript = document.querySelector('script[src$="projects.js"]');
            if (existingScript) {
                existingScript.remove();
            }

            // Create and load new script
            const script = document.createElement('script');
            script.src = 'js/projects.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // Reinitialize necessary scripts after content load
    reinitializeScripts() {
        // Reinitialize any scripts that need to run after content load
        if (typeof initModal === 'function') {
            initModal();
        }
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
}); 