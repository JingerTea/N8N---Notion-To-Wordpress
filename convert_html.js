function convert(block_type) {
    let blocks;
    let text_html = "";
    if (block_type.rich_text) {
        blocks = block_type.rich_text;
    } else {
        blocks = block_type;
    }

    // Convert block to html
    blocks.forEach(element => {
        style_html = element.plain_text;

        if (element.href) {
            const link = element.href;
            style_html = `<a href="${link}" target="_blank">${style_html}</a>`;
        }
        if (element.annotations.bold){
            style_html = `<strong>${style_html}</strong>`;
        }
        if (element.annotations.italic){
            style_html = `<em>${style_html}</em>`;
        }
        if (element.annotations.strikethrough){
            style_html = `<span style="text-decoration: line-through;">${style_html}</span>`;
        }
        if (element.annotations.underline){
            style_html = `<span style="text-decoration: underline;">${style_html}</span>`;
        }
        if (element.annotations.code) {
            style_html = `<code>${style_html}</code>`;
        }
        if (element.annotations.color) {
            switch (element.annotations.color) {
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


let html = "";
let block_html, title, id, link;

items.forEach(element => {
    let block = element.json;
    let block_html = "";

    switch (block.type) {
        case 'paragraph':
            text_html = convert(block.paragraph);
            block_html = `<p>${text_html}</p>`;
            break;

        case 'child_page':
            title = block.child_page.title;
            id = block.parent_id;
            link = `https://www.notion.so/${id}`;
            block_html = `<p><a href="${link}" >${title}</a></p>`;
            break;

        case 'to_do':
            text_html = convert(block.to_do);
            block_html = `<ul><li>${text_html}</li></ul>`;
            break

        case 'heading_1':
            text_html = convert(block.heading_1);
            block_html = `<h1>${text_html}</h1>`;
            break;

        case 'heading_2':
            text_html = convert(block.heading_2);
            block_html = `<h2>${text_html}</h2>`;
            break;

        case 'heading_3':
            text_html = convert(block.heading_3);
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
                text_html = convert(element)
                block_html += `<td>${text_html}</td>`;
            })
            block_html = `<tr>${block_html}</tr></tbody></table></figure>`;
            break;


        case 'bulleted_list_item':
            text_html = convert(block.bulleted_list_item);
            block_html = `<ul><li>${text_html}</li></ul>`;
            break;

        case 'numbered_list_item':
            text_html = convert(block.numbered_list_item);
            block_html = `<ol><li>${text_html}</li></ol>`;
            break;

        case 'toggle':
            text_html = convert(block.toggle);
            block_html = `<ul class="is-style-arrow"><li>${text_html}</li></ul>`;
            break;

        case 'quote':
            text_html = convert(block.quote);
            block_html = `<blockquote class="wp-block-quote"><p>${text_html}</p></blockquote>`;
            break;

        case 'divider':
            block_html = `<hr class="wp-block-separator has-alpha-channel-opacity"/>`
            break;

        case 'unsupported':
            block_html = `<p><span style="background-color:#cf2e2e">*** Link page not supported ***</span></p>`
            break;

        case 'callout':
            text_html = convert(block.callout);
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
            text_html = convert(block.code);
            block_html = `<pre class="wp-block-code"><code>${text_html}</code></pre>`;
            break;

        case 'equation':
            block_html = `<p><span style="background-color:#cf2e2e">*** Equation not supported ***</span></p>`
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
    html += block_html;
})

html = html.replace(/<\/ul><ul>/g, '').replace(/<\/ol><ol>/g, '');
return [{
  json: {
    "Output": html
    }
}];
