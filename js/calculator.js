/**
 * Renvia IT - Impact Calculator
 * Calculates environmental impact based on device type and quantity
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Calculator form elements
    const form = document.getElementById('impactCalculatorForm');
    const deviceTypeSelect = document.getElementById('deviceType');
    const deviceCountInput = document.getElementById('deviceCount');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const increaseBtn = document.getElementById('increaseBtn');
    const resultsCard = document.getElementById('resultsCard');
    
    // Impact factors per device type (in kg)
    // These are based on industry averages for lifecycle assessments
    const impactFactors = {
        laptop: {
            co2: 45,        // kg CO2e per device
            weight: 2.5,    // kg average weight
            water: 8500,    // liters for manufacturing
            energy: 180     // kWh for manufacturing
        },
        desktop: {
            co2: 75,
            weight: 8,
            water: 15000,
            energy: 300
        },
        server: {
            co2: 350,
            weight: 25,
            water: 50000,
            energy: 1200
        },
        mobile: {
            co2: 16,
            weight: 0.2,
            water: 3000,
            energy: 65
        },
        monitor: {
            co2: 35,
            weight: 5,
            water: 6000,
            energy: 140
        },
        mixed: {
            co2: 50,        // Average across all types
            weight: 5,
            water: 10000,
            energy: 220
        }
    };
    
    // ===================================
    // NUMBER INPUT CONTROLS
    // ===================================
    if (decreaseBtn && increaseBtn && deviceCountInput) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(deviceCountInput.value) || 1;
            if (currentValue > 1) {
                deviceCountInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(deviceCountInput.value) || 1;
            if (currentValue < 10000) {
                deviceCountInput.value = currentValue + 1;
            }
        });
        
        // Validate number input
        deviceCountInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10000) {
                this.value = 10000;
            }
        });
    }
    
    // ===================================
    // FORM SUBMISSION
    // ===================================
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(form)) {
                return;
            }
            
            const deviceType = deviceTypeSelect.value;
            const deviceCount = parseInt(deviceCountInput.value);
            
            // Calculate and display results
            calculateImpact(deviceType, deviceCount);
        });
    }
    
    // ===================================
    // CALCULATE IMPACT
    // ===================================
    function calculateImpact(deviceType, deviceCount) {
        const factors = impactFactors[deviceType];
        
        if (!factors) {
            alert('Please select a device type');
            return;
        }
        
        // Calculate total impacts
        const totalCO2 = factors.co2 * deviceCount;
        const totalWeight = factors.weight * deviceCount;
        const totalWater = factors.water * deviceCount;
        const totalEnergy = factors.energy * deviceCount;
        
        // Calculate equivalents
        const treesEquivalent = Math.round(totalCO2 / 21); // Average tree absorbs ~21kg CO2/year
        const carsOffRoad = (totalCO2 / 4600).toFixed(2); // Average car emits ~4.6 tonnes CO2/year
        const drivingMiles = Math.round(totalCO2 * 2.4); // ~0.41kg CO2 per mile
        
        // Display results with animation
        displayResults({
            co2: totalCO2.toFixed(0),
            trees: treesEquivalent,
            cars: carsOffRoad,
            water: totalWater.toFixed(0),
            waste: totalWeight.toFixed(1),
            energy: totalEnergy.toFixed(0),
            driving: drivingMiles
        });
    }
    
    // ===================================
    // DISPLAY RESULTS
    // ===================================
    function displayResults(data) {
        // Show results card with animation
        resultsCard.style.display = 'block';
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Animate numbers
        setTimeout(() => {
            animateValue('co2Result', 0, data.co2, 1500);
            animateValue('treesResult', 0, data.trees, 1500);
            animateValue('carsResult', 0, data.cars, 1500, true);
            animateValue('waterResult', 0, data.water, 1500);
            animateValue('wasteResult', 0, data.waste, 1500, true);
            animateValue('energyResult', 0, data.energy, 1500);
            
            // Update driving equivalent
            document.getElementById('drivingEquivalent').textContent = 
                data.driving.toLocaleString();
        }, 300);
    }
    
    // ===================================
    // ANIMATE NUMBER VALUES
    // ===================================
    function animateValue(elementId, start, end, duration, isDecimal = false) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startNum = parseFloat(start);
        const endNum = parseFloat(end);
        const range = endNum - startNum;
        const startTime = Date.now();
        
        function updateValue() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startNum + (range * easeOut);
            
            if (isDecimal) {
                element.textContent = current.toFixed(2);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                if (isDecimal) {
                    element.textContent = endNum.toFixed(2);
                } else {
                    element.textContent = Math.floor(endNum).toLocaleString();
                }
            }
        }
        
        requestAnimationFrame(updateValue);
    }
    
    console.log('Impact Calculator loaded successfully');
});