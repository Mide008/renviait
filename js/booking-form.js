/**
 * Renvia IT - Multi-Step Booking Form (Resend via Netlify Functions)
 * Sends to info@renviait.co.uk + auto-confirmation to user
 */

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('bookingForm');
    const steps = document.querySelectorAll('.form-step');
    const stepperSteps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const stepIndicator = document.getElementById('stepIndicator');
    
    let currentStep = 1;
    const totalSteps = 5;
    
    // Set minimum date for collection (tomorrow)
    const collectionDateInput = document.querySelector('input[name="collectionDate"]');
    if (collectionDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        collectionDateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // ===================================
    // EQUIPMENT MANAGEMENT
    // ===================================
    const equipmentList = document.getElementById('equipmentList');
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    
    if (addEquipmentBtn) {
        addEquipmentBtn.addEventListener('click', function() {
            const equipmentItem = document.createElement('div');
            equipmentItem.className = 'equipment-item';
            equipmentItem.innerHTML = `
                <div class="equipment-header">
                    <button type="button" class="remove-equipment-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">Device Type</label>
                        <select name="deviceType[]" class="form-select" required>
                            <option value="">Select type...</option>
                            <option value="laptop">Laptops</option>
                            <option value="desktop">Desktop Computers</option>
                            <option value="server">Servers</option>
                            <option value="mobile">Mobile Devices</option>
                            <option value="monitor">Monitors</option>
                            <option value="printer">Printers</option>
                            <option value="networking">Networking Equipment</option>
                            <option value="storage">Storage Devices</option>
                            <option value="other">Other</option>
                        </select>
                        <span class="form-error">Please select a device type</span>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">Quantity</label>
                        <input type="number" name="quantity[]" class="form-input" min="1" required>
                        <span class="form-error">Please enter quantity</span>
                    </div>
                </div>
            `;
            
            equipmentList.appendChild(equipmentItem);
            
            const removeBtn = equipmentItem.querySelector('.remove-equipment-btn');
            removeBtn.addEventListener('click', function() {
                equipmentItem.remove();
            });
        });
    }
    
    // ===================================
    // STEP NAVIGATION
    // ===================================
    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        stepperSteps.forEach(s => s.classList.remove('active', 'completed'));
        
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        stepperSteps.forEach((s, index) => {
            const stepNum = index + 1;
            if (stepNum < step) {
                s.classList.add('completed');
            } else if (stepNum === step) {
                s.classList.add('active');
            }
        });
        
        prevBtn.style.display = step === 1 ? 'none' : 'flex';
        nextBtn.style.display = step === totalSteps ? 'none' : 'flex';
        submitBtn.style.display = step === totalSteps ? 'flex' : 'none';
        
        stepIndicator.textContent = `Step ${step} of ${totalSteps}`;
        
        if (step === 5) {
            populateReview();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // ===================================
    // STEP VALIDATION
    // ===================================
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const inputs = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group') || input.closest('.radio-group') || input.closest('.form-checkbox');
            const errorElement = formGroup?.querySelector('.form-error');
            
            input.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('visible');
            }
            
            if (input.type === 'radio') {
                const radioGroup = currentStepElement.querySelectorAll(`input[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(r => r.checked);
                
                if (!isChecked) {
                    isValid = false;
                    if (errorElement) {
                        errorElement.classList.add('visible');
                    }
                }
                return;
            }
            
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.classList.add('visible');
                    }
                }
                return;
            }
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                    errorElement.classList.add('visible');
                }
                return;
            }
            
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                        errorElement.classList.add('visible');
                    }
                }
            }
            
            if (input.type === 'tel') {
                const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                if (!phoneRegex.test(input.value) || input.value.length < 10) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid phone number';
                        errorElement.classList.add('visible');
                    }
                }
            }
            
            if (input.type === 'date') {
                const selectedDate = new Date(input.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please select a future date';
                        errorElement.classList.add('visible');
                    }
                }
            }
        });
        
        return isValid;
    }
    
    // ===================================
    // POPULATE REVIEW
    // ===================================
    function populateReview() {
        const formData = new FormData(form);
        
        const reviewContact = document.getElementById('reviewContact');
        reviewContact.innerHTML = `
            <div class="review-item">
                <strong>Name:</strong> ${formData.get('firstName')} ${formData.get('lastName')}
            </div>
            <div class="review-item">
                <strong>Email:</strong> ${formData.get('email')}
            </div>
            <div class="review-item">
                <strong>Phone:</strong> ${formData.get('phone')}
            </div>
            <div class="review-item">
                <strong>Company:</strong> ${formData.get('company')}
            </div>
            ${formData.get('jobTitle') ? `<div class="review-item"><strong>Job Title:</strong> ${formData.get('jobTitle')}</div>` : ''}
        `;
        
        const deviceTypes = formData.getAll('deviceType[]');
        const quantities = formData.getAll('quantity[]');
        let equipmentHTML = '<div class="review-equipment-list">';
        
        deviceTypes.forEach((type, index) => {
            const typeName = document.querySelector(`option[value="${type}"]`)?.textContent || type;
            equipmentHTML += `
                <div class="review-equipment-item">
                    <i class="fas fa-laptop"></i>
                    <span>${quantities[index]}x ${typeName}</span>
                </div>
            `;
        });
        
        equipmentHTML += '</div>';
        
        if (formData.get('equipmentNotes')) {
            equipmentHTML += `<div class="review-item"><strong>Notes:</strong> ${formData.get('equipmentNotes')}</div>`;
        }
        
        document.getElementById('reviewEquipment').innerHTML = equipmentHTML;
        
        const collectionDate = new Date(formData.get('collectionDate'));
        const dateFormatted = collectionDate.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const timeSlot = document.querySelector(`option[value="${formData.get('collectionTime')}"]`)?.textContent || '';
        
        const reviewCollection = document.getElementById('reviewCollection');
        reviewCollection.innerHTML = `
            <div class="review-item">
                <strong>Address:</strong><br>
                ${formData.get('address')}<br>
                ${formData.get('city')}, ${formData.get('postcode')}
            </div>
            <div class="review-item">
                <strong>Date:</strong> ${dateFormatted}
            </div>
            <div class="review-item">
                <strong>Time:</strong> ${timeSlot}
            </div>
            ${formData.get('accessInstructions') ? `<div class="review-item"><strong>Access Instructions:</strong> ${formData.get('accessInstructions')}</div>` : ''}
        `;
        
        const destructionMethod = document.querySelector(`input[name="dataDestruction"]:checked`)?.value || '';
        const certificate = formData.get('certificate') === 'yes' ? 'Yes' : 'No';
        
        let methodText = '';
        if (destructionMethod === 'standard') methodText = 'Standard Secure Wiping (DoD 5220.22-M)';
        if (destructionMethod === 'physical') methodText = 'Physical Destruction (Shredding)';
        if (destructionMethod === 'onsite') methodText = 'On-Site Destruction (Witnessed)';
        
        const reviewSecurity = document.getElementById('reviewSecurity');
        reviewSecurity.innerHTML = `
            <div class="review-item">
                <strong>Destruction Method:</strong> ${methodText}
            </div>
            <div class="review-item">
                <strong>Certificate Required:</strong> ${certificate}
            </div>
        `;
    }
    
    // ===================================
    // BUTTON HANDLERS
    // ===================================
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateCurrentStep()) {
                currentStep++;
                if (currentStep > totalSteps) currentStep = totalSteps;
                showStep(currentStep);
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentStep--;
            if (currentStep < 1) currentStep = 1;
            showStep(currentStep);
        });
    }
    
    // ===================================
    // FORM SUBMISSION WITH RESEND
    // ===================================
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateCurrentStep()) {
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            const formData = new FormData(form);
            const bookingRef = 'BK' + Date.now();
            
            // Prepare equipment array
            const deviceTypes = formData.getAll('deviceType[]');
            const quantities = formData.getAll('quantity[]');
            const equipment = deviceTypes.map((type, index) => ({
                type: getDeviceTypeName(type),
                quantity: quantities[index]
            }));
            
            // Format collection date
            const collectionDate = new Date(formData.get('collectionDate'));
            const dateFormatted = collectionDate.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const timeSlot = document.querySelector(`option[value="${formData.get('collectionTime')}"]`)?.textContent || '';
            
            // Prepare data for API
            const bookingData = {
                bookingReference: bookingRef,
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                jobTitle: formData.get('jobTitle') || '',
                equipment: equipment,
                equipmentNotes: formData.get('equipmentNotes') || '',
                address: formData.get('address'),
                city: formData.get('city'),
                postcode: formData.get('postcode'),
                collectionDate: dateFormatted,
                collectionTime: timeSlot,
                accessInstructions: formData.get('accessInstructions') || '',
                dataDestruction: formData.get('dataDestruction'),
                certificate: formData.get('certificate')
            };
            
            try {
                // Call Netlify Function
                const response = await fetch('/.netlify/functions/send-booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Store in localStorage for dashboard
                    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                    bookings.push({
                        id: bookingRef,
                        firstName: formData.get('firstName'),
                        lastName: formData.get('lastName'),
                        email: formData.get('email'),
                        company: formData.get('company'),
                        collectionDate: formData.get('collectionDate'),
                        status: 'pending',
                        timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                    
                    // Show success message
                    document.getElementById('confirmEmail').textContent = formData.get('email');
                    document.querySelector('.booking-form-container').style.display = 'none';
                    document.querySelector('.stepper').style.display = 'none';
                    document.getElementById('successMessage').style.display = 'block';
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    throw new Error(result.error || 'Form submission failed');
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                alert('There was an error submitting your booking. Please try again or contact us directly at info@renviait.co.uk');
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Submit Booking';
            }
        });
    }
    
    function getDeviceTypeName(type) {
        const names = {
            laptop: 'Laptops',
            desktop: 'Desktop Computers',
            server: 'Servers',
            mobile: 'Mobile Devices',
            monitor: 'Monitors',
            printer: 'Printers',
            networking: 'Networking Equipment',
            storage: 'Storage Devices',
            other: 'Other Equipment'
        };
        return names[type] || type;
    }
    
    // Initialize
    showStep(currentStep);
    
    console.log('Booking form with Resend (Netlify Functions) loaded successfully');
});