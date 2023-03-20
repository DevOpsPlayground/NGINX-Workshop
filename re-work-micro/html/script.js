console.log("script loaded")

const hostServer = "http://localhost"

const widgetSpace = document.getElementById("widget-space")

// const origins = ["example1", "example2", "example3", "example4"]
const origins = ["example1", "example2", "example3", "funny-panda","sweet-panda","proud-panda","suited-panda","loved-panda","firm-panda","settling-panda","premium-panda","feasible-panda","welcome-panda","pumped-panda","trusty-panda","rational-panda","moving-panda","fast-panda","social-panda","logical-panda","on-panda","driving-panda","perfect-panda","equal-panda","becoming-panda","still-panda","touched-panda","fair-panda","quiet-panda","ample-panda","master-panda","fun-panda","big-panda","full-panda","credible-panda","inspired-panda","pet-panda","willing-panda","guiding-panda","useful-panda","close-panda","smashing-panda","stunning-panda","musical-panda","evolved-panda","teaching-panda","artistic-panda","learning-panda","singular-panda","funky-panda","optimal-panda","loving-panda","measured-panda","whole-panda","verified-panda","finer-panda","glorious-panda","outgoing-panda","living-panda","refined-panda","valued-panda","champion-panda"]


// const testWidget = document.createElement("iframe")
// testWidget.src = `${hostServer}/example1`
// testWidget.className = "widget"
// testWidget.id = `test-widget`
// testWidget.key = "test"
// widgetSpace.appendChild(testWidget)

origins.forEach((origin, i) => {
    try {
        fetch(`${hostServer}/widget/${origin}`).then(response => {
            if (response.ok) {
                console.log(response)
                renderWidget(origin, i)
                addMenuButton(origin)
            }
        })

    } catch (err) {

    }
    
    // renderWidget(origin, i)
})

function renderWidget(origin, key) {
    const widget = document.createElement("iframe")
    widget.src = `${hostServer}/widget/${origin}`
    widget.className = "widget"
    widget.id = `${origin}-widget`
    widget.key = key
    widgetSpace.appendChild(widget)
}

// const widget1 = document.createElement("iframe")
// widget1.src = "http://localhost/widget/example1"

// widgetSpace.appendChild(widget1)


// #### Menu ######

function addMenuButton(panda) {
    const buttonDiv = document.createElement('div')
    buttonDiv.innerText = panda
  
    const button = document.createElement('button')
    button.innerText = "hide"
    button.setAttribute('onclick', `hide("${panda}")`)
    button.id = `toggle-${panda}`
  
  
    buttonDiv.appendChild(button)
    menu.appendChild(buttonDiv)
  
  }
  
  
  function hide(panda) {
    // console.log("hide", panda)
    const thisWidget = document.getElementById(`${panda}-widget`)
  
    thisWidget.hidden = true
    const thisButton = document.getElementById(`toggle-${panda}`)
    thisButton.innerText = "show"
    thisButton.setAttribute('onclick', `show("${panda}")`)
  }
  
  function show(panda, action) {
    // console.log("show", panda)
    const thisWidget = document.getElementById(`${panda}-widget`)
  
    thisWidget.hidden = false
    const thisButton = document.getElementById(`toggle-${panda}`)
    thisButton.innerText = "hide"
    thisButton.setAttribute('onclick', `hide("${panda}")`)
  }