import Prompt from '../../components/prompt/prompt.js'
import { updatePageState } from "../../utils/data_utils/local_storage_handlers.js";
import Body from '../../components/body/body.js';
import NavButtons from '../../components/nav_buttons/nav_buttons.js';
import Subtitle from '../../components/header/header.js';
import Sidebar from '../../components/sidebar/sidebar.js';

export function loadOTPage(){
    //update page state
    updatePageState('overtime');

    // prepare page view
    Body.reset();
    NavButtons.show();
    Sidebar.show();

    // just enable next for now
    // TODO: only enable when all info is entered
    NavButtons.Next.enable();

    // update page text
    Subtitle.update('Overtime Estimates');
    // TODO: update to make dynamic
    Prompt.Text.update(`This is a placeholder for the OT estimates.`);
}