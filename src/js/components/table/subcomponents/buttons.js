import Rows from './rows.js'

function hideButton(className){
    return function() {
        var buttons = document.getElementsByClassName(className);
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'none';
        }
    }
}

function showButton(className){
    return function() {
        var buttons = document.getElementsByClassName(className);
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].style.display = 'inline';
        }
    }
}

function updateButtonText(className, text){
    document.querySelector(`.${className}`).textContent = text;
}

function handleRowEdit(actionOnClick, updateCallback = null){
    // attach an event listener to each edit button in every row
    var editButtons = document.getElementsByClassName('btn-edit');
    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', async function(event) {
            // Determine what was clicked on within the table
            var rowToEdit = event.target.closest('tr');
            // mark row as being edited
            rowToEdit.classList.add('active-editing');
            
            // turn relevant entries into textboxes, usually
            actionOnClick();

            // hide edit buttons
            Edit.hide();
            if(updateCallback){
                initializeConfirmButton(updateCallback);
            }
        });
    };
}

function initializeConfirmButton(updateCallback){
    // get element and add listener for click
    var rowToEdit = document.querySelector('.active-editing');
    const confirm_btn = rowToEdit.querySelector(".btn-confirm");

    // Remove existing click event listener to prevent multiple-event additions
    confirm_btn.replaceWith(confirm_btn.cloneNode(true));
    const new_confirm_btn = rowToEdit.querySelector(".btn-confirm");

    // show the row's confirm button
    new_confirm_btn.style.display = 'block';
    new_confirm_btn.addEventListener('click', function(){;
        // save row edits
        Rows.saveEdits(rowToEdit);
        // update values in sidebar
        updateCallback();
        // make row no longer green
        rowToEdit.classList.remove('active-editing');
        // show edit buttons and hide confirm buttons
        Edit.show();
        Confirm.hide();
    });
}

const Edit = {
    html(text = 'Edit row'){ return `<button class="btn btn-edit">${text}</button>`},
    hide: hideButton('btn-edit'),
    show: showButton('btn-edit'),
    init : function(actionOnClick, updateCallback){
        handleRowEdit(actionOnClick, updateCallback)
    }
};

const Confirm = {
    html() {return `<button class="btn btn-confirm">Confirm</button>`},
    hide: hideButton('btn-confirm'),
    show: showButton('btn-confirm')
};

const AddRow = {
    hide: hideButton('btn-add'),
    show: showButton('btn-add'),
    updateText: function(text){
        updateButtonText('btn-add', text);
    }
};

export const Buttons = {
    Edit : Edit,
    Confirm : Confirm,
    AddRow : AddRow,
    edit_confirm_btns : Edit.html() + Confirm.html() ,
}

export default Buttons;