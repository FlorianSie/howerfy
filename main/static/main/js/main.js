function render_task_full() {
        render_task("voting");
        //hower_vote();  
}

function clear_view(parent) {
        if (document.querySelector(`${parent}`) !== null) {
                if (document.querySelector(`${parent}`).hasChildNodes()) {
                        div = document.querySelector(`${parent}`);
                        while (div.firstChild) {
                        div.removeChild(div.lastChild)
                        }
                }
        }
}

function dropdown_select(id, display_id) {
        console.log(display_id);
        text = document.querySelector(`#dropdown-p-${id}`).innerText;
        document.querySelector(display_id).innerText = text;
        a = document.querySelector('#dropdown-tasks');
        a.remove();
}


function render_dropdown(append_to, display_id, data) {
        console.log('render_dropdown evoked')

        if (document.querySelector('#dropdown-tasks') == null) {

                if (data == "visibility") {
                        data = {
                                "id": "1",
                                "pre_text": "please select",
                                "options": {"option":
                                                [
                                                        {"option": "1", "text":"Only me"},
                                                        {"option": "2", "text":"Public"},
                                                        {"option": "3", "text":"Team only"},
                                                        {"option": "4", "text":"Team admins only"},
                                                ]    
                                        }
                        }
                } else if (data == 'editable') {
                        data = {
                                "id": "2",
                                "pre_text": "please select",
                                "options": {"option":
                                                [
                                                        {"option": "1", "text":"Only me"},
                                                        {"option": "2", "text":"Team only"},
                                                        {"option": "3", "text":"Team admins only"},
                                                ]    
                                        }
                        }

                } else if (data == 'milestones') {
                        data = {
                                "id": "3",
                                "pre_text": "please select",
                                "options": {"option":
                                                [
                                                        {"option": "1", "text":"Only me"},
                                                        {"option": "2", "text":"Team only"},
                                                        {"option": "3", "text":"Team admins only"},
                                                ]    
                                        }
                        }

                }

                dropdown_tasks = document.createElement('ul');
                dropdown_tasks.setAttribute('class', 'dropdown-list');
                dropdown_tasks.setAttribute('id', 'dropdown-tasks');
                document.querySelector(append_to).appendChild(dropdown_tasks);


                        array = data.options.option

                        array.forEach(element => {
                                li = document.createElement('li');
                                li.setAttribute('class', 'dropdown-item');
                                li.setAttribute('id', `dropdown-item-tasks-${element.option}`);
                                li.setAttribute('onclick', `dropdown_select(${element.option}, '${display_id}')`)
                                document.querySelector('#dropdown-tasks').appendChild(li);
                                        p = document.createElement('p');
                                        p.setAttribute('class', 'dropdown-p');
                                        p.setAttribute('id', `dropdown-p-${element.option}`);
                                        p.innerText = element.text;
                                        document.querySelector(`#dropdown-item-tasks-${element.option}`).appendChild(p);  
                        });

        } else {
                a = document.querySelector('#dropdown-tasks');
                a.remove();
                }

}

function render_task_menue(button_tag) {
        if (button-tag == "visibility") {
                render_dropdown('#settings-box-wrap', '#settings-input-visibility', 'visibility')
        }
}


