// console.log("Hello")
// console.log("location: ", window.location.href)

const sampleWidgets = [
    "<div class='widget-content'><h1>Widget A</h1></div>",
    "<div class='widget-content'><h1>Widget B</h1></div>",
    "<div class='widget-content'><h1>Widget C</h1></div>",
    "<div class='widget-content'><h1>Widget D</h1></div>"
]

const widgetElements = formatWidgets(sampleWidgets)
renderWidgets(widgetElements)

const pandas = ["example1", "example2", "example3", "funpanda", "sillypanda", "wrongpanda", "nginxpanda"]

const widgetPromises = pandas.map(path => {
  return getWidget(`http://54.217.163.148/widget/${path}`)
})

Promise.all(widgetPromises).then(newWidgets => {
  const newWidgetsObjects = newWidgets.map((content, i) => {
    return {content, panda: pandas[i]}
  })
  const newFormattedWidgets = formatWidgets(newWidgetsObjects)
  renderWidgets(newFormattedWidgets)
})

function formatWidgets(widgetsArray) {
  const widgetElements = []
  widgetsArray.forEach((widget, i) => {
    console.log(widget)
    if (widget.content) {
      widgetElements.push(`<div class="widget" key=${i} id="${widget.panda}-widget">${widget.content}</div>`)
    }
  })
  return widgetElements
}

function renderWidgets(widgetElementsArray) {

  const widgetSpace = document.getElementById("widget-space")
  widgetSpace.innerHTML = widgetElementsArray.join("")

  const scripts = document.getElementById("widget-space").querySelectorAll("script");
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].innerText) {
      eval(scripts[i].innerText);
    } else {
      fetch(scripts[i].src).then(function (data) {
        data.text().then(function (r) {
          eval(r);
        })
      });

    }
    // To not repeat the element
    scripts[i].parentNode.removeChild(scripts[i]);
  }
}


async function getWidget(url) {
  try {
    let response = await fetch(url)
    if (response.ok == false) {
      console.log('caught: ', url)
    } else {
      const widget = await response.text()
      return widget
    }
  } catch (err) {
    console.log('caught: ', url)
  }
}

// #### Menu ######

const menu = document.getElementById('menu')

pandas.forEach(panda => {
  const buttonDiv = document.createElement('div')
  buttonDiv.innerText = panda
  
  const button = document.createElement('button')
  button.innerText = "hide"
  button.setAttribute('onclick', `hide("${panda}")`)
  button.id = `toggle-${panda}`
  

  buttonDiv.appendChild(button)
  menu.appendChild(buttonDiv)
})

function hide(panda) {
  console.log("hide", panda)
  const thisWidget = document.getElementById(`${panda}-widget`)
  
  thisWidget.hidden = true
  const thisButton = document.getElementById(`toggle-${panda}`)
  thisButton.innerText = "show"
  thisButton.setAttribute('onclick', `show("${panda}")`)
}

function show(panda, action) {
  console.log("show", panda)
  const thisWidget = document.getElementById(`${panda}-widget`)
  
  thisWidget.hidden = false
  const thisButton = document.getElementById(`toggle-${panda}`)
  thisButton.innerText = "hide"
  thisButton.setAttribute('onclick', `hide("${panda}")`)
}