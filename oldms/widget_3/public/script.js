console.log("script running in widget_2")

const text = "this came from index.js"

// document.getElementById("counter").innerText = text

function increment() {
    console.log("click")
    const counterElement = document.getElementById('counter')
    counterElement.innerText = (parseInt(counterElement.innerText, 10) + 1).toString()
}

document.getElementById("increment-button").addEventListener("click", increment);

console.log("increment is defined as a ", typeof increment)

// let i = 0

// setInterval(() => {
//     i++
//     console.log(i)
//     document.getElementById("counter").innerText = i.toString()
// }, 1000)