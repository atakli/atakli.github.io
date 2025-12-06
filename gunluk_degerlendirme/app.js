// Storage keys
const STORAGE_KEYS = {
    QUESTIONS: 'daily_questions',
    ANSWERS: 'daily_answers',
    ANSWER_OPTIONS: 'answer_options',
    LAST_ANSWERED_DATE: 'last_answered_date'
};

// Generate unique ID for questions
function generateId() {
    return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Default questions - now includes answer options for each question
const DEFAULT_QUESTIONS = [
    {
        id: generateId(),
        text: "Bugün başın ağrıdı mı?",
        answerOptions: ["Evet", "Hayır"]
    }
];

// Predefined default questions library
const DEFAULT_QUESTIONS_LIBRARY = [
    {
        text: "Bugün başın ağrıdı mı?",
        answerOptions: ["Evet", "Hayır"]
    },
    {
        text: "Bugün mide bulantın oldu mu?",
        answerOptions: ["Evet", "Hayır"]
    },
    {
        text: "Bugün ilaç aldın mı?",
        answerOptions: ["Evet", "Hayır"]
    },
    {
        text: "Bugün uyku kaliteniz nasıldı?",
        answerOptions: ["Çok iyi", "İyi", "Orta", "Kötü", "Çok kötü"]
    },
    {
        text: "Bugün stres seviyeniz nasıldı?",
        answerOptions: ["Çok yüksek", "Yüksek", "Orta", "Düşük", "Çok düşük"]
    },
    {
        text: "Bugün egzersiz yaptın mı?",
        answerOptions: ["Evet", "Hayır"]
    },
    {
        text: "Bugün yeterince su içtin mi?",
        answerOptions: ["Evet", "Hayır"]
    },
    {
        text: "Bugün kaç saat uyudun?",
        answerOptions: ["4'ten az", "4-6 saat", "6-8 saat", "8'den fazla"]
    },
    {
        text: "Bugün ruh halin nasıldı?",
        answerOptions: ["Çok iyi", "İyi", "Orta", "Kötü", "Çok kötü"]
    },
    {
        text: "Bugün konsantrasyon sorunu yaşadın mı?",
        answerOptions: ["Evet", "Hayır"]
    }
];

// App state
let questions = [];
let answers = [];

// Show default questions selection screen
function loadDefaultQuestions() {
    showScreen('defaultQuestionsScreen');
    displayDefaultQuestions();
}

// Display default questions with checkboxes
function displayDefaultQuestions() {
    const container = document.getElementById('defaultQuestionsList');

    const availableQuestions = DEFAULT_QUESTIONS_LIBRARY.filter(defaultQ => {
        // Show only questions that don't already exist
        return !questions.some(q => q.text === defaultQ.text);
    });

    if (availableQuestions.length === 0) {
        container.innerHTML = '<p class="no-data">Tüm varsayılan sorular zaten eklenmiş!</p>';
        return;
    }

    container.innerHTML = availableQuestions.map((q, index) => `
        <div class="default-question-item">
            <label class="checkbox-label">
                <input type="checkbox" class="question-checkbox" data-index="${index}" checked>
                <div class="question-info">
                    <div class="question-text">${q.text}</div>
                    <div class="answer-options-preview">Cevaplar: ${q.answerOptions.join(', ')}</div>
                </div>
            </label>
        </div>
    `).join('');
}

// Add selected default questions
function addSelectedDefaultQuestions() {
    const checkboxes = document.querySelectorAll('.question-checkbox:checked');
    const availableQuestions = DEFAULT_QUESTIONS_LIBRARY.filter(defaultQ => {
        return !questions.some(q => q.text === defaultQ.text);
    });

    let addedCount = 0;
    checkboxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        const defaultQuestion = availableQuestions[index];

        questions.push({
            id: generateId(),
            text: defaultQuestion.text,
            answerOptions: [...defaultQuestion.answerOptions]
        });
        addedCount++;
    });

    if (addedCount > 0) {
        saveQuestions();
        updateUI();
        alert(`${addedCount} soru eklendi!`);
        showScreen('homeScreen');
    } else {
        alert('Lütfen en az bir soru seçin.');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeServiceWorker();
    setupEventListeners();
    updateUI();
    checkTodayAnswer();
});

// Load data from localStorage
function loadData() {
    const storedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (storedQuestions) {
        const parsed = JSON.parse(storedQuestions);
        // Migrate old format (array of strings) to new format (array of objects with IDs)
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
            questions = parsed.map(q => ({
                id: generateId(),
                text: q,
                answerOptions: ["Evet", "Hayır"]
            }));
            saveQuestions(); // Save migrated format
        } else if (parsed.length > 0 && !parsed[0].id) {
            // Migrate format without IDs to format with IDs
            questions = parsed.map(q => ({
                id: generateId(),
                text: q.text,
                answerOptions: q.answerOptions || ["Evet", "Hayır"]
            }));
            saveQuestions(); // Save migrated format
        } else {
            questions = parsed;
        }
    } else {
        questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    }

    const storedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
    answers = storedAnswers ? JSON.parse(storedAnswers) : [];
}

