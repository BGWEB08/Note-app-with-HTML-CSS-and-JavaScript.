document.addEventListener("DOMContentLoaded", function () {
    const addBox = document.createElement("li");
    addBox.classList.add("add-box");
    addBox.innerHTML = `
        <div class="icon"><i class="fa-solid fa-plus"></i></div>
        <p>Add new note</p>
    `;
    document.querySelector(".container").appendChild(addBox);

    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");
    popupContainer.innerHTML = `
        <div class="popup">
            <div class="content">
                <header>
                    <p>Add a new note</p>
                    <i class="fa-solid fa-xmark"></i>
                </header>
                <form action="#">
                    <div class="row title">
                        <label>Title</label>
                        <input type="text">
                    </div>
                    <div class="row description">
                        <label>Description</label>
                        <textarea></textarea>
                    </div>
                    <button>Add Note</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(popupContainer);

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
        container.innerHTML = ""; // Önceki notları temizle
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
        let confirmDelete = confirm("Bu notu gerçekten silmek istiyor musunuz?");
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
        popupContainer.classList.add("show"); // Düzenleme formunu açmak için pop-up'u göster
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

    showNotes(); // Sayfa yüklendiğinde notları göster
});
