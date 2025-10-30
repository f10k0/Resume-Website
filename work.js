document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeAnimations();
    initializeEventListeners();
    initializeProjectFilters();
    initializeGitHubLinks();
    initializeContactForm();
    initializeDiary();
    initializeProgressBars();
    initializeTooltips();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeToggle(savedTheme);
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('progress-bar')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-item, .project-card, .card, .progress-bar').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            const icon = this.querySelector('.project-icon, .card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(8deg)';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            const icon = this.querySelector('.project-icon, .card-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
    });
}

function animateProgressBar(progressBar) {
    const width = progressBar.style.width || progressBar.getAttribute('data-width');
    if (width && !progressBar.hasAttribute('data-animated')) {
        progressBar.setAttribute('data-animated', 'true');
        progressBar.style.width = '0';
        setTimeout(() => {
            progressBar.style.width = width;
        }, 300);
    }
}

function initializeEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    const downloadBtn = document.querySelector('a[download]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            if (!checkFileExists(this.href)) {
                e.preventDefault();
                showNotification('Файл резюме временно недоступен', 'warning');
            }
        });
    }
    
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        profileImage.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZGVlMmU2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM3NTdkIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkFWQVRBUjwvdGV4dD4KPC9zdmc+';
            showNotification('Аватар не найден, используется заглушка', 'info');
        });
    }
}

function checkFileExists(url) {
    return true;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.style.transition = 'all 0.5s ease';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
    
    showNotification(`Тема изменена на ${newTheme === 'dark' ? 'тёмную' : 'светлую'}`, 'success');
    
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 500);
}

function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'bi bi-moon-fill';
            themeToggle.title = 'Переключить на светлую тему';
        } else {
            icon.className = 'bi bi-sun-fill';
            themeToggle.title = 'Переключить на темную тему';
        }
    }
}

function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length > 0 && projectItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'btn-primary');
                    btn.classList.add('btn-outline-primary');
                });
                this.classList.add('active', 'btn-primary');
                this.classList.remove('btn-outline-primary');
                
                let visibleCount = 0;
                projectItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                        visibleCount++;
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                showNotification(`Найдено проектов: ${visibleCount}`, 'info', 2000);
            });
        });
    }
}

function initializeGitHubLinks() {
    const githubLinks = document.querySelectorAll('a[href="https://github.com/f10k0"]');
    githubLinks.forEach(link => {
        link.href = 'https://github.com/f10k0';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
    
    const projectLinks = {
        'marsoid': 'https://github.com/f10k0/marsoid',
        'migame': 'https://github.com/f10k0/migame', 
        'skelecastle': 'https://github.com/f10k0/skelecastle',
        'cosmoball': 'https://github.com/f10k0/cosmoball',
        'earlrun': 'https://github.com/f10k0/earlrun',
        'task-manager': 'https://github.com/f10k0/task-manager'
    };
    
    Object.keys(projectLinks).forEach(project => {
        document.querySelectorAll(`a[href="https://github.com/f10k0/${project}"]`).forEach(link => {
            link.href = projectLinks[project];
            link.target = '_blank';
        });
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                this.classList.add('was-validated');
                showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
                this.reset();
                this.classList.remove('was-validated');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                inputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            }, 2000);
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const isRequired = field.required;
    
    field.classList.remove('is-valid', 'is-invalid');
    
    if (isRequired && !value) {
        field.classList.add('is-invalid');
        return false;
    }
    
    switch (type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
        case 'text':
            if (field.id === 'name' && value && !isValidName(value)) {
                field.classList.add('is-invalid');
                return false;
            }
            break;
    }
    
    if (value) {
        field.classList.add('is-valid');
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    return name.length >= 2 && name.length <= 50;
}

function initializeDiary() {
    const addEntryBtn = document.getElementById('addEntryBtn');
    if (addEntryBtn) {
        addEntryBtn.addEventListener('click', function() {
            showAddEntryModal();
        });
    }
    
    loadDiaryEntries();
    initializeDiaryProgressBars();
    forceProgressBarsUpdate();
}

function initializeDiaryProgressBars() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.diary-progress .progress-bar');
        progressBars.forEach(bar => {
            const currentWidth = bar.style.width;
            if (currentWidth && currentWidth !== '0%') {
                bar.style.width = '0%';

                setTimeout(() => {
                    bar.style.width = currentWidth;
                    bar.style.transition = 'width 2s ease-in-out';

                    const shimmer = document.createElement('div');
                    shimmer.style.position = 'absolute';
                    shimmer.style.top = '0';
                    shimmer.style.left = '-100%';
                    shimmer.style.width = '100%';
                    shimmer.style.height = '100%';
                    shimmer.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)';
                    shimmer.style.animation = 'shimmer 2s infinite';
                    bar.style.position = 'relative';
                    bar.style.overflow = 'hidden';
                    bar.appendChild(shimmer);
                }, 100);
            }
        });
    }, 1000);
}

