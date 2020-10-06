window.addEventListener("resize", function () {    
    mark();
});
let prompts = ["Please select the left boundary of the space allocated for the name", "Please select the right boundary of the space allocated for the name", "Please select the bottom boundary of the space allocated for the name", ""];
let person;
let pos = 0;

// The boundary object to store the x and y coordinates of the text area boundaries for left, right and bottom
//let active=0;
//let textareas=[]
let boundary = {};
boundary.fontsize=Number(document.getElementById('number').value);
boundary.color = "black";
//let height = 0;
// Initializing a new image and assigning it to a source
let img = new Image();


var loadFile = function(event) {
img.src = URL.createObjectURL(event.target.files[0]);
};


//    img.src = "./DSC.png"
// calculating the image width to height ratio to enable proper scaling of canvas dimensions irrespective of screen size 
var rat
// This function changes the content of the prompt heading that guides users on how to select boundaries 
function selector(p, prompts) {
    pos = p
    mark();
    document.getElementById("prompt").innerHTML = prompts[p];
}
// This function creates the canvas element and draws the image inside it. 

// This function returns the normalized coordinates of mouse clicks made on the canvas. These coordinates are used to mark the boundaries of the text
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    let width = document.getElementById('container').offsetWidth;
    let height = width / rat;
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    x = x / width;
    y = y / height;


    if (pos == 0) {
        if (boundary.right && x > boundary.right[0]) {
            prompt("left boundary must be to the left of right boundary")
        } else {
            boundary.left = [x, y];
            mark();
        }

        //localStorage.setItem("boundary", JSON.stringify(boundary));
    } if (pos == 1) {
        if (boundary.left && x < boundary.left[0]) {
            prompt("right boundary must be to the right of left boundary")
        } else {
            boundary.right = [x, y]
            mark();
        }

        //localStorage.setItem("boundary", JSON.stringify(boundary));
    } if (pos == 2) {
        boundary.bottom = [x, y];
        mark();
        // localStorage.setItem("boundary", JSON.stringify(boundary));
    }

}

function mark() {
    let canvascontainer = document.getElementById("canvas");
    let width = document.getElementById('container').offsetWidth;
    let height = width / rat
    canvascontainer.innerHTML = `<canvas id="my_canvas"width="${width}" height="${height}"></canvas>`
    let canvas = document.getElementById("my_canvas")
    height = canvas.height;
    canvas.addEventListener('click', function (event) {
        getCursorPosition(canvas, event)
    })
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (boundary.left) {
        ctx.beginPath();
        ctx.moveTo(boundary.left[0] * width, 0);
        ctx.lineTo(boundary.left[0] * width, canvas.height);
        ctx.stroke()
    } if (boundary.right) {
        ctx.beginPath();
        ctx.moveTo(boundary.right[0] * width, 0);
        ctx.lineTo(boundary.right[0] * width, canvas.height);
        ctx.stroke()
    }
    if (boundary.bottom && boundary.left && boundary.right) {
        ctx.beginPath();
        ctx.moveTo(boundary.left[0] * width, boundary.bottom[1] * height);
        ctx.lineTo(boundary.right[0] * width, boundary.bottom[1] * height);
        ctx.stroke()
    } if (boundary.bottom && boundary.left && !boundary.right) {
        ctx.beginPath();
        ctx.moveTo(boundary.left[0] * width, boundary.bottom[1] * height);
        ctx.lineTo(canvas.width, boundary.bottom[1] * height);
        ctx.stroke()
    } if (boundary.bottom && boundary.right && !boundary.left) {
        ctx.beginPath();
        ctx.moveTo(boundary.right[0] * width, boundary.bottom[1] * height);
        ctx.lineTo(0, boundary.bottom[1] * height);
        ctx.stroke()
    } if (boundary.bottom && !boundary.left && !boundary.right) {
        ctx.beginPath();
        ctx.moveTo(0, boundary.bottom[1] * height);
        ctx.lineTo(canvas.width, boundary.bottom[1] * height);
        ctx.stroke()
    }
    if (boundary.right && boundary.left && boundary.bottom) {
       let person = document.getElementById("preview-test").value
        let width = document.getElementById('container').offsetWidth;
        let center = (boundary.left[0] * width + boundary.right[0] * width) / 2
        boundary.fontsize=Number(document.getElementById('number').value)/canvas.height
        ctx.font = `${boundary.fontsize * canvas.height}px Verdana`;
        ctx.fillStyle = boundary.color;
        //ctx2.font = `${boundary.fontsize * canvas2.height}px Verdana`;
        //ctx2.fillStyle = boundary.color;
        ctx.textAlign = "center";
        //ctx2.textAlign = "center";
        ctx.fillText(person, center, boundary.bottom[1] * (width / rat));
    }
}

// This function enables the download of the certificate
function downloadfunc() {
    if (boundary.right && boundary.left && boundary.bottom) {
        const a = document.createElement("a");
        let canvas2 = document.getElementById("print");
        a.href = canvas2.toDataURL();
        a.download = "canvas-image.png";
        a.click();
        document.body.removeChild(a);
    } else {
        prompt("select all boundaries");
    }

}
// On start, the canvas is drawn, and the various event listeners for the boundary selectors are initializes
function start() {
    getBase64Image(img);
    rat = img.width / img.height;
    document.getElementById("upload-div").classList.toggle("hide");
    document.getElementById("container").classList.toggle("show");
    mark();
    let left_border = document.getElementById("left_border")
    let right_border = document.getElementById("right_border");
    let bottom = document.getElementById("bottom");
    let done = document.getElementById("done");
    done.addEventListener('click', function () {
        if (boundary.right && boundary.left && boundary.bottom) {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/boundary", false);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    url = JSON.parse(this.responseText).url
                    document.write(url);
                }
            };
            xhttp.send(JSON.stringify(boundary));
        }

    })

    left_border.addEventListener('click', function () {
        selector(0, prompts)
      
    })
    right_border.addEventListener('click', function () {
        selector(1, prompts)
       
    })
    bottom.addEventListener('click', function () {
        selector(2, prompts)
       
    })
    preview.addEventListener('click', function () {
        selector(3, prompts)
        person = document.getElementById("preview-test").value
        check();
    });

    document.getElementById("prompt").innerHTML = prompts[0];

}
img.onload = start;


// function for storing the certificate template
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

var dataURL = canvas.toDataURL("image/png");
boundary.src=dataURL;
}

function check() {
    if (boundary.right && boundary.left && boundary.bottom) {
        let width = document.getElementById('container').offsetWidth;
        let center = (boundary.left[0] * width + boundary.right[0] * width) / 2
        document.getElementById("canvas").innerHTML = `<canvas id="my_canvas"width="${width}" height="${width / rat}"></canvas>`
        let canvas = document.getElementById("my_canvas");
        let ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // would later add dynamic font change
        //let font = (30 * width) / 1264;
        ctx.font = `${boundary.fontsize * canvas.height}px Verdana`;
        ctx.fillStyle = boundary.color;
        ctx.textAlign = "center";
        ctx.fillText(person, center, boundary.bottom[1] * (width / rat));

    }
}