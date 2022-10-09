let block_dict = [], html = "";

// Convert text to html with style
function text_to_html(block_type) {
    let blocks, text_html = "";

    // Identify block text
    if (block_type.rich_text) {
        blocks = block_type.rich_text;
    } else {
        blocks = block_type;
    }

    // Convert block to html
    blocks.forEach(block => {
        style_html = block.plain_text;

        if (block.href) {
            const link = block.href;
            style_html = `<a href="${link}" target="_blank">${style_html}</a>`;
        }
        if (block.annotations.bold){
            style_html = `<strong>${style_html}</strong>`;
        }
        if (block.annotations.italic){
            style_html = `<em>${style_html}</em>`;
        }
        if (block.annotations.strikethrough){
            style_html = `<span style="text-decoration: line-through;">${style_html}</span>`;
        }
        if (block.annotations.underline){
            style_html = `<span style="text-decoration: underline;">${style_html}</span>`;
        }
        if (block.annotations.code) {
            style_html = `<code>${style_html}</code>`;
        }
        if (block.annotations.color) {
            switch (block.annotations.color) {
                case 'gray':
                    style_html = `<span style="color:rgba(120, 119, 116, 1);fill:rgba(120, 119, 116, 1)">${style_html}</span>`;
                    break;
                case 'brown':
                    style_html = `<span style="color:rgba(159, 107, 83, 1);fill:rgba(159, 107, 83, 1)">${style_html}</span>`;
                    break;
                case 'orange':
                    style_html = `<span style="color:rgba(217, 115, 13, 1);fill:rgba(217, 115, 13, 1)">${style_html}</span>`;
                    break;
                case 'yellow':
                    style_html = `<span style="color:rgba(203, 145, 47, 1);fill:rgba(203, 145, 47, 1)">${style_html}</span>`;
                    break;
                case 'green':
                    style_html = `<span style="color:rgba(68, 131, 97, 1);fill:rgba(68, 131, 97, 1)">${style_html}</span>`;
                    break;
                case 'blue':
                    style_html = `<span style="color:rgba(51, 126, 169, 1);fill:rgba(51, 126, 169, 1)">${style_html}</span>`;
                    break;
                case 'purple':
                    style_html = `<span style="color:rgba(144, 101, 176, 1);fill:rgba(144, 101, 176, 1)">${style_html}</span>`;
                    break;
                case 'pink':
                    style_html = `<span style="color:rgba(193, 76, 138, 1);fill:rgba(193, 76, 138, 1)">${style_html}</span>`;
                    break;
                case 'red':
                    style_html = `<span style="color:rgba(212, 76, 71, 1);fill:rgba(212, 76, 71, 1)">${style_html}</span>`;
                    break;
                case 'gray_background':
                    style_html = `<span style="background:rgba(241, 241, 239, 1)">${style_html}</span>`;
                    break;
                case 'brown_background':
                    style_html = `<span style="background:rgba(244, 238, 238, 1)">${style_html}</span>`;
                    break;
                case 'orange_background':
                    style_html = `<span style="background:rgba(251, 236, 221, 1)">${style_html}</span>`;
                    break;
                case 'yellow_background':
                    style_html = `<span style="background:rgba(251, 243, 219, 1)">${style_html}</span>`;
                    break;
                case 'green_background':
                    style_html = `<span style="background:rgba(237, 243, 236, 1)">${style_html}</span>`;
                    break;
                case 'blue_background':
                    style_html = `<span style="background:rgba(231, 243, 248, 1)" >${style_html}</span>`;
                    break;
                case 'purple_background':
                    style_html = `<span style="background:rgba(244, 240, 247, 0.8)" >${style_html}</span>`;
                    break;
                case 'pink_background':
                    style_html = `<span style="background:rgba(249, 238, 243, 0.8)" >${style_html}</span>`;
                    break;
                case 'red_background':
                    style_html = `<span style="background:rgba(253, 235, 236, 1)" >${style_html}</span>`;
                    break;
            }
        }
        text_html += style_html;
    })
    return text_html;
}

// Clean end tags and add new end tags
function get_tags (block, start_tag, end_tag){
    // Define variable
    let id, remove_tag, new_start_tag = "", new_end_tag = "";

    // Get block ID
    if (block.parent.page_id) {
        id = block.parent.page_id;
    } else if (block.parent.block_id) {
        id = block.parent.block_id;
    }
    // Get block type
    let type = block.type;

    // If dictionary contains block ID as key, remove items after it add 1 to order
    if (block_dict[id] !== undefined && block_dict[id][0] === block.type) {
        let id_list = Object.keys(block_dict);
        let index = id_list.indexOf(id);
        let last_index = id_list.length;
        id_list = id_list.slice(index + 1, last_index);
        id_list.forEach(id => delete block_dict[id]);
        block_dict[id][1] += 1;
        // If dictionary does not contain block ID, append ID to dictionary
    } else {
        block_dict[id] = [type, 1, end_tag];
    }

    let level = Object.keys(block_dict).length;
    const order = block_dict[id][1];

    // If the block is the first type in the level
    if (order === 1) {
        level -= 1;
    }

    const keys = Object.keys(block_dict);

    for(let i = 0; i < level; i++) {
        let remove_tag = block_dict[keys[i]][2];
        if (html.endsWith(remove_tag)) {
            let index = html.lastIndexOf(remove_tag);
            // console.log("Remove Tag: " + remove_tag);
            html = html.substring(0, index);
            new_end_tag = remove_tag + new_end_tag;
        }
    }

    // Analyze tags
    if (order === 1) {
        new_start_tag = start_tag;
        new_end_tag = end_tag + new_end_tag;
        }
    // console.log("Remove HTML: " + html);
    // console.log("=============")


    return [new_start_tag, new_end_tag];
}

