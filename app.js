// ===== DATA =====
const defaultBooks = [
  { id: "BK001", title: "Database Management Systems", author: "Ramakrishnan", category: "CS", copies: 4, available: 3 },
  { id: "BK002", title: "Introduction to Algorithms", author: "Cormen", category: "CS", copies: 3, available: 2 },
  { id: "BK003", title: "Operating System Concepts", author: "Silberschatz", category: "CS", copies: 5, available: 5 },
  { id: "BK004", title: "Computer Networks", author: "Tanenbaum", category: "CS", copies: 3, available: 1 },
  { id: "BK005", title: "Data Structures using C", author: "Reema Thareja", category: "CS", copies: 6, available: 4 },
  { id: "BK006", title: "Discrete Mathematics", author: "Kenneth Rosen", category: "Math", copies: 4, available: 4 },
  { id: "BK007", title: "Engineering Mathematics", author: "B.S. Grewal", category: "Math", copies: 5, available: 3 },
  { id: "BK008", title: "Web Technology", author: "Uttam K Roy", category: "CS", copies: 3, available: 2 },
  { id: "BK009", title: "Software Engineering", author: "Pressman", category: "CS", copies: 4, available: 4 },
  { id: "BK010", title: "Wings of Fire", author: "A.P.J Abdul Kalam", category: "Literature", copies: 2, available: 2 },
];

const defaultMembers = [
  { id: "MEM001", name: "Rahul Sharma", course: "BCA 3rd Year", email: "rahul@example.com", issued: 2, status: "Active" },
  { id: "MEM002", name: "Priya Singh", course: "MCA 2nd Year", email: "priya@example.com", issued: 1, status: "Active" },
  { id: "MEM003", name: "Amit Kumar", course: "BCA 2nd Year", email: "amit@example.com", issued: 0, status: "Active" },
  { id: "MEM004", name: "Neha Gupta", course: "BCA 1st Year", email: "neha@example.com", issued: 1, status: "Active" },
  { id: "MEM005", name: "Vikram Patel", course: "MCA 1st Year", email: "vikram@example.com", issued: 0, status: "Inactive" },
];

const defaultTransactions = [
  { id: "TXN001", memberId: "MEM001", memberName: "Rahul Sharma", bookId: "BK004", bookTitle: "Computer Networks", issueDate: "2025-04-01", dueDate: "2025-04-15", returnDate: null, fine: 0, status: "Issued" },
  { id: "TXN002", memberId: "MEM002", memberName: "Priya Singh", bookId: "BK001", bookTitle: "Database Management Systems", issueDate: "2025-03-20", dueDate: "2025-04-03", returnDate: "2025-04-05", fine: 4, status: "Returned" },
  { id: "TXN003", memberId: "MEM001", memberName: "Rahul Sharma", bookId: "BK008", bookTitle: "Web Technology", issueDate: "2025-04-10", dueDate: "2025-04-24", returnDate: null, fine: 0, status: "Issued" },
  { id: "TXN004", memberId: "MEM004", memberName: "Neha Gupta", bookId: "BK002", bookTitle: "Introduction to Algorithms", issueDate: "2025-03-15", dueDate: "2025-03-29", returnDate: "2025-03-29", fine: 0, status: "Returned" },
];

// Load from localStorage or use defaults
let books = JSON.parse(localStorage.getItem("lms_books")) || defaultBooks;
let members = JSON.parse(localStorage.getItem("lms_members")) || defaultMembers;
let transactions = JSON.parse(localStorage.getItem("lms_txns")) || defaultTransactions;

function save() {
  localStorage.setItem("lms_books", JSON.stringify(books));
  localStorage.setItem("lms_members", JSON.stringify(members));
  localStorage.setItem("lms_txns", JSON.stringify(transactions));
}

