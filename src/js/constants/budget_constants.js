// Set to equal current fiscal year
export var FISCAL_YEAR = '26';

// object categories (from obj part of account string)
export const OBJ_CATEGORIES = {
    list : [
        // 'Salaries & Wages',
        // 'Employee Benefits',
        'Professional & Contractual Services',
        'Operating Supplies',
        'Operating Services',
        'Equipment Acquisition',
        'Capital Outlays',
        'Fixed Charges',
        'Other Expenses'
    ]
}

// from the drop-down menu
export const EMPLOYEE_TYPES = [
    'Regular',
    'TASS',
    'Seasonal',
    'Uniform Fire',
    'Uniform Police',
    'Appointed',
    'Elected',
    'Long Term Disability',
    'New Position'
]

export const OT_OBJECTS = [
    '601300 - Salar-Overtime-Gen City', 
    '601305 - Salaries-Overtime-Police Unif',
    '601310 - Salaries-Overtime-Fire Unif',
    '602300 - Wages-Overtime-Gen City'
]

// Nice names for the pages
export const PAGE_LABELS = {
    'welcome': 'Welcome Page',
    'upload': 'Excel Upload',
    'baseline-landing': 'Fund Selection',
    'revenue': 'Revenue',
    'personnel': 'Personnel',
    'overtime': 'Overtime',
    'nonpersonnel': 'Non-Personnel',
    'new-inits': 'New Initiatives (Supplementals)',
    'summary': 'Summary Page',
    'finish' : 'Download & Finish'
};