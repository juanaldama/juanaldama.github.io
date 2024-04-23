function toggleTheme() {
    document.querySelector("body").classList.toggle("dark-mode");
}

let buttonVariable = document.getElementById("toggleButton")
buttonVariable.onclick = toggleTheme;