function forceProgressBarsUpdate() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const currentWidth = bar.style.width;
            if (currentWidth && currentWidth !== '0%') {
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = currentWidth;
                }, 50);
            }
        });
    }, 1000);
}

function loadDiaryEntries() {
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        const entryList = document.querySelector('.list-group');
        if (entryList) {
            const staticEntries = entryList.querySelectorAll('li:not(.dynamic-entry)');
            if (staticEntries.length === 0) {
                entryList.innerHTML = '';
            } else {
                const dynamicEntries = entryList.querySelectorAll('.dynamic-entry');
                dynamicEntries.forEach(entry => entry.remove());
            }
            
            entries.forEach(entry => {
                addDiaryEntryToDOM(entry, true);
            });
        }
    }
}

function showAddEntryModal() {
    const modalHtml = `
        <div class="modal fade" id="addEntryModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Добавить запись в дневник</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="entryForm">
                            <div class="mb-3">
                                <label for="entryDate" class="form-label">Дата *</label>
                                <input type="date" class="form-control" id="entryDate" required>
                            </div>
                            <div class="mb-3">
                                <label for="entryTitle" class="form-label">Заголовок *</label>
                                <input type="text" class="form-control" id="entryTitle" placeholder="Что вы изучили?" required maxlength="100">
                            </div>
                            <div class="mb-3">
                                <label for="entryDescription" class="form-label">Описание</label>
                                <textarea class="form-control" id="entryDescription" rows="3" placeholder="Подробное описание..." maxlength="500"></textarea>
                                <div class="form-text">Осталось символов: <span id="charCount">500</span></div>
                            </div>
                            <div class="mb-3">
                                <label for="entryStatus" class="form-label">Статус *</label>
                                <select class="form-select" id="entryStatus" required>
                                    <option value="">Выберите статус...</option>
                                    <option value="completed">Завершено</option>
                                    <option value="in-progress">В процессе</option>
                                    <option value="planned">Запланировано</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" id="saveEntryBtn">Сохранить запись</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('addEntryModal'));
    modal.show();
    
    document.getElementById('entryDate').valueAsDate = new Date();
    
    const descriptionField = document.getElementById('entryDescription');
    const charCount = document.getElementById('charCount');
    
    descriptionField.addEventListener('input', function() {
        const remaining = 500 - this.value.length;
        charCount.textContent = remaining;
        charCount.className = remaining < 50 ? 'text-warning' : 'text-muted';
    });
    
    document.getElementById('saveEntryBtn').addEventListener('click', function() {
        saveDiaryEntry();
        modal.hide();
    });
    
    document.getElementById('addEntryModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function saveDiaryEntry() {
    const date = document.getElementById('entryDate').value;
    const title = document.getElementById('entryTitle').value.trim();
    const description = document.getElementById('entryDescription').value.trim();
    const status = document.getElementById('entryStatus').value;
    
    if (!date || !title || !status) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    const entryData = {
        id: Date.now(),
        date: date,
        title: title,
        description: description,
        status: status,
        createdAt: new Date().toISOString()
    };
    
    addDiaryEntryToDOM(entryData);
    saveEntryToStorage(entryData);
    showNotification('Запись успешно добавлена в дневник!', 'success');
}

function addDiaryEntryToDOM(entryData, isLoaded = false) {
    const entryList = document.querySelector('.list-group');
    if (!entryList) return;
    
    const formattedDate = new Date(entryData.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    let statusBadge;
    let statusText;
    switch(entryData.status) {
        case 'completed':
            statusBadge = '<span class="badge bg-success">✓ Завершено</span>';
            statusText = 'completed';
            break;
        case 'in-progress':
            statusBadge = '<span class="badge bg-warning">🔄 В процессе</span>';
            statusText = 'in-progress';
            break;
        case 'planned':
            statusBadge = '<span class="badge bg-secondary">📅 Запланировано</span>';
            statusText = 'planned';
            break;
    }
    
    const newEntry = document.createElement('li');
    newEntry.className = `list-group-item d-flex justify-content-between align-items-center fade-in dynamic-entry ${statusText}`;
    newEntry.setAttribute('data-entry-id', entryData.id);
    newEntry.innerHTML = `
        <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <strong>${formattedDate} - ${entryData.title}</strong>
                    ${entryData.description ? `<br><small class="text-muted">${entryData.description}</small>` : ''}
                </div>
                ${statusBadge}
            </div>
            <small class="text-muted">Добавлено: ${new Date(entryData.createdAt).toLocaleDateString('ru-RU')}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger ms-2 delete-entry" title="Удалить запись">
            <i class="bi bi-trash"></i>
        </button>
    `;
    
    if (!isLoaded) {
        newEntry.style.opacity = '0';
        newEntry.style.transform = 'translateY(20px)';
    }
    
    entryList.insertBefore(newEntry, entryList.firstChild);
    
    if (!isLoaded) {
        setTimeout(() => {
            newEntry.style.opacity = '1';
            newEntry.style.transform = 'translateY(0)';
            newEntry.style.transition = 'all 0.3s ease';
        }, 50);
    }
    
    const deleteBtn = newEntry.querySelector('.delete-entry');
    deleteBtn.addEventListener('click', function() {
        deleteDiaryEntry(entryData.id, newEntry);
    });
}

function saveEntryToStorage(entryData) {
    let entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    entries.unshift(entryData);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
}

function deleteDiaryEntry(entryId, entryElement) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        entryElement.style.opacity = '0';
        entryElement.style.transform = 'translateX(100px)';
        entryElement.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            entryElement.remove();
            
            let entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
            entries = entries.filter(entry => entry.id !== entryId);
            localStorage.setItem('diaryEntries', JSON.stringify(entries));
            
            showNotification('Запись удалена', 'info');
        }, 300);
    }
}

function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        if (width && !bar.hasAttribute('data-animated')) {
            bar.setAttribute('data-animated', 'true');
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        }
    });
}

function showNotification(message, type = 'info', duration = 5000) {
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => {
        if (notification.getAttribute('data-type') === type) {
            notification.remove();
        }
    });
    
    const notification = document.createElement('div');
    notification.className = `custom-notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.setAttribute('data-type', type);
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1060;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
        border-radius: 10px;
    `;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="me-2" style="font-size: 1.2rem;">${icon}</div>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
    
    return notification;
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success':
            return '✅';
        case 'error':
            return '❌';
        case 'warning':
            return '⚠️';
        case 'info':
            return 'ℹ️';
        default:
            return '💡';
    }
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function refreshDiaryProgressBars() {
    const progressBars = document.querySelectorAll('.diary-progress .progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        if (width) {
            // Временно сбрасываем ширину
            bar.style.width = '0%';
            bar.style.transition = 'none';

            setTimeout(() => {
                bar.style.transition = 'width 2s ease-in-out';
                bar.style.width = width;
            }, 50);
        }
    });
}

function ensureProgressBarsVisible() {
    setTimeout(() => {
        const progressContainers = document.querySelectorAll('.diary-progress');
        progressContainers.forEach(container => {
            const progressBar = container.querySelector('.progress-bar');
            if (progressBar) {
                const computedStyle = window.getComputedStyle(progressBar);
                const width = computedStyle.width;
                
                if (width === '0px' || width === 'auto') {
                    const targetWidth = progressBar.getAttribute('style')?.match(/width:\s*(\d+)%/);
                    if (targetWidth) {
                        progressBar.style.width = targetWidth[1] + '%';
                    }
                }
            }
        });
    }, 2000);
}

document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        const img = e.target;
        if (!img.hasAttribute('data-error-handled')) {
            img.setAttribute('data-error-handled', 'true');
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZGVlMmU2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM3NTdkIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4';
            img.alt = 'Изображение не найдено';
            img.style.opacity = '0.7';
        }
    }
}, true);

document.addEventListener('show.bs.modal', function(e) {
    const modal = e.target;
    modal.style.overflow = 'hidden';
});

document.addEventListener('hidden.bs.modal', function(e) {
    const modal = e.target;
    modal.style.overflow = '';
});

let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.add('scrolled');
    }, 100);
});

window.addEventListener('load', function() {
    setTimeout(() => {
        refreshDiaryProgressBars();
        ensureProgressBarsVisible();
    }, 3000);
});

window.Website = {
    toggleTheme,
    showNotification,
    addDiaryEntry: showAddEntryModal,
    refreshProgressBars: refreshDiaryProgressBars
};

console.log('Website initialized successfully!');