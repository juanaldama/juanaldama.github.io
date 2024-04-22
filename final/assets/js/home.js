words = [
    "abyss",
    "acoustic",
    "active",
    "adorable",
    "adventure",
    "amazing",
    "ancient",
    "angel",
    "arcade",
    "art",
    "autumn",
    "awesome",
    "baby",
    "badger",
    "bamboo",
    "beach",
    "bear",
    "beauty",
    "berry",
    "bird",
    "black",
    "blossom",
    "blue",
    "breeze",
    "brilliant",
    "bubble",
    "butterfly",
    "candle",
    "candy",
    "castle",
    "charming",
    "cheerful",
    "cherry",
    "cloud",
    "coconut",
    "colorful",
    "comet",
    "cotton",
    "cozy",
    "crimson",
    "crystal",
    "curious",
    "daffodil",
    "dancing",
    "delightful",
    "diamond",
    "dolphin",
    "dream",
    "eagle",
    "earth",
    "echo",
    "elegant",
    "emerald",
    "enchanted",
    "energy",
    "eternal",
    "evening",
    "exotic",
    "fabulous",
    "fairy",
    "fantastic",
    "feather",
    "firefly",
    "floral",
    "flower",
    "forest",
    "fragrant",
    "frost",
    "frozen",
    "gentle",
    "glimmer",
    "glowing",
    "golden",
    "graceful",
    "green",
    "happy",
    "harmony",
    "heavenly",
    "hibiscus",
    "hidden",
    "honey",
    "honeydew",
    "hummingbird",
    "icy",
    "imagine",
    "inspire",
    "iris",
    "island",
    "jade",
    "joyful",
    "juniper",
    "kingfisher",
    "lagoon",
    "lake",
    "lavender",
    "legend",
    "lilac",
    "lily",
    "living",
    "lovely",
    "magic",
    "majestic",
    "marine",
    "meadow",
    "melody",
    "midnight",
    "miracle",
    "misty",
    "moon",
    "morning",
    "mystic",
    "nature",
    "night",
    "ocean",
    "orange",
    "orchid",
    "palace",
    "paradise",
    "peaceful",
    "pearl",
    "peony",
    "perfection",
    "petal",
    "pink",
    "planet",
    "pleasant",
    "plum",
    "poetic",
    "precious",
    "pretty",
    "prism",
    "pure",
    "purple",
    "quiet",
    "rainbow",
    "raindrop",
    "raspberry",
    "red",
    "reflect",
    "refresh",
    "restful",
    "ripple",
    "rose",
    "sapphire",
    "scenic",
    "secret",
    "serene",
    "shimmer",
    "silence",
    "silver",
    "skylark",
    "smile",
    "smooth",
    "snow",
    "soaring",
    "soft",
    "sparkle",
    "spirit",
    "spring",
    "star",
    "stellar",
    "stunning",
    "summer",
    "sunrise",
    "sunset",
    "sunshine",
    "swan",
    "sweet",
    "tangerine",
    "tender",
    "tranquil",
    "treasure",
    "tulip",
    "twilight",
    "unique",
    "vibrant",
    "violet",
    "vision",
    "vivid",
    "waterfall",
    "whisper",
    "white",
    "wildflower",
    "willow",
    "wind",
    "wisdom",
    "wonder",
    "wondrous",
    "yellow",
    "zen",
    "zephyr"
  ]
var gameStarted = false;
var score = 0;
var highScore = 0;
var currWord = null;
var startedTyping = false;
var wordList = [];
var firstLetters = new Set();
var timeoutID;



function createLeaf(word, count) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    leaf.id = word;

    //decrease animation time as time goes on to make it harder over time, making the least possible 3 seconds
    var animationLength = 5 - (count * 0.1);
    animationLength = Math.max(animationLength, 3.0)
    leaf.style.animationDuration = animationLength.toString() + "s";

    
    for (let i = 0; i < word.length; i++) {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = word[i];
        leaf.appendChild(letterSpan);
    }

    leaf.style.left = (0.1 + Math.random() * 0.8) * 100 + 'vw'; // Random horizontal position
    leaf.style.top = '1400px'; 

    document.getElementById('tree-container').appendChild(leaf);
    
    // checks if the leaf has reached the bottom of the screen
    const checkLeafPosition = () => {
        if (window.innerHeight - leaf.getBoundingClientRect().bottom < 70){
            leaf.classList.add('lost');
            leaf.innerHTML = "&nbsp"
            endGame();
          }
    };
    const positionInterval = setInterval(checkLeafPosition, 100);
    setTimeout(() => {
        clearInterval(positionInterval);
    }, 5000)
    
    
}

