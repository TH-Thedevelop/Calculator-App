const display = document.getElementById("display");
let currentMode = 'normal';
let hideTimer;
let calculationHistory = []; // NEW: Array to store calculation history
let historyIndex = -1; // NEW: Index for navigating history

// Auto-hide navbar functionality - NEW: Hide navbar when not hovering
function showNavbar() {
    const navbar = document.getElementById('navbar');
    navbar.classList.remove('hidden');
    clearTimeout(hideTimer); // Cancel any pending hide
}

function hideNavbar() {
    const navbar = document.getElementById('navbar');
    hideTimer = setTimeout(() => {
        navbar.classList.add('hidden');
    }, 2000); // Hide after 2 seconds of no hover
}

// Initialize navbar behavior - NEW: Set up auto-hide on page load
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    
    // Hide navbar initially after a short delay
    setTimeout(() => {
        navbar.classList.add('hidden');
    }, 3000); // Hide after 3 seconds initially
    
    // Show navbar on hover, hide when mouse leaves
    navbar.addEventListener('mouseenter', showNavbar);
    navbar.addEventListener('mouseleave', hideNavbar);
    
    // NEW: Add keyboard shortcuts for history navigation
    document.addEventListener('keydown', function(event) {
        // Ctrl + H: Show history
        if (event.ctrlKey && event.key === 'h') {
            event.preventDefault();
            showHistory();
        }
        // Ctrl + L: Clear history
        else if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            clearHistory();
        }
        // Arrow Up: Navigate to previous calculation
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateHistory('up');
        }
        // Arrow Down: Navigate to next calculation
        else if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateHistory('down');
        }
    });
});

function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.getElementById('normal-mode').classList.toggle('active', mode === 'normal');
    document.getElementById('scientific-mode').classList.toggle('active', mode === 'scientific');
    document.getElementById('conversion-mode').classList.toggle('active', mode === 'conversion');
    
    // Show/hide appropriate keyboard
    document.getElementById('normal-keys').style.display = mode === 'normal' ? 'grid' : 'none';
    document.getElementById('scientific-keys').style.display = mode === 'scientific' ? 'grid' : 'none';
    document.getElementById('conversion-keys').style.display = mode === 'conversion' ? 'grid' : 'none';
}

function addToDisplay(input)
{
    display.value += input;
}

function clearDisplay()
{
    display.value = "";
}

function mod()
{
    // Modulo function - calculates remainder after division
    // Example: 2%3 = 2, 5%3 = 2, 7%4 = 3

    try
    {
        let expression = (display.value).replace(/%/g, "%");
        let result = eval(expression);
        if (isNaN(result) || !isFinite(result)) {
            display.value = "Error";
        } else {
            display.value = result;
            addToHistory(expression, result);
        }
    } catch (error) {
        display.value = "Error"
    }
}

