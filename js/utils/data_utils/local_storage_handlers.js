import { FISCAL_YEAR } from "../../init.js";
import Sidebar from "../../components/sidebar/sidebar.js";

// save page state
export function updatePageState(page){
    localStorage.setItem('page_state', page);
}

// load page state
export function loadPageState(page){
    const pageState = localStorage.getItem('page_state');
    return pageState !== null ? pageState : 'welcome';
}

// TODO: move fund state management here
export function updateFundState(fund){
    localStorage.setItem('fund', fund);
}

export function loadFundState(){
    return localStorage.getItem("fund");
}

export function saveTableData() {
    var table = document.getElementById('main-table');
    var save_as = `${loadPageState()}_${loadFundState()}`;
    var rows = table.rows;
    var tableData = [];
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].cells;
        var rowData = [];
        for (var j = 0; j < cols.length; j++) {
            // if a formatted cost, save the underlying value instead
            if (cols[j].classList.contains('cost')) {
                rowData.push(cols[j].getAttribute('value'));
            } else {
                rowData.push(cols[j].innerText);
            }
        }
        tableData.push(rowData);
    }
    // Save JSON string to localStorage
    localStorage.setItem(save_as, JSON.stringify(tableData));
    Sidebar.updateTotals();
}

export function loadTableData(name){
    return JSON.parse(localStorage.getItem(name));
}

// Class to hold information on a specific fund and table
class StoredTable {
    constructor(page, fund){
        this.name = `${page}_${fund}`;
        this.page = page;
        this.table = loadTableData(this.name);
    }

    totalCol() {
        switch(this.page){
            case 'personnel':
                return 'Total Cost';
            case 'OT':
                return 'Total Cost (including benefits)';
            case 'nonpersonnel':
                return `FY${FISCAL_YEAR} Request`;
            case 'revenue':
                break;
            default:
                break;
        }
    }

    getSum() {
        // fill with zero until there is something saved in storage
        if(!this.table){ 
            return 0; 
        }
        var total_index = this.table[0].indexOf(this.totalCol());
        let sum = 0;
        for (let i = 1; i < this.table.length; i++){
            sum += Math.round(parseFloat(this.table[i][total_index]));
        }
        return sum;
    }
}

// Holds all the detailed data for one fund's budget
class Fund {
    constructor(fund){
        this.personnel = new StoredTable('personnel', fund);
        this.OT = new StoredTable('OT', fund);
        this.nonpersonnel = new StoredTable('nonpersonnel', fund);
        this.revenue = new StoredTable('revenue', fund);
    }

    getPersonnelCost() {
        return this.personnel.getSum() + this.OT.getSum();
    }

    getNonPersonnelCost() {
        return this.nonpersonnel.getSum();
    }

    getRevenue() {
        return this.revenue.getSum();
    }

    getTotal() { 
        return this.getNonPersonnelCost() + this.getPersonnelCost() - this.getRevenue() 
    }
}

export class Baseline {
    // baseline will just contain a list of funds
    constructor(fund_names) {
        this.fund_names = fund_names;
        this.funds = [];
        fund_names.forEach((fund) => { 
            this.funds.push(new Fund(fund));
        });
    } 

    personnel() {
        let total = 0;
        this.funds.forEach(fund => {
            total += fund.getPersonnelCost();
        });
        return total;
    }

    nonpersonnel() {
        let total = 0;
        this.funds.forEach(fund => {
            total += fund.getNonPersonnelCost();
        });
        return total;
    }

    revenue() {
        let total = 0;
        this.funds.forEach(fund => {
            total += fund.getRevenue();
        });
        return total;
    }

    total() {
        return this.nonpersonnel() + this.personnel() - this.revenue();
    }
}