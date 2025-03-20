// Drag and Drop
function setupDragAndDrop() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    });

    document.querySelectorAll('.column').forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
        });
        column.addEventListener('drop', e => {
            e.preventDefault();
            const draggable = document.querySelector('.dragging');
            column.insertBefore(draggable, column.querySelector('.add-card'));
            updateConfirmedBy(draggable, column.id);
        });
    });
}

setupDragAndDrop();

// Modal Handling
const modal = document.getElementById('jurnalModal');
let currentCard = null;
let currentColumnId = null;

function openAddModal(columnId) {
    currentColumnId = columnId;
    currentCard = null;
    document.getElementById('modalTitle').textContent = 'Tambah Jurnal';
    clearModalFields();
    toggleConfirmedByField(columnId);
    modal.style.display = 'flex';
    document.getElementById('saveButton').onclick = saveNewCard;
}

function openEditModal(button) {
    currentCard = button.closest('.card');
    const content = currentCard.querySelector('.card-content');
    const mainFields = Array.from(content.children).filter(div => !div.classList.contains('sub-section'));
    const subSection = content.querySelector('.sub-section');
    const subFields = subSection ? Array.from(subSection.children) : [];

    const namaGuru = mainFields[0].textContent.replace('Nama Guru: ', '');
    const tanggal = mainFields[1].textContent.replace('Tanggal: ', '');
    const kelas = mainFields[2].textContent.replace('Kelas: ', '');
    const sakit = mainFields[3].textContent.replace('Sakit: ', '');
    const ijin = mainFields[4].textContent.replace('Ijin: ', '');
    const bolos = mainFields[5].textContent.replace('Bolos: ', '');
    const doText = subFields[0] ? subFields[0].textContent.replace('Do: ', '') : '';
    const doingText = subFields[1] ? subFields[1].textContent.replace('Doing: ', '') : '';
    const doneText = subFields[2] ? subFields[2].textContent.replace('Done: ', '') : '';
    const confirmedBy = mainFields.find(div => div.textContent.startsWith('Dikonfirmasi oleh:'))?.textContent.replace('Dikonfirmasi oleh: ', '') || '';

    document.getElementById('modalTitle').textContent = 'Edit Jurnal';
    document.getElementById('namaGuru').value = namaGuru;
    document.getElementById('tanggal').value = tanggal;
    document.getElementById('kelas').value = kelas;
    document.getElementById('sakit').value = sakit;
    document.getElementById('ijin').value = ijin;
    document.getElementById('bolos').value = bolos;
    document.getElementById('do').value = doText;
    document.getElementById('doing').value = doingText;
    document.getElementById('done').value = doneText;
    document.getElementById('confirmedBy').value = confirmedBy;

    toggleConfirmedByField(currentCard.closest('.column').id);
    modal.style.display = 'flex';
    document.getElementById('saveButton').onclick = saveEditedCard;
}

function closeModal() {
    modal.style.display = 'none';
}

function clearModalFields() {
    document.getElementById('namaGuru').value = '';
    document.getElementById('tanggal').value = '';
    document.getElementById('kelas').value = '';
    document.getElementById('sakit').value = '';
    document.getElementById('ijin').value = '';
    document.getElementById('bolos').value = '';
    document.getElementById('do').value = '';
    document.getElementById('doing').value = '';
    document.getElementById('done').value = '';
    document.getElementById('confirmedBy').value = '';
}

function toggleConfirmedByField(columnId) {
    const confirmedByLabel = document.getElementById('confirmedByLabel');
    const confirmedByInput = document.getElementById('confirmedBy');
    if (columnId === 'confirmed') {
        confirmedByLabel.style.display = 'block';
        confirmedByInput.style.display = 'block';
    } else {
        confirmedByLabel.style.display = 'none';
        confirmedByInput.style.display = 'none';
    }
}

function updateConfirmedBy(card, columnId) {
    const content = card.querySelector('.card-content');
    const children = Array.from(content.children);
    const confirmedByDivIndex = children.findIndex(div => div.textContent.startsWith('Dikonfirmasi oleh:'));

    if (columnId === 'confirmed') {
        if (confirmedByDivIndex === -1) { // Jika belum ada "Dikonfirmasi oleh"
            const newConfirmedBy = prompt('Masukkan nama pengonfirmasi:');
            if (newConfirmedBy) {
                const confirmedByDiv = document.createElement('div');
                confirmedByDiv.innerHTML = `<strong>Dikonfirmasi oleh:</strong> ${newConfirmedBy}`;
                content.appendChild(confirmedByDiv);
            }
        }
    } else if (columnId === 'submitted' && confirmedByDivIndex !== -1) { // Jika digeser ke Submitted dan ada "Dikonfirmasi oleh"
        children[confirmedByDivIndex].remove();
    }
}

