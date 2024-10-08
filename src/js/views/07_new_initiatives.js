
import { View, ViewTable } from './view_class.js'
import Table from "../components/table/table.js";
import Form from "../components/form/form.js";
import FundLookupTable from '../models/fund_lookup_table.js';
import { FISCAL_YEAR } from '../constants/';
import AccountString from '../models/account_string.js';
import NavButtons from '../components/nav_buttons/nav_buttons.js';


const dropdownOptions = ['N/A', 'One-Time', 'Recurring']

// set up page and initialize all buttons
export class InitiativesView extends View {

    constructor() {
        super();
        this.page_state = 'new-inits';
        this.prompt = `
            This is the place to propose new initiatives for FY${FISCAL_YEAR}.
            New initiative submissions will count as supplemental line items and will be the starting 
            point for a conversation with both OB and ODFS, who will help with the details.`;
        this.subtitle = 'New Initiatives';
        this.table = new InitiativesTable();
    }

    visit() {
        // remove fund selection
        localStorage.setItem("fund", '');
        super.visit();

        // hide back button to avoid confusion
        NavButtons.Last.hide();
    }

}

class InitiativesTable extends ViewTable {

    constructor() {
        super();

        // add additional columns to the table
        this.columns = [
            { title: 'Fund', className: 'fund'},
            { title: 'Supplemental Initiative', className: 'init-name' },
            { title: 'Total Initiative Request', className: 'total', isCost: true },
            // { title: 'Personnel FTE', className: 'ftes'},
            { title: 'Personnel Salary & Benefits', className: 'personnel', isCost: true },
            { title: 'Non-Personnel Operating', className: 'nonpersonnel', isCost: true },
            { title: 'Non-Personnel Capital', className: 'nonpersonnel-capital', isCost: true },
            { title: 'Description & Justification', className: 'notes' },
            { title: 'Recurring or One-Time', className: 'rev-type'},
            { title: 'Edit', className: 'edit' }
        ];

        this.addButtonText = 'Add new initiative' ;
        
    }

    addCustomQuestions(){

        // general questions
        Form.NewField.shortText('Initiative Name:', 'init-name', true); 
        Form.NewField.longText('What is the business case for the Initiative?', 'q1', true);
        Form.NewField.longText(`Why is the initiative needed? What is the value-add to residents? 
            What is the Department’s plan for implementing the Initiative?`, 'q2', true);
        Form.NewField.longText(`Why can’t the Initiative be funded with the Department’s baseline budget?`, 'q3', true);

        Form.NewField.dropdown(`Is this initiative one-time or recurring?`, 
            'rev-type', dropdownOptions);

        // Account string info
        Form.NewField.dropdown('Fund:', 'fund-name', FundLookupTable.listFundNames('Add new'), true);

        // Numbers
        Form.NewField.numericInput('What is your ballpark estimate of TOTAL ADDITONAL expenditures associated with this initiative?', 
            'total', true);
        Form.NewField.numericInput('Estimate of ADDITONAL personnel cost?', 'personnel', false);
        Form.NewField.numericInput('Estimate of ADDITONAL nonpersonnel operating cost?', 'nonpersonnel', false);
        Form.NewField.numericInput('Estimate of ADDITONAL nonpersonnel capital costs?', 'nonpersonnel-capital', false);
    }

    editColumns(responses) {
        responses['fund'] = AccountString.getNumber(responses['fund-name']);
        responses['notes'] = `${responses['q1']} ${responses['q2']} ${responses['q3']}`;
        return responses;
    }

    addModalValidation() { 
        super.addValidationListener('fund-name', 'Fund', 'fund-validation', 4);
    }

    // action on row edit click: make cells editable
    actionOnEdit() { 
        Table.Cell.createTextbox('total', true);
        // Table.Cell.createTextbox('revenue', true);
        Table.Cell.createTextbox('personnel', true);
        Table.Cell.createTextbox('nonpersonnel', true);
        Table.Cell.createTextbox('nonpersonnel-capital', true);
        Table.Cell.createTextbox('init-name');
        Table.Cell.createDropdown('rev-type', dropdownOptions);
        Table.Cell.createTextbox('notes', false, 'textarea');
    }

}

export default InitiativesView;