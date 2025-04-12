document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const repoName = card.getAttribute('data-repo');
        const starsElement = card.querySelector('.github-stars');

        if (repoName && starsElement) {
            const apiUrl = `https://api.github.com/repos/${repoName}`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const starCount = data.stargazers_count !== undefined ? data.stargazers_count : 'N/A';
                    starsElement.textContent = `Stars: ${starCount} ⭐`;
                })
                .catch(error => {
                    console.error('Error fetching GitHub data for', repoName, ':', error);
                    starsElement.textContent = 'Stars: Error';
                });
        } else if (starsElement) {
            // Handle cases where data-repo is missing but the span exists
             starsElement.textContent = 'Stars: Repo not specified';
        }
    });
});
