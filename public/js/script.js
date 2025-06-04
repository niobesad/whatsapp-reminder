// DOM Elements
const remindersContainer = document.getElementById('reminders-container');
const reminderLists = document.getElementById('reminder-lists');
const customLists = document.getElementById('custom-lists');
const addReminderForm = document.getElementById('add-reminder-form');
const reminderListSelect = document.getElementById('reminder-list');


// Current state
let currentList = 'All Reminders';

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    loadLists();
    loadReminders();
    setupEventListeners();
});

function setupEventListeners() {
    // Add reminder form submission
    addReminderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addNewReminder();
    });
}

function loadLists() {
    fetch('/api/lists')
        .then(response => response.json())
        .then(lists => {
            // Clear existing lists first
            customLists.innerHTML = '';
            reminderListSelect.innerHTML = '';

            // Add a default option for "All Reminders"
            const defaultOption = document.createElement('option');
            defaultOption.value = '';

            lists.forEach(list => {
                // Sidebar list items
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = list.name;
                a.href = '#'; // You can replace this if needed
                a.onclick = (e) => {
                    e.preventDefault();
                    changeList(list.name);
                };
                li.appendChild(a);
                customLists.appendChild(li);

                // Dropdown options
                const option = document.createElement('option');
                option.value = list.id;
                option.textContent = list.name;
                reminderListSelect.appendChild(option);
            });

        });
}

function loadView(name) {
    changeList(name);
}

function loadReminders() {
    let queryParams = [];

    if (currentList === 'Upcoming Reminders') {
        queryParams.push('view=upcoming');
    } else if (currentList === 'Completed Reminders') {
        queryParams.push('view=completed');
    }

    // If a custom list is selected (not the default 'All Reminders')
    if (
        currentList !== 'All Reminders' &&
        currentList !== 'Upcoming Reminders' &&
        currentList !== 'Completed Reminders'
    ) {
        // Find the list id by matching list name in the dropdown options
        const listOption = [...reminderListSelect.options].find(opt => opt.text === currentList);
        if (listOption && listOption.value) {
            queryParams.push(`list_id=${listOption.value}`);
        }
    }

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    fetch(`/api/reminders${queryString}`)
        .then(response => response.json())
        .then(reminders => {
            remindersContainer.innerHTML = '';

            reminders.forEach(reminder => {
                const reminderElement = createReminderElement(reminder);
                remindersContainer.appendChild(reminderElement);
            });
        });
}

function createReminderElement(reminder) {
    const element = document.createElement('div');
    element.className = 'reminder-item d-flex align-items-center justify-content-between py-2 border-bottom';
    element.dataset.id = reminder.id;

    element.innerHTML = `
        <div class="d-flex align-items-start">
            <input type="checkbox" class="form-check-input me-3 mt-1"
                ${reminder.completed ? 'checked' : ''}
                onchange="toggleReminderCompletion(${reminder.id}, this.checked)">
            <div>
                <div class="fw-semibold ${reminder.completed ? 'text-decoration-line-through text-muted' : ''}">
                    ${reminder.title}
                </div>
                ${reminder.description ? `<div class="small text-muted">${reminder.description}</div>` : ''}
                ${reminder.due_date ? `<div class="small text-muted">Due: ${new Date(reminder.due_date).toLocaleString()}</div>` : ''}
            </div>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-danger" onclick="deleteReminder(${reminder.id})">
                <i class="fas fa-trash"></i>
            </button>
            <button class="btn btn-sm btn-outline-success" onclick="completeReminder(${reminder.id})">
                <i class="fas fa-check"></i>
            </button>
        </div>
    `;

    return element;
}

function changeList(listName) {
    currentList = listName;
    document.getElementById('current-list').textContent = listName;
    loadReminders();
}

// CRUD Operations
function addNewReminder() {
    const title = document.getElementById('reminder-title').value;
    const description = document.getElementById('reminder-description').value;
    const due_date = document.getElementById('reminder-due').value;
    const listId = document.getElementById('reminder-list').value || null;
    const addReminderForm = document.getElementById('add-reminder-form');

    fetch('/api/reminders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            description,
            due_date,
            list_id: listId,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Use Bootstrap's modal instance API to close it
                const modalEl = document.getElementById('add-reminder-modal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) {
                    modalInstance.hide();
                }

                addReminderForm.reset();
                loadReminders();
            } else {
                alert(data.error || 'Failed to add reminder');
            }
        });
}


function toggleReminderCompletion(id, completed) {
    fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) loadReminders();
            else alert(data.error || 'Failed to update reminder');
        });
}

function completeReminder(id) {
    fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) loadReminders();
            else alert(data.error || 'Failed to complete reminder');
        });
}

