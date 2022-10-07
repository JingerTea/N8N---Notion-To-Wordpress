const request = require('request-promise-native');
var block_id, temp_remove;

var api_key = items[0].json.api_key;

let tasks = [];
let new_items = [];
var count = 1;

do {
    // Initalize
    if (count == 1){
        block_id = items[0].json.page_id;
    } 
    // Handle previous Response
    else {
        if (tasks[0].has_children == true) {
            block_id = tasks[0].id;
            new_items = new_items.concat(tasks[0]);
            temp_remove = tasks.shift();
        } else if (tasks[0].has_children == false) {
            new_items = new_items.concat(tasks[0]);
            temp_remove = tasks.shift();
            continue;
        }
    }

    // Get Children
    const options = {
        url: `https://api.notion.com/v1/blocks/${block_id}/children?page_size=100`,
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Notion-Version": "2022-06-28",
            "Authorization": api_key
        },
        json: true,
    };

    // Append Response
    const response = await request(options);
    
    let temp = [];
    response.results.forEach(element => {
        temp = temp.concat(element);
    })
    tasks = temp.concat(tasks);
    count += 1;

} while (tasks.length !== 0);

return new_items;
