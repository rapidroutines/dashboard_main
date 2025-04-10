// Function to render exercise cards
function renderExercises(category = 'all') {
    const exerciseGrid = document.getElementById('exerciseGrid');
    exerciseGrid.innerHTML = '';

    const filteredExercises = category === 'all' 
        ? exercises 
        : exercises.filter(exercise => exercise.category === category);

    filteredExercises.forEach(exercise => {
        const card = document.createElement('div');
        card.classList.add('exercise-card', exercise.category);

        // Create difficulty dots based on level
        let difficultyDots = '';
        for (let i = 1; i <= 3; i++) {
            difficultyDots += `<span class="difficulty-level ${i <= exercise.difficulty ? 'active' : ''}"></span>`;
        }

        // Map difficulty level to text
        let difficultyText = '';
        switch(exercise.difficulty) {
            case 1:
                difficultyText = 'Beginner';
                break;
            case 2:
                difficultyText = 'Intermediate';
                break;
            case 3:
                difficultyText = 'Advanced';
                break;
        }

        card.innerHTML = `
            <div class="exercise-img" style="background-image: url('${exercise.image}')">
                <span class="exercise-category">${exercise.category}</span>
            </div>
            <div class="exercise-content">
                <h3 class="exercise-title">${exercise.title}</h3>
                <p class="exercise-desc">${exercise.description}</p>
                <div class="exercise-meta">
                    <div class="difficulty">
                        ${difficultyDots}
                        <span class="difficulty-text">${difficultyText}</span>
                    </div>
                </div>
                <a href="#" class="exercise-btn">View Details</a>
            </div>
        `;

        exerciseGrid.appendChild(card);
    });
}

// Initialize with all exercises
document.addEventListener('DOMContentLoaded', () => {
    renderExercises();

    // Add filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter exercises
            const filter = button.getAttribute('data-filter');
            renderExercises(filter);
        });
    });

    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Change icon based on theme
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
    });
});
