export const popCount = n=> n.toString(2).replace(/0/g,"").length

// The utility functions so Tailwind knows to include those styles 
export function cn_row(n) {
    switch(n) {
        case  1: return 'row-1';
        case  2: return 'row-2';
        case  3: return 'row-3';
        case  4: return 'row-4';
        case  5: return 'row-5';
        case  6: return 'row-6';
        case  7: return 'row-7';
        case  8: return 'row-8';
        case  9: return 'row-9';
        case 10: return 'row-10';
        case 11: return 'row-11';
        case 12: return 'row-12';
    }
}

export function cn_col(n) {
    switch(n) {
        case  1: return 'col-1';
        case  2: return 'col-2';
        case  3: return 'col-3';
        case  4: return 'col-4';
        case  5: return 'col-5';
        case  6: return 'col-6';
        case  7: return 'col-7';
        case  8: return 'col-8';
        case  9: return 'col-9';
        case 10: return 'col-10';
        case 11: return 'col-11';
        case 12: return 'col-12';
    }
}

export function cn_gridCols(n) {
    switch(n) {
        case  1: return 'grid-cols-1';
        case  2: return 'grid-cols-2';
        case  3: return 'grid-cols-3';
        case  4: return 'grid-cols-4';
        case  5: return 'grid-cols-5';
        case  6: return 'grid-cols-6';
        case  7: return 'grid-cols-7';
        case  8: return 'grid-cols-8';
        case  9: return 'grid-cols-9';
        case 10: return 'grid-cols-10';
        case 11: return 'grid-cols-11';
        case 12: return 'grid-cols-12';
    }
}

export function cn_gridRows(n) {
    switch(n) {
        case  1: return 'grid-rows-1';
        case  2: return 'grid-rows-2';
        case  3: return 'grid-rows-3';
        case  4: return 'grid-rows-4';
        case  5: return 'grid-rows-5';
        case  6: return 'grid-rows-6';
        case  7: return 'grid-rows-7';
        case  8: return 'grid-rows-8';
        case  9: return 'grid-rows-9';
        case 10: return 'grid-rows-10';
        case 11: return 'grid-rows-11';
        case 12: return 'grid-rows-12';
    }
}
