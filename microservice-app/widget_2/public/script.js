const answers = ["yes", "no", "that depends", "don't count on it", "outlook is not so good", "my sources say yes", "it's a certainty" , "you bet"]


window.onload = function() {
    const eight = document.getElementById("eight")
    const answer = document.getElementById("answer")
    const eightBall = document.getElementById("eight-ball")
    const question = document.getElementById("question")

    eightBall.addEventListener("click", function(event) {
        console.log("click")
        if (question.value.length < 1) {
            alert("enter a question")
        } else {
            question.value = ""
            eight.hidden = true
            const num = Math.floor(Math.random() * Math.floor(answers.length))
            const answerText = answers[num]
            console.log(answerText)
            answer.innerText = answerText
        }        
    })

}