// ===== NAVIGATION =====
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  const el = document.getElementById(id);
  if (el) { el.style.display = 'block'; }
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.nav-links a[href="#${id}"]`);
  if (link) link.classList.add('active');

  if (id === 'books') renderBooks(books);
  if (id === 'members') renderMembers(members);
  if (id === 'issue') renderTransactions();
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const href = a.getAttribute('href').replace('#', '');
    showSection(href);
  });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, 20);
  });
}

// ===== BOOKS =====
function renderBooks(data) {
  const tbody = document.getElementById('bookTbody');
  if (!tbody) return;
  tbody.innerHTML = data.map(b => `
    <tr>
      <td><span style="color:var(--gold);font-weight:600">${b.id}</span></td>
      <td>${b.title}</td>
      <td style="color:var(--text-muted)">${b.author}</td>
      <td><span class="badge badge-info">${b.category}</span></td>
      <td>${b.copies}</td>
      <td>${b.available > 0 
        ? `<span class="badge badge-success">Available (${b.available})</span>` 
        : `<span class="badge badge-danger">All Issued</span>`}</td>
      <td>
        <button class="action-btn edit" onclick="editBook('${b.id}')">Edit</button>
        <button class="action-btn" onclick="deleteBook('${b.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function searchBooks() {
  const q = document.getElementById('bookSearch').value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  renderBooks(filtered);
}

function filterByCategory() {
  const cat = document.getElementById('categoryFilter').value;
  const filtered = cat === 'all' ? books : books.filter(b => b.category === cat);
  renderBooks(filtered);
}

function addBook() {
  const id = document.getElementById('nb_id').value.trim();
  const title = document.getElementById('nb_title').value.trim();
  const author = document.getElementById('nb_author').value.trim();
  const category = document.getElementById('nb_cat').value;
  const copies = parseInt(document.getElementById('nb_copies').value) || 1;

  if (!id || !title || !author) return showToast("Please fill all fields!", 'error');
  if (books.find(b => b.id === id)) return showToast("Book ID already exists!", 'error');

  books.push({ id, title, author, category, copies, available: copies });
  save();
  renderBooks(books);
  closeModal('addBookModal');
  showToast("✅ Book added successfully!", 'success');
  ['nb_id','nb_title','nb_author','nb_copies'].forEach(f => document.getElementById(f).value = '');
}

function deleteBook(id) {
  if (!confirm("Delete this book?")) return;
  books = books.filter(b => b.id !== id);
  save();
  renderBooks(books);
  showToast("Book deleted.", 'error');
}

function editBook(id) {
  const b = books.find(b => b.id === id);
  if (!b) return;
  const newTitle = prompt("Edit Title:", b.title);
  if (newTitle) { b.title = newTitle; save(); renderBooks(books); showToast("Book updated!", 'success'); }
}

