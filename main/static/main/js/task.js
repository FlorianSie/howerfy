document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#nav-plus').onclick = () => {
        document.querySelector('#task').style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';

        render_new_task("task");
    }
});

const mediaQuery = window.matchMedia('(max-width: 640px)')
// each time an input field is focused, this function check whether the min. input field are filled in. 
// if yes, the save button is enabled
function enable_save() {    
    var title_get = document.querySelector('#title-text').value;
    var description_get = document.querySelector('#task-description').value;
    var deadline_get = document.querySelector('#date-text').value;
    console.log(`title: ${title_get}, description: ${description_get}, deadline: ${deadline_get}`)

    if (title_get !="" && description_get !="" && deadline_get !="") {
        document.querySelector('#save-button-new-task').setAttribute('class', 'save-button-active');
        document.querySelector('#save-button-new-task').setAttribute('onclick', 'save_task()');
    } else {
        document.querySelector('#save-button-new-task').setAttribute('class', 'save-button');
        document.querySelector('#save-button-new-task').removeAttribute('onclick');
    }
}
// Enable save function converted to mobile
function enable_save_m() {
    var title_get = document.querySelector('#title-text').value;
    var description_get = document.querySelector('#task-description').value;
    var deadline_get = document.querySelector('#date-text').value;
    console.log(`title: ${title_get}, description: ${description_get}, deadline: ${deadline_get}`)

    if (title_get !="" && description_get !="" && deadline_get !="") {
        document.querySelector('#task-nav-icon-5').setAttribute('class', 'task-nav-icon-active-mobile');
        document.querySelector('#task-nav-icon-5').setAttribute('onclick', 'save_task()');
    } else {
        document.querySelector('#task-nav-icon-5').setAttribute('class', 'task-nav-icon-plain');
        document.querySelector('#task-nav-icon-5').removeAttribute('onclick');
    }

}
async function refresh_previews(id) {
    removeElementsByClass("task-prev")
    tasks = await get_team_tasks("new-team",id);
    console.log(tasks)
    tasks.forEach(task => {
        render_task_preview(task.id,"new-team", task.classification, task.title, task.progress, task.completed)
    }); 
}
// Save new task
// --> Privacy Settings: Because these are not used, they were set to "Only me" as default
async function save_task() {
    // Get main data (min. requirements to add new task)
    var title_get = document.querySelector('#title-text').value;
    var description_get = document.querySelector('#task-description').value;
    var deadline_get = document.querySelector('#date-text').value;
    // Get other data
        // Get milestones
        var milestone_list = []
        var milestones = document.querySelectorAll('.milestone-input');
        milestones.forEach(milestone => {
            milestone = milestone.value
            milestone_list.push(milestone)
        })
        console.log(milestone_list);
        // Get slider data
        var urgency_get = parseInt(document.querySelector('#slider-urgency').value);
        var importance_get = parseInt(document.querySelector('#slider-importance').value);
        // Get completed status
        var completed_get = Boolean(document.querySelector('#task-nav-icon-3').dataset.completed);
        // Get privacy settings data
        var visibility_get = "Only me" //document.querySelector('#settings-input-visibility').innerText;
        var editable_get = "Only me" //document.querySelector('#settings-input-editable').innerText;
        var milestones_get = "Only me" //document.querySelector('#settings-input-milestones').innerText;
        // Get team assignment
        var to_team = document.querySelector('#settings-input-Team').dataset.team_id
        if (to_team === undefined) {
            to_team = ""
        }
        console.log(title_get, description_get, deadline_get, urgency_get, importance_get, completed_get, visibility_get,editable_get, milestones_get, to_team)

    const csrftoken = getCookie('csrftoken');

    const request = new Request(
        '/new_task',
        {headers: {'X-CSRFToken': csrftoken}}
    );

    fetch(request, {
        method: 'POST',
        body: JSON.stringify({
            // to Task model
            title: title_get,
            description: description_get,
            deadline: deadline_get,            
            completed: completed_get,
            visibility: visibility_get,
            editable: editable_get,
            milestone_settings: milestones_get,
            // to Rating model
            urgency: urgency_get,
            importance: importance_get,             
            // to Milestone model
            milestones: milestone_list, 
            // to Team model
            team: to_team,         
        })
    })
    .then(() => {
        var id = document.querySelector('#settings-input-Team').dataset.team_id;
        close_task('task');
        // If user is on "create new team view" --> load new task preview and add it to view
        if (document.querySelector('#new-team').style.display == "flex") {
            refresh_previews(id);
        }
    });    
}
async function update_task(id, spec) {
    var title_get = document.querySelector('#title-text').value;
    var description_get = document.querySelector('#task-description').value;
    var deadline_get = document.querySelector('#date-text').value;
    // Get milestones
    var milestone_list = []
    var milestones = document.querySelectorAll('.milestone-input');
    milestones.forEach(milestone => {
        if (!milestone.hasAttribute('data-id')) {
            milestone = milestone.value
            milestone_list.push(milestone)
        }
    })
    console.log(milestone_list);

    const csrftoken = getCookie('csrftoken');

    const request = new Request(
        `/task/update/${id}/${spec}`,
        {headers: {'X-CSRFToken': csrftoken}}
    )

    fetch(request, {
        method: 'PUT',
        body: JSON.stringify({
            // to Task model
            title: title_get,
            description: description_get,
            deadline: deadline_get,
            // to Milestone model
            milestones: milestone_list, 
                       
        
        })
    })
    close_task('general');


}
// Add "close" function to task element
function close_task(view) {
    console.log('close')

    if (view == "voting" && !mediaQuery.matches) {
        document.querySelector('#close-icon-svg').addEventListener('click', () => {
            clear_task_view();
            add_hover_function();
            document.querySelector('.task-prev-select').setAttribute('class', 'task-prev')
            elements = document.querySelectorAll('.task-prev');
            console.log(`task-prev elements: ${elements}`)
            elements.forEach(element => {
                element.addEventListener('mouseleave', clear_task_view);
                element.addEventListener('mouseover', on_hover);
                element.setAttribute('class', 'task-prev-hover')
            });
        }); 
    } else if (view == "task" || view == "general") {
        document.querySelector('#overlay').style.display = 'none';
        div = document.querySelector('#task');
        while (div.firstChild) {
            div.removeChild(div.lastChild)
        }
        if (mediaQuery.matches) {
            document.querySelector('#task').style.pointerEvents = 'none'
        }
        refresh_previews
    } else if (view == "search") {
        document.querySelector('#overlay').style.display = 'none';
        document.querySelector('.user-search-container').style.display = 'none';
    } else if (view == "message") {
        document.querySelector('.message-container').style.display = 'none'
        document.querySelector('.message-text').innerText = "";
    } else if (view == "team") {
        document.querySelector('.team-select').style.display = 'none'
        document.querySelector('#overlay').style.display = 'none';
    }
}
// fill circles depending on whether task is open or not
function set_circle(id, status) {
    console.log(`circle status: ${status}`)
    if (status) {
        document.querySelector(`#milestone-circle-${id}`).setAttribute('fill', 'rgba(99, 193, 50, 1)') // green
    } else {
        document.querySelector(`#milestone-circle-${id}`).setAttribute('fill', 'rgba(75, 83, 88, 1)') // dark grey
    }
}
// toggle between "completed" and "open" status (milestone circle)
function toggle_circle(id) {
    console.log(`toggle: ${id}`)
    circle = event.target
    console.log(circle.attributes.fill.value)
    if (circle.attributes.fill.value == 'rgba(99, 193, 50, 1)') {
        event.target.setAttribute('fill', 'rgba(75, 83, 88, 1)')  
    } else {
        event.target.setAttribute('fill', 'rgba(99, 193, 50, 1)')
    }
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `/task/update/${id}/milestone`,
        {headers: {'X-CSRFToken': csrftoken}}
    )    
    fetch(request, {method: 'PUT'})
    .then(response => response.json())
    .then(res => progress = res.progress)
    .then(() => {
        progress_field = document.querySelector('#progress-text').innerText = `${progress}%`
    });        
}
// Add voting function to menue button on task view placeholder --> e.g. "placeholder-container-${voting}" shows voting container
function show_options(placeholder) {
    console.log('show options evoked')
    // List to close:
    array = ['settings', 'voting', 'team']
    var toClose = array.filter((item) => {
        return item != placeholder
    })
    toClose.forEach(element => {
        document.querySelector(`#placeholder-container-${element}`).style.display = 'none';        
    });

    if (document.querySelector(`#placeholder-container-${placeholder}`).style.display == 'flex') {
        document.querySelector(`#placeholder-container-${placeholder}`).style.display = 'none'
    } else {
        document.querySelector(`#placeholder-container-${placeholder}`).style.display = 'flex'
    }    
}
// add hower vote button function
function hower_vote(view) {
    
    div = document.createElement('div');
    div.setAttribute('class', 'container-sliders');
    div.setAttribute('id', 'container-slider-1');
    if (mediaQuery.matches && view !='new_task') {
        document.querySelector('#voting-container-right').appendChild(div)
        div.setAttribute('class', 'container-sliders-inactive');
    } else {
        document.querySelector('#placeholder-container-voting').appendChild(div)
    }

    div = document.createElement('div');
    div.setAttribute('class', 'container-sliders');
    div.setAttribute('id', 'container-slider-2');
    if (mediaQuery.matches && view !='new_task') {
        document.querySelector('#voting-container-right').appendChild(div)
        div.setAttribute('class', 'container-sliders-inactive');
    } else {
    document.querySelector('#placeholder-container-voting').appendChild(div)
    }

        input = document.createElement('input');
        input.setAttribute('class', 'slider');
        input.setAttribute('id', 'slider-importance');
        input.setAttribute('type', 'range');
        input.setAttribute('min', '1');
        input.setAttribute('max', '100');
        input.setAttribute('value', '50');
        document.querySelector('#container-slider-1').appendChild(input)

        input = document.createElement('input');
        input.setAttribute('class', 'slider');
        input.setAttribute('id', 'slider-urgency');
        input.setAttribute('type', 'range');
        input.setAttribute('min', '1');
        input.setAttribute('max', '100');
        input.setAttribute('value', '50');
        document.querySelector('#container-slider-2').appendChild(input)

        label = document.createElement('h2');
        label.setAttribute('class', 'slider-label');
        label.innerText = "Importance";
        document.querySelector('#container-slider-1').appendChild(label);

        label = document.createElement('h2');
        label.setAttribute('class', 'slider-label');
        label.innerText = "Urgency";
        document.querySelector('#container-slider-2').appendChild(label);
}