function notion_to_html(blocks) {
    let id, link, text_html, start_tag, end_tag, new_start_tag, new_end_tag;
    blocks.forEach(element => {
        let block = element.json;
        let block_html = "";

        // console.log(block);
        switch (block.type) {
            case 'paragraph':
                text_html = text_to_html(block.paragraph);
                block_html = `<p>${text_html}</p>`;
                break;

            case 'child_page':
                let title = block.child_page.title;
                id = block.parent_id;
                link = `https://www.notion.so/${id}`;
                block_html = `<p><a href="${link}" >${title}</a></p>`;
                break;

            case 'heading_1':
                text_html = text_to_html(block.heading_1);
                block_html = `<h1>${text_html}</h1>`;
                break;

            case 'heading_2':
                text_html = text_to_html(block.heading_2);
                block_html = `<h2>${text_html}</h2>`;
                break;

            case 'heading_3':
                text_html = text_to_html(block.heading_3);
                block_html = `<h3>${text_html}</h3>`;
                break;

            case 'table':
                block_html = `<figure class="wp-block-table"><table><tbody></tbody></table></figure>`
                break;

            case 'table_row':
                end_tag = "</tbody></table></figure>";
                if (html.endsWith(end_tag)) {
                    const length = html.length - end_tag.length;
                    html = html.substring(0, length);
                }

                block.table_row.cells.forEach(element => {
                    text_html = text_to_html(element)
                    block_html += `<td>${text_html}</td>`;
                })
                block_html = `<tr>${block_html}</tr></tbody></table></figure>`;
                break;

                // Need fix
            case 'to_do':
                text_html = text_to_html(block.to_do);

                start_tag = "<ul>";
                end_tag = "</ul>";
                if (block.to_do.checked){
                    block_html = `<li><input type="checkbox" checked/> <label>text_html</label></li>`
                } else {
                    block_html = `<li><input type="checkbox"/> <label>text_html</label></li>`
                }

                [new_start_tag, new_end_tag] = get_tags(block, start_tag, end_tag);
                block_html = new_start_tag + block_html + new_end_tag;
                break

            case 'bulleted_list_item':
                text_html = text_to_html(block.bulleted_list_item.rich_text);
                start_tag = "<ul>";
                end_tag = "</ul>";
                [new_start_tag, new_end_tag] = get_tags(block, start_tag, end_tag);
                block_html = new_start_tag + `<li>${text_html}</li>` + new_end_tag;

                break;

            case 'numbered_list_item':
                text_html = text_to_html(block.numbered_list_item);
                start_tag = "<ol>";
                end_tag = "</ol>";
                [new_start_tag, new_end_tag] = get_tags(block, start_tag, end_tag);
                block_html = new_start_tag + `<li>${text_html}</li>` + new_end_tag;

                break;

            case 'toggle':
                text_html = text_to_html(block.toggle);
                start_tag = "<ul class=\"is-style-arrow\">";
                end_tag = "</ul>";
                [new_start_tag, new_end_tag] = get_tags(block, start_tag, end_tag);
                block_html = new_start_tag + `<li>${text_html}</li>` + new_end_tag;
                break;

            case 'quote':
                text_html = text_to_html(block.quote);
                block_html = `<blockquote class="wp-block-quote"><p>${text_html}</p></blockquote>`;
                break;

            case 'divider':
                block_html = `<hr class="wp-block-separator has-alpha-channel-opacity"/>`
                break;

            case 'unsupported':
                block_html = `<p><span style="background-color:#cf2e2e">*** Link page not supported ***</span></p>`
                break;

            case 'callout':
                text_html = text_to_html(block.callout);
                block_html = `<blockquote class="wp-block-quote"><p>${text_html}</p></blockquote>`;
                break;

            case 'child_database':
                block_html = `<p><span style="background-color:#cf2e2e">*** Database not supported ***</span></p>`
                break;

            case 'image':
                link = block.image.file.url;
                block_html = `<p><img class="alignnone size-full" src="${link}" /></p>`;
                break;

            case 'code':
                text_html = text_to_html(block.code);
                block_html = `<pre class="wp-block-code"><code>${text_html}</code></pre>`;
                break;

            case 'equation':
                const equation = block.equation.expression;
                block_html = `<p><span style="background-color:#cf2e2e"> ${equation} </span></p>`
                break;

            case `video`:
                block_html = block.video.external.url;
                block_html = `<p><a href="${block_html}">${block_html}</a></p>`
                break;

            case `bookmark`:
                block_html = block.bookmark.url;
                block_html = `<p><a href="${block_html}">${block_html}</a></p>`
                break;
        }
        // console.log(block_html);
        html += block_html;
        // console.log("HTML: " + html);
    })
    return html;
}

result = notion_to_html(items);
return [{
  json: {
    "Output": result
    }
}];
