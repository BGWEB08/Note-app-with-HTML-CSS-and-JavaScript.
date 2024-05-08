// script.js
document.addEventListener("DOMContentLoaded", function () {
    const addBox = document.querySelector(".add-box");
    const popupContainer = document.querySelector(".popup-container");
    const closeIcon = document.querySelector(".popup i.fa-xmark");
    const addBtn = document.querySelector(".popup button");
    const title = document.querySelector(".popup input");
    const description = document.querySelector(".popup textarea");

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    let isUpdate = false, updateId;

    addBox.addEventListener("click", () => {
        title.focus();
        popupContainer.classList.add("show");
    });

    closeIcon.addEventListener("click", () => {
        isUpdate = false;
        title.value = "";
        description.value = "";
        addBtn.innerText = "Add Note";
        popupContainer.classList.remove("show");
    });

    function showNotes(){
        const container = document.querySelector(".container");
        container.innerHTML = ""; // Clear previous notes
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
                </li>`;
            container.insertAdjacentHTML("beforeend", liTag);
        });
    }

    function showMenu(elem){
        elem.parentElement.classList.add("show");
        document.addEventListener("click",e => {
            if(e.target.tagName != "I" || e.target != elem){
                elem.parentElement.classList.remove("show");
            }
        });
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
        title.value = tit;
        description.value = desc;
        addBtn.innerText = "Update Note";
        popupContainer.classList.add("show"); // Show the popup to edit
    }

    addBtn.addEventListener("click",e => {
        e.preventDefault();
        let noteTitle = title.value;
        let noteDescription = description.value;

        if(noteTitle || noteDescription){
            let dateObj = new Date();
            let month = months[dateObj.getMonth()];
            let day = dateObj.getDate();
            let year = dateObj.getFullYear();

            let noteInfo = {
                title: noteTitle,
                description: noteDescription,
                date: `${month} ${day} ${year}`
            };
            if(!isUpdate){
                notes.push(noteInfo);
            } else {
                isUpdate = false;
                notes[updateId] = noteInfo;
            }
            
            localStorage.setItem("notes",JSON.stringify(notes));
            closeIcon.click();
            showNotes();
        }
    });

    showNotes(); // Show notes when the page loads
});
