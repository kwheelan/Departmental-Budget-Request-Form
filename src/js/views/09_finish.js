import CurrentFund from '../models/current_fund.js';
import { View } from "./view_class.js";
import Prompt from "../components/prompt/prompt.js";
import { downloadXLSX } from "../utils/XLSX_handlers.js";
import WelcomeView from './00_welcome.js';
import NavButtons from '../components/nav_buttons/nav_buttons.js';

function returnToWelcome() {
    const welcome = new WelcomeView();
    welcome.visit();
};

export class FinishView extends View {

    constructor() {
        super();
        this.page_state = 'finish';
        this.subtitle = 'Finish';
        this.sidebar = false;
        // todo toggle to false
        this.navButtons = true;
        this.prompt = ``;
    }

    visit() {
        super.visit();

        // reset fund
        CurrentFund.reset();

        // add prompt buttons
        Prompt.Buttons.Right.updateText('Download Excel');
        Prompt.Buttons.Left.updateText('Start over with new Excel upload');
        // add button links
        Prompt.Buttons.Left.addAction(returnToWelcome);
        Prompt.Buttons.Right.addAction(downloadXLSX);
        Prompt.show();

        // hide next button
        NavButtons.Next.hide();

    }

    cleanup() {
        // delete event listeners
        Prompt.Buttons.Left.removeAction(returnToWelcome);
        Prompt.Buttons.Right.removeAction(downloadXLSX);
        Prompt.Buttons.Right.enable();
    }
}

export default FinishView;