function deleteReminder(id) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        fetch(`/api/reminders/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) loadReminders();
                else alert(data.error || 'Failed to delete reminder');
            });
    }
}

function addNewList() {
    const name = document.getElementById('new-list-name').value.trim();
    if (!name) return;

    fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('new-list-name').value = '';
                loadLists();
                renderListsInModal();
            } else {
                alert(data.error || 'Failed to add list');
            }
        });
}

// Modal functions
function showAddReminderModal() {
    const modal = new bootstrap.Modal(document.getElementById('add-reminder-modal'));
    modal.show();
}

function showEditListsModal() {
    const modal = new bootstrap.Modal(document.getElementById('edit-lists-modal'));
    modal.show();
    renderListsInModal();
}

function showEditReceiversModal() {
    const modal = new bootstrap.Modal(document.getElementById('edit-receivers-modal'));
    modal.show();
    renderReceiversInModal();
}

function renderListsInModal() {
    fetch('/api/lists')
        .then(response => response.json())
        .then(lists => {
            const container = document.getElementById('lists-container');
            container.innerHTML = '';

            lists.forEach(list => {
                const div = document.createElement('div');
                div.className = 'list-item';
                div.innerHTML = `
                    <span>${list.name}</span>
                    <div class="list-item-actions">
                        <button onclick="deleteList(${list.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(div);
            });
        });
}

function renderReceiversInModal() {
    fetch('/api/receivers')
        .then(response => response.json())
        .then(receivers => {
            const container = document.getElementById('receivers-container');
            container.innerHTML = '';

            receivers.forEach(receiver => {
                const div = document.createElement('div');
                div.className = 'receiver-item';
                div.innerHTML = `
                    <span>${receiver.phone_number}</span>
                    <div class="receiver-item-actions">
                        <button onclick="deleteReceiver(${receiver.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(div);
            });
        });
}

function addNewReceiver() {
    const phone = document.getElementById('new-receiver-phone').value.trim();
    if (!phone) return;

    fetch('/api/receivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone })
    })
        .then(res => res.json())
        .then(() => {
            document.getElementById('new-receiver-phone').value = '';
            renderReceiversInModal();
        });
}

function deleteReceiver(id) {
    fetch(`/api/receivers/${id}`, { method: 'DELETE' })
        .then(() => renderReceiversInModal());
}

function switchPhoneType() {
    const select = document.getElementById('phone-type-select');
    const myPhoneSection = document.getElementById('my-phone-section');
    const broadcastSection = document.getElementById('broadcast-section');

    if (select.value === 'my-phone') {
        myPhoneSection.style.display = 'block';
        broadcastSection.style.display = 'none';
        loadMyPhoneNumber();
    } else {
        myPhoneSection.style.display = 'none';
        broadcastSection.style.display = 'block';
        renderReceiversInModal();
    }
}

function loadMyPhoneNumber() {
    fetch('/api/user/phone')
        .then(res => res.json())
        .then(data => {
            document.getElementById('my-phone-input').value = data.phone_number || '';
            document.getElementById('my-phone-message').textContent = '';
        });
}

function saveMyPhoneNumber() {
    const phone = document.getElementById('my-phone-input').value.trim();
    if (!phone) {
        document.getElementById('my-phone-message').textContent = 'Phone number cannot be empty.';
        return;
    }

    fetch('/api/user/phone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById('my-phone-message').textContent = 'Saved successfully!';
            } else {
                document.getElementById('my-phone-message').textContent = data.error || 'Failed to save.';
            }
        })
        .catch(() => {
            document.getElementById('my-phone-message').textContent = 'Error saving phone number.';
        });
}

function showEditReceiversModal() {
    const modal = new bootstrap.Modal(document.getElementById('edit-receivers-modal'));
    modal.show();
    // default to my phone or broadcast, you can change this
    document.getElementById('phone-type-select').value = 'broadcast'; // or 'my-phone'
    switchPhoneType();
}

async function loadBroadcastMode() {
    const res = await fetch('/api/user/broadcast-mode');
    if (!res.ok) return 0; // default fallback

    const data = await res.json();
    return data.broadcast_mode;
}

async function saveBroadcastMode(mode) {
    await fetch('/api/user/broadcast-mode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ broadcast_mode: mode }),
    });
}

async function switchPhoneType() {
    const select = document.getElementById('phone-type-select');
    const myPhoneSection = document.getElementById('my-phone-section');
    const broadcastSection = document.getElementById('broadcast-section');

    const mode = select.value === 'my-phone' ? 0 : 1;
    await saveBroadcastMode(mode); // save user choice

    if (mode === 0) {
        myPhoneSection.style.display = 'block';
        broadcastSection.style.display = 'none';
        loadMyPhoneNumber();
    } else {
        myPhoneSection.style.display = 'none';
        broadcastSection.style.display = 'block';
        renderReceiversInModal();
    }
}

async function showEditReceiversModal() {
    const modal = new bootstrap.Modal(document.getElementById('edit-receivers-modal'));
    modal.show();

    const savedMode = await loadBroadcastMode();
    const select = document.getElementById('phone-type-select');
    select.value = savedMode === 0 ? 'my-phone' : 'broadcast';

    switchPhoneType();
}


function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function deleteList(id) {
    if (confirm('Are you sure you want to delete this list? Reminders in this list will not be deleted.')) {
        fetch(`/api/lists/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadLists();
                    renderListsInModal();
                } else {
                    alert(data.error || 'Failed to delete list');
                }
            });
    }
}

// Responsive behavior
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger-menu');

    if (
        window.innerWidth <= 768 &&
        !sidebar.contains(event.target) &&
        !hamburger.contains(event.target) &&
        sidebar.classList.contains('active')
    ) {
        sidebar.classList.remove('active');
    }
});

window.addEventListener('orientationchange', function () {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

window.addEventListener('load', function () {
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
});

function logout() {
    fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data?.error) {
                alert('Logout failed: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('An unexpected error occurred during logout.');
        });
}