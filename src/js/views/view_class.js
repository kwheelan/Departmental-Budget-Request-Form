import Prompt from "../components/prompt/prompt.js";
import Sidebar from "../components/sidebar/sidebar.js";
import NavButtons from "../components/nav_buttons/nav_buttons.js";
import Body from "../components/body/body.js";
import { Subtitle, Title } from "../components/header/header.js";
import Table from "../components/table/table.js";
import Form from "../components/form/form.js";
import Modal from "../components/modal/modal.js";

import { CurrentPage, AccountString } from '../models/'


export class View {

    constructor() {
        // page state in local storage
        this.page_state = '';

        // whether to display
        this.navButtons = true; 
        this.sidebar = true;

        // text to show in the prompt area
        this.prompt = null;

        // subtitle text
        this.subtitle = '';

        // table object of class ViewTable or null
        this.table = null;
    }

    visit() {
        // update page state
        CurrentPage.update(this.page_state);

        // start with a blank page
        Body.reset();

        // add default title
        Title.default();
        
        // default to showing navbuttons
        if (this.navButtons) { NavButtons.show(); };
        
        // default to showing sidebar
        if (this.sidebar) { Sidebar.show() };

        // initialize prompt text and buttons
        if (this.prompt) { Prompt.Text.update(this.prompt) };
        
        // initialize table
        if (this.table) { this.table.build(); }

        // show page subtitle
        if (this.subtitle) { Subtitle.update(this.subtitle) };
    }

    cleanup() { return; }

}

export class ViewTable {

    constructor(){
        // Ensure methods retain the correct `this` context
        this.submitNewRow = this.submitNewRow.bind(this);

        this.columns = [
            { title: 'Account String', className: 'account-string' },
            { title: 'Appropriation Name', className: 'approp-name', hide: true },
            { title: 'Appropriation', className: 'approp', hide: true },
            { title: 'Cost Center Name', className: 'cc-name',  hide: true },
            { title: 'Cost Center', className: 'cc',  hide: true },
            { title: 'Fund Name', className: 'fund-name',  hide: true },
            { title: 'Fund', className: 'fund',  hide: true },
            { title: 'Edit', className: 'edit' },
        ];
        
        // whether to add an edit column
        this.addEdit = true ;

        // message to show if there's no saved data
        this.noDataMessage = null;
   
        // text to show for new row button
        this.addButtonText = null ;

        // whether to show as a datatable
        this.dataTable = true;
    }

    async refreshData() {
        // create a datatable object
        if(this.dataTable){this.initDataTable()}

        // add an edit column if needed
        if (this.addEdit) { 
            Table.Columns.addAtEnd(Table.Buttons.edit_confirm_btns, 'Edit'); 
            // activate edit buttons
            Table.Buttons.Edit.init(this.actionOnEdit, this.updateTable);
        }
        
        // assign the correct classes based on the table columns
        Table.Columns.assignClasses(this.columns);

        // Apply any update function to make sure sidebar is up to date
        this.updateTable();
        // add any newly created cc or approp to the filters
        this.updateFilters();

    }

    async build() {
        // build table from local storage and initialize edit buttons

        // add the add new row button if needed
        if (this.addButtonText) { 
            this.setUpForm();
        }

        // check for data
        if(await Table.Data.load()) {  
            // if there's data, update the table and add filters    
            await this.refreshData();
            this.addFilters();
        } else {
            // show a message if there's no saved table data for the selected fund
            if (this.noDataMessage) {
                Prompt.Text.update(this.noDataMessage);
            }
        }
    }

    addFilters() {
        // Add all relevant filters to table
        Table.Filter.add('Appropriation', 'approp-name');
        Table.Filter.add('Cost Center', 'cc-name');
        if (this.columns.some(column => column.className === 'object-name')){
            Table.Filter.add('Object', 'object-name');
        };
        if (this.columns.some(column => column.className === 'object-category')){
            Table.Filter.add('Object Category', 'object-category');
        }
    }

    updateFilters() {
        // update filters with any new values
        Table.Filter.updateOptions('approp-name');
        Table.Filter.updateOptions('cc-name');
        if (this.columns.some(column => column.className === 'object-name')){
            Table.Filter.updateOptions('object-name');
        };
        if (this.columns.some(column => column.className === 'object-category')){
            Table.Filter.updateOptions('object-category');
        }
    }

    initDataTable() {
        Table.adjustWidth('100%');
        // Initialize Datatables
        if ( !$.fn.dataTable.isDataTable('#main-table') ) {
            $('#main-table').DataTable({
                paging: false, // Disable pagination
                info: false, // Disable table information display
                searching: false // Disable the search bar
            });
        };
    }

