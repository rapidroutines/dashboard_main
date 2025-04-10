function renderExercises(category = 'all') {
    const exerciseGrid = document.getElementById('exerciseGrid');
    exerciseGrid.innerHTML = '';

    const filteredExercises = category === 'all' 
        ? exercises 
        : exercises.filter(exercise => exercise.category === category);

    filteredExercises.forEach(exercise => {
        const card = document.createElement('div');
        card.classList.add('exercise-card', exercise.category);

        let difficultyDots = '';
        for (let i = 1; i <= 3; i++) {
            difficultyDots += `<span class="difficulty-level ${i <= exercise.difficulty ? 'active' : ''}"></span>`;
        }

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

document.addEventListener('DOMContentLoaded', () => {
    renderExercises();

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            renderExercises(filter);
        });
    });

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
    });
});
