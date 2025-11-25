/**
 * Renvia IT - Dashboard
 * Handles dashboard data display and calculations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // LOAD DASHBOARD DATA
    // ===================================
    function loadDashboardData() {
        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // If no bookings, create demo data
        if (bookings.length === 0) {
            createDemoData();
            return;
        }
        
        // Calculate stats
        calculateStats(bookings);
        
        // Display bookings
        displayBookings(bookings);
    }
    
    // ===================================
    // CREATE DEMO DATA
    // ===================================
    function createDemoData() {
        const demoBookings = [
            {
                id: 'BK1732450123',
                contact: {
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@techcorp.com',
                    company: 'Tech Corp Ltd'
                },
                equipment: {
                    devices: [
                        { type: 'laptop', quantity: '15' },
                        { type: 'monitor', quantity: '10' }
                    ]
                },
                collection: {
                    date: '2025-12-01',
                    city: 'London'
                },
                status: 'completed',
                timestamp: '2024-11-15T10:30:00Z'
            },
            {
                id: 'BK1732450456',
                contact: {
                    firstName: 'Sarah',
                    lastName: 'Johnson',
                    email: 'sarah.j@innovate.co.uk',
                    company: 'Innovate Solutions'
                },
                equipment: {
                    devices: [
                        { type: 'desktop', quantity: '8' },
                        { type: 'server', quantity: '2' }
                    ]
                },
                collection: {
                    date: '2025-11-28',
                    city: 'Manchester'
                },
                status: 'scheduled',
                timestamp: '2024-11-20T14:20:00Z'
            },
            {
                id: 'BK1732450789',
                contact: {
                    firstName: 'Michael',
                    lastName: 'Brown',
                    email: 'mbrown@startupco.com',
                    company: 'Startup Co'
                },
                equipment: {
                    devices: [
                        { type: 'laptop', quantity: '20' },
                        { type: 'mobile', quantity: '30' }
                    ]
                },
                collection: {
                    date: '2025-11-26',
                    city: 'Birmingham'
                },
                status: 'pending',
                timestamp: '2024-11-22T09:15:00Z'
            }
        ];
        
        localStorage.setItem('bookings', JSON.stringify(demoBookings));
        calculateStats(demoBookings);
        displayBookings(demoBookings);
    }
    
    // ===================================
    // CALCULATE STATISTICS
    // ===================================
    function calculateStats(bookings) {
        let totalDevices = 0;
        let totalCO2 = 0;
        let totalWaste = 0;
        let pendingCount = 0;
        
        // Impact factors (same as calculator)
        const impactFactors = {
            laptop: { co2: 45, weight: 2.5 },
            desktop: { co2: 75, weight: 8 },
            server: { co2: 350, weight: 25 },
            mobile: { co2: 16, weight: 0.2 },
            monitor: { co2: 35, weight: 5 },
            printer: { co2: 40, weight: 10 },
            networking: { co2: 60, weight: 5 },
            storage: { co2: 30, weight: 1 },
            other: { co2: 50, weight: 5 }
        };
        
        bookings.forEach(booking => {
            if (booking.status === 'pending' || booking.status === 'scheduled') {
                pendingCount++;
            }
            
            booking.equipment.devices.forEach(device => {
                const quantity = parseInt(device.quantity) || 0;
                const factors = impactFactors[device.type] || impactFactors.other;
                
                totalDevices += quantity;
                totalCO2 += factors.co2 * quantity;
                totalWaste += factors.weight * quantity;
            });
        });
        
        // Update stats cards
        document.getElementById('totalBookings').textContent = bookings.length;
        document.getElementById('pendingBookings').textContent = pendingCount;
        document.getElementById('totalImpact').textContent = totalCO2.toFixed(0) + ' kg';
        document.getElementById('totalDevices').textContent = totalDevices;
        
        // Update impact summary
        const treesEquivalent = Math.round(totalCO2 / 21);
        document.getElementById('impactCO2').textContent = totalCO2.toFixed(0) + ' kg';
        document.getElementById('impactTrees').textContent = treesEquivalent;
        document.getElementById('impactWaste').textContent = totalWaste.toFixed(1) + ' kg';
    }
    
    // ===================================
    // DISPLAY BOOKINGS
    // ===================================
    function displayBookings(bookings) {
        const bookingsList = document.getElementById('bookingsList');
        const emptyState = document.getElementById('emptyState');
        
        if (bookings.length === 0) {
            bookingsList.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }
        
        bookingsList.style.display = 'block';
        emptyState.style.display = 'none';
        
        // Sort by timestamp (newest first)
        bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Display recent bookings (limit to 5)
        const recentBookings = bookings.slice(0, 5);
        
        bookingsList.innerHTML = recentBookings.map(booking => {
            const statusClass = getStatusClass(booking.status);
            const statusIcon = getStatusIcon(booking.status);
            const date = new Date(booking.collection.date);
            const dateFormatted = date.toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });
            
            const deviceSummary = booking.equipment.devices.map(d => 
                `${d.quantity}x ${getDeviceTypeName(d.type)}`
            ).join(', ');
            
            return `
                <div class="booking-card">
                    <div class="booking-card-header">
                        <div class="booking-card-id">
                            <i class="fas fa-hashtag"></i>
                            ${booking.id}
                        </div>
                        <span class="badge ${statusClass}">
                            <i class="${statusIcon}"></i>
                            ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                    </div>
                    
                    <div class="booking-card-body">
                        <div class="booking-info">
                            <i class="fas fa-building"></i>
                            <span>${booking.contact.company}</span>
                        </div>
                        <div class="booking-info">
                            <i class="fas fa-laptop"></i>
                            <span>${deviceSummary}</span>
                        </div>
                        <div class="booking-info">
                            <i class="fas fa-calendar"></i>
                            <span>${dateFormatted}</span>
                        </div>
                        <div class="booking-info">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${booking.collection.city}</span>
                        </div>
                    </div>
                    
                    <div class="booking-card-footer">
                        <button class="btn-text" onclick="viewBooking('${booking.id}')">
                            View Details
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===================================
    // HELPER FUNCTIONS
    // ===================================
    function getStatusClass(status) {
        switch(status) {
            case 'completed': return 'badge-success';
            case 'scheduled': return 'badge-primary';
            case 'pending': return 'badge-warning';
            case 'cancelled': return 'badge-secondary';
            default: return 'badge-secondary';
        }
    }
    
    function getStatusIcon(status) {
        switch(status) {
            case 'completed': return 'fas fa-check-circle';
            case 'scheduled': return 'fas fa-calendar-check';
            case 'pending': return 'fas fa-clock';
            case 'cancelled': return 'fas fa-times-circle';
            default: return 'fas fa-question-circle';
        }
    }
    
    function getDeviceTypeName(type) {
        const names = {
            laptop: 'Laptops',
            desktop: 'Desktops',
            server: 'Servers',
            mobile: 'Mobile Devices',
            monitor: 'Monitors',
            printer: 'Printers',
            networking: 'Networking',
            storage: 'Storage',
            other: 'Other'
        };
        return names[type] || type;
    }
    
    // ===================================
    // VIEW BOOKING DETAILS
    // ===================================
    window.viewBooking = function(bookingId) {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) {
            alert('Booking not found');
            return;
        }
        
        // For now, just show an alert with details
        // In production, this would open a modal or navigate to a details page
        let details = `Booking Details\n\n`;
        details += `ID: ${booking.id}\n`;
        details += `Company: ${booking.contact.company}\n`;
        details += `Contact: ${booking.contact.firstName} ${booking.contact.lastName}\n`;
        details += `Email: ${booking.contact.email}\n`;
        details += `Status: ${booking.status}\n\n`;
        details += `Equipment:\n`;
        booking.equipment.devices.forEach(d => {
            details += `- ${d.quantity}x ${getDeviceTypeName(d.type)}\n`;
        });
        details += `\nCollection Date: ${booking.collection.date}\n`;
        details += `Location: ${booking.collection.city}\n`;
        
        alert(details);
    };
    
    // ===================================
    // INITIALIZE DASHBOARD
    // ===================================
    loadDashboardData();
    
    console.log('Dashboard loaded successfully');
});