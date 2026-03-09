let allIssuesData = [];

// 1. Login Functionality
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        fetchAllIssues(); 
    } else {
        alert('Credential vul! Check Demo Credentials below.');
    }
}

// 2. Data Fetching
async function fetchAllIssues() {
    toggleSpinner(true);
    try {
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await response.json();
        allIssuesData = result.data;
        renderCards(allIssuesData);
    } catch (error) {
        console.error("API Error:", error);
    } finally {
        toggleSpinner(false);
    }
}

// 3. Render Issue Cards (Figma Grid Layout)
function renderCards(issues) {
    const grid = document.getElementById('issues-grid');
    const countLabel = document.getElementById('issue-count');
    grid.innerHTML = '';
    countLabel.innerText = issues.length;

    issues.forEach(issue => {
        const borderClass = issue.status === 'open' ? 'border-t-[#22C55E]' : 'border-t-[#A855F7]';
        const iconColor = issue.status === 'open' ? 'text-green-500' : 'text-purple-500';
        
        const card = document.createElement('div');
        card.className = `bg-white p-6 rounded-xl border border-slate-200 border-t-4 ${borderClass} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group`;
        card.onclick = () => openIssuePopup(issue._id);
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <span class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${getPriorityStyle(issue.priority)}">${issue.priority}</span>
                <i class="fas fa-circle-check ${iconColor} opacity-70 group-hover:opacity-100"></i>
            </div>
            <h3 class="font-extrabold text-slate-800 mb-2 leading-snug line-clamp-2 text-md">${issue.title}</h3>
            <p class="text-slate-400 text-xs mb-5 line-clamp-2 leading-relaxed">${issue.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-6">
                <span class="text-[9px] font-bold border border-red-100 text-red-500 px-2 py-1 rounded bg-red-50"># BUG</span>
                <span class="text-[9px] font-bold border border-orange-100 text-orange-500 px-2 py-1 rounded bg-orange-50 uppercase">Help Wanted</span>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400">
                <div class="flex items-center gap-1.5">
                    <div class="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[8px] uppercase">${issue.author.substring(0,2)}</div>
                    <span>${issue.author}</span>
                </div>
                <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 4. Filtering (Tabs)
function filterIssues(status) {
    // UI Update
    document.querySelectorAll('[id^="tab-"]').forEach(btn => btn.classList.remove('active-tab'));
    document.getElementById(`tab-${status}`).classList.add('active-tab');

    if (status === 'all') {
        renderCards(allIssuesData);
    } else {
        const filtered = allIssuesData.filter(i => i.status.toLowerCase() === status.toLowerCase());
        renderCards(filtered);
    }
}

// 5. Search Functionality
async function handleSearch() {
    const text = document.getElementById('search-input').value;
    if (text.length < 2) {
        if(text.length === 0) renderCards(allIssuesData);
        return;
    }
    
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
    const data = await res.json();
    renderCards(data.data);
}

// 6. Modal / Popup (Screenshot 17 design)
async function openIssuePopup(id) {
    const modal = document.getElementById('modal');
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const result = await res.json();
    const issue = result.data;

    const content = document.getElementById('modal-content');
    content.innerHTML = `
        <h2 class="text-3xl font-black text-slate-800 mb-3 pr-8">${issue.title}</h2>
        <div class="flex gap-3 mb-8 items-center">
            <span class="bg-green-500 text-white px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">${issue.status}</span>
            <span class="text-slate-400 text-xs font-medium">Opened by <b class="text-slate-600">${issue.author}</b> • ${new Date(issue.createdAt).toDateString()}</span>
        </div>
        
        <div class="flex gap-2 mb-8">
            <span class="text-[10px] font-bold border border-red-100 text-red-400 px-3 py-1 rounded-md">CRITICAL</span>
            <span class="text-[10px] font-bold border border-amber-100 text-amber-500 px-3 py-1 rounded-md">DESIGN SYSTEM</span>
        </div>

        <p class="text-slate-500 text-base leading-[1.8] mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">${issue.description}</p>
        
        <div class="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div>
                <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Assignee</p>
                <p class="font-extrabold text-slate-700">Public Account</p>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Priority</p>
                <p class="font-extrabold text-red-500 uppercase">${issue.priority}</p>
            </div>
        </div>

        <button onclick="closeModal()" class="mt-10 w-full bg-[#4F46E5] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-transform">Close Details</button>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Helpers
function toggleSpinner(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
    document.getElementById('issues-grid').classList.toggle('hidden', show);
}

function getPriorityStyle(p) {
    const val = p.toLowerCase();
    if (val === 'high') return 'bg-red-50 text-red-600 border border-red-100';
    if (val === 'medium') return 'bg-amber-50 text-amber-600 border border-amber-100';
    return 'bg-blue-50 text-blue-600 border border-blue-100';
}