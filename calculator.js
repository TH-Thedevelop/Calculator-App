const display = document.getElementById("display");

function addToDisplay(input)
{
    display.value += input;
}

function clearDisplay()
{
    display.value = "";
}

function calculate() {
    try {
        let expression = display.value;

        // Log expression for debugging
        console.log("Before eval:", expression);

        // Constants
        expression = expression.replace(/π/g, "Math.PI");

        // Exponentiation
        expression = expression.replace(/\^/g, "**");

        // Replace functions using word boundaries to avoid overlap
        expression = expression.replace(/\barcsin\(/g, "Math.asin(");
        expression = expression.replace(/\barccos\(/g, "Math.acos(");
        expression = expression.replace(/\barctan\(/g, "Math.atan(");

        expression = expression.replace(/\bsin\(/g, "Math.sin(");
        expression = expression.replace(/\bcos\(/g, "Math.cos(");
        expression = expression.replace(/\btan\(/g, "Math.tan(");
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
        } else {
            display.value = result;
        }

    } catch (error) {
        console.error("Eval error:", error);
        display.value = "Error";
    }
}

function backspace()
{
    const functions = ["sin(", "cos(", "tan(", "arcsin(", "arccos(", "arctan("];

        for (let func of functions) {
        if (display.value.endsWith(func)) {
            display.value = display.value.slice(0, -func.length);
            return;
        }
    }
    display.value = display.value.slice(0,-1);
}