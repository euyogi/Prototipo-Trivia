// Colors.
const LIGHT_GREEN = "#4CAF50", LIGHT_RED = "#F44336";

// When tries == 9 the game is over.
let points = 0, tries = 0;

// Disables alternatives buttons.
function disable_options() {
    let buttons = document.getElementsByClassName("row")[0].childNodes;

    for (let button of buttons) {
        // Gets only the button elements (because there are text elements inside it as well).
        if (button.tagName == "BUTTON") // Changes the class of that button.
            button.classList.add("disabled");
    }
}

function delete_options() {
    let row = document.getElementsByClassName("row")[0];

    // It needs to be backwards otherwise not all buttons will be removed.
    for (let i = row.childNodes.length - 1; i >= 0; --i) {
        let button = row.childNodes.item(i);
        if (button.tagName == "BUTTON") // Not all children are buttons.
          row.removeChild(button);
    }
}

function answered_event(button, flag, fb_1, points_text) {
    disable_options();

    // Enable the option.
    button.classList.remove("disabled");

    // Changes the class, that will give it a colored background, white letters, disable hover.
    if (flag) {
        button.classList.add("correct");
        fb_1.innerHTML = "Correct :) Looking for next...";
        fb_1.style.color = LIGHT_GREEN;
        points_text.innerHTML = "Points: " + ++points;
    }
    else {
        button.classList.add("incorrect");
        fb_1.innerHTML = "Incorrect :( Looking for next...";
        fb_1.style.color = LIGHT_RED;
    }

    ++tries;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function generate_questions(data) {
    delete_options();

    let q_1 = document.getElementById("question_1");
    let fb_1 = document.getElementById("feedback_1");

    if (tries == 10) {
        q_1.innerHTML = "";

        if (points > 6) {
            fb_1.innerHTML = "You got " + points + "/10 congrats!";
            fb_1.style.color = LIGHT_GREEN;
        }
        else {
            fb_1.innerHTML = "You got " + points + "/10 maybe try again!";
            fb_1.style.color = LIGHT_RED;
        }

        return;
    }

    fb_1.innerHTML = "";
    q_1.innerHTML = data[tries].question.text;

    let answers = [ ...data[tries].incorrectAnswers, data[tries].correctAnswer ]
    shuffle(answers);

    let points_text = document.getElementById("points");

    for (let option of answers) {
        let button = document.createElement("button");
        
        if (option == data[tries].correctAnswer) {
            button.setAttribute("name", "correct");

            button.addEventListener("click", function() { 
                answered_event(button, true, fb_1, points_text);
                setTimeout(generate_questions, 3000, data);
            });
        }
        else {
            button.setAttribute("name", "incorrect");

            button.addEventListener("click", function() { 
                answered_event(button, false, fb_1, points_text);
                setTimeout(generate_questions, 3000, data);
            });
        }

        button.setAttribute("type", "button");
        button.innerHTML = option;

        document.getElementById("options_1").appendChild(button);
    }
}

// After DOM has been loaded.
document.addEventListener("DOMContentLoaded", function() {
    fetch("https://the-trivia-api.com/v2/questions?difficulties=easy")
        .then((response) => {
            // Check if the response is successful
            if (response.ok) // Parse the response as JSON
                return response.json();
            else // Throw an error if the response is not successful
                throw new Error("Something went wrong");
        })
        .then((data) => { // Handle the data
            generate_questions(data);
        });

    // Gets the first and only element with the name "submit_btn".
    let submit = document.getElementsByName("submit_btn")[0];
    let fb_2 = document.getElementById("feedback_2");

    // When the user presses the "check answer" button.
    submit.addEventListener("click", function () {
        // Gets the first and only element with the name "answer".
        let answer = document.getElementsByName("answer")[0];

        // If the answer typed is correct.
        if (answer.value.toLowerCase() == "switzerland") {
            // Changes the class to "correct", that will give it a green background, white letters, disable hover.
            submit.classList.add("correct");

            // The second feedback element will have "correct" as text in green.
            fb_2.innerHTML = "Correct :)";
            fb_2.style.color = LIGHT_GREEN;
        }

        // If it isn't.
        else {
            // Changes the class to "incorrect", that will give it a red background, white letters, disable hover.
            submit.classList.add("incorrect");

            // The second feedback element will have "incorrect" as text in red.
            fb_2.innerHTML = "Incorrect :(";
            fb_2.style.color = LIGHT_RED;
        }

        // Changes the class of the text input, where you type the answer to "disabled".
        answer.classList.add("disabled");
    });
});
