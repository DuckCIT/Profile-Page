document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.getElementById('projects-grid');
    const loadingIndicator = document.getElementById('projects-loading');

    // Fetch GitHub repositories
    fetch('https://api.github.com/users/DuckCIT/repos?sort=updated&direction=desc')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            return response.json();
        })
        .then(repos => {
            // Filter out forks and sort by star count
            const sortedRepos = repos
                .filter(repo => !repo.fork && repo.stargazers_count > 0)
                .sort((a, b) => b.stargazers_count - a.stargazers_count);

            if (sortedRepos.length === 0) {
                projectsGrid.innerHTML = `<p class="error-message">${translations[currentLang].projectsError}</p>`;
                return;
            }

            // Create project cards
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
                        <div class="project-languages">
                            ${repo.language ? `<span class="language-tag">${repo.language}</span>` : ''}
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i>
                            ${translations[currentLang].viewOnGitHub}
                        </a>
                    </div>
                `;
                projectsGrid.appendChild(projectCard);
            });

            // Show the grid and hide loading indicator
            projectsGrid.style.display = 'grid';
            loadingIndicator.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            projectsGrid.innerHTML = `<p class="error-message">${translations[currentLang].projectsError}</p>`;
            loadingIndicator.style.display = 'none';
        });
}); 