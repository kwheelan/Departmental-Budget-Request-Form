
import Prompt from '../../components/prompt/prompt.js'
import Body from '../../components/body/body.js';
import NavButtons from '../../components/nav_buttons/nav_buttons.js';
import Subtitle from '../../components/header/header.js';
import Sidebar from '../../components/sidebar/sidebar.js';
import Table from '../../components/table/table.js';
import { Services } from '../../utils/data_utils/budget_data_handlers.js';
import { OT_FRINGE } from '../../init.js';

export function preparePageView(){
    // prepare page view
    Body.reset();
    NavButtons.show();
    Sidebar.show();

    // enable next button
    NavButtons.Next.enable();

    // update page text
    Subtitle.update('Overtime Estimates');

    // activate table
    initializeOTTable();
    Prompt.Text.update(`Please see your baseline overtime / holiday pay / shift premiums in the table below.
        Make any edits and continue.`);
}

function assignClasses() {
    // record columns and their classes
    const OT_cols = [
        { title: 'Account String', className: 'string' },
        { title: `Cost Center Name`, className: 'cc' },
        { title: 'Service', className: 'service' },
        { title: 'Recurring or One-Time', className: 'recurring'},
        { title: 'Hourly Employee Overtime (Wages)', className: 'OT-wages', isCost: true },
        { title: 'Salaried Employee Overtime (Salary)', className: 'OT-salary', isCost: true },
        { title: 'Total Cost (including benefits)', className : 'total', isCost: true},
        { title: 'Edit', className: 'edit'}
    ];

    // assign cost classes
    Table.Columns.assignClasses(OT_cols)
}

function OTRowOnEdit(){
    Table.Cell.createTextbox('OT-wages', true);
    Table.Cell.createTextbox('OT-salary', true);
    Table.Cell.createServiceDropdown(Services.list());
}

export async function initializeOTTable(){
    // load table data from local storage
    if(await Table.Data.load()) {
        //after table is loaded, fill it
        Table.show();
        Table.Columns.addAtEnd( '0', 'Hourly Employee Overtime (Wages)');
        Table.Columns.addAtEnd( '0', 'Salaried Employee Overtime (Salary)');
        // Table.Columns.addAtEnd( '0', 'Total Cost (including benefits)');
        Table.Columns.addAtEnd(Table.Buttons.edit_confirm_btns, 'Edit');;
        assignClasses();
        // add up the baseline costs and update sidebar
        updateDisplayandTotals();
        // activate edit buttons
        Table.Buttons.Edit.init(OTRowOnEdit, updateDisplayandTotals);
    } else {
        Prompt.Text.update('No overtime expenditures for this fund.')
    }
}

function calculateTotalCost(wages, salary, fringe){
    return (wages + salary) * (1 + fringe) ;
}

// update sidebar and also cost totals when the FTEs are edited
function updateDisplayandTotals(){
    // calculate for each row
    let rows = document.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++){
        // fetch values for calculations
        let OT_salary = Table.Cell.getValue(rows[i], 'OT-salary');
        let OT_wages = Table.Cell.getValue(rows[i], 'OT-wages');

        // add salary and wages and fringe benefits (FICA)
        let row_total = calculateTotalCost(OT_salary, OT_wages, OT_FRINGE);

        // update total
        Table.Cell.updateValue(rows[i], 'total', row_total);

        //save data
        Table.save();
    }
}