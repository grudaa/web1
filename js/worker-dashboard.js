document.addEventListener('DOMContentLoaded', function() {
    
    const workerShifts = [
        { date: '2025-07-01', type: 'morning', time: '09:00-17:00' },
        { date: '2025-07-03', type: 'afternoon', time: '13:00-21:00' },
        { date: '2025-07-05', type: 'morning', time: '09:00-17:00' },
        { date: '2025-07-07', type: 'evening', time: '17:00-01:00' }
    ];

    let isClocked = false;    
    let clockInTime = null;   
    let totalHours = 0;

    // Navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active', 'bg-light', 'text-dark'));
            
            link.classList.add('active', 'bg-light', 'text-dark');
            
            document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');
            
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) targetSection.style.display = 'block';
        });
    });

    // Schedule
    function renderSchedule() {
        const calendar = document.getElementById('weekCalendar');
        if (!calendar) return;
        
        calendar.innerHTML = ''; 
        
        const today = new Date();
        const currentDay = today.getDay(); 
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay + 1); 
        
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            
            const day = document.createElement('div');
            day.className = 'schedule-day';
            
            day.style.display = 'flex';
            day.style.flexDirection = 'column';
            day.style.alignItems = 'center';
            day.style.textAlign = 'center';
            
            const dayNumber = currentDate.getDate();
            day.innerHTML = `<div class="day-number" style="font-weight: bold; margin-bottom: 10px;">${dayNumber}</div>`;

            const dateString = currentDate.toISOString().split('T')[0]; 
            const dayShift = workerShifts.find(s => s.date === dateString);
            
            if (dayShift) {
                day.innerHTML += `<div class="shift-block" style="background-color: #e3f2fd; border: 2px solid #2196f3; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.8rem; margin-bottom: 0.5rem;">
                    <div class="shift-type">${dayShift.type.charAt(0).toUpperCase() + dayShift.type.slice(1)}</div>
                    <div class="shift-hours">${dayShift.time}</div>
                </div>`;
            } else {
                day.innerHTML += '<div class="no-shift" style="color: #999; font-size: 0.8rem; margin-top: 15px;">No shift</div>';
            }
            
            calendar.appendChild(day);
        }
    }

    // Time tracking display
    function updateTime() {
        const now = new Date();
        const timeEl = document.getElementById('currentTime');
        const dateEl = document.getElementById('currentDate');
        
        if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        
        if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Clock status
    function updateStatus() {
        const status = document.getElementById('clockStatus');
        const info = document.getElementById('sessionInfo');
        const btn = document.getElementById('clockBtn');
        const shift = document.getElementById('shiftStatus');
        
        if (isClocked) {
            
            status.textContent = 'Clocked In';
            status.className = 'badge bg-success fs-6 px-3 py-2 rounded-pill';
            if (info) info.innerHTML = '<span class="badge bg-success me-2" style="width: 12px; height: 12px; border-radius: 50%;"></span><span class="fw-semibold">Currently Clocked In</span>';
            if (btn) { btn.textContent = 'Clock Out'; btn.className = 'btn btn-danger btn-lg'; }
            
            // Elapsed time 
            if (shift && clockInTime) {
                const elapsed = Math.floor((Date.now() - clockInTime) / 60000); 
                shift.textContent = `Clocked in for ${elapsed} minutes`;
            }
        } else {
            status.textContent = 'Clocked Out';
            status.className = 'badge bg-danger fs-6 px-3 py-2 rounded-pill';
            if (info) info.innerHTML = '<span class="badge bg-danger me-2" style="width: 12px; height: 12px; border-radius: 50%;"></span><span class="fw-semibold">Currently Clocked Out</span>';
            if (btn) { btn.textContent = 'Clock In'; btn.className = 'btn btn-primary btn-lg'; }
            if (shift) shift.textContent = 'Ready to clock in';
        }
    }

    // Hours worked
    function updateHours() {
        const display = document.querySelector('.fs-4.fw-semibold.text-dark');
        if (display) {
            let hours = totalHours; 
            
            if (isClocked && clockInTime) {
                hours += (Date.now() - clockInTime) / 3600000;
            }
            display.textContent = `${hours.toFixed(2)} hrs`;
        }
    }

    // Clock in/out 
    function clockAction() {
        if (isClocked) {
            // clock out
            if (clockInTime) {
                totalHours += (Date.now() - clockInTime) / 3600000;
            }
            isClocked = false;
            clockInTime = null;
            
            Swal.fire({ 
                icon: 'success', 
                title: 'Clocked Out', 
                text: `Total hours today: ${totalHours.toFixed(2)}`, 
                timer: 3000, 
                showConfirmButton: false 
            });
        } else {

            // clock in
            isClocked = true;
            clockInTime = Date.now();
            
            Swal.fire({ 
                icon: 'success', 
                title: 'Clocked In', 
                text: 'Have a great shift!', 
                timer: 2000, 
                showConfirmButton: false 
            });
        }
        
        updateStatus();
        updateHours();
    }

    // Initialization

    renderSchedule(); 
    updateTime();     
    updateStatus();   
    updateHours();    
    
    const scheduleSection = document.getElementById('schedule');
    if (scheduleSection) scheduleSection.style.display = 'block';
    
    //Event listener for clock in out
    const clockBtn = document.getElementById('clockBtn');
    if (clockBtn) clockBtn.addEventListener('click', clockAction);
    
    // Live updates
    setInterval(updateTime, 60000);

    // Status 
    setInterval(() => { 
        if (isClocked) { 
            updateStatus();
            updateHours();
        } 
    }, 30000);
});
