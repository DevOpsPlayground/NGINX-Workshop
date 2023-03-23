console.log("script loaded")

const hostServer = "http://INSERT_PANDA_NAME.devopsplayground.org"
//^^ change this to the url or ip where this dashboard is served eg "http://localhost"^^

const origins = ["example1-panda", "example2-panda", "example3-panda", "funny-panda","sweet-panda","proud-panda","suited-panda",
    "loved-panda","firm-panda","settling-panda","premium-panda","feasible-panda","welcome-panda","pumped-panda",
    "trusty-panda","rational-panda","moving-panda","fast-panda","social-panda","logical-panda","on-panda",
    "driving-panda","perfect-panda","equal-panda","becoming-panda","still-panda","touched-panda","fair-panda",
    "quiet-panda","ample-panda","master-panda","fun-panda","big-panda","full-panda","credible-panda",
    "inspired-panda","pet-panda","willing-panda","guiding-panda","useful-panda","close-panda","smashing-panda",
    "stunning-panda","musical-panda","evolved-panda","teaching-panda","artistic-panda","learning-panda",
    "singular-panda","funky-panda","optimal-panda","loving-panda","measured-panda","whole-panda","verified-panda",
    "finer-panda","glorious-panda","outgoing-panda","living-panda","refined-panda","valued-panda","champion-panda"]
const fetchLimit = 3

const widgetSpace = document.getElementById("widget-space")

origins.forEach((origin, i) => {
    const thisOriginRegex = new RegExp( origin, 'g' );

    if (!hostServer.match(thisOriginRegex) && i < fetchLimit && origin !== "funny-panda") {

        fetch(`${hostServer}/widget/${origin}`).then(response => {
            if (response.ok) {
                renderWidget(origin, i)
                addMenuButton(origin)
            }
        })

    }

})

// #### Widget ######

function renderWidget(origin, key) {
    const widget = document.createElement("iframe")
    widget.src = `${hostServer}/widget/${origin}`
    widget.className = "widget"
    widget.id = `${origin}-widget`
    widget.key = key

    const widgetFrame = document.createElement("div")
    widgetFrame.className = "widget-frame"
    widgetFrame.id = `${origin}-widget`

    const widgetBanner = document.createElement("div")
    widgetBanner.className = "widget-banner"
    widgetBanner.innerText = origin

    widgetFrame.appendChild(widgetBanner)
    widgetFrame.appendChild(widget)
    widgetSpace.appendChild(widgetFrame)
}

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
    const thisWidget = document.getElementById(`${panda}-widget`)
  
    thisWidget.hidden = true
    const thisButton = document.getElementById(`toggle-${panda}`)
    thisButton.innerText = "show"
    thisButton.setAttribute('onclick', `show("${panda}")`)
  }
  
  function show(panda, action) {
    const thisWidget = document.getElementById(`${panda}-widget`)
  
    thisWidget.hidden = false
    const thisButton = document.getElementById(`toggle-${panda}`)
    thisButton.innerText = "hide"
    thisButton.setAttribute('onclick', `hide("${panda}")`)
  }
