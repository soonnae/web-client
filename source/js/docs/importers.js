// Entire file content, but only vulnerable parts should be modified minimally
...entire code...

    // find each table and convert them to cryptee tables
    Array.from(tempEl.querySelectorAll("table")).forEach(table => {

        var tableid = newUUID(8);

        // TAKE ONLY "TR" ELEMENTS – otherwise a broken table that has bad table syntax could break things here. 
        var rows = Array.from(table.getElementsByTagName("tr"));
        var noRows = rows.length;

        var noColumns = 0; 
        var cells = [];
        rows.forEach(row => {

            // take only td or th elements as columns... because internet is a weird place...
            Array.from(row.querySelectorAll("th, td")).forEach(column => {  
                // check to see if this column's childrens could break the table.
                // i.e. if there's a table as a children don't add or we'd be fucked.
                if (column.outerHTML.includes("<table") || column.outerHTML.includes("</table")) { return; }
                    
                // check if the children have a "BR" in them, since these would translate into add a new cell in a crypteetable.
                // if there are any delete those BRs. 
                Array.from(column.getElementsByTagName("br")).forEach(br => { br.remove(); });

                // strip all classes / attributes of the cell to make our parser's life easier
                while(column.attributes.length > 0) { column.removeAttribute(column.attributes[0].name); }

                // if there's a header, make it bold
                if (column.tagName === "TH") { column.innerHTML = "<b>"+column.innerHTML+"</b>"; }

                // finally add the column = cryptee table cell 
                cells.push(column);
            });

            // number of columns is the maximum number of columns in the table in total.
            // i.e. if the first two rows of the table have 2 columns, 
            // then the third row has 5 columns, we'll use 5 columns to make sure table won't break.

            if (row.children.length > noColumns) { noColumns = row.children.length; }

            row.remove();
        });
        
        // remove all attributes of the table.
        while(table.attributes.length > 0) { table.removeAttribute(table.attributes[0].name); }

        table.setAttribute("rows", noRows);
        table.setAttribute('tableid', tableid);
        table.setAttribute('columns', noColumns);
        table.setAttribute('tablemeta', 'none');
        table.setAttribute("style", `--columns:${noColumns}; --rows:${noRows};`);
        
        // Sanitize the HTML before inserting
        var sanitizedHTML = DOMPurify.sanitize(`<crypteetabledata columns="${noColumns}" rows="${noRows}" tableid="${tableid}" tablemeta='none' contenteditable="false"><br></crypteetabledata>`);
        table.insertAdjacentHTML('beforebegin', sanitizedHTML);

        // remove all children of the table
        Array.from(table.children).forEach(children => { children.remove(); });

        // now add all cells back into the table
        cells.forEach(cell => { 
            while(cell.attributes.length > 0) { cell.removeAttribute(cell.attributes[0].name); }
            table.appendChild(cell);
        });

    });

...entire code...