function keydownEventHandler(event) {

    var typed = event.key;
    console.log(typed)
    if (!startedTyping) {
        currWord = findWordByLetter(wordList, typed);
        if (currWord == null) {
            return;
        }
        startedTyping = true;
    }

    var leaf = document.getElementById(currWord);
    if (!leaf) {
        return
    }
    var spans = document.getElementById(currWord).children;



    for (let i = 0; i < spans.length; i++) {
        
        if (spans[i].classList.contains("letter-bg")) {
            continue;
        }
        if (spans[i].innerHTML == typed && (spans[i - 1] === undefined || spans[i - 1].classList.contains("letter-bg") !== false)) {
            leaf.classList.add("typing");
            spans[i].classList.add("letter-bg");
            if (i == spans.length - 1) {
                // Delete word and add to score
                score += 1;
                document.getElementById("score").innerHTML = "SCORE: " + score
                wordList.splice(wordList.indexOf(currWord), 1);
                firstLetters.delete(currWord.charAt(0));
                document.getElementById("tree-container").removeChild(document.getElementById(currWord));
                currWord = null;
                startedTyping = false;
                break; // Exit the loop after removing the word
            }
            break;
        }
    }
}

function runGame() {
    

    const leaves = document.querySelectorAll('.leaf');
    for (const leaf of leaves) {
        document.getElementById("tree-container").removeChild(leaf);
    }

    document.getElementById("game-over-box").classList.add("hidden")
    document.getElementById("play-again-box").classList.add("hidden")

    document.getElementById("score").innerHTML = "SCORE: 0"

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' 
    });

    if (gameStarted) {
        return;
    } 
    gameStarted = true;
    score = 0;
    
    
    var count = 0

    document.addEventListener('keydown', keydownEventHandler);

    var leafInterval = function() {
        var randomWord = words[Math.floor(Math.random() * words.length)];
        while (firstLetters.has(randomWord.charAt(0))) {
            randomWord = words[Math.floor(Math.random() * words.length)];
        }

        wordList.push(randomWord);
        firstLetters.add(randomWord.charAt(0));
        createLeaf(randomWord, count);

        
        const randomInterval = Math.floor(Math.random() * (3000 - 200 + 1)) + 200; //random num between 200 and 3000
        
        timeoutID = setTimeout(leafInterval, randomInterval);

        // console.log(count);
        count += 1;
    } 
    timeoutID = setTimeout(leafInterval, 1500);
    
    
}

//finds the words by the letter you type
function findWordByLetter(wordsArray, letter) {
    for (let i = 0; i < wordsArray.length; i++) {
        let word = wordsArray[i];
        if (word.startsWith(letter)) {
            return wordsArray[i];
        }
    }
    return null;
}

//function that ends the game and stops the leaves from spawning
function endGame() {
    gameStarted = false;
    wordList = [];
    startedTyping = false;
    currWord = null;
    firstLetters = new Set();

    if (score > highScore) {
        highScore = score;
    }

    document.getElementById("your-score").innerHTML = "YOUR SCORE: " + score
    document.getElementById("high-score").innerHTML = "HIGH SCORE: " + highScore
    document.getElementById("game-over-box").classList.remove("hidden")
    document.getElementById("play-again-box").classList.remove("hidden")

    const leaves = document.querySelectorAll('.leaf');
    for (const leaf of leaves) {
        if (!leaf.classList.contains("lost")) {
            document.getElementById("tree-container").removeChild(leaf);
        }
    }

    document.removeEventListener('keydown', keydownEventHandler);
    clearTimeout(timeoutID);
    
    
}
//runs game if press play or play again
document.getElementById('play-box').onclick = runGame;
document.getElementById('play-again-box').onclick = runGame;

//makes it so that when you refresh it takes you to top of page
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }
