//declare TodoList Arr
let todoarr=[];
var inputField = document.getElementById("todo-input");
var myul = document.getElementById("myList");
var clear = document.querySelector(".icon-refresh");
var mydate = document.getElementById("mydate");

//classes 
const CHECK_CIRCLE="fa-check-circle";
const UNCHECK_CIRCLE="fa-circle-thin";
const LINE_THROUGH="linethrough";


//Assig Today Date
let today = new Date();
var DateValue = today.toLocaleString("en-us",{weekday:"long",month:"short",day:"numeric"})
mydate.innerHTML=DateValue;

//getting data from local storage and load 
const data = JSON.parse(localStorage.getItem("TODO"));
if(data) {
    todoarr= data;
    loadList(todoarr);
} else {
    todoarr =[]
}
 
//populate data
function loadList(todoarr) {
    todoarr.forEach(element => {
        addTodo(element.name,element.id,element.done,element.trash)
    });
}

//clear Local Storage
clear.addEventListener("click",function () {
    localStorage.clear();
    location.reload();
})

//function for adding Todo
function addTodo(todo, id, done, trash) {
    if(trash){
       return false
    }
    const DONE = done ? CHECK_CIRCLE : UNCHECK_CIRCLE;
    const LINE = done ? LINE_THROUGH :"";
    const item =`
                <li>
                <i class="fa ${DONE}" aria-hidden="true" job="complete" tid=${id} ></i>
                <span class="text ${LINE}">${todo}</span>
                <i class="fa fa-pencil-square-o" aria-hidden="true" id="icon-edit" job="edit" tid=${id}></i> 
                <i class="fa fa-trash-o" aria-hidden="true" id="icon-delete" job="remove" tid=${id} ></i>
                </li>
                `;
    const position="beforeEnd";
    myul.insertAdjacentHTML(position,item)
    }

//Update Todo
function updateTODO(todoValue,todoid) {
    const updatedTodoArr = todoarr.map(item=>{
        if(item.id === parseInt(todoid)){
            
            return {id:item.id, name: todoValue,done:item.done, trash: item.trash};
        }
        return item
    })
    setLocalStorage(updatedTodoArr);
    
}

//Set data into Local Storage
function setLocalStorage(array) {
    localStorage.setItem("TODO",JSON.stringify(array));
    location.reload();
}
    
//get Value from input field 
document.onkeyup=function(event){
    if(event.keyCode===13){
        
        const todoValue=inputField.value;
        if(todoValue){
            if(inputField.getAttribute("mode")){
                var todoid = inputField.getAttribute("tid");
                updateTODO(todoValue,todoid)
            } else {
                addTodo(todoValue,todoarr.length,false,false);
                todoarr.push({id:todoarr.length, name: todoValue,done : false, trash : false});
                setLocalStorage(todoarr);
            }
        }
        inputField.value="";       
    }
}

//Complete Todo
function completeTodo(element){
    element.classList.toggle(CHECK_CIRCLE);
    element.classList.toggle(UNCHECK_CIRCLE);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    const Tid =element.attributes.tid.value;
    todoarr[Tid].done= !todoarr[Tid].done;

}

//remove TODO
function removeTodo(element){
    const Tid =element.attributes.tid.value;
    element.parentNode.parentNode.removeChild(element.parentNode);
    todoarr[Tid].trash=true;
}

//Edit TODO
function  editTodo(element) {
    const Tid =element.attributes.tid.value;
     todoarr.filter(item=>{
          if(item.id === parseInt(Tid)){
              inputField.value=item.name;
              inputField.setAttribute("mode","edit");
              inputField.setAttribute("Tid",`${Tid}`);
        }
    })
}


// target element
myul.addEventListener("click",function(e){
    const element = e.target;
    const elementJob =  element.attributes.job.value;

    if(elementJob === "complete") {
        completeTodo(element);
    } else if(elementJob === "remove") {
        removeTodo(element);
    } else if( elementJob === "edit") {
        editTodo(element);
    }
    
})