function saveNewCard() {
    const namaGuru = document.getElementById('namaGuru').value;
    const tanggal = document.getElementById('tanggal').value;
    const kelas = document.getElementById('kelas').value;
    const sakit = document.getElementById('sakit').value;
    const ijin = document.getElementById('ijin').value;
    const bolos = document.getElementById('bolos').value;
    const doText = document.getElementById('do').value;
    const doingText = document.getElementById('doing').value;
    const doneText = document.getElementById('done').value;
    const confirmedBy = document.getElementById('confirmedBy').value;

    if (namaGuru && tanggal && kelas) {
        const column = document.getElementById(currentColumnId);
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.draggable = true;
        newCard.innerHTML = `
            <div class="card-content">
                <div><strong>Nama Guru:</strong> ${namaGuru}</div>
                <div><strong>Tanggal:</strong> ${tanggal}</div>
                <div><strong>Kelas:</strong> ${kelas}</div>
                <div><strong>Sakit:</strong> ${sakit || '0 siswa'}</div>
                <div><strong>Ijin:</strong> ${ijin || '0 siswa'}</div>
                <div><strong>Bolos:</strong> ${bolos || '0 siswa'}</div>
                <div><strong>Isi Jurnal:</strong></div>
                <div class="sub-section">
                    <div><strong>Do:</strong> ${doText || '-'}</div>
                    <div><strong>Doing:</strong> ${doingText || '-'}</div>
                    <div><strong>Done:</strong> ${doneText || '-'}</div>
                </div>
                ${currentColumnId === 'confirmed' && confirmedBy ? `<div><strong>Dikonfirmasi oleh:</strong> ${confirmedBy}</div>` : ''}
            </div>
            <div class="card-buttons">
                <button class="edit-btn" onclick="openEditModal(this)">✏️</button>
                <button class="delete-btn" onclick="deleteCard(this)">🗑️</button>
            </div>
        `;
        column.insertBefore(newCard, column.querySelector('.add-card'));
        setupDragAndDrop();
        closeModal();
    } else {
        alert('Nama Guru, Tanggal, dan Kelas wajib diisi!');
    }
}

function saveEditedCard() {
    const namaGuru = document.getElementById('namaGuru').value;
    const tanggal = document.getElementById('tanggal').value;
    const kelas = document.getElementById('kelas').value;
    const sakit = document.getElementById('sakit').value;
    const ijin = document.getElementById('ijin').value;
    const bolos = document.getElementById('bolos').value;
    const doText = document.getElementById('do').value;
    const doingText = document.getElementById('doing').value;
    const doneText = document.getElementById('done').value;
    const confirmedBy = document.getElementById('confirmedBy').value;

    if (namaGuru && tanggal && kelas) {
        const columnId = currentCard.closest('.column').id;
        currentCard.querySelector('.card-content').innerHTML = `
            <div><strong>Nama Guru:</strong> ${namaGuru}</div>
            <div><strong>Tanggal:</strong> ${tanggal}</div>
            <div><strong>Kelas:</strong> ${kelas}</div>
            <div><strong>Sakit:</strong> ${sakit || '0 siswa'}</div>
            <div><strong>Ijin:</strong> ${ijin || '0 siswa'}</div>
            <div><strong>Bolos:</strong> ${bolos || '0 siswa'}</div>
            <div><strong>Isi Jurnal:</strong></div>
            <div class="sub-section">
                <div><strong>Do:</strong> ${doText || '-'}</div>
                <div><strong>Doing:</strong> ${doingText || '-'}</div>
                <div><strong>Done:</strong> ${doneText || '-'}</div>
            </div>
            ${columnId === 'confirmed' && confirmedBy ? `<div><strong>Dikonfirmasi oleh:</strong> ${confirmedBy}</div>` : ''}
        `;
        closeModal();
    } else {
        alert('Nama Guru, Tanggal, dan Kelas wajib diisi!');
    }
}

// Delete Card
function deleteCard(button) {
    if (confirm('Hapus jurnal ini?')) {
        button.closest('.card').remove();
    }
}