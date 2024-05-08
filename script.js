const addBox = document.querySelector(".add-box");
const popupContainer = document.querySelector(".popup-container");
const closeIcon = document.querySelector("header i");
const addBtn = document.querySelector(".content button");
const title = document.querySelector("input");
const description = document.querySelector("textarea");
const titleNote = document.querySelector("header p")

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click",() => {
    title.focus();
    popupContainer.classList.add("show");
})

closeIcon.addEventListener("click",() => {
    isUpdate = false;
    title.value = "";
    description.value = "";
    addBtn.innerText = "Add Note";
    titleNote.innerText = "Add a new Note";
    popupContainer.classList.remove("show");
})

function showNotes(){
    notes.forEach((note,index) => {
        let liTag = `
            <li class="note">
            <div class="main">
                <p>${note.title}</p>
                <span>${note.description}</span>
            </div>
            <div class="footer">
                <span>${note.date}</span>
                <div class="settings">
                    <i onClick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="menu">
                        <li onClick="updateNote(${index},'${note.title}','${note.description}')"><i class="fa-regular fa-pen-to-square"></i>Edit</li>
                        <li onClick="deleteNote(${index})"><i class="fa-regular fa-trash-can"></i>Delete</li>
                    </ul>
                </div>
            </div>
        </li>`
        addBox.insertAdjacentHTML("afterend",liTag)
    })
}

function showMenu(elem){
    elem.parentElement.classList.add("show");
    document.addEventListener("click",e => {
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show");
        }
    })
}

function deleteNote(noteIndex){
    let confirmDelete = confirm("Do you really want to delete this note?");
    if(!confirmDelete) return;
    
    notes.splice(noteIndex,1);

    localStorage.setItem("notes",JSON.stringify(notes));
    showNotes();
}

function updateNote(noteIndex,tit,desc){
    isUpdate = true;
    updateId = noteIndex;
    addBox.click();
    title.value = tit;
    description.value = desc;
    addBtn.innerText = "Update Note";
    titleNote.innerText = "Update a Note";
}

addBtn.addEventListener("click",e => {
    e.preventDefault();
    let noteTitle = title.value;
    noteDescription = description.value;

    if(noteTitle || noteDescription){
        let dateObj = new Date();
        month = months[dateObj.getMonth()];
        day = dateObj.getDay();
        year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle,
            description: noteDescription,
            date: `${month} ${day} ${year}`
        }
        if(!isUpdate){
            notes.push(noteInfo)
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
       
        closeIcon.click();
        showNotes();
    }

})