// Save data to localStorage
function saveQuestions() {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

function saveAnswers() {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
}

// Initialize Service Worker
async function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// Check if all today's questions are answered
function checkTodayAnswer() {
    const todayLocalDateString = new Date().toLocaleDateString('tr-TR');
    const reminderAlert = document.getElementById('reminderAlert');

    // Check if all questions are answered
    const unansweredCount = questions.filter(question => {
        const answered = answers.some(a =>
            a.dateString === todayLocalDateString && a.questionId === question.id
        );
        return !answered;
    }).length;

    if (unansweredCount > 0) {
        reminderAlert.style.display = 'block';
    } else {
        reminderAlert.style.display = 'none';
    }
}


// Answer a specific question
function answerQuestion(questionId, questionText, answer) {
    const today = new Date();
    // Create a date in Istanbul timezone (UTC+3)
    const istanbulDate = new Date(today.getTime() + (3 * 60 * 60 * 1000));
    const answerData = {
        date: istanbulDate.toISOString(),
        dateString: today.toLocaleDateString('tr-TR'),
        questionId: questionId,
        question: questionText,
        answer: answer
    };

    // Check if already answered today - use question ID for comparison
    const todayLocalDateString = today.toLocaleDateString('tr-TR');
    const existingAnswerIndex = answers.findIndex(a => {
        return a.dateString === todayLocalDateString && a.questionId === questionId;
    });

    if (existingAnswerIndex >= 0) {
        // Update existing answer instead of creating new one
        answers[existingAnswerIndex] = answerData;
    } else {
        // Add new answer at the beginning
        answers.unshift(answerData);
    }

    localStorage.setItem(STORAGE_KEYS.LAST_ANSWERED_DATE, today.toDateString());
    saveAnswers();

    // Update UI to show answered state
    renderAllQuestions();
    checkTodayAnswer();
}

// Check if a question has been answered today
function isQuestionAnsweredToday(questionId) {
    const todayLocalDateString = new Date().toLocaleDateString('tr-TR');
    return answers.some(a =>
        a.dateString === todayLocalDateString && a.questionId === questionId
    );
}

// Get today's answer for a question
function getTodaysAnswer(questionId) {
    const todayLocalDateString = new Date().toLocaleDateString('tr-TR');
    const answer = answers.find(a =>
        a.dateString === todayLocalDateString && a.questionId === questionId
    );
    return answer ? answer.answer : null;
}

// Render all questions on the home screen
function renderAllQuestions() {
    const container = document.getElementById('questionsContainer');

    if (questions.length === 0) {
        container.innerHTML = '<p class="no-data" style="color: white;">Henüz soru eklenmemiş</p>';
        return;
    }

    container.innerHTML = questions.map((question, index) => {
        const isAnswered = isQuestionAnsweredToday(question.id);
        const todayAnswer = getTodaysAnswer(question.id);
        const badgeClass = isAnswered ? 'answered' : '';
        const badgeText = isAnswered ? '✓ Cevaplandı' : '⚠️ Cevaplanmadı';

        const answerButtons = question.answerOptions.map(option =>
            `<button class="btn" data-question-id="${question.id}" data-question-text="${question.text}" data-answer="${option}">${option}</button>`
        ).join('');

        const statusText = isAnswered ? `Cevabınız: ${todayAnswer}` : '';

        return `
            <div class="today-question">
                <div class="today-badge ${badgeClass}">${badgeText}</div>
                <p class="question-text-display">${question.text}</p>
                <div class="answer-buttons">
                    ${answerButtons}
                </div>
                <p class="answer-status" style="color: green; font-weight: 500; min-height: 20px;">${statusText}</p>
            </div>
        `;
    }).join('');

    // Add event listeners to all answer buttons
    document.querySelectorAll('#questionsContainer .answer-buttons .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = e.target.dataset.questionId;
            const questionText = e.target.dataset.questionText;
            const answer = e.target.dataset.answer;
            answerQuestion(questionId, questionText, answer);
        });
    });
}

