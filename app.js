document.addEventListener('DOMContentLoaded', function() {
    // All available subjects with icons
    const allSubjects = [
        // Arts Subjects
        'Literature in English', 'Government', 'History', 'Geography', 
        'Economics', 'Christian Religious Studies', 'Islamic Studies', 
        'Fine Arts', 'Music', 'Drama/Theater Arts', 'Visual Arts',
        
        // Commerce Subjects
        'Commerce', 'Accounting', 'Business Studies', 'Office Practice',
        
        // Science Subjects
        'Biology', 'Chemistry', 'Physics', 'Mathematics', 
        'Further Mathematics', 'Computer Science',
        
        // Other Relevant Subjects
        'Agricultural Science', 'Health Education', 'Physical Education'
    ];

    const subjectIcons = {
        'Literature in English': 'fa-book',
        'Government': 'fa-landmark',
        'History': 'fa-history',
        'Geography': 'fa-globe-africa',
        'Economics': 'fa-chart-line',
        'Christian Religious Studies': 'fa-cross',
        'Islamic Studies': 'fa-mosque',
        'Fine Arts': 'fa-palette',
        'Music': 'fa-music',
        'Drama/Theater Arts': 'fa-theater-masks',
        'Visual Arts': 'fa-paint-brush',
        'Commerce': 'fa-shopping-cart',
        'Accounting': 'fa-calculator',
        'Business Studies': 'fa-briefcase',
        'Office Practice': 'fa-file-alt',
        'Biology': 'fa-dna',
        'Chemistry': 'fa-flask',
        'Physics': 'fa-atom',
        'Mathematics': 'fa-square-root-alt',
        'Further Mathematics': 'fa-infinity',
        'Computer Science': 'fa-laptop-code',
        'Agricultural Science': 'fa-tractor',
        'Health Education': 'fa-heartbeat',
        'Physical Education': 'fa-running'
    };

    // App state
    const state = {
        currentView: 'setup',
        user: {
            name: ''
        },
        settings: {
            questionCount: 20,
            timeLimit: 30,
            difficulty: 'medium'
        },
        selectedSubjects: [],
        questions: [],
        currentQuestionIndex: 0,
        totalTime: 0,
        timeLeft: {
            minutes: 0,
            seconds: 0
        },
        timer: null,
        showResults: false,
        testDate: new Date()
    };

    // DOM Elements
    const elements = {
        // Panels
        setupPanel: document.getElementById('setup-panel'),
        testPanel: document.getElementById('test-panel'),
        resultsPanel: document.getElementById('results-panel'),
        
        // Setup elements
        nameInput: document.getElementById('name'),
        subjectGrid: document.getElementById('subject-grid'),
        questionCountInput: document.getElementById('questionCount'),
        timeLimitInput: document.getElementById('timeLimit'),
        difficultySelect: document.getElementById('difficulty'),
        startTestBtn: document.getElementById('start-test-btn'),
        
        // Test elements
        timer: document.getElementById('timer'),
        timeMinutes: document.getElementById('time-minutes'),
        timeSeconds: document.getElementById('time-seconds'),
        progressBar: document.getElementById('progress-bar'),
        currentQuestionNum: document.getElementById('current-question-num'),
        totalQuestions: document.getElementById('total-questions'),
        questionContainer: document.getElementById('question-container'),
        questionNumber: document.getElementById('question-number'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        prevQuestionBtn: document.getElementById('prev-question-btn'),
        nextQuestionBtn: document.getElementById('next-question-btn'),
        finishTestBtn: document.getElementById('finish-test-btn'),
        endTestBtn: document.getElementById('end-test-btn'),
        viewResultsBtn: document.getElementById('view-results-btn'),
        
        // Results elements
        score: document.getElementById('score'),
        resultName: document.getElementById('result-name'),
        resultSubjects: document.getElementById('result-subjects'),
        resultTotalQuestions: document.getElementById('result-total-questions'),
        resultCorrect: document.getElementById('result-correct'),
        resultWrong: document.getElementById('result-wrong'),
        resultTime: document.getElementById('result-time'),
        resultDate: document.getElementById('result-date'),
        newTestBtn: document.getElementById('new-test-btn'),
        reviewTestBtn: document.getElementById('review-test-btn'),
        
        // Modal elements
        confirmationModal: document.getElementById('confirmation-modal'),
        confirmationMessage: document.getElementById('confirmation-message'),
        confirmYes: document.getElementById('confirm-yes'),
        confirmNo: document.getElementById('confirm-no')
    };

    // Initialize the app
    function init() {
        renderSubjects();
        setupEventListeners();
        updateStartButtonState();
    }

    // Render subject cards
    function renderSubjects() {
        elements.subjectGrid.innerHTML = '';
        allSubjects.forEach(subject => {
            const isSelected = state.selectedSubjects.includes(subject);
            const subjectCard = document.createElement('div');
            subjectCard.className = `bg-white rounded-lg p-4 shadow-md cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 text-center border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`;
            subjectCard.innerHTML = `
                <div class="text-blue-500 text-3xl mb-2">
                    <i class="fas ${subjectIcons[subject] || 'fa-question-circle'}"></i>
                </div>
                <h3 class="font-medium">${subject}</h3>
            `;
            subjectCard.addEventListener('click', () => toggleSubjectSelection(subject));
            elements.subjectGrid.appendChild(subjectCard);
        });
    }

    // Toggle subject selection
    function toggleSubjectSelection(subject) {
        const index = state.selectedSubjects.indexOf(subject);
        if (index === -1) {
            state.selectedSubjects.push(subject);
        } else {
            state.selectedSubjects.splice(index, 1);
        }
        renderSubjects();
        updateStartButtonState();
    }

    // Update start button state based on form validity
    function updateStartButtonState() {
        const isValid = state.user.name.trim() !== '' && 
                       state.selectedSubjects.length > 0 && 
                       state.settings.questionCount > 0 && 
                       state.settings.questionCount <= 100 &&
                       state.settings.timeLimit > 0 &&
                       state.settings.timeLimit <= 120;
        
        elements.startTestBtn.disabled = !isValid;
    }

    // Start the test
    function startTest() {
        // Update state from form inputs
        state.user.name = elements.nameInput.value.trim();
        state.settings.questionCount = parseInt(elements.questionCountInput.value);
        state.settings.timeLimit = parseInt(elements.timeLimitInput.value);
        state.settings.difficulty = elements.difficultySelect.value;
        
        // Generate questions
        state.questions = generateQuestions(
            state.selectedSubjects, 
            state.settings.questionCount, 
            state.settings.difficulty
        );
        
        // Reset test state
        state.currentQuestionIndex = 0;
        state.showResults = false;
        state.testDate = new Date();
        
        // Setup timer
        state.totalTime = state.settings.timeLimit * 60;
        updateTimerDisplay();
        
        // Start timer
        if (state.timer) {
            clearInterval(state.timer);
        }
        state.timer = setInterval(updateTimer, 1000);
        
        // Switch to test view
        showTestPanel();
        renderQuestion();
    }

    // Generate questions
    function generateQuestions(subjects, count, difficulty) {
        const questions = [];
        const questionsPerSubject = Math.ceil(count / subjects.length);
        
        subjects.forEach(subject => {
            for (let i = 0; i < questionsPerSubject && questions.length < count; i++) {
                questions.push(generateQuestion(subject, difficulty));
            }
        });
        
        return shuffleArray(questions);
    }

    // Generate a single question
    function generateQuestion(subject, difficulty) {
        const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
        const correctOptionIndex = Math.floor(Math.random() * 4);
        
        const question = {
            id: Math.random().toString(36).substr(2, 9),
            subject: subject,
            text: `Sample question about ${subject} (${difficulty} difficulty). This is a placeholder question that would be replaced with actual content in a real application.`,
            options: [],
            correctOptionIndex: correctOptionIndex,
            selectedOption: null
        };
        
        // Generate options
        for (let i = 0; i < 4; i++) {
            question.options.push({
                id: i,
                text: `Option ${i+1} for ${subject} question`,
                isCorrect: i === correctOptionIndex
            });
        }
        
        return question;
    }

    // Shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Update timer
    function updateTimer() {
        state.totalTime--;
        updateTimerDisplay();
        
        if (state.totalTime <= 0) {
            clearInterval(state.timer);
            finishTest();
        }
    }

    // Update timer display
    function updateTimerDisplay() {
        state.timeLeft = {
            minutes: Math.floor(state.totalTime / 60),
            seconds: state.totalTime % 60
        };
        
        elements.timeMinutes.textContent = padNumber(state.timeLeft.minutes, 2);
        elements.timeSeconds.textContent = padNumber(state.timeLeft.seconds, 2);
        
        // Update timer color based on time remaining
        if (state.timeLeft.minutes < 1) {
            elements.timer.classList.add('text-red-500', 'pulse-fast');
            elements.timer.classList.remove('text-yellow-500', 'pulse-animation', 'text-gray-800');
        } else if (state.timeLeft.minutes < 5) {
            elements.timer.classList.add('text-yellow-500', 'pulse-animation');
            elements.timer.classList.remove('text-red-500', 'pulse-fast', 'text-gray-800');
        } else {
            elements.timer.classList.remove('text-red-500', 'pulse-fast', 'text-yellow-500', 'pulse-animation');
            elements.timer.classList.add('text-gray-800');
        }
    }

    // Pad number with leading zeros
    function padNumber(num, length) {
        return num.toString().padStart(length, '0');
    }

    // Show test panel
    function showTestPanel() {
        elements.setupPanel.classList.add('hidden');
        elements.testPanel.classList.remove('hidden');
        elements.resultsPanel.classList.add('hidden');
        state.currentView = 'test';
    }

    // Render current question
    function renderQuestion() {
        const question = state.questions[state.currentQuestionIndex];
        
        // Update question number and progress
        elements.currentQuestionNum.textContent = state.currentQuestionIndex + 1;
        elements.totalQuestions.textContent = state.questions.length;
        elements.progressBar.style.width = `${(state.currentQuestionIndex / state.questions.length) * 100}%`;
        
        // Update question text
        elements.questionNumber.textContent = `Question ${state.currentQuestionIndex + 1}`;
        elements.questionText.textContent = question.text;
        
        // Render options
        elements.optionsContainer.innerHTML = '';
        question.options.forEach(option => {
            const optionEl = document.createElement('div');
            let optionClasses = 'p-4 border rounded-lg cursor-pointer transition flex items-center';
            
            if (state.showResults) {
                if (option.isCorrect) {
                    optionClasses += ' bg-green-100 border-green-300';
                } else if (question.selectedOption === option) {
                    optionClasses += ' bg-red-100 border-red-300';
                }
            } else if (question.selectedOption === option) {
                optionClasses += ' bg-blue-50 border-blue-300 font-medium';
            } else {
                optionClasses += ' hover:bg-gray-50 hover:border-blue-300';
            }
            
            optionEl.className = optionClasses;
            optionEl.innerHTML = `
                <input type="radio" name="questionOption" class="mr-3" 
                    ${question.selectedOption === option ? 'checked' : ''}
                    ${state.showResults ? 'disabled' : ''}>
                ${option.text}
                ${state.showResults ? `
                    <span class="ml-auto">
                        ${option.isCorrect ? '<i class="fas fa-check text-green-500"></i>' : ''}
                        ${!option.isCorrect && question.selectedOption === option ? '<i class="fas fa-times text-red-500"></i>' : ''}
                    </span>
                ` : ''}
            `;
            
            if (!state.showResults) {
                optionEl.addEventListener('click', () => selectOption(option));
            }
            
            elements.optionsContainer.appendChild(optionEl);
        });
        
        // Update navigation buttons
        elements.prevQuestionBtn.disabled = state.currentQuestionIndex === 0;
        
        if (state.currentQuestionIndex === state.questions.length - 1) {
            elements.nextQuestionBtn.classList.add('hidden');
            elements.finishTestBtn.classList.remove('hidden');
        } else {
            elements.nextQuestionBtn.classList.remove('hidden');
            elements.finishTestBtn.classList.add('hidden');
        }
        
        elements.endTestBtn.classList.toggle('hidden', state.showResults);
        elements.viewResultsBtn.classList.toggle('hidden', !state.showResults);
    }

    // Select an option
    function selectOption(option) {
        if (!state.showResults) {
            state.questions[state.currentQuestionIndex].selectedOption = option;
            renderQuestion();
        }
    }

    // Go to next question
    function nextQuestion() {
        if (state.currentQuestionIndex < state.questions.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        }
    }

    // Go to previous question
    function previousQuestion() {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            renderQuestion();
        }
    }

    // Finish test
    function finishTest() {
        clearInterval(state.timer);
        state.showResults = true;
        renderQuestion();
    }

    // View results
    function viewResults() {
        elements.setupPanel.classList.add('hidden');
        elements.testPanel.classList.add('hidden');
        elements.resultsPanel.classList.remove('hidden');
        state.currentView = 'results';
        
        // Calculate results
        const correctAnswers = state.questions.filter(q => q.selectedOption && q.selectedOption.isCorrect).length;
        const wrongAnswers = state.questions.filter(q => q.selectedOption && !q.selectedOption.isCorrect).length;
        const percentage = Math.round((correctAnswers / state.questions.length) * 100);
        
        // Calculate time spent
        const timeSpentMinutes = Math.floor((state.settings.timeLimit * 60 - state.totalTime) / 60);
        const timeSpentSeconds = (state.settings.timeLimit * 60 - state.totalTime) % 60;
        
        // Update results display
        elements.score.textContent = `${percentage}%`;
        elements.resultName.textContent = state.user.name;
        elements.resultSubjects.textContent = state.selectedSubjects.join(', ');
        elements.resultTotalQuestions.textContent = state.questions.length;
        elements.resultCorrect.textContent = correctAnswers;
        elements.resultWrong.textContent = wrongAnswers;
        elements.resultTime.textContent = `${timeSpentMinutes}m ${timeSpentSeconds}s`;
        elements.resultDate.textContent = state.testDate.toLocaleString();
    }

    // Start new test
    function startNewTest() {
        // Reset state
        state.selectedSubjects = [];
        state.questions = [];
        state.currentQuestionIndex = 0;
        state.showResults = false;
        
        // Reset form inputs
        elements.nameInput.value = '';
        elements.questionCountInput.value = '20';
        elements.timeLimitInput.value = '30';
        elements.difficultySelect.value = 'medium';
        
        // Switch to setup view
        elements.setupPanel.classList.remove('hidden');
        elements.testPanel.classList.add('hidden');
        elements.resultsPanel.classList.add('hidden');
        state.currentView = 'setup';
        
        // Re-render subjects
        renderSubjects();
        updateStartButtonState();
    }

    // Review test
    function reviewTest() {
        state.currentQuestionIndex = 0;
        state.showResults = true;
        showTestPanel();
        renderQuestion();
    }

    // Show confirmation dialog
    function showConfirmation(message, callback) {
        elements.confirmationMessage.textContent = message;
        elements.confirmationModal.classList.remove('hidden');
        
        const handleResponse = (confirmed) => {
            elements.confirmationModal.classList.add('hidden');
            if (confirmed && callback) {
                callback();
            }
            
            // Clean up event listeners
            elements.confirmYes.removeEventListener('click', yesHandler);
            elements.confirmNo.removeEventListener('click', noHandler);
        };
        
        const yesHandler = () => handleResponse(true);
        const noHandler = () => handleResponse(false);
        
        elements.confirmYes.addEventListener('click', yesHandler);
        elements.confirmNo.addEventListener('click', noHandler);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Form inputs
        elements.nameInput.addEventListener('input', () => {
            state.user.name = elements.nameInput.value.trim();
            updateStartButtonState();
        });
        
        elements.questionCountInput.addEventListener('input', () => {
            state.settings.questionCount = parseInt(elements.questionCountInput.value);
            updateStartButtonState();
        });
        
        elements.timeLimitInput.addEventListener('input', () => {
            state.settings.timeLimit = parseInt(elements.timeLimitInput.value);
            updateStartButtonState();
        });
        
        elements.difficultySelect.addEventListener('change', () => {
            state.settings.difficulty = elements.difficultySelect.value;
        });
        
        // Buttons
        elements.startTestBtn.addEventListener('click', startTest);
        elements.prevQuestionBtn.addEventListener('click', previousQuestion);
        elements.nextQuestionBtn.addEventListener('click', nextQuestion);
        elements.finishTestBtn.addEventListener('click', finishTest);
        elements.endTestBtn.addEventListener('click', () => {
            showConfirmation('Are you sure you want to end the test now?', finishTest);
        });
        elements.viewResultsBtn.addEventListener('click', viewResults);
        elements.newTestBtn.addEventListener('click', startNewTest);
        elements.reviewTestBtn.addEventListener('click', reviewTest);
        
        // Handle page reload confirmation
        window.addEventListener('beforeunload', (e) => {
            if (state.currentView === 'test') {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
                return e.returnValue;
            }
        });
    }

    // Initialize the app
    init();
});