function calculate() {
    try {
        let originalExpression = display.value; // Store original for history
        let expression = originalExpression;

        // Log expression for debugging
        console.log("Before eval:", expression);

        // Constants
        expression = expression.replace(/π/g, "Math.PI");

        // Exponentiation
        expression = expression.replace(/\^/g, "**");
        
        // Modulo operation (keep % as is - JavaScript handles it natively)
        // No replacement needed for % symbol

        // Replace functions using word boundaries to avoid overlap
        expression = expression.replace(/\barcsin\(/g, "Math.asin(");
        expression = expression.replace(/\barccos\(/g, "Math.acos(");
        expression = expression.replace(/\barctan\(/g, "Math.atan(");

        expression = expression.replace(/\bsin\(/g, "Math.sin(");
        expression = expression.replace(/\bcos\(/g, "Math.cos(");
        expression = expression.replace(/\btan\(/g, "Math.tan(");
        
        // Scientific functions
        expression = expression.replace(/\bsqrt\(/g, "Math.sqrt(");
        expression = expression.replace(/\blog\(/g, "Math.log10(");
        expression = expression.replace(/\bln\(/g, "Math.log(");
        expression = expression.replace(/\babs\(/g, "Math.abs(");
        expression = expression.replace(/\bexp\(/g, "Math.exp(");
        expression = expression.replace(/\b10\^/g, "Math.pow(10,");
        
        // Constants
        expression = expression.replace(/\be\b/g, "Math.E");
        
        // Factorial function
        expression = expression.replace(/\bfactorial\(/g, "factorial(");
        
        // Handle factorial function
        if (expression.includes("factorial(")) {
            expression = expression.replace(/factorial\(([^)]+)\)/g, function(match, num) {
                let n = parseFloat(eval(num));
                if (n < 0 || n !== Math.floor(n)) {
                    throw new Error("Factorial only defined for non-negative integers");
                }
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            });
        }
        
        /*CURRENTLY WORKS FOR RADIANS ONLY, NOT DEGREES*/

        // Auto-close any open parentheses
        let openParens = (expression.match(/\(/g) || []).length;
        let closeParens = (expression.match(/\)/g) || []).length;
        let missingParens = openParens - closeParens;
        if (missingParens > 0) {
            expression += ")".repeat(missingParens);
        }

        let result = eval(expression);

        if (isNaN(result) || !isFinite(result)) {
            display.value = "Domain Error";
            // NEW: Store error in history
            addToHistory(originalExpression, "Domain Error");
        } else {
            display.value = result;
            // NEW: Store successful calculation in history
            addToHistory(originalExpression, result);
        }

    } catch (error) {
        console.error("Eval error:", error);
        display.value = "Error";
        // NEW: Store error in history
        addToHistory(display.value, "Error");
    }
}

function backspace()
{
    const functions = ["arcsin(", "arccos(", "arctan(", "sin(", "cos(", "tan(", 
                      "sqrt(", "log(", "ln(", "abs(", "exp(", "factorial(", "10^"];

    for (let func of functions) {
        if (display.value.endsWith(func)) {
            display.value = display.value.slice(0, -func.length);
            return;
        }
    }
    display.value = display.value.slice(0,-1);
}

// Calculation history functions - NEW: Store and retrieve calculation history
function addToHistory(expression, result) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: timestamp
    };
    
    calculationHistory.unshift(historyItem); // Add to beginning of array
    historyIndex = 0; // Reset index to most recent
    
    // Limit history to 50 items to prevent memory issues
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }
    
    // NEW: Update history sidebar if visible
    updateHistorySidebar();
    
    console.log("Added to history:", historyItem);
}

function showHistory() {
    if (calculationHistory.length === 0) {
        alert("No calculation history available.");
        return;
    }
    
    let historyText = "Calculation History:\n\n";
    calculationHistory.forEach((item, index) => {
        historyText += `${index + 1}. ${item.expression} = ${item.result}\n`;
        historyText += `   Time: ${item.timestamp}\n\n`;
    });
    
    alert(historyText);
}

function navigateHistory(direction) {
    if (calculationHistory.length === 0) return;
    
    if (direction === 'up') {
        historyIndex = Math.min(historyIndex + 1, calculationHistory.length - 1);
    } else if (direction === 'down') {
        historyIndex = Math.max(historyIndex - 1, 0);
    }
    
    if (historyIndex >= 0 && historyIndex < calculationHistory.length) {
        const historyItem = calculationHistory[historyIndex];
        display.value = historyItem.expression;
    }
}

function clearHistory() {
    calculationHistory = [];
    historyIndex = -1;
    // NEW: Update history sidebar
    updateHistorySidebar();
    alert("Calculation history cleared.");
}

// History sidebar functions - NEW: Manage collapsible history panel
function toggleHistorySidebar() {
    const sidebar = document.getElementById('history-sidebar');
    const toggleBtn = document.getElementById('toggle-history');
    const navbarBtn = document.getElementById('navbar-history-btn');
    
    if (sidebar.classList.contains('hidden')) {
        // Show sidebar
        sidebar.classList.remove('hidden');
        if (toggleBtn) toggleBtn.textContent = '✕';
        if (navbarBtn) navbarBtn.textContent = '✕';
        updateHistorySidebar();
    } else {
        // Hide sidebar
        sidebar.classList.add('hidden');
        if (toggleBtn) toggleBtn.textContent = '📜';
        if (navbarBtn) navbarBtn.textContent = '📜';
    }
}

function updateHistorySidebar() {
    const historyContent = document.getElementById('history-content');
    
    if (!historyContent) return;
    
    if (calculationHistory.length === 0) {
        historyContent.innerHTML = '<div style="text-align: center; color: #777DA7; padding: 20px; font-style: italic;">No calculations yet</div>';
        return;
    }
    
    let html = '';
    calculationHistory.forEach((item, index) => {
        html += `
            <div class="history-item" onclick="loadHistoryItem(${index})">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
                <div class="history-timestamp">${item.timestamp}</div>
            </div>
        `;
    });
    
    historyContent.innerHTML = html;
}

function loadHistoryItem(index) {
    if (index >= 0 && index < calculationHistory.length) {
        const item = calculationHistory[index];
        display.value = item.expression;
        historyIndex = index;
    }
}

// Unit conversion functions - NEW: Comprehensive conversion system
const conversions = {
    // Temperature conversions
    temperature: {
        celsius: {
            fahrenheit: (c) => (c * 9/5) + 32,
            kelvin: (c) => c + 273.15
        },
        fahrenheit: {
            celsius: (f) => (f - 32) * 5/9,
            kelvin: (f) => ((f - 32) * 5/9) + 273.15
        },
        kelvin: {
            celsius: (k) => k - 273.15,
            fahrenheit: (k) => ((k - 273.15) * 9/5) + 32
        }
    },
    // Length conversions (meters as base unit)
    length: {
        meter: {
            kilometer: (m) => m / 1000,
            centimeter: (m) => m * 100,
            millimeter: (m) => m * 1000,
            inch: (m) => m * 39.3701,
            foot: (m) => m * 3.28084,
            yard: (m) => m * 1.09361,
            mile: (m) => m / 1609.34
        },
        kilometer: {
            meter: (km) => km * 1000,
            mile: (km) => km * 0.621371
        },
        centimeter: {
            meter: (cm) => cm / 100,
            inch: (cm) => cm * 0.393701
        },
        inch: {
            meter: (inches) => inches / 39.3701,
            centimeter: (inches) => inches * 2.54,
            foot: (inches) => inches / 12
        },
        foot: {
            meter: (ft) => ft / 3.28084,
            inch: (ft) => ft * 12,
            yard: (ft) => ft / 3
        },
        mile: {
            meter: (mi) => mi * 1609.34,
            kilometer: (mi) => mi * 1.60934
        }
    },
    // Weight conversions (kilograms as base unit)
    weight: {
        kilogram: {
            gram: (kg) => kg * 1000,
            pound: (kg) => kg * 2.20462,
            ounce: (kg) => kg * 35.274
        },
        gram: {
            kilogram: (g) => g / 1000,
            pound: (g) => g * 0.00220462,
            ounce: (g) => g * 0.035274
        },
        pound: {
            kilogram: (lb) => lb / 2.20462,
            gram: (lb) => lb * 453.592,
            ounce: (lb) => lb * 16
        },
        ounce: {
            kilogram: (oz) => oz / 35.274,
            gram: (oz) => oz * 28.3495,
            pound: (oz) => oz / 16
        }
    },
    // Volume conversions (liters as base unit)
    volume: {
        liter: {
            milliliter: (l) => l * 1000,
            gallon: (l) => l * 0.264172,
            quart: (l) => l * 1.05669,
            pint: (l) => l * 2.11338,
            cup: (l) => l * 4.22675
        },
        milliliter: {
            liter: (ml) => ml / 1000,
            cup: (ml) => ml * 0.00422675
        },
        gallon: {
            liter: (gal) => gal / 0.264172,
            quart: (gal) => gal * 4,
            pint: (gal) => gal * 8
        },
        cup: {
            milliliter: (cup) => cup * 236.588,
            liter: (cup) => cup * 0.236588
        }
    }
};

function showConvertMenu() {
    const menuText = `
Conversion Menu:

1. Temperature
   - Celsius ↔ Fahrenheit ↔ Kelvin

2. Length
   - Meter ↔ Kilometer ↔ Centimeter ↔ Inch ↔ Foot ↔ Yard ↔ Mile

3. Weight
   - Kilogram ↔ Gram ↔ Pound ↔ Ounce

4. Volume
   - Liter ↔ Milliliter ↔ Gallon ↔ Quart ↔ Pint ↔ Cup

Enter conversion like: "convert 25 celsius to fahrenheit"
Or click conversion buttons on calculator.
    `;
    alert(menuText);
}

function convert(value, fromUnit, toUnit, category) {
    try {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return "Invalid number";
        }

        if (!conversions[category] || !conversions[category][fromUnit] || !conversions[category][fromUnit][toUnit]) {
            return "Conversion not available";
        }

        const result = conversions[category][fromUnit][toUnit](numValue);
        return parseFloat(result.toFixed(6)); // Round to 6 decimal places
    } catch (error) {
        return "Conversion error";
    }
}

// Quick conversion functions for common conversions
function quickConvert(conversionType) {
    const value = display.value;
    if (!value || isNaN(parseFloat(value))) {
        alert("Please enter a number first.");
        return;
    }

    let result;
    switch(conversionType) {
        case 'celsius-to-fahrenheit':
            result = convert(value, 'celsius', 'fahrenheit', 'temperature');
            break;
        case 'fahrenheit-to-celsius':
            result = convert(value, 'fahrenheit', 'celsius', 'temperature');
            break;
        case 'meter-to-foot':
            result = convert(value, 'meter', 'foot', 'length');
            break;
        case 'foot-to-meter':
            result = convert(value, 'foot', 'meter', 'length');
            break;
        case 'kilogram-to-pound':
            result = convert(value, 'kilogram', 'pound', 'weight');
            break;
        case 'pound-to-kilogram':
            result = convert(value, 'pound', 'kilogram', 'weight');
            break;
        case 'liter-to-gallon':
            result = convert(value, 'liter', 'gallon', 'volume');
            break;
        case 'gallon-to-liter':
            result = convert(value, 'gallon', 'liter', 'volume');
            break;
        case 'kilometer-to-mile':
            result = convert(value, 'kilometer', 'mile', 'length');
            break;
        case 'mile-to-kilometer':
            result = convert(value, 'mile', 'kilometer', 'length');
            break;
        case 'gram-to-ounce':
            result = convert(value, 'gram', 'ounce', 'weight');
            break;
        case 'ounce-to-gram':
            result = convert(value, 'ounce', 'gram', 'weight');
            break;
        case 'milliliter-to-cup':
            result = convert(value, 'milliliter', 'cup', 'volume');
            break;
        case 'cup-to-milliliter':
            result = convert(value, 'cup', 'milliliter', 'volume');
            break;
        default:
            result = "Unknown conversion";
    }

    if (typeof result === 'number') {
        display.value = result;
        addToHistory(`${value} ${conversionType.replace('-', ' to ')}`, result);
    } else {
        alert(result);
    }
}

// About dialog function - NEW: Show calculator information
function showAbout() {
    const aboutText = `
🧮 Calculator - Smart & Accurate

Features:
• Standard Mode: Basic arithmetic operations
• Scientific Mode: Advanced mathematical functions
• Conversion Mode: Unit conversions for temperature, length, weight, and volume
• Calculation History: Track your calculations with timestamps
• Keyboard Shortcuts: Ctrl+H (history), Ctrl+L (clear history), ↑/↓ (navigate)

Version: 1.0
Built with HTML5, CSS3, and JavaScript

Click anywhere to close this dialog.
    `;
    
    // Create a modal dialog
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        font-family: Arial, sans-serif;
        line-height: 1.6;
        white-space: pre-line;
        cursor: default;
    `;
    
    content.innerHTML = aboutText.replace(/\n/g, '<br>');
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close modal when clicked
    modal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Prevent content click from closing modal
    content.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Basic calculator mode - NEW: Simplified version without advanced functions
function addToDisplayBasic(input)
{
    // Only allow basic operations in basic mode
    const allowedChars = /^[0-9+\-*/.()=]$/;
    if (allowedChars.test(input) || input === 'Clear') {
        if (input === 'Clear') {
            clearDisplay();
        } else if (input === '=') {
            calculate();
        } else {
            addToDisplay(input);
        }
    }
}