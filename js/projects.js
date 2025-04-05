// Main function to fetch and display GitHub projects
async function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const loadingIndicator = document.getElementById('projects-loading');

    if (!projectsGrid || !loadingIndicator) return;

    try {
        // Show loading state
        loadingIndicator.style.display = 'block';
        projectsGrid.style.display = 'none';
        
        const loadingText = document.getElementById('projectsLoading');
        if (loadingText) {
            loadingText.textContent = translations[currentLang].projectsLoading;
        }

        // Fetch and process GitHub repositories
        const response = await fetch('https://api.github.com/users/DuckCIT/repos?sort=updated&direction=desc');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const repos = await response.json();

        const sortedRepos = repos
            .filter(repo => !repo.fork && repo.stargazers_count > 0)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        projectsGrid.innerHTML = '';

        if (sortedRepos.length === 0) {
            projectsGrid.innerHTML = `<p class="error-message">${translations[currentLang].projectsError}</p>`;
            return;
        }

        // Create and display project cards
        sortedRepos.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-card-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || translations[currentLang].noDescription}</p>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count} ${translations[currentLang].stars}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count} ${translations[currentLang].forks}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i>
                        ${translations[currentLang].viewOnGitHub}
                    </a>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });

        projectsGrid.style.display = 'grid';
        loadingIndicator.style.display = 'none';
    } catch (error) {
        projectsGrid.innerHTML = `<p class="error-message">${translations[currentLang].projectsError}</p>`;
        loadingIndicator.style.display = 'none';
    }
}

window.loadProjects = loadProjects;
window.addEventListener('load', loadProjects);