//creating the grid array
let container2 = document.getElementById('container2');
let container3 = document.getElementById('container3');

started = 0;
s = 0
obstacle = 0;
let ele = new Array(1000);//stores the id's(number) of each box in the grid
let blocks = []// stores the bloked box numbers

//setting the grid pattern for the area
for (let i = 0; i < 25; i++) {

    for (let j = 0; j < 40; j++) {
        ele[i * 40 + j] = document.createElement('button');
        ele[i * 40 + j].classList.add('box');
        ele[i * 40 + j].id = i * 40 + j;

        container2.appendChild(ele[i * 40 + j]);
        ele[i * 40 + j].style.gridColumn = j / (j + 1);
        ele[i * 40 + j].style.gridRow = i / (i + 1);

    }
}

//creating variables for start and end points
let start = document.createElement('div');
let end = document.createElement('div');

start.innerHTML = 'S';
end.innerHTML = 'E';
start.setAttribute('draggable', 'true')//to give permitions for start and end divs to be draged
end.setAttribute('draggable', 'true');

//appending them to some intial positions
ele[0].appendChild(start);
ele[460].appendChild(end);

//setting id and class for botj start and end elements
start.id = 'start';
end.id = 'end';
start.classList.add('dragBox');
end.classList.add('dragBox');

//setting variables for drag operations
let dragBoxes = document.querySelectorAll('.dragBox');
let boxes = document.querySelectorAll('.box');

//selects each box(start and end) that can be draged
dragBoxes.forEach(dragbox => {
    dragbox.addEventListener('dragstart', () => {
        dragbox.classList.add('dragging');//adding a class name to the draged element so that it can be used for further operations
    })

    dragbox.addEventListener('dragend', () => {
        dragbox.classList.remove('dragging');//removind the class name that we creadtwd above after it as been droped
    })
})

// selects each box from the grid mainly to peform append operations when the dragbox is droped
boxes.forEach(box => {
    box.addEventListener('dragover', (e) => {//troggered when any element elemnt draged over it
        e.preventDefault();//to prevent the default behavier(to allow the draged box to enter in to the element)
    })

    box.addEventListener('drop', (e) => {//triggerd when any drop is done
        let draged = document.querySelector('.dragging');
        box.appendChild(draged);//appended the element into the box where the dragging box is dropes
    })

})


//funtion to ceheck for the presence of a number in the list
function isIn(n, v) {
    let j = 0

    while (j < v.length) {
        if (v[j] == n) {
            return false
        }
        j += 1;
    }

    if (j == v.length) {
        return true
    }
}

//async sleep used to make code stop working for 10 milkliseconds so that we can easily visualize the tracing of the algorithm
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//function for finding the path throegh BFS
async function bfs(st, ed) {
    startX = Math.floor(st / 40);
    startY = st % 40;

    goalX = Math.floor(ed / 40);
    goalY = ed % 40;

    console.log(goalX, goalY);
    let path = []
    //directions options for every element move
    let dr = [-1, 1, 0, 0];
    let dc = [0, 0, -1, 1];
    //queues that stores both x and y coordinates for the BFS queue
    let qr = [startX];
    let qc = [startY];
    //array that stores thevisited elements number
    let visited = [startX * 40 + startY];

    let flag = 1;



    while (((qr.length) > 0) && (flag > 0))//loop till queue is empty and the element is found
    {
        await sleep(10);
        // storing the cordinates of the fist element in the queue
        let x = qr[0];
        let y = qc[0];

        // these loop gives the directions for the present element to move towords its neighbors
        for (let i = 0; i < 4; i++) {

            a = x + dr[i]
            b = y + dc[i]

            //boundry conditions for the element movement
            if ((a < 0) || (a >= 25)) {
                continue;
            }
            if ((b < 0) || (b >= 40)) {
                continue;
            }

            //checking for the goal
            if (a == goalX && b == goalY) {
                flag = 0;
               
                visited.push(a * 40 + b);
                path[(a * 40 + b)] = x * 40 + y;
                continue;
                //ele[a * 40 + b].style.backgroundColor = "Green";
            }


            //checking for the solid boxes
            if (!(isIn(a * 40 + b, blocks))) {
                continue;
            }



            if (isIn(a * 40 + b, visited)) {

                //console.log(a*25 + b);

                //if it is not visited allready then push that coordinates to the queue
                qr.push(a);
                qc.push(b);
                visited.push(a * 40 + b);

                ele[a * 40 + b].style.backgroundColor = "yellow";
                path[(a * 40 + b)] = x * 40 + y;

            }


        }

        qr.shift();
        qc.shift();

    }

    //printing the path 
    if (flag == 0) {
        let finalPath = [goalX * 40 + goalY]//appending the goal first and then backtracking towords the start by following the parent who called it

        let l = 0

        while (finalPath[l] != startX * 40 + startY) {//back teracking to get the path
            finalPath.push(path[finalPath[l]])
            l += 1
        }
        // finally printing(printing in the sense making the path green) the path 
        for (let i = 0; i <= l; i++) {
            ele[finalPath[i]].style.backgroundColor = "green";
        }


        length = document.createElement('div');
        length.id = 'length';
        length.innerHTML = '<p>length<p><p>' + l + '<p>';

        container3.appendChild(length);
    }
    else {
        length = document.createElement('div');
        length.id = 'length';
        length.innerHTML = '<p>Path not found<p>';
        length.style.backgroundColor = "rgba(255, 0, 0, 0.692)";
        container3.appendChild(length);
    }




    return flag;
}


//function for blocking the boxes

function startObstacleCreation() {
    //setting for creating blocks
    b = document.getElementById('b2');
    if (obstacle == 0) {
        container2.setAttribute('onmousedown', 'activateBlockMarking()');
        container2.setAttribute('onmouseup', 'deactivateBlockMarking()');
        obstacle = 1;
        b.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
        b.innerHTML = 'Stop Creation';

    }
    else {
        container2.removeAttribute('onmousedown', 'activateBlockMarking()');
        container2.removeAttribute('onmouseup', 'deactivateBlockMarking()');
        obstacle = 0;
        b.style.backgroundColor = "rgba(251, 255, 0, 0.527)";
        b.innerHTML = 'Create Obstacles';
    }

}


function activateBlockMarking() {
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 40; j++) {
            ele[i * 40 + j].setAttribute('onmouseover', 'blocked(' + (i * 40 + j) + ')');
        }
    }
}

function deactivateBlockMarking() {
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 40; j++) {
            ele[i * 40 + j].removeAttribute('onmouseover');
        }
    }
}

function blocked(a) {

    if (!(isIn(a, blocks))) {
        ele[a].style.backgroundColor = "antiquewhite";
        idx = blocks.indexOf(a);
        blocks.splice(idx, 1);
    }
    else {
        ele[a].style.backgroundColor = "black";
        blocks.push(a);
    }

}

function clearboard() {
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 40; j++) {

            ele[i * 40 + j].style.backgroundColor = 'antiquewhite';


        }
    }
    if (started == 0) {
        started = 1;
    }
    else {
        container3.removeChild(length);
        started = 0;
    }
}


function startfinding() {
    //setting to white boxes without disturbing the white boxes
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 40; j++) {
            if (isIn((i * 40 + j), blocks)) {
                ele[i * 40 + j].style.backgroundColor = 'antiquewhite';
            }

        }
    }

    if (started == 0) {
        started = 1;
    }
    else {
        container3.removeChild(length);
    }


    if(1){
        bfs(start.parentNode.id, end.parentNode.id)
    }
    
    
}