// Show answer edit modal with button selection
function showAnswerEditModal(dateString, questionId, currentAnswer, options) {
    const modal = document.getElementById('answerEditModal');
    const modalQuestion = document.getElementById('modalCurrentAnswer');
    const modalOptions = document.getElementById('modalAnswerOptions');

    modalQuestion.textContent = `Şu anki cevap: ${currentAnswer}`;

    // Create buttons for each option
    modalOptions.innerHTML = options.map(option => `
        <button class="btn modal-answer-btn" data-answer="${option}">${option}</button>
    `).join('');

    // Add click listeners to option buttons
    document.querySelectorAll('.modal-answer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newAnswer = e.target.dataset.answer;

            // Find and update the answer
            const answerIndex = answers.findIndex(a =>
                a.dateString === dateString && a.questionId === questionId
            );
            if (answerIndex >= 0) {
                answers[answerIndex].answer = newAnswer;
                saveAnswers();
                displayHistory();
                closeAnswerEditModal();
            }
        });
    });

    modal.style.display = 'flex';
}

// Close answer edit modal
function closeAnswerEditModal() {
    document.getElementById('answerEditModal').style.display = 'none';
}

// Display history - grouped by date
function displayHistory() {
    const historyList = document.getElementById('historyList');

    if (answers.length === 0) {
        historyList.innerHTML = '<p class="no-data">Henüz cevap kaydedilmemiş</p>';
        return;
    }

    // Group answers by date
    const groupedByDate = {};
    answers.forEach(answer => {
        if (!groupedByDate[answer.dateString]) {
            groupedByDate[answer.dateString] = [];
        }
        groupedByDate[answer.dateString].push(answer);
    });

    // Convert to array and sort by date (newest first)
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
        const dateA = new Date(a.split('.').reverse().join('-'));
        const dateB = new Date(b.split('.').reverse().join('-'));
        return dateB - dateA;
    });

    historyList.innerHTML = sortedDates.map(dateString => {
        const dayAnswers = groupedByDate[dateString];

        const answersHtml = dayAnswers.map((answer, idx) => {
            // Find the question to get current answer options
            const question = questions.find(q => q.id === answer.questionId);
            const answerOptions = question ? question.answerOptions : [];

            return `
                <div class="history-answer-row">
                    <div class="history-question">${answer.question}</div>
                    <div class="history-answer">${answer.answer}</div>
                    <div class="history-actions">
                        <button class="btn-edit-answer" data-date="${dateString}" data-question-id="${answer.questionId}" data-current-answer="${answer.answer}" data-options='${JSON.stringify(answerOptions)}'>Düzenle</button>
                        <button class="btn-delete-answer" data-date="${dateString}" data-question-id="${answer.questionId}">Sil</button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="history-date-group">
                <div class="history-date-header">${dateString}</div>
                <div class="history-answers-container">
                    ${answersHtml}
                </div>
            </div>
        `;
    }).join('');

    // Add edit listeners
    document.querySelectorAll('.btn-edit-answer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dateString = e.target.dataset.date;
            const questionId = e.target.dataset.questionId;
            const currentAnswer = e.target.dataset.currentAnswer;
            const options = JSON.parse(e.target.dataset.options);

            if (options.length === 0) {
                alert('Bu soru artık mevcut değil');
                return;
            }

            // Show answer selection modal
            showAnswerEditModal(dateString, questionId, currentAnswer, options);
        });
    });

    // Add delete listeners
    document.querySelectorAll('.btn-delete-answer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dateString = e.target.dataset.date;
            const questionId = e.target.dataset.questionId;

            if (confirm('Bu cevabı silmek istediğinize emin misiniz?')) {
                const answerIndex = answers.findIndex(a =>
                    a.dateString === dateString && a.questionId === questionId
                );
                if (answerIndex >= 0) {
                    answers.splice(answerIndex, 1);
                    saveAnswers();
                    displayHistory();
                }
            }
        });
    });
}

// Display questions list
function displayQuestions() {
    const questionsList = document.getElementById('questionsList');

    if (questions.length === 0) {
        questionsList.innerHTML = '<p class="no-data">Soru bulunamadı</p>';
        return;
    }

    questionsList.innerHTML = questions.map((question, index) => `
        <div class="question-item">
            <div class="question-text">${question.text}</div>
            <div class="answer-options-preview">Cevaplar: ${question.answerOptions.join(', ')}</div>
            <div>
                <button class="btn-edit-question-text" data-index="${index}">Soruyu Düzenle</button>
                <button class="btn-edit-question-answers" data-index="${index}">Cevapları Düzenle</button>
                <button class="btn-delete-question" data-index="${index}">Sil</button>
            </div>
        </div>
    `).join('');

    // Add edit question text listeners
    document.querySelectorAll('.btn-edit-question-text').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const question = questions[index];
            const newText = prompt('Soruyu düzenle:', question.text);
            if (newText && newText.trim()) {
                const oldText = question.text;
                const newTextTrimmed = newText.trim();

                // Update question text
                question.text = newTextTrimmed;
                saveQuestions();

                // Update all historical answers with this question ID to show new text
                let updatedCount = 0;
                answers.forEach(answer => {
                    if (answer.questionId === question.id) {
                        answer.question = newTextTrimmed;
                        updatedCount++;
                    }
                });

                if (updatedCount > 0) {
                    saveAnswers();
                }

                displayQuestions();
                updateUI();
            }
        });
    });

    // Add edit answer options listeners
    document.querySelectorAll('.btn-edit-question-answers').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            showAnswerOptionsEditor(index);
        });
    });

    // Add delete listeners
    document.querySelectorAll('.btn-delete-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
                questions.splice(index, 1);
                saveQuestions();
                displayQuestions();
                updateUI();
            }
        });
    });
}

