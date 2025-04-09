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

    init() {
        window.addEventListener('popstate', () => {
            this.loadContent(window.location.pathname);
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('a') && !e.target.matches('.footer-icons a')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href && this.routes[href]) {
                    // Kiểm tra nếu đang ở trang hiện tại
                    if (href === window.location.pathname) {
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu
                    } else {
                        this.navigate(href);
                    }
                }
            }
        });

        this.handleInitialLoad();
        this.cleanUrl();
    }

    cleanUrl() {
        const currentUrl = window.location.pathname;
        if (currentUrl.endsWith('index.html')) {
            const newUrl = currentUrl.replace('index.html', '');
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    async handleInitialLoad() {
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && this.routes[currentPath]) {
            await this.loadContent(currentPath);
        }
    }

    async navigate(path) {
        if (window.location.pathname === '/' && path !== '/') {
            if (typeof window.stopFoodRandom === 'function') {
                window.stopFoodRandom();
            }
        }
        history.pushState({}, '', path);
        await this.loadContent(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.cleanUrl();
    }

    async loadContent(path) {
        try {
            const response = await fetch(this.routes[path]);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const titles = {
                '/': 'Duck CIT',
                '/projects': 'My Projects - Duck CIT',
                '/privacy-policy': 'Privacy Policy - Duck CIT',
                '/terms-of-use': 'Terms of Use - Duck CIT'
            };
            document.title = titles[path] || 'Duck CIT';
            
            const newContent = doc.querySelector('.content');
            if (newContent) {
                this.contentContainer.innerHTML = newContent.innerHTML;
                
                if (typeof updateContent === 'function') {
                    updateContent(currentLang);
                }
                
                if (path === '/projects') {
                    await this.loadProjectsScript();
                    if (typeof window.loadProjects === 'function') {
                        await window.loadProjects();
                    }
                }
                
                this.reinitializeScripts();
            }
        } catch (error) {
            this.contentContainer.innerHTML = '<h1>Page not found</h1>';
        }
    }

    async loadProjectsScript() {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[src$="projects.js"]');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement('script');
            script.src = 'js/projects.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    reinitializeScripts() {
        if (typeof initModal === 'function') {
            initModal();
        }
        if (window.location.pathname === '/' && typeof window.initFoodRandom === 'function') {
            window.initFoodRandom();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});