privacy_settings = ['visibility']//, 'editable', 'milestones'] --> Can be added later
team_settings = ['Team']
// add settings to rendered task
function settings(array, append_to) {

    div = document.createElement('div');
    div.setAttribute('class', 'settings-box');
    div.setAttribute('id', `settings-box-${append_to}`);
    document.querySelector(`#placeholder-container-${append_to}`).appendChild(div);

    div = document.createElement('div');
    div.setAttribute('class', 'settings-box');
    div.setAttribute('id', 'settings-box-wrap');
    document.querySelector(`#settings-box-${append_to}`).appendChild(div);

    array.forEach(element => {

        row = document.createElement('div');
        row.setAttribute('class', 'settings-row-inner');
        row.setAttribute('id', `settings-row-${element}`);
        document.querySelector(`#settings-box-${append_to}`).appendChild(row)

            row = document.createElement('div');
            row.setAttribute('class', 'settings-row');
            row.setAttribute('id', `settings-row-container-${element}`);
            document.querySelector(`#settings-row-${element}`).appendChild(row)

                label = document.createElement('h2');
                label.setAttribute('class', 'setting-label');
                label.setAttribute('id', `setting-label-${element}`);
                label.innerText = element
                document.querySelector(`#settings-row-container-${element}`).appendChild(label);

                input = document.createElement('h3');
                input.setAttribute('class', 'settings-input');
                input.setAttribute('id', `settings-input-${element}`);
                input.innerText = "Only me"
                document.querySelector(`#settings-row-container-${element}`).appendChild(input)

                task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                task_svg.setAttribute('class', 'task-nav-svg-container');
                task_svg.setAttribute('height', '30px');
                task_svg.setAttribute('width', '30px');
                task_svg.setAttribute('id', `dropdown-row-svg-${element}`)
                task_svg.setAttribute('onclick', `render_dropdown('#settings-row-${element}', '#settings-input-${element}', '${element}')`)

                document.querySelector(`#settings-row-container-${element}`).appendChild(task_svg);

                document.querySelector(`#dropdown-row-svg-${element}`).innerHTML = `<svg width="100%" height="100%" viewBox="0 0 105 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                    <g transform="matrix(1,0,0,1,-710.469,-612.906)">
                        <g transform="matrix(0.987208,0,0,0.725547,212.944,377.05)">
                            <path class="nav-svg" d="M506.251,328.175L557.725,374.113L607.547,328.932"/>
                        </g>
                    </g>
                </svg>`
            
    });







}
function render_new_task(view) {
    // --> view input is used in onclick functions
    // dummy data
    var title_get ="test"
    var progress ="progress"
    var date ="29.09.2039"
    var description_get ="Sample text this is a description for a task bla bla bla I do youga every day"

    // dummy data for milestones
     var milestones_data = [
         {
        "id": "1",
        "task": "call customer",
        "open": true,
            },
    ] 
    // delete prior task
    // get element to append
    if (view == "task") {
        div = document.querySelector('#task');
    } else if (view == "voting") {
        if (document.querySelector('#voting-container-right').hasChildNodes()) {
            div = document.querySelector('#voting-container-right');
            while (div.firstChild) {
                div.removeChild(div.lastChild)
            }
        }
        div = document.querySelector('#voting-container-right');        
    }
    
    // create task box that holds task + menue functions
    task_box = document.createElement('div');
    task_box.setAttribute('class', 'task-box');
    div.appendChild(task_box);
        // Create div for close icon
        close_icon = document.createElement('div');
        close_icon.setAttribute('id', 'close-task');
        document.querySelector('.task-box').appendChild(close_icon)
            x_icon = document.createElement('div');
            x_icon.setAttribute('id', 'close-icon');
            document.querySelector('#close-task').appendChild(x_icon)

            task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            task_svg.setAttribute('class', 'task-nav-svg-container');
            task_svg.setAttribute('height', '50px');
            task_svg.setAttribute('width', '50px');
            document.querySelector('#close-icon').appendChild(task_svg);

            document.querySelector('#close-task').innerHTML = `<svg onclick='close_task("${view}")' id="close-icon-svg" width="30px" height="30px" viewBox="0 0 102 102" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" class="nav-svg">
            <g transform="matrix(1,0,0,1,-954.38,-578.283)">
                <g id="close" transform="matrix(1,0,0,1,301.398,248.529)">
                    <g transform="matrix(1,0,0,1,147.847,1.16359)">
                        <path clas="nav-svg" d="M507.384,428.209L604.753,330.84"/>
                    </g>
                    <g transform="matrix(-1,0,0,1,1259.98,1.16359)">
                        <path class="nav-svg" d="M507.384,428.209L604.753,330.84"/>
                    </g>
                </g>
            </g>
        </svg>`



    // create task container
    task_container = document.createElement('div');
    task_container.setAttribute('class', 'task-container')
    task_box.appendChild(task_container);
    // create both segments of the container
    container_left = document.createElement('div')
    container_left.setAttribute('class', 'container-left')
    document.querySelector('.task-container').appendChild(container_left)

        // row 1 insinde left div
        row_1 = document.createElement('div');
        row_1.setAttribute('class', 'row-1');
        document.querySelector('.container-left').appendChild(row_1)

            title = document.createElement('div');
            title.setAttribute('class', 'div-title');
            document.querySelector('.row-1').appendChild(title);
                // task name
                title_text = document.createElement('input');
                title_text.setAttribute('placeholder', 'Title');
                title_text.setAttribute('class', 'title-input');
                title_text.setAttribute('id', 'title-text');
                title_text.setAttribute('oninput', 'enable_save()');
                document.querySelector('.div-title').appendChild(title_text);
                title_text = document.querySelector('#title-text');

                // task date
                date_text = document.createElement('input');
                date_text.setAttribute('class', 'date-picker')
                date_text.setAttribute('placeholder', 'Add deadline');
                date_text.setAttribute('type', 'date');
                date_text.setAttribute('id', 'date-text');
                date_text.setAttribute('oninput', 'enable_save()');
                document.querySelector('.div-title').appendChild(date_text);

        // row 2 insinde left div
        row_2 = document.createElement('div');
        row_2.setAttribute('class', 'row-2');
        document.querySelector('.container-left').appendChild(row_2)

            // task description div
            description_div = document.createElement('div');
            description_div.setAttribute('class', 'div-description');
            document.querySelector('.row-2').appendChild(description_div);

                description = document.createElement('textarea');
                description.setAttribute('class', 'description');
                description.setAttribute('type', 'text');
                description.setAttribute('placeholder', 'Add a description here...');
                description.setAttribute('id', 'task-description');
                description.setAttribute('contenteditable', 'true')
                description.setAttribute('oninput', 'enable_save()');
                document.querySelector('.div-description').appendChild(description);
                description_text = document.querySelector('#task-description');

            // task nav
            nav_container = document.createElement('div');
            nav_container.setAttribute('class', 'row-3');
            document.querySelector('.container-left').appendChild(nav_container);
                // nav container 1 -- HOWER VOTE ICON
                nav_svg_container = document.createElement('div');
                nav_svg_container.setAttribute('class', 'task-nav-icon');
                nav_svg_container.setAttribute('id', 'task-nav-icon-1');
                nav_svg_container.setAttribute('tabindex', '0');
                nav_svg_container.setAttribute('onclick', `show_options('voting')`)
                document.querySelector('.row-3').appendChild(nav_svg_container);
                    // add SVG HOWER
                    task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    task_svg.setAttribute('class', 'task-nav-svg-container');
                    task_svg.setAttribute('height', '30px');
                    task_svg.setAttribute('width', '30px');
                    document.querySelector('#task-nav-icon-1').appendChild(task_svg);
                        // render SVG
                        document.querySelector('#task-nav-icon-1').innerHTML = `
                        <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                        <svg class="nav-svg" width="30px" height="30px" viewBox="0 0 105 105" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                            <g transform="matrix(1,0,0,1,-503.213,-326.706)">
                                <g id="Hower-map" serif:id="Hower map">
                                    <path class="nav-svg" d="M539.884,400.826L550.585,390.125"/>
                                    <g transform="matrix(1,0,0,-1,0,801.868)">
                                        <path class="nav-svg" d="M539.884,400.826L550.585,390.125"/>
                                    </g>
                                    <g transform="matrix(6.12323e-17,1,-1,6.12323e-17,978.955,-176.9)">
                                        <path class="nav-svg" d="M539.884,400.826L550.585,390.125"/>
                                    </g>
                                    <g transform="matrix(6.12323e-17,1,1,-6.12323e-17,177.087,-176.9)">
                                        <path class="nav-svg" d="M539.884,400.826L550.585,390.125"/>
                                    </g>
                                    <g transform="matrix(1.0619,0,0,1.0619,-32.4756,-23.1276)">
                                        <rect class="nav-svg" x="506.582" y="331.561" width="94.171" height="94.171"/>
                                    </g>
                                    <path class="nav-svg" d="M505.463,352.211L605.463,352.211" />
                                    <path class="nav-svg" d="M577.965,362.984L577.965,400.826L540.324,400.826"/>
                                    <path class="nav-svg" d="M529.405,328.956L529.405,428.956"/>
                                </g>
                            </g>
                        </svg>`
                // nav container 2 -- TEAM SETTINGS ICON
                nav_svg_container = document.createElement('div');
                nav_svg_container.setAttribute('class', 'task-nav-icon');
                nav_svg_container.setAttribute('id', 'task-nav-icon-2');
                nav_svg_container.setAttribute('onclick', `show_options('team')`);
                nav_svg_container.setAttribute('tabindex', '0');
                document.querySelector('.row-3').appendChild(nav_svg_container);
                    // add SVG TEAM
                    task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    task_svg.setAttribute('class', 'task-nav-svg-container');
                    task_svg.setAttribute('height', '30px');
                    task_svg.setAttribute('width', '30px');
                    document.querySelector('#task-nav-icon-2').appendChild(task_svg);
                        // render SVG
                        document.querySelector('#task-nav-icon-2').innerHTML = `<svg class="nav-svg" width="30px" height="30px" viewBox="0 0 109 106" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                        <g transform="matrix(1,0,0,1,-1197.59,-309.556)">
                            <g id="Team">
                                <path class="nav-svg" d="M1245.03,349.42L1258.36,349.42"/>
                                <path class="nav-svg" d="M1252.18,311.806C1230.86,312.365 1231.55,331.044 1244.43,349.25L1244.43,356.255L1251.25,362.642"/>
                                <g transform="matrix(-1,0,0,1,2502.92,0)">
                                    <path class="nav-svg" d="M1252.18,311.806C1230.86,312.365 1231.55,331.044 1244.43,349.25L1244.43,356.255L1250.81,362.642"/>
                                </g>
                                <g transform="matrix(0.962621,0,0,1,44.8488,0)">
                                    <path class="nav-svg" d="M1199.84,412.339L1306.84,412.339"/>
                                </g>
                                <g transform="matrix(0.884859,0,0,0.968704,146.517,12.9043)">
                                    <path class="nav-svg" d="M1306.84,412.339C1310.58,410.067 1295.71,397.821 1286.91,397.543C1284.82,397.477 1284.27,392.819 1285.79,391.385C1298.13,379.706 1296.37,362.612 1279.79,360.441"/>
                                </g>
                                <g transform="matrix(-0.884859,0,0,0.968704,2410.57,12.9043)">
                                    <path class="nav-svg" d="M1306.84,412.339C1310.58,410.067 1295.71,397.821 1286.91,397.543C1284.82,397.477 1284.27,392.819 1285.79,391.385C1298.13,379.706 1295.45,362.612 1278.86,360.441"/>
                                </g>
                                <g transform="matrix(0.884859,0,0,0.968704,92.8823,12.9043)">
                                    <path class="nav-svg" d="M1306.84,412.339C1310.58,410.067 1295.71,397.821 1286.91,397.543C1284.82,397.477 1284.27,392.819 1285.79,391.385C1298.13,379.706 1296.37,362.612 1279.79,360.441"/>
                                </g>
                                <g transform="matrix(-0.884859,0,0,0.968704,2356.93,12.9043)">
                                    <path class="nav-svg" d="M1306.84,412.339C1310.58,410.067 1295.71,397.821 1286.91,397.543C1284.82,397.477 1284.27,392.819 1285.79,391.385C1298.13,379.706 1295.45,362.612 1278.86,360.441"/>
                                </g>
                            </g>
                        </g>
                    </svg>`
                // nav container 3 -- PRIVACY SETTINGS ICON
                nav_svg_container = document.createElement('div');
                nav_svg_container.setAttribute('class', 'task-nav-icon');
                nav_svg_container.setAttribute('id', 'task-nav-icon-4');
                nav_svg_container.setAttribute('onclick', `show_options('settings')`);
                nav_svg_container.setAttribute('tabindex', '0');
                document.querySelector('.row-3').appendChild(nav_svg_container);
                    // add SVG LOCK
                    task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    task_svg.setAttribute('class', 'task-nav-svg-container');
                    task_svg.setAttribute('height', '30px');
                    task_svg.setAttribute('width', '30px');
                    document.querySelector('#task-nav-icon-4').appendChild(task_svg);
                        // render SVG
                        document.querySelector('#task-nav-icon-4').innerHTML = `<svg class="nav-svg" width="30px" height="30px" viewBox="0 0 81 104" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                        <g transform="matrix(1,0,0,1,-481.132,-699.284)">
                            <g transform="matrix(1.16762,0,0,1.16762,-80.9826,-117.549)">
                                <g transform="matrix(0.225917,0,0,0.225136,329.71,610.256)">
                                    <path stroke-width="15" d="M825.741,720.251C833.938,718.663 840.142,713.061 843.209,707.116L843.209,657.828C868.963,622.084 840.428,600.335 825.645,603.526C810.394,600.975 779.49,617.682 804.513,656.448L804.513,707.299C810.639,715.17 817.73,719.432 825.741,720.251Z"/>
                                </g>
                                <g transform="matrix(1,0,0,1,-10.9189,54.5976)">
                                    <rect x="494.051" y="676.946" width="65.612" height="55.385"/>
                                </g>
                                <g transform="matrix(1,0,0,1,-1.11124,0)">
                                    <path d="M495.042,731.543C495.042,691.198 539.057,691.198 539.057,731.543"/>
                                </g>
                            </g>
                        </g>
                    </svg>`
                // nav container 4 -- CHECK ICON
                nav_svg_container = document.createElement('div');
                nav_svg_container.setAttribute('class', 'task-nav-icon-plain');
                nav_svg_container.setAttribute('id', 'task-nav-icon-3');
                nav_svg_container.setAttribute('onclick', 'set_status("close")');
                nav_svg_container.setAttribute('tabindex', '0');
                document.querySelector('.row-3').appendChild(nav_svg_container);
                    // add SVG CHECK
                    task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    task_svg.setAttribute('class', 'task-nav-svg-container');
                    task_svg.setAttribute('height', '30px');
                    task_svg.setAttribute('width', '30px');
                    document.querySelector('#task-nav-icon-3').appendChild(task_svg);
                        // render SVG
                        document.querySelector('#task-nav-icon-3').innerHTML =`<svg class="nav-svg" width="30px" height="30px" viewBox="0 0 105 105" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                        <g transform="matrix(1,0,0,1,-204.003,-561.619)">
                            <g id="Check">
                                <g transform="matrix(1.12992,0,0,1.12992,-47.5626,182.24)">
                                    <g id="Plus-icon" serif:id="Plus icon">
                                        <circle class="nav-svg" id="check-circle" cx="268.883" cy="382" r="44.251"/>
                                    </g>
                                </g>
                                <g transform="matrix(1,0,0,1,-2.10427,-3.12896)">
                                    <path class="nav-svg" id="check-path" d="M236.733,615.935L251.858,631.06L279.982,602.935"/>
                                </g>
                            </g>
                        </g>
                    </svg>`
                    // add save button to nav bar if mobile 
                    if (mediaQuery.matches) {
                    // nav container 4 -- CHECK ICON
                    nav_svg_container = document.createElement('div');
                    nav_svg_container.setAttribute('class', 'task-nav-icon-plain');
                    nav_svg_container.setAttribute('id', 'task-nav-icon-5');
                    nav_svg_container.setAttribute('onclick', 'save_task()');
                    nav_svg_container.setAttribute('tabindex', '0');
                    document.querySelector('.row-3').appendChild(nav_svg_container);
                        // add SVG CHECK
                        task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        task_svg.setAttribute('class', 'task-nav-svg-container');
                        task_svg.setAttribute('height', '30px');
                        task_svg.setAttribute('width', '30px');
                        document.querySelector('#task-nav-icon-5').appendChild(task_svg);
                        // render SVG
                        document.querySelector('#task-nav-icon-5').innerHTML = `<svg class="nav-svg" width="30px" height="30px" viewBox="0 0 104 104" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                        <g transform="matrix(1,0,0,1,-1041.9,-317.858)">
                            <g transform="matrix(0.693609,0,0,0.687804,903.119,263.498)">
                                <path class="nav-svg" d="M318.638,81.943L211.624,81.943C209.33,81.943 207.13,82.862 205.507,84.498C203.885,86.134 202.974,88.353 202.974,90.666L202.974,218.61C202.974,223.428 206.847,227.333 211.624,227.333L338.497,227.333C340.791,227.333 342.991,226.414 344.614,224.778C346.236,223.142 347.147,220.923 347.147,218.61L347.147,110.78L318.638,81.943L318.638,129.231C318.638,131.545 317.726,133.763 316.104,135.399C314.482,137.035 312.281,137.954 309.987,137.954C293.233,137.954 256.534,137.954 239.779,137.954C237.485,137.954 235.285,137.035 233.662,135.399C232.04,133.763 231.129,131.545 231.129,129.231C231.129,113.487 231.129,81.943 231.129,81.943"/>
                                <path class="nav-svg" d="M231.197,227.333L231.197,172.171C231.197,169.857 232.108,167.639 233.73,166.003C235.352,164.367 237.553,163.448 239.847,163.448C256.718,163.448 293.838,163.448 310.71,163.448C313.004,163.448 315.204,164.367 316.826,166.003C318.449,167.639 319.36,169.857 319.36,172.171C319.36,189.595 319.36,227.045 319.36,227.045"/>
                                <g transform="matrix(1,0,0,1,-84.7649,-22.3881)">
                                    <rect class="nav-svg" x="374.286" y="119.034" width="12.211" height="25.446">
                                </g>
                            </g>
                        </g>
                    </svg>`
                        
                    }                
                       
           
        
        // create right container
    container_right = document.createElement('div')
    container_right.setAttribute('class', 'container-right')
    // Responsive adjustment:
    if (mediaQuery.matches) {
        document.querySelector('.row-3').before(container_right)
        // Change to mobile save button function
        document.querySelector('#date-text').innerHTML = 'Add deadline'
        document.querySelector('#title-text').setAttribute('oninput', 'enable_save_m()')
        document.querySelector('#date-text').setAttribute('oninput', 'enable_save_m()')
        document.querySelector('#task-description').setAttribute('oninput', 'enable_save_m()')
    } else {
    document.querySelector('.task-container').appendChild(container_right)
    }
        // append row 1 for title
        row_1_right = document.createElement('div');
        row_1_right.setAttribute('class', 'row-1-right');
        document.querySelector('.container-right').appendChild(row_1_right)

            milestones = document.createElement('h3');
            milestones.setAttribute('class', 'h3');
            milestones.setAttribute('id', 'milestone-title');
            document.querySelector('.row-1-right').appendChild(milestones);
            milestones_title = document.querySelector('#milestone-title');
            milestones_title.innerText = "Milestones"

            // task progress
            progress_text = document.createElement('h3');
            progress_text.setAttribute('class', 'h3');
            progress_text.setAttribute('id', 'progress-text');
            document.querySelector('.row-1-right').appendChild(progress_text);
            progress_text = document.querySelector('#progress-text');

            progress_text.innerText = '0%';

        // append row 2 for milestones
        row_2_right = document.createElement('div');
        row_2_right.setAttribute('class', 'row-2-right');
        document.querySelector('.container-right').appendChild(row_2_right)
            // creatae ul
            ul = document.createElement('ul');
            ul.setAttribute('class', 'ul-milestones');
            document.querySelector('.row-2-right').appendChild(ul)

            // function for creating LI for each Milestone
            milestones_data.forEach(milestone => { 
                
                li_wrap = document.createElement('li');
                li_wrap.setAttribute('class', 'li-wrap');
                li_wrap.setAttribute('id', `li-wrap-${milestone.id}`);
                document.querySelector('.ul-milestones').appendChild(li_wrap);
                    // left div
                    li_left = document.createElement('div');
                    li_left.setAttribute('class', 'li-left');
                    li_left.setAttribute('id', `li-left-${milestone.id}`);
                    document.querySelector(`#li-wrap-${milestone.id}`).appendChild(li_left);
                        // milestone svg container
                        milestone_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        milestone_icon.setAttribute('class', 'milestone-svg-container');
                        milestone_icon.setAttribute('height', '30px');
                        milestone_icon.setAttribute('width', '30px');
                        milestone_icon.setAttribute('id', `milestone-icon-${milestone.id}`)
                        document.querySelector(`#li-left-${milestone.id}`).appendChild(milestone_icon)
                        // circle rendering
                        circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        circle.setAttribute('class', 'milestone-circle');
                        circle.setAttribute('id', `milestone-circle-${milestone.id}`);
                        circle.setAttribute('r', '5');
                        circle.setAttribute('cx', '5px');
                        circle.setAttribute('cy', '50%');
                        circle.setAttribute('fill', 'rgba(75, 83, 88, 1)')

                        document.querySelector(`#milestone-icon-${milestone.id}`).appendChild(circle)
                    // right div
                    li_right = document.createElement('div');
                    li_right.setAttribute('class', 'li-right');
                    li_right.setAttribute('id', `li-right-${milestone.id}`);
                    document.querySelector(`#li-wrap-${milestone.id}`).appendChild(li_right);
                        // milestone title  
                        milestone_title = document.createElement('input');
                        milestone_title.setAttribute('class', 'milestone-input');
                        milestone_title.setAttribute('type', 'text');
                        milestone_title.setAttribute('oninput', `add_milestone(${milestone.id})`);
                        milestone_title.setAttribute('placeholder', 'add milestone');
                        milestone_title.setAttribute('id', `description-${milestone.id}`);                      
                        document.querySelector(`#li-right-${milestone.id}`).appendChild(milestone_title);
                        milestone_title.innerText = milestone.task

             console.log(`new milestone status: ${milestone.open} view: ${view}`)
            });
    
    // Create create container for voting sliders and settings
    voting_container = document.createElement('div');
    voting_container.setAttribute('id', 'voting-container-task');
    voting_container.setAttribute('style', 'display: none')
    document.querySelector('.task-box').appendChild(voting_container);

// Create placeholder DIVs for voting / settings / teams
    // For VOTING            
    container = document.createElement('div');
    container.setAttribute('id', 'placeholder-container-voting');
    container.setAttribute('class', 'placeholder-container');
    container.setAttribute('style', 'display: none')
    document.querySelector('.task-box').appendChild(container);
    // For PRIVACY SETTINGS
    container = document.createElement('div');
    container.setAttribute('id', 'placeholder-container-settings');
    container.setAttribute('class', 'placeholder-container');
    container.setAttribute('style', 'display: none')
    document.querySelector('.task-box').appendChild(container);
    // For TEAM SETTINGS
    container = document.createElement('div');
    container.setAttribute('id', 'placeholder-container-team');
    container.setAttribute('class', 'placeholder-container');
    container.setAttribute('style', 'display: none')
    document.querySelector('.task-box').appendChild(container);

// Create save button
    save_button = document.createElement('button');
    save_button.setAttribute('class', 'save-button');
    save_button.setAttribute('id', 'save-button-new-task');
    save_button.setAttribute('style', 'color: white');
    save_button.innerText = "Save"
    document.querySelector('.task-box').appendChild(save_button);

    // Add functions
            // render sliders (Task nav -> icon 1)
            hower_vote('new_task');
            settings(privacy_settings, 'settings');
            settings(team_settings, 'team');
            // Responsive
            if (mediaQuery.matches) {
                document.querySelector('#save-button-new-task').style.display = "none"
            }
    // Responsive adjustments
    if (mediaQuery.matches) {
        document.querySelector('#task').style.pointerEvents = "auto"
    }

            

    
};
// change color of "check" icon and update Task.completed --> used for milestone circles
function set_status(status) {
    if (status == "open") {
        svg = document.querySelector('#check-circle');
        svg.setAttribute('style', 'stroke: rgba(22, 22, 24, 1)')

        svg = document.querySelector('#check-path');
        svg.setAttribute('style', 'stroke: rgba(22, 22, 24, 1)')

        document.querySelector('#task-nav-icon-3').setAttribute('onclick', 'set_status("close")')
        document.querySelector('#task-nav-icon-3').setAttribute('data-completed', false);

        task_id = event.target.dataset.task_id
        console.log(task_id);

        const csrftoken = getCookie('csrftoken');
        const request = new Request(
            `/task/update/${task_id}/status`,
            {headers: {'X-CSRFToken': csrftoken}}
        )    
        fetch(request, {method: 'PUT'})
        console.log('changed status to close')

    } else if (status == "close") {
        svg = document.querySelector('#check-circle');
        svg.setAttribute('style', 'stroke: rgba(99, 193, 50, 1)')

        svg = document.querySelector('#check-path');
        svg.setAttribute('style', 'stroke: rgba(99, 193, 50, 1)')

        document.querySelector('#task-nav-icon-3').setAttribute('onclick', 'set_status("open")');
        document.querySelector('#task-nav-icon-3').setAttribute('data-completed', true);

        task_id = event.target.dataset.task_id
        console.log(task_id);

        const csrftoken = getCookie('csrftoken');
        const request = new Request(
            `/task/update/${task_id}/status`,
            {headers: {'X-CSRFToken': csrftoken}}
        )    
        fetch(request, {method: 'PUT'})
        console.log('changed status to open')
    }    
}
// similar set color of check icon based on the actuatl status of the rendered task
function set_status_render(status) {
    console.log("set status render evoked")
    if (status == true) {
        console.log("set status render evoked TRUE")
        svg = document.querySelector('#check-circle');
        svg.setAttribute('style', 'stroke: rgba(99, 193, 50, 1)') // green
        svg = document.querySelector('#check-path');
        svg.setAttribute('style', 'stroke: rgba(99, 193, 50, 1)') // green
    } else {
        console.log("set status render evoked FALSE")
        svg = document.querySelector('#check-circle');
        svg.setAttribute('style', 'stroke: rgba(22, 22, 24, 1)') // dark grey
        svg = document.querySelector('#check-path');
        svg.setAttribute('style', 'stroke: rgba(22, 22, 24, 1)') // dark grey
    }
}
// Used for "new task" function (see last line)
function add_milestone(id) {

        var milestone = 
            {
        "id": id+1,
        "task": "call customer",
        "open": true,
            },
        
    
         li_wrap = document.createElement('li');
         li_wrap.setAttribute('class', 'li-wrap');
         li_wrap.setAttribute('id', `li-wrap-${milestone.id}`);
         document.querySelector('.ul-milestones').appendChild(li_wrap);
             // left div
             li_left = document.createElement('div');
             li_left.setAttribute('class', 'li-left');
             li_left.setAttribute('id', `li-left-${milestone.id}`);
             document.querySelector(`#li-wrap-${milestone.id}`).appendChild(li_left);
                 // milestone svg container
                 milestone_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                 milestone_icon.setAttribute('class', 'milestone-svg-container');
                 milestone_icon.setAttribute('height', '30px');
                 milestone_icon.setAttribute('width', '30px');
                 milestone_icon.setAttribute('id', `milestone-icon-${milestone.id}`)
                 document.querySelector(`#li-left-${milestone.id}`).appendChild(milestone_icon)
                 // circle rendering
                 circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                 circle.setAttribute('class', 'milestone-circle');
                 circle.setAttribute('id', `milestone-circle-${milestone.id}`);
                 circle.setAttribute('r', '5');
                 circle.setAttribute('cx', '5px');
                 circle.setAttribute('cy', '50%');
                 circle.setAttribute('fill', 'rgba(75, 83, 88, 1)');
                 document.querySelector(`#milestone-icon-${milestone.id}`).appendChild(circle)
             // right div
             li_right = document.createElement('div');
             li_right.setAttribute('class', 'li-right');
             li_right.setAttribute('id', `li-right-${milestone.id}`);
             document.querySelector(`#li-wrap-${milestone.id}`).appendChild(li_right);
                 // milestone title  
                 milestone_title = document.createElement('input');
                 milestone_title.setAttribute('class', 'milestone-input');
                 milestone_title.setAttribute('type', 'text');
                 milestone_title.setAttribute('oninput', `add_milestone(${milestone.id})`);
                 milestone_title.setAttribute('placeholder', 'add milestone');
                 milestone_title.setAttribute('id', `description-${milestone.id}`);                      
                 document.querySelector(`#li-right-${milestone.id}`).appendChild(milestone_title);

     


        document.querySelector(`#description-${id}`).removeAttribute('oninput');          

}
// Used for "view task" function (see last line)
function add_milestone_view(id) {

    var milestone = 
        {
    "id": id+1,
    "task": "call customer",
    "open": true,
        },
    

     li_wrap = document.createElement('li');
     li_wrap.setAttribute('class', 'li-wrap');
     li_wrap.setAttribute('id', `li-wrap-${milestone.id}`);
     document.querySelector('.ul-milestones').appendChild(li_wrap);
         // left div
         li_left = document.createElement('div');
         li_left.setAttribute('class', 'li-left');
         li_left.setAttribute('id', `li-left-${milestone.id}`);
         document.querySelector(`#li-wrap-${milestone.id}`).appendChild(li_left);
             // milestone svg container
             milestone_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
             milestone_icon.setAttribute('class', 'milestone-svg-container');
             milestone_icon.setAttribute('height', '30px');
             milestone_icon.setAttribute('width', '30px');
             milestone_icon.setAttribute('id', `milestone-icon-${milestone.id}`)
             document.querySelector(`#li-left-${milestone.id}`).appendChild(milestone_icon)
             // circle rendering
             circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
             circle.setAttribute('class', 'milestone-circle');
             circle.setAttribute('id', `milestone-circle-${milestone.id}`);
             circle.setAttribute('r', '5');
             circle.setAttribute('cx', '5px');
             circle.setAttribute('cy', '50%');
             circle.setAttribute('onclick', 'toggle_circle()')
             circle.setAttribute('fill', 'rgba(75, 83, 88, 1)');
             document.querySelector(`#milestone-icon-${milestone.id}`).appendChild(circle)
         // right div
         li_right = document.createElement('div');
         li_right.setAttribute('class', 'li-right');
         li_right.setAttribute('id', `li-right-${milestone.id}`);
         document.querySelector(`#li-wrap-${milestone.id}`).appendChild(li_right);
             // milestone title  
             milestone_title = document.createElement('input');
             milestone_title.setAttribute('class', 'milestone-input');
             milestone_title.setAttribute('type', 'text');
             milestone_title.setAttribute('oninput', `add_milestone(${milestone.id})`);
             milestone_title.setAttribute('placeholder', 'add milestone');
             milestone_title.setAttribute('id', `description-${milestone.id}`);                      
             document.querySelector(`#li-right-${milestone.id}`).appendChild(milestone_title);
}
    