// Show answer options editor for a question
function showAnswerOptionsEditor(questionIndex) {
    const question = questions[questionIndex];
    const currentOptions = question.answerOptions.join(', ');
    const newOptions = prompt(
        `"${question.text}" için cevap seçeneklerini düzenle (virgülle ayır):`,
        currentOptions
    );

    if (newOptions !== null) {
        const optionsArray = newOptions.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
        if (optionsArray.length > 0) {
            question.answerOptions = optionsArray;
            saveQuestions();
            displayQuestions();
            updateUI();
        } else {
            alert('En az bir cevap seçeneği girmelisiniz');
        }
    }
}


// Update UI
function updateUI() {
    renderAllQuestions();
    checkTodayAnswer();
}

// Screen navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Setup event listeners
function setupEventListeners() {
    // Answer buttons will be dynamically created in renderAllQuestions()

    // Settings toggle
    document.getElementById('settingsToggle').addEventListener('click', () => {
        const settingsMenu = document.getElementById('settingsMenu');
        if (settingsMenu.style.display === 'none') {
            settingsMenu.style.display = 'block';
        } else {
            settingsMenu.style.display = 'none';
        }
    });

    // Navigation buttons
    document.getElementById('viewHistory').addEventListener('click', () => {
        displayHistory();
        showScreen('historyScreen');
        document.getElementById('settingsMenu').style.display = 'none';
    });

    document.getElementById('manageQuestions').addEventListener('click', () => {
        displayQuestions();
        showScreen('questionsScreen');
        document.getElementById('settingsMenu').style.display = 'none';
    });

    // Load default questions
    document.getElementById('loadDefaults').addEventListener('click', () => {
        loadDefaultQuestions();
        document.getElementById('settingsMenu').style.display = 'none';
    });

    document.getElementById('backFromHistory').addEventListener('click', () => {
        showScreen('homeScreen');
    });

    document.getElementById('backFromQuestions').addEventListener('click', () => {
        showScreen('homeScreen');
    });

    document.getElementById('backFromDefaults').addEventListener('click', () => {
        showScreen('homeScreen');
    });

    document.getElementById('addSelectedDefaults').addEventListener('click', addSelectedDefaultQuestions);

    document.getElementById('closeAnswerModal').addEventListener('click', closeAnswerEditModal);

    // Close modal when clicking outside
    document.getElementById('answerEditModal').addEventListener('click', (e) => {
        if (e.target.id === 'answerEditModal') {
            closeAnswerEditModal();
        }
    });

    // Add question
    document.getElementById('addQuestion').addEventListener('click', () => {
        const newQuestionInput = document.getElementById('newQuestion');
        const newQuestion = newQuestionInput.value.trim();

        if (newQuestion) {
            // Ask for answer options
            const answerOptionsStr = prompt('Bu soru için cevap seçeneklerini girin (virgülle ayırın):', 'Evet, Hayır');
            if (answerOptionsStr) {
                const answerOptionsArray = answerOptionsStr.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
                if (answerOptionsArray.length > 0) {
                    questions.push({
                        id: generateId(),
                        text: newQuestion,
                        answerOptions: answerOptionsArray
                    });
                    saveQuestions();
                    displayQuestions();
                    newQuestionInput.value = '';
                    updateUI();
                } else {
                    alert('En az bir cevap seçeneği girmelisiniz');
                }
            }
        } else {
            alert('Lütfen bir soru girin');
        }
    });

    // Export data
    document.getElementById('exportData').addEventListener('click', () => {
        const dataStr = JSON.stringify(answers, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gunluk-sorular-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    });

    // Clear history
    document.getElementById('clearHistory').addEventListener('click', () => {
        if (confirm('Tüm geçmişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
            answers = [];
            saveAnswers();
            localStorage.removeItem(STORAGE_KEYS.LAST_ANSWERED_DATE);
            displayHistory();
        }
    });
}
