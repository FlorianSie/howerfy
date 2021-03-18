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
        text = document.querySelector(`#dropdown-item-tasks-${id}`).innerText;
        document.querySelector(display_id).innerText = text;
        a = document.querySelector('#dropdown-tasks');
        // If dropdown is team select, add team id to the settings-input div. This ID will be grabbed by "save_task()" function
        if (display_id == '#settings-input-Team') {
                document.querySelector('#settings-input-Team').setAttribute('data-team_id', `${id}`)
        }
        a.remove();
}

async function render_dropdown(append_to, display_id, data) {
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
                                                        //{"option": "3", "text":"Team only"},
                                                        //{"option": "4", "text":"Team admins only"},
                                                ]    
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

                } else if (data == 'Team') {
                        array = await get_teams();

                        dropdown_tasks = document.createElement('ul');
                        dropdown_tasks.setAttribute('class', 'dropdown-list');
                        dropdown_tasks.setAttribute('id', 'dropdown-tasks');
                        document.querySelector(append_to).appendChild(dropdown_tasks);
        
                                array.forEach(element => {
                                        li = document.createElement('li');
                                        li.setAttribute('class', 'dropdown-item');
                                        li.setAttribute('id', `dropdown-item-tasks-${element.id}`);
                                        li.setAttribute('onclick', `dropdown_select(${element.id}, '${display_id}')`)
                                        document.querySelector('#dropdown-tasks').appendChild(li);
                                                p = document.createElement('p');
                                                p.setAttribute('class', 'dropdown-p');
                                                p.setAttribute('id', `dropdown-p-${element.name}`);
                                                p.innerText = element.name;
                                                document.querySelector(`#dropdown-item-tasks-${element.id}`).appendChild(p);  
                                });

                }


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

function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

// User search

document.addEventListener('DOMContentLoaded', () => {

        const search = document.querySelector('#search');
        const matchList = document.querySelector('#suggestions');

        const searchUsers = async searchText => {
                const res = await fetch('/user/all');  
                const users = await res.json();
                
                let matches = users.filter(user => {
                        const regex = new RegExp(`^${searchText}`, 'gi');
                        return user.username.match(regex);
                })
                console.log(matches)
                if (searchText == 0) {
                        matches = []
                        clear_view('#suggestions');
                }
                clear_view('#suggestions');
                search_render_avatar(matches);
        }
        if (window.location.pathname != "/home") {
                search.addEventListener('input', () => searchUsers(search.value));
        }

});
// Returns currently signed in user
async function get_user() {
        const res = await fetch('/user/user');
        const user = await res.json();

        return user;
}

// Remove elements by class name
function removeElementsByClass(className){
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }


function show_team_overview() {
        document.querySelector('#task').style.display = 'none';
        document.querySelector('#overlay').style.display = 'none';
        document.querySelector('#voting-view').style.display = 'none';
        document.querySelector('#new-team').style.display = 'none';
        document.querySelector('#all-tasks').style.display = 'none';
        document.querySelector('#dropdown-view').style.display = 'none';
        document.querySelector('#team-overview').style.display = 'flex';
}