angular.module('cbtApp', [])
.filter('numberPad', function() {
    return function(input, length) {
        input = input.toString();
        while (input.length < length) {
            input = '0' + input;
        }
        return input;
    };
})
.controller('CBTController', function($scope, $window, $interval) {
    // Initialize variables
    $scope.currentView = 'setup';
    $scope.user = {
        name: ''
    };
    $scope.settings = {
        questionCount: 20,
        timeLimit: 30,
        difficulty: 'medium'
    };
    $scope.selectedSubjects = [];
    $scope.questions = [];
    $scope.currentQuestionIndex = 0;
    $scope.timeLeft = {
        minutes: 0,
        seconds: 0
    };
    $scope.totalTime = 0;
    $scope.timer = null;
    $scope.showResults = false;
    $scope.testDate = new Date();
    $scope.showConfirmationModal = false;
    $scope.confirmationMessage = '';
    $scope.confirmationCallback = null;
    
    // All available subjects with categories
    $scope.allSubjects = [
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
    
    // Get icon for each subject
    $scope.getSubjectIcon = function(subject) {
        const icons = {
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
        
        return icons[subject] || 'fa-question-circle';
    };
    
    // Toggle subject selection
    $scope.toggleSubjectSelection = function(subject) {
        const index = $scope.selectedSubjects.indexOf(subject);
        if (index === -1) {
            $scope.selectedSubjects.push(subject);
        } else {
            $scope.selectedSubjects.splice(index, 1);
        }
    };
    
    // Check if subject is selected
    $scope.isSubjectSelected = function(subject) {
        return $scope.selectedSubjects.indexOf(subject) !== -1;
    };
    
    // Check if can start test
    $scope.canStartTest = function() {
        return $scope.user.name && 
               $scope.selectedSubjects.length > 0 && 
               $scope.settings.questionCount > 0 && 
               $scope.settings.questionCount <= 100 &&
               $scope.settings.timeLimit > 0 &&
               $scope.settings.timeLimit <= 120;
    };
    
    // Start the test
    $scope.startTest = function() {
        // Generate questions based on selected subjects
        $scope.questions = generateQuestions(
            $scope.selectedSubjects, 
            $scope.settings.questionCount, 
            $scope.settings.difficulty
        );
        
        // Initialize test variables
        $scope.currentQuestionIndex = 0;
        $scope.showResults = false;
        $scope.testDate = new Date();
        
        // Set up timer
        $scope.totalTime = $scope.settings.timeLimit * 60;
        $scope.timeLeft = {
            minutes: Math.floor($scope.totalTime / 60),
            seconds: $scope.totalTime % 60
        };
        
        // Start timer
        if ($scope.timer) {
            $interval.cancel($scope.timer);
        }
        $scope.timer = $interval(function() {
            $scope.totalTime--;
            $scope.timeLeft = {
                minutes: Math.floor($scope.totalTime / 60),
                seconds: $scope.totalTime % 60
            };
            
            if ($scope.totalTime <= 0) {
                $interval.cancel($scope.timer);
                $scope.finishTest();
            }
        }, 1000);
        
        // Switch to test view
        $scope.currentView = 'test';
    };
    
    // Generate questions based on subjects and difficulty
    function generateQuestions(subjects, count, difficulty) {
        const questions = [];
        const questionsPerSubject = Math.ceil(count / subjects.length);
        
        subjects.forEach(subject => {
            for (let i = 0; i < questionsPerSubject && questions.length < count; i++) {
                questions.push(generateQuestion(subject, difficulty));
            }
        });
        
        // Shuffle questions
        return shuffleArray(questions);
    }
    
    // Generate a single question for a subject
    function generateQuestion(subject, difficulty) {
        // This is a simplified version - in a real app, you would have a database of questions
        const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
        
        const question = {
            id: Math.random().toString(36).substr(2, 9),
            subject: subject,
            text: `Sample question about ${subject} (${difficulty} difficulty). This is a placeholder question that would be replaced with actual content in a real application.`,
            options: [],
            correctOptionIndex: Math.floor(Math.random() * 4),
            selectedOption: null
        };
        
        // Generate options
        for (let i = 0; i < 4; i++) {
            question.options.push({
                id: i,
                text: `Option ${i+1} for ${subject} question`,
                isCorrect: i === question.correctOptionIndex
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
    
    // Get current question
    $scope.currentQuestion = function() {
        return $scope.questions[$scope.currentQuestionIndex];
    };
    
    // Select an option
    $scope.selectOption = function(option) {
        if (!$scope.showResults) {
            $scope.currentQuestion().selectedOption = option;
        }
    };
    
    // Check if option is selected
    $scope.isOptionSelected = function(option) {
        return $scope.currentQuestion().selectedOption === option;
    };
    
    // Go to next question
    $scope.nextQuestion = function() {
        if ($scope.currentQuestionIndex < $scope.questions.length - 1) {
            $scope.currentQuestionIndex++;
        }
    };
    
    // Go to previous question
    $scope.previousQuestion = function() {
        if ($scope.currentQuestionIndex > 0) {
            $scope.currentQuestionIndex--;
        }
    };
    
    // Check if current question is last
    $scope.isLastQuestion = function() {
        return $scope.currentQuestionIndex === $scope.questions.length - 1;
    };
    
    // Finish test
    $scope.finishTest = function() {
        $interval.cancel($scope.timer);
        $scope.showResults = true;
    };
    
    // View results
    $scope.viewResults = function() {
        $scope.currentView = 'results';
    };
    
    // Count correct answers
    $scope.countCorrectAnswers = function() {
        return $scope.questions.filter(q => q.selectedOption && q.selectedOption.isCorrect).length;
    };
    
    // Count wrong answers
    $scope.countWrongAnswers = function() {
        return $scope.questions.filter(q => q.selectedOption && !q.selectedOption.isCorrect).length;
    };
    
    // Calculate percentage
    $scope.calculatePercentage = function() {
        const correct = $scope.countCorrectAnswers();
        return Math.round((correct / $scope.questions.length) * 100);
    };
    
    // Format time spent
    $scope.formatTimeSpent = function() {
        const totalSeconds = ($scope.settings.timeLimit * 60) - $scope.totalTime;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds}s`;
    };
    
    // Start new test
    $scope.startNewTest = function() {
        $scope.currentView = 'setup';
        $scope.selectedSubjects = [];
    };
    
    // Review test
    $scope.reviewTest = function() {
        $scope.currentView = 'test';
        $scope.currentQuestionIndex = 0;
        $scope.showResults = true;
    };
    
    // Show confirmation dialog
    $scope.showConfirmation = function(message, callback) {
        $scope.confirmationMessage = message;
        $scope.confirmationCallback = callback;
        $scope.showConfirmationModal = true;
    };
    
    // Confirm action
    $scope.confirmAction = function(confirmed) {
        $scope.showConfirmationModal = false;
        if (confirmed && $scope.confirmationCallback) {
            $scope.confirmationCallback();
        }
    };
    
    // Handle page reload
    $window.onbeforeunload = function(e) {
        if ($scope.currentView === 'test') {
            const message = 'Are you sure you want to leave? Your test progress will be lost.';
            e.returnValue = message;
            return message;
        }
    };
    
    // Initialize
    $scope.$watch('currentQuestionIndex', function() {
        $scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
    });
});         