    // placeholder for action on row edit click
    actionOnEdit() { return }

    // update function for the sidebar; default to just saving the table
    updateTable() { Table.save() }

    // extra questions of the form to add a new row
    addCustomQuestions() { return };

    // extra questions of the form to add a new row
    addModalValidation() { 
        // Add option to type in new appropriation
        const appropriationInput = document.getElementById('approp-name');
        appropriationInput.addEventListener('change', function() {
            if (appropriationInput.value == 'Add new'){
                // Add a new field after appropriation
                Form.NewField.shortText('Type new appropriation code:', 'approp', true);
                let newAppropInput = document.getElementById('approp');
                appropriationInput.parentElement.insertAdjacentElement('afterend', newAppropInput.parentElement);

                // add an event listener for validation on appropriation code
                newAppropInput.addEventListener('blur', function() {
                    // grab error text id
                    let validationText = document.getElementById('approp-validation');
                    // clear error and then add any newly relevant ones
                    validationText.textContent = '';
                    if (newAppropInput.value.length != 5){
                        validationText.textContent = 'Appropriation codes must be exactly 5 numbers.';
                    } else if (isNaN(Number(newAppropInput.value))){
                        validationText.textContent = 'Appropriation codes must be numeric.';
                    }
                })
            } else {
                // if 'add new' is not selected, delete the new prompt
                let newAppropInput = document.getElementById('approp');
                if (newAppropInput){
                    newAppropInput.parentElement.innerHTML = '';
                }
            }
        });

        // Add option to type in new cost center
        const cCInput = document.getElementById('cc-name');
        cCInput.addEventListener('change', function() {
            if (cCInput.value == 'Add new'){
                // Add a new field after appropriation
                Form.NewField.shortText('Type new cost center code:', 'cc', true);
                let newCCInput = document.getElementById('cc');
                cCInput.parentElement.insertAdjacentElement('afterend', newCCInput.parentElement);

                // add an event listener for validation on appropriation code
                newCCInput.addEventListener('blur', function() {
                    // grab error text id
                    let validationText = document.getElementById('cc-validation');
                    // clear error and then add any newly relevant ones
                    validationText.textContent = '';
                    if (newCCInput.value.length != 6){
                        validationText.textContent = 'Cost center codes must be exactly 6 numbers.';
                    } else if (isNaN(Number(newCCInput.value))){
                        validationText.textContent = 'Cost center codes must be numeric.';
                    }
                })
            } else {
                // if 'add new' is not selected, delete the new prompt
                let newCCInput = document.getElementById('cc');
                if (newCCInput){
                    newCCInput.parentElement.innerHTML = '';
                }
            }
        })
    }

    setUpForm() {
        // show add button
        Table.Buttons.AddRow.show();
        Table.Buttons.AddRow.updateText(this.addButtonText);

        // set up modal for form when add button is pressed
        Modal.clear();
        Modal.Link.add('add-btn');
        Modal.Title.update(this.addButtonText);

        // create form
        Form.new('modal-body');

        // add custom questions
        this.addCustomQuestions();
        // any validation or special functions
        this.addModalValidation();
        // add submit button
        Form.SubmitButton.add();

        // Initialize form submission to table data
        Modal.Submit.init(this.submitNewRow);
    }

    editColumns(responses) { 
        // if a new appropriation was entered, fix it
        if (responses['approp']){
            responses['approp-name'] = `${responses['approp']} - New`;
        };
        // same for cost center
        if (responses['cc']){
            responses['cc-name'] = `${responses['cc']} - New`;
        };

        // get numbers from account string names
        if(responses['fund-name']){
            responses['fund'] = AccountString.getNumber(responses['fund-name']);
        };
        if(responses['approp-name']){
            responses['approp'] = AccountString.getNumber(responses['approp-name']);
        };
        if(responses['cc-name']){
            responses['cc'] = AccountString.getNumber(responses['cc-name']);
        };
        if(responses['object-name']){
            responses['object'] = AccountString.getNumber(responses['object-name']);
        };
        responses['account-string'] = 
            AccountString.build(responses['approp-name'], 
                                responses['cc-name'], 
                                responses['object-name'], 
                                responses['fund']);
        return responses;
    }

    submitNewRow(event) {
        // get answers from form, hide form, show answers in table
        var responses = Form.fetchAllResponses(event);
        
        // edit inputs from modal
        responses = this.editColumns(responses);
        
        // make sure it's not an empty response
        if (Object.values(responses)[0] != ''){

            // change page view
            Modal.hide();
            
            // add data to table
            Table.Rows.add(responses, this.columns);
            Table.save();
            
            // rebuild table
            this.refreshData();
        }
    }

}