# 🧮 Calculator App - Smart & Accurate

## Overview
A modern, feature-rich web-based calculator application built with HTML5, CSS3, and JavaScript. This calculator provides three distinct modes: Standard, Scientific, and Conversion, along with advanced features like calculation history and keyboard shortcuts.

## ✨ Features

### 🔢 Standard Mode
- Basic arithmetic operations (+, -, ×, ÷)
- Parentheses support for complex expressions
- Clear and backspace functionality
- Real-time calculation display

### 🧪 Scientific Mode
- **Trigonometric Functions**: sin, cos, tan, arcsin, arccos, arctan
- **Logarithmic Functions**: log (base 10), ln (natural log)
- **Mathematical Constants**: π (pi), e (Euler's number)
- **Advanced Operations**: Square root, exponentiation, factorial
- **Scientific Notation**: 10^x, e^x
- **Absolute Value**: |x|

### 🔄 Conversion Mode
- **Temperature**: Celsius ↔ Fahrenheit ↔ Kelvin
- **Length**: Meter ↔ Kilometer ↔ Centimeter ↔ Inch ↔ Foot ↔ Yard ↔ Mile
- **Weight**: Kilogram ↔ Gram ↔ Pound ↔ Ounce
- **Volume**: Liter ↔ Milliliter ↔ Gallon ↔ Quart ↔ Pint ↔ Cup

### 📊 Advanced Features
- **Calculation History**: Track all calculations with timestamps
- **History Navigation**: Use arrow keys or click to navigate previous calculations
- **Collapsible History Panel**: Sidebar with visual history display
- **Keyboard Shortcuts**:
  - `Ctrl + H`: Show history
  - `Ctrl + L`: Clear history
  - `↑/↓`: Navigate calculation history
- **Auto-hiding Navbar**: Clean interface with hover-to-reveal navigation
- **Interactive Logo**: Click logo for app information

## 🎨 Design & UI

### Color Palette
- **Primary Purple**: #777DA7 (Navbar, borders)
- **Light Green**: #C6ECAE (Button area background)
- **Vibrant Orange**: #FE5F55 (Display, active states)
- **Muted Green**: #94C9A9 (Buttons, history panel)
- **Professional Blue**: #4A90E2 (Logo elements)

### Responsive Design
- Mobile-friendly interface
- Adaptive button layouts for different modes
- Smooth animations and transitions
- Modern rounded corners and shadows

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required

### Installation & Running

#### Option 1: Simple File Opening
```bash
# Navigate to project directory
cd /path/to/Calculator-App

# Open in browser (Linux)
xdg-open calculator.html

# Open in browser (Windows)
start calculator.html

# Open in browser (macOS)
open calculator.html
```

#### Option 2: Local HTTP Server (Recommended)
```bash
# Navigate to project directory
cd /path/to/Calculator-App

# Start local server with Python
python3 -m http.server 8000

# Or with Node.js
npx http-server

# Or with PHP
php -S localhost:8000
```

Then open your browser and navigate to `http://localhost:8000/calculator.html`

## 📁 Project Structure
```
Calculator-App/
├── calculator.html      # Main HTML structure
├── calculator.css       # Styling and responsive design
├── calculator.js        # Core functionality and logic
└── README.md           # This documentation
```

## 🔧 Technical Implementation

### HTML Structure
- Semantic HTML5 elements
- Accessible form controls
- SVG logo integration
- Modal dialog system

### CSS Features
- CSS Grid for button layouts
- Flexbox for navbar alignment
- CSS transitions and animations
- Responsive design principles
- Custom SVG styling

### JavaScript Functionality
- **Expression Parser**: Handles complex mathematical expressions
- **Function Mapping**: Converts user input to JavaScript Math functions
- **History Management**: Local storage and navigation
- **Unit Conversion**: Comprehensive conversion algorithms
- **Error Handling**: Graceful error management
- **Event Handling**: Keyboard shortcuts and mouse interactions

## 🎯 Usage Examples

### Basic Calculations
```
2 + 3 = 5
(10 - 4) * 2 = 12
25 / 5 = 5
```

### Scientific Calculations
```
sin(π/2) = 1
log(100) = 2
sqrt(16) = 4
2^3 = 8
5! = 120
```

### Unit Conversions
```
25°C = 77°F
1 mile = 1.60934 km
1 kg = 2.20462 lbs
1 liter = 0.264172 gallons
```

## 🔍 Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🛠️ Development

### Code Organization
- **Modular JavaScript**: Functions organized by feature
- **CSS Architecture**: Component-based styling
- **HTML Semantics**: Accessible markup structure

### Performance Optimizations
- Efficient expression evaluation
- History size limiting (50 items max)
- Smooth animations with CSS transitions
- Optimized event handling

## 📈 Future Enhancements
- [ ] Dark/Light theme toggle
- [ ] Additional mathematical functions
- [ ] Graph plotting capabilities
- [ ] Export calculation history
- [ ] Offline PWA support
- [ ] Voice input support
- [ ] Customizable button layouts

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author
Created with ❤️ using modern web technologies.

---

**Calculator App - Smart & Accurate** 🧮
Built with HTML5, CSS3, and JavaScript
