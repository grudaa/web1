document.addEventListener('DOMContentLoaded', function() {

    let workers = [{ id: 1, name: 'John Doe', role: 'full-time' }];
    
    let shifts = [
        { id: 1, workerId: 1, workerName: 'John Doe', date: '2025-07-01', type: 'morning', time: '09:00-17:00' },
        { id: 2, workerId: 1, workerName: 'John Doe', date: '2025-07-03', type: 'afternoon', time: '13:00-21:00' },
        { id: 3, workerId: 1, workerName: 'John Doe', date: '2025-07-05', type: 'morning', time: '09:00-17:00' }
    ];
    
    let nextId = 2, nextShiftId = 4;

    // Navbar - handle both navigation and mobile collapse
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile navbar if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
            
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active', 'bg-light', 'text-dark'));
            link.classList.add('active', 'bg-light', 'text-dark');
            document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');
            document.querySelector(link.getAttribute('href')).style.display = 'block';
        });
    });

    // Calendar
    function renderCalendar() {
        const calendar = document.getElementById('calendarBody');
        calendar.innerHTML = ''; 

        const today = new Date();
        const currentDay = today.getDay(); 
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay + 1); 
        
        // Create 7 days 
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            
            const day = document.createElement('div');
            day.className = 'calendar-day';
            
            day.style.display = 'flex';
            day.style.flexDirection = 'column';
            day.style.alignItems = 'center';
            day.style.textAlign = 'center';
            
            // Add day number at the top
            const dayNumber = currentDate.getDate();
            day.innerHTML = `<div class="day-number" style="font-weight: bold; margin-bottom: 10px;">${dayNumber}</div>`;
            
            const dateString = currentDate.toISOString().split('T')[0];
            const dayShifts = shifts.filter(s => s.date === dateString);
            
            // Shift as visual block
            dayShifts.forEach(shift => {
                day.innerHTML += `<div class="shift-block" style="background-color: #e3f2fd; border: 2px solid #2196f3; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.8rem; margin-bottom: 0.5rem;">
                    <div class="shift-type">${shift.type.charAt(0).toUpperCase() + shift.type.slice(1)}</div>
                    <div class="shift-worker">${shift.workerName}</div>
                    <div class="shift-time">${shift.time}</div>
                </div>`;
            });
            
            if (dayShifts.length === 0) {
                day.innerHTML += '<div class="no-shift" style="color: #999; font-size: 0.8rem; margin-top: 15px;">No shifts</div>';
            }
            
            calendar.appendChild(day);
        }
    }

    // Workers tab

    // Display all workers table
    function renderWorkers() {
        const tbody = document.getElementById('workerTableBody');
        tbody.innerHTML = '';
        
        // Create table row for each worker
        workers.forEach(worker => {
            const shiftCount = shifts.filter(s => s.workerId === worker.id).length;
            
            tbody.innerHTML += `<tr>
                <td>${worker.name}</td>
                <td><span class="badge bg-secondary">${worker.role}</span></td>
                <td>${shiftCount}</td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="removeWorker(${worker.id})">Remove</button></td>
            </tr>`;
        });
        updateWorkerSelect();
    }

    function updateWorkerSelect() {
        const select = document.getElementById('workerSelect');
        select.innerHTML = '<option value="">Choose worker...</option>';
        
        workers.forEach(w => select.innerHTML += `<option value="${w.id}">${w.name}</option>`);
    }

    // Add worker

    document.getElementById('workerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('workerName').value;
        const role = document.getElementById('workerRole').value;
        

        if (name && role) {
            workers.push({ id: nextId++, name, role });

            renderWorkers();
            
            document.getElementById('workerForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('workerModal')).hide();
            
            Swal.fire({ icon: 'success', title: 'Worker Added!', timer: 2000, showConfirmButton: false });
        }
    });

    // Shift assign

    document.getElementById('shiftForm').addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const workerId = parseInt(document.getElementById('workerSelect').value);
        const date = document.getElementById('shiftDate').value;
        const type = document.getElementById('shiftType').value;
        

        if (workerId && date && type) {
            const worker = workers.find(w => w.id === workerId);
            
            const times = { morning: '09:00-17:00', afternoon: '13:00-21:00', evening: '17:00-01:00' };
            
            shifts.push({
                id: nextShiftId++, 
                workerId, 
                workerName: worker.name, 
                date, 
                type, 
                time: times[type]
            });
            
            renderCalendar();
            renderWorkers();
            
            document.getElementById('shiftForm').reset();
            
            Swal.fire({ icon: 'success', title: 'Shift Assigned!', timer: 2000, showConfirmButton: false });
        }
    });

    // Remove worker

    window.removeWorker = (id) => {

        if (id === 1) {
            Swal.fire({ icon: 'error', title: 'Cannot Remove', text: 'John Doe cannot be removed.' });
            return;
        }
        
        workers = workers.filter(w => w.id !== id);
        
        shifts = shifts.filter(s => s.workerId !== id);
        
        renderWorkers();
        renderCalendar();
        
        Swal.fire({ icon: 'success', title: 'Worker Removed', timer: 1500, showConfirmButton: false });
    };

    // Initialization

    renderCalendar(); 
    renderWorkers();  
    
    document.getElementById('shiftDate').value = new Date().toISOString().split('T')[0];
});