// ===== MEMBERS =====
function renderMembers(data) {
  const tbody = document.getElementById('memberTbody');
  if (!tbody) return;
  tbody.innerHTML = data.map(m => `
    <tr>
      <td><span style="color:var(--gold);font-weight:600">${m.id}</span></td>
      <td>${m.name}</td>
      <td style="color:var(--text-muted)">${m.course}</td>
      <td style="color:var(--text-muted)">${m.email}</td>
      <td>${m.issued}</td>
      <td><span class="badge ${m.status === 'Active' ? 'badge-success' : 'badge-warn'}">${m.status}</span></td>
      <td>
        <button class="action-btn edit" onclick="editMember('${m.id}')">Edit</button>
        <button class="action-btn" onclick="deleteMember('${m.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function searchMembers() {
  const q = document.getElementById('memberSearch').value.toLowerCase();
  const filtered = members.filter(m => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
  renderMembers(filtered);
}

function addMember() {
  const id = document.getElementById('nm_id').value.trim();
  const name = document.getElementById('nm_name').value.trim();
  const course = document.getElementById('nm_course').value.trim();
  const email = document.getElementById('nm_email').value.trim();

  if (!id || !name || !course || !email) return showToast("Please fill all fields!", 'error');
  if (members.find(m => m.id === id)) return showToast("Member ID already exists!", 'error');

  members.push({ id, name, course, email, issued: 0, status: "Active" });
  save();
  renderMembers(members);
  closeModal('addMemberModal');
  showToast("✅ Member added successfully!", 'success');
  ['nm_id','nm_name','nm_course','nm_email'].forEach(f => document.getElementById(f).value = '');
}

function deleteMember(id) {
  if (!confirm("Delete this member?")) return;
  members = members.filter(m => m.id !== id);
  save();
  renderMembers(members);
  showToast("Member deleted.", 'error');
}

function editMember(id) {
  const m = members.find(m => m.id === id);
  if (!m) return;
  const newName = prompt("Edit Name:", m.name);
  if (newName) { m.name = newName; save(); renderMembers(members); showToast("Member updated!", 'success'); }
}

// ===== ISSUE / RETURN =====
function issueBook() {
  const memberId = document.getElementById('issueMemberId').value.trim();
  const bookId = document.getElementById('issueBookId').value.trim();
  const issueDate = document.getElementById('issueDate').value;
  const dueDate = document.getElementById('dueDate').value;

  if (!memberId || !bookId || !issueDate || !dueDate) return showToast("Fill all fields!", 'error');

  const member = members.find(m => m.id === memberId);
  const book = books.find(b => b.id === bookId);

  if (!member) return showToast("❌ Member not found!", 'error');
  if (!book) return showToast("❌ Book not found!", 'error');
  if (book.available <= 0) return showToast("❌ No copies available!", 'error');

  const txnId = "TXN" + String(transactions.length + 1).padStart(3, '0');
  transactions.push({ id: txnId, memberId, memberName: member.name, bookId, bookTitle: book.title, issueDate, dueDate, returnDate: null, fine: 0, status: "Issued" });

  book.available--;
  member.issued++;
  save();
  renderTransactions();
  showToast(`✅ Book issued! Txn ID: ${txnId}`, 'success');
  ['issueMemberId','issueBookId','issueDate','dueDate'].forEach(f => document.getElementById(f).value = '');
}

function returnBook() {
  const txnId = document.getElementById('returnTxnId').value.trim();
  const returnDate = document.getElementById('returnDate').value;

  if (!txnId || !returnDate) return showToast("Fill all fields!", 'error');

  const txn = transactions.find(t => t.id === txnId && t.status === 'Issued');
  if (!txn) return showToast("❌ Transaction not found or already returned!", 'error');

  const due = new Date(txn.dueDate);
  const ret = new Date(returnDate);
  const diffDays = Math.max(0, Math.ceil((ret - due) / (1000*60*60*24)));
  const fine = diffDays * 2; // ₹2 per day

  txn.returnDate = returnDate;
  txn.fine = fine;
  txn.status = "Returned";

  const book = books.find(b => b.id === txn.bookId);
  const member = members.find(m => m.id === txn.memberId);
  if (book) book.available++;
  if (member && member.issued > 0) member.issued--;

  save();
  renderTransactions();

  if (fine > 0) {
    document.getElementById('fineBox').style.display = 'block';
    document.getElementById('fineAmount').textContent = `₹${fine}`;
    showToast(`⚠️ Returned with fine ₹${fine}`, 'error');
  } else {
    document.getElementById('fineBox').style.display = 'none';
    showToast("✅ Book returned successfully!", 'success');
  }
  document.getElementById('returnTxnId').value = '';
  document.getElementById('returnDate').value = '';
}

function renderTransactions() {
  const tbody = document.getElementById('txnTbody');
  if (!tbody) return;
  tbody.innerHTML = [...transactions].reverse().map(t => `
    <tr>
      <td><span style="color:var(--gold);font-weight:600">${t.id}</span></td>
      <td>${t.memberName}</td>
      <td>${t.bookTitle}</td>
      <td>${t.issueDate}</td>
      <td>${t.dueDate}</td>
      <td>${t.returnDate || '—'}</td>
      <td>${t.fine > 0 ? `<span style="color:var(--warn)">₹${t.fine}</span>` : '—'}</td>
      <td><span class="badge ${t.status === 'Returned' ? 'badge-success' : 'badge-warn'}">${t.status}</span></td>
    </tr>
  `).join('');
}

// ===== ADMIN LOGIN =====
function adminLogin() {
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;
  if (u === 'admin' && p === 'admin123') {
    showToast("✅ Welcome, Admin!", 'success');
    setTimeout(() => showSection('books'), 800);
  } else {
    showToast("❌ Wrong credentials!", 'error');
  }
}

// ===== MODALS =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }

// ===== TOAST =====
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3000);
}

// ===== SET DEFAULT DATES =====
window.onload = () => {
  const today = new Date().toISOString().split('T')[0];
  const due = new Date(); due.setDate(due.getDate() + 14);
  const dueStr = due.toISOString().split('T')[0];
  if (document.getElementById('issueDate')) document.getElementById('issueDate').value = today;
  if (document.getElementById('dueDate')) document.getElementById('dueDate').value = dueStr;
  if (document.getElementById('returnDate')) document.getElementById('returnDate').value = today;
  animateCounters();
};
