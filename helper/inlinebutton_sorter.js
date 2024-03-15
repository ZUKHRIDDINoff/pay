export default (listArray, rowSize = 3) => {
    let row = 0;
    let rowArray = [];
    let buttons = [];

    listArray.reverse().map(async(el, index) => {
        if(row < rowSize){
            rowArray.push({
                text: `${el}`,
                callback_data: `top_up&&choose_network:${el}`
            })
            row += 1;
        }

        if(row == rowSize || index == listArray.length-1) {
            buttons.push(rowArray);
            row = 0;
            rowArray = [];
        } 
    });

    return buttons;
}