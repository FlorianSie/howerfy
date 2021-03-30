document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#voting').onclick = () => {
        // defined in main.js --> clears div if not null
        clear_view('#voting-view');
        clear_view('#new-team');
        clear_view('#all-tasks');
        document.querySelector('#start').style.display = 'none'
        document.querySelector('#voting-view').style.display = 'flex'
        document.querySelector('#task').style.display = 'none'
        document.querySelector('#new-team').style.display = 'none'
        document.querySelector('#all-tasks').style.display = 'none'
        document.querySelector('#dropdown-view').style.display = "none"
        document.querySelector('#team-overview').style.display = 'none'
        voting();
        add_view_dropdown('voting');
        get_voting_tasks("voting");
        // Adjustments for mobile
        if (mediaQuery.matches) {
            // adds voting sliders below voting tasks overview
            hower_vote();
            add_voting_button_mobile();
        }
    }
})

function add_hover_class() {
    prev = document.querySelectorAll('.task-prev');
    prev.forEach(element => {
        element.classList.add('task-prev-hover');            
    });
}
function add_visible_class() {
    prev = document.querySelectorAll('.task-prev-hover');
    prev.forEach(element => {
        element.classList.add('visible')
    })
}
function clear_task_view() {
    if (document.querySelector('#voting-container-right').hasChildNodes()) {
        div = document.querySelector('#voting-container-right');
        while (div.firstChild) {
            div.removeChild(div.lastChild)
        }
    }
}
function new_rating() {
    id_get = document.querySelector('#save-button-voting').dataset.id
    importance_get = document.querySelector('#slider-importance').value
    urgency_get = document.querySelector('#slider-urgency').value    

    const csrftoken = getCookie('csrftoken');

    const request = new Request(
        '/new_rating',
        {headers: {'X-CSRFToken': csrftoken}}
    );

    fetch(request, {
        method: 'POST',
        body: JSON.stringify({
            task: id_get,
            importance: importance_get,
            urgency: urgency_get,
        })
    });
    if (!mediaQuery.matches) {    
    document.querySelector('#save-button-voting').setAttribute('class', 'save-button');
    elements = document.querySelectorAll('.task-prev');
    elements.forEach(element => {
        element.removeEventListener('mouseleave', clear_task_view);
        element.removeEventListener('mouseover', on_hover);
        element.setAttribute('class', 'task-prev-hover')
    });
    clear_task_view();
    add_hover_function()
    }
    fade_out_task();
    // Inactivate sliders if mobile
    if (mediaQuery.matches) {
        document.querySelector('#container-slider-1').setAttribute('class', 'container-sliders-inactive');
        document.querySelector('#container-slider-2').setAttribute('class', 'container-sliders-inactive');
    }    
}
function fade_out_task() {
    document.querySelector(`#task-prev-${id_get}`).classList.add('class', 'faded');
    close_task('voting'); 
}
function on_hover() {
    if (event.target.className == "task-prev-hover") {
        id = event.target.dataset.id;
        render_task(id, "voting");
        }
}
function add_hover_function() {
        
    array = document.querySelectorAll('.task-prev-hover');
    
    array.forEach(prev_element => {        
        prev_element.addEventListener('mouseleave', clear_task_view);
        prev_element.addEventListener('mouseover', on_hover);

        prev_element.addEventListener('click', () => {
            console.log('click')
            if (event.target.className == "task-prev-hover") {
                id = event.target.dataset.id;
                render_task(id, "voting");
                document.querySelector(`#task-prev-${id}`).setAttribute('class', 'task-prev-select');
                targetElement = document.querySelector(`#task-prev-${id}`)
                // Remove "mouse" functions from the element that triggered the event
                targetElement.removeEventListener('mouseleave', clear_task_view);
                targetElement.removeEventListener('mouseover', on_hover);
                // Remove "mouse" functions from all other elements
                elements = document.querySelectorAll('.task-prev-hover');
                elements.forEach(element => {
                    element.removeEventListener('mouseleave', clear_task_view);
                    element.removeEventListener('mouseover', on_hover);
                    element.setAttribute('class', 'task-prev')
                });
            }               
        })
    })     
};
function voting() {
    left_div = document.createElement('div');
    left_div.setAttribute('class', 'voting-container');
    left_div.setAttribute('id', 'voting-container-left');
    document.querySelector('#voting-view').appendChild(left_div);

    separator = document.createElement('div');
    separator.setAttribute('class', 'voting-separator')
    document.querySelector('#voting-view').appendChild(separator);

    right_div = document.createElement('div');
    right_div.setAttribute('class', 'voting-container');
    right_div.setAttribute('id', 'voting-container-right');
    document.querySelector('#voting-view').appendChild(right_div);
}
async function get_task(id) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `/task/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    const response = await fetch(request, {method:'POST'})
    return response.json();    
}
async function render_task(id, view) {
    // Get task data
    task =  await get_task(id)
    

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
        } else if (view == "general") {
            document.querySelector('#overlay').style.display = "block";
            div = document.querySelector('#task');
            div.style.display = "block";
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
                    title_text.setAttribute('readonly', 'True');
                    title_text.setAttribute('value', `${task.title}`);
                    title_text.setAttribute('class', 'title-input');
                    title_text.setAttribute('id', 'title-text');
                    document.querySelector('.div-title').appendChild(title_text);
                    title_text = document.querySelector('#title-text');
    
                    // task date
                    date_text = document.createElement('input');
                    date_text.setAttribute('class', 'date-picker');
                    date_text.setAttribute('type', 'date');
                    date_text.setAttribute('readonly', 'True');
                    date_text.setAttribute('value', `${task.deadline}`);
                    date_text.setAttribute('id', 'date-text');
                    document.querySelector('.div-title').appendChild(date_text);
                    date_text = document.querySelector('#date-text');                    
    
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
                    description.setAttribute('readonly', 'True');
                    description.setAttribute('text', `${task.description}`);
                    description.setAttribute('id', 'task-description');
                    description.innerText = task.description
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
                    // nav container 4 -- CHECK ICON
                    nav_svg_container = document.createElement('div');
                    nav_svg_container.setAttribute('class', 'task-nav-icon-plain');
                    nav_svg_container.setAttribute('id', 'task-nav-icon-3');
                    nav_svg_container.setAttribute('onclick', 'set_status("close")');
                    nav_svg_container.setAttribute('data-task_id', `${task.id}`);
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
        // create right container
        container_right = document.createElement('div')
        container_right.setAttribute('class', 'container-right')
        document.querySelector('.task-container').appendChild(container_right)
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
    
                progress_text.innerText = `${task.progress}%`;
    
            // append row 2 for milestones
            row_2_right = document.createElement('div');
            row_2_right.setAttribute('class', 'row-2-right');
            document.querySelector('.container-right').appendChild(row_2_right)
                // creatae ul
                ul = document.createElement('ul');
                ul.setAttribute('class', 'ul-milestones');
                document.querySelector('.row-2-right').appendChild(ul)
        
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
        save_button.setAttribute('class', 'save-button-active');
        save_button.setAttribute('id', 'save-button-voting');
        save_button.setAttribute('onclick', 'new_rating()');
        save_button.setAttribute('data-id', `${id}`);
        save_button.setAttribute('style', 'color: white');
        save_button.innerText = "Vote"
        document.querySelector('.task-box').appendChild(save_button);
    
        // Add functions
        
        console.log(task.completed)

        if (view == 'voting') {
                // render sliders (Task nav -> icon 1)
                hower_vote();
                show_options('voting');
                settings(privacy_settings, 'settings');
                settings(team_settings, 'team');
                close_task('voting');
                render_milestones();

        } else if (view == 'general') {
            settings(privacy_settings, 'settings');
            settings(team_settings, 'team');
            // Grey out voting function
            hover_icon = document.querySelector('#task-nav-icon-1');
            hover_icon.setAttribute('class', 'task-nav-icon-plain');
            // Add settings which are not displayed under "voting view"
                            // nav container 2 -- TEAM SETTINGS ICON
                            nav_svg_container = document.createElement('div');
                            nav_svg_container.setAttribute('class', 'task-nav-icon');
                            nav_svg_container.setAttribute('id', 'task-nav-icon-2');
                            nav_svg_container.setAttribute('onclick', `show_options('team')`);
                            nav_svg_container.setAttribute('tabindex', '0');
                            document.querySelector('.row-3').insertBefore(nav_svg_container, document.querySelector('#task-nav-icon-3'));
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
                            document.querySelector('.row-3').insertBefore(nav_svg_container, document.querySelector('#task-nav-icon-3'));
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
            // if own task || team task:
            user = await get_user();
            render_milestones();


            if (task.user == user.id) {
                document.querySelector('.title-input').removeAttribute('readonly');
                document.querySelector('.description').removeAttribute('readonly');
                document.querySelector('.date-picker').removeAttribute('readonly');
                mstones = document.querySelectorAll('.milestone-input')
                mstones.forEach(mstone => {
                    mstone.removeAttribute('readonly')
                });
                document.querySelector('#save-button-voting').innerText = 'Update'                
                document.querySelector('#save-button-voting').setAttribute('onclick', `update_task(${task.id}, "update")`)
                // Add "add milestone"
                add_milestone_view(1)
            } else if (task.user != user.id) {
                document.querySelector('#save-button-voting').style.display = "none"
                document.querySelector('.row-3').classList.add('not-own-task');
                milestones = document.querySelectorAll('.milestone-circle')
                milestones.forEach(milestone => {
                    milestone.removeAttribute('onclick');
                    milestone.style.pointerEvents = "none"                 
                });
            } 
            
        }
        console.log(task.completed)
        if (task.completed) {
            document.querySelector('#task-nav-icon-3').setAttribute('onclick', 'set_status("open")')          
        } else if (task.completed) {
            document.querySelector('#task-nav-icon-3').setAttribute('onclick', 'set_status("close")')
        }
        set_status_render(task.completed)

    // Responsive adjustments
    if (mediaQuery.matches) {
        document.querySelector('.row-3').before(container_right)
        document.querySelector('#task').style.pointerEvents = 'auto'
    }

};
function render_milestones() {
    // function for creating LI for each Milestone
    task.milestones.forEach(milestone => { 

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
            milestone_icon.setAttribute('id', `milestone-icon-${milestone.id}`);
            milestone_icon.setAttribute('data-id', `${milestone.id}`);
            document.querySelector(`#li-left-${milestone.id}`).appendChild(milestone_icon)
            // circle rendering
            circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'milestone-circle');
            circle.setAttribute('id', `milestone-circle-${milestone.id}`);
            circle.setAttribute('r', '5');
            circle.setAttribute('cx', '5px');
            circle.setAttribute('onclick', `toggle_circle(${milestone.id})`)
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
            milestone_title.setAttribute('readonly', 'true');
            milestone_title.setAttribute('value', milestone.title);
            milestone_title.setAttribute('id', `description-${milestone.id}`);
            milestone_title.setAttribute('data-id', `${milestone.id}`);                    
            document.querySelector(`#li-right-${milestone.id}`).appendChild(milestone_title);
    set_circle(milestone.id, milestone.completed);
    });
}
function get_voting_tasks(view) {
    console.log('get_voting_tasks fired')
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `voting`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {method:'POST'})
    .then(response => response.json())
    .then(tasks => tasks_get = tasks)
    .then(() => console.log(tasks_get))
    .then(() => {
        // Add Placeholder immage if no tasks returned
        if (tasks_get == "" && mediaQuery.matches) {
            voting_view = document.querySelector('#voting-container-left')
            well_done_svg = `<svg id="b799fbe1-7cb7-4635-8884-b814a9e7e215" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="150px" height="150px" viewBox="0 0 640.65724 577.17886"><path d="M438.404,307.82132c-11.01605-32.92966-45.0348-51.23148-67.41427-43.7448s-38.5377,42.57432-27.52165,75.504c10.19672,30.48049,41.09425,48.07684,62.34943,44.93672a2.4111,2.4111,0,0,0-.29727.86443l-.64994,5.42078a2.44167,2.44167,0,0,0,3.24841,2.589l10.94888-3.92591a2.44172,2.44172,0,0,0,.8633-4.06338l-3.94671-3.77257a2.41653,2.41653,0,0,0-.46175-.33188C434.48011,371.08126,448.62292,338.36807,438.404,307.82132Z" transform="translate(-279.67138 -161.41057)" fill="#f2f2f2"/><path d="M398.52421,283.59439a40.17042,40.17042,0,0,1,18.17735,52.25234c-.9474,2.15673,2.53662,3.29094,3.4778,1.1483A43.92349,43.92349,0,0,0,400.556,280.54609C398.48974,279.45115,396.44264,282.49133,398.52421,283.59439Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><path d="M884.404,259.82132c-11.016-32.92966-45.0348-51.23148-67.41427-43.7448s-38.5377,42.57432-27.52165,75.504c10.19672,30.48049,41.09425,48.07684,62.34943,44.93672a2.4111,2.4111,0,0,0-.29727.86443l-.64994,5.42078a2.44167,2.44167,0,0,0,3.24841,2.589l10.94888-3.92591a2.44172,2.44172,0,0,0,.8633-4.06338l-3.94671-3.77257a2.41653,2.41653,0,0,0-.46175-.33188C880.48011,323.08126,894.62292,290.36807,884.404,259.82132Z" transform="translate(-279.67138 -161.41057)" fill="#f2f2f2"/><path d="M844.52421,235.59439a40.17042,40.17042,0,0,1,18.17735,52.25234c-.9474,2.15673,2.53662,3.29094,3.4778,1.1483A43.92349,43.92349,0,0,0,846.556,232.54609C844.48974,231.45115,842.44264,234.49133,844.52421,235.59439Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><path d="M625.404,206.82132c-11.016-32.92966-45.0348-51.23148-67.41427-43.7448s-38.5377,42.57432-27.52165,75.504c10.19672,30.48049,41.09425,48.07684,62.34943,44.93672a2.4111,2.4111,0,0,0-.29727.86443l-.64994,5.42078a2.44167,2.44167,0,0,0,3.24841,2.589l10.94888-3.92591a2.44172,2.44172,0,0,0,.8633-4.06338l-3.94671-3.77257a2.41653,2.41653,0,0,0-.46175-.33188C621.48011,270.08126,635.62292,237.36807,625.404,206.82132Z" transform="translate(-279.67138 -161.41057)" fill="#f2f2f2"/><path d="M585.52421,182.59439a40.17042,40.17042,0,0,1,18.17735,52.25234c-.9474,2.15673,2.53662,3.29094,3.4778,1.1483A43.92349,43.92349,0,0,0,587.556,179.54609C585.48974,178.45115,583.44264,181.49133,585.52421,182.59439Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><circle cx="290.48241" cy="201.23783" r="2.62444" fill="#ccc"/><circle cx="284.8888" cy="303.95675" r="5.18452" fill="#ccc"/><circle cx="198.09305" cy="286.18213" r="2.99584" fill="#ccc"/><circle cx="243.60567" cy="236.87991" r="3.24432" fill="#ccc"/><circle cx="403.25036" cy="427.44691" r="2.62444" fill="#ccc"/><circle cx="317.30063" cy="370.92163" r="5.18452" fill="#ccc"/><circle cx="376.33906" cy="304.8618" r="2.99584" fill="#ccc"/><circle cx="396.04016" cy="369.00206" r="3.24432" fill="#ccc"/><ellipse cx="836.6349" cy="684.24158" rx="6.76007" ry="21.53369" transform="translate(-523.77203 535.2876) rotate(-39.93837)" fill="#2f2e41"/><circle cx="511.15638" cy="515.35311" r="43.06732" fill="#2f2e41"/><rect x="516.30144" y="549.15264" width="13.08374" height="23.44171" fill="#2f2e41"/><rect x="490.13396" y="549.15264" width="13.08374" height="23.44171" fill="#2f2e41"/><ellipse cx="518.48204" cy="572.86693" rx="10.90314" ry="4.08868" fill="#2f2e41"/><ellipse cx="492.31456" cy="572.3218" rx="10.90314" ry="4.08868" fill="#2f2e41"/><path d="M777.30491,622.62674c3.84558-15.487,20.82056-24.60077,37.91474-20.35617s27.83429,20.2403,23.9887,35.7273-16.60394,15.537-33.69812,11.29235S773.45933,638.11377,777.30491,622.62674Z" transform="translate(-279.67138 -161.41057)" fill="#e6e6e6"/><ellipse cx="742.31957" cy="656.78005" rx="6.76007" ry="21.53369" transform="translate(-448.87657 884.62646) rotate(-64.62574)" fill="#2f2e41"/><circle cx="504.71776" cy="506.26552" r="14.35864" fill="#fff"/><circle cx="498.81639" cy="501.11873" r="4.78621" fill="#3f3d56"/><path d="M793.39653,697.59149a9.57244,9.57244,0,0,1-18.83533,3.42884h0l-.00336-.0185c-.94177-5.20215,3.08039-7.043,8.28253-7.98474S792.45481,692.38941,793.39653,697.59149Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><ellipse cx="430.43769" cy="644.24148" rx="21.53369" ry="6.76007" transform="translate(-604.69403 654.88722) rotate(-69.08217)" fill="#2f2e41"/><circle cx="110.95912" cy="515.35305" r="43.06735" fill="#2f2e41"/><rect x="91.33351" y="549.15265" width="13.08374" height="23.44171" fill="#2f2e41"/><rect x="117.50099" y="549.15265" width="13.08374" height="23.44171" fill="#2f2e41"/><ellipse cx="102.23666" cy="572.86693" rx="10.90314" ry="4.08868" fill="#2f2e41"/><ellipse cx="128.40414" cy="572.32178" rx="10.90314" ry="4.08868" fill="#2f2e41"/><circle cx="112.04946" cy="504.44983" r="14.71921" fill="#fff"/><circle cx="112.04945" cy="504.44983" r="4.90643" fill="#3f3d56"/><path d="M348.85377,636.7121c-3.47748-15.57379,7.63867-31.31043,24.82861-35.1488s33.94422,5.67511,37.4217,21.24884-7.91492,21.31762-25.10486,25.156S352.33125,652.286,348.85377,636.7121Z" transform="translate(-279.67138 -161.41057)" fill="#e6e6e6"/><ellipse cx="342.12235" cy="656.7801" rx="6.76007" ry="21.53369" transform="translate(-677.57762 523.03713) rotate(-64.62574)" fill="#2f2e41"/><path d="M369.476,692.30048c0,4.21515,10.85328,12.53857,22.89658,12.53857s23.33514-11.867,23.33514-16.08209-11.29193.81775-23.33514.81775S369.476,688.08533,369.476,692.30048Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><circle cx="316.67837" cy="474.35295" r="43.06733" fill="#2f2e41"/><rect x="297.05274" y="508.15264" width="13.08374" height="23.44171" fill="#2f2e41"/><rect x="323.22024" y="508.15264" width="13.08373" height="23.44171" fill="#2f2e41"/><ellipse cx="307.95583" cy="531.86693" rx="10.90314" ry="4.08868" fill="#2f2e41"/><ellipse cx="334.12337" cy="531.32176" rx="10.90314" ry="4.08868" fill="#2f2e41"/><path d="M554.573,595.71222c-3.47747-15.57379,7.63866-31.31042,24.82866-35.1488s33.94422,5.67511,37.4217,21.2489-7.91492,21.31769-25.10486,25.156S558.05049,611.286,554.573,595.71222Z" transform="translate(-279.67138 -161.41057)" fill="#6c63ff"/><ellipse cx="637.4534" cy="611.64234" rx="23.89244" ry="7.50055" transform="translate(-525.45495 468.82357) rotate(-45.0221)" fill="#2f2e41"/><ellipse cx="544.74805" cy="614.64234" rx="7.50055" ry="23.89244" transform="translate(-554.71702 403.49289) rotate(-44.9779)" fill="#2f2e41"/><path d="M858.1781,362.43165c-1.4297-44.15967-31.675-79.01642-67.55466-77.8548-79.853,2.36609-81.80308,148.80118-4.70743,159.32l-1.63226,12.97539,23.81077-.77089-2.46814-12.84263C836.64005,436.4039,859.47429,402.46761,858.1781,362.43165Z" transform="translate(-279.67138 -161.41057)" fill="#ff6584"/><path d="M750.91418,386.91539l-8.99528.29122a146.49353,146.49353,0,0,1-1.65029-50.97329l8.99528-.29123Q744.28032,362.56747,750.91418,386.91539Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><rect x="782.36555" y="443.49202" width="27" height="6" transform="translate(-293.7025 -135.42359) rotate(-1.85434)" fill="#3f3d56"/><polygon points="451.208 511.273 448.491 510.001 515.303 283.429 518.02 284.702 451.208 511.273" fill="#3f3d56"/><path d="M913.47588,399.77386c16.3163-41.05969,2.49878-85.09205-30.86214-98.349-74.15988-29.70541-134.40019,103.77921-67.9117,144.19784l-6.676,11.2453,22.13927,8.7977,2.8634-12.76032C864.20072,459,898.68322,436.99934,913.47588,399.77386Z" transform="translate(-279.67138 -161.41057)" fill="#6c63ff"/><path d="M805.35487,379.40605l-8.36382-3.32362a146.49359,146.49359,0,0,1,18.83383-47.395l8.36382,3.32362Q808.99136,354.434,805.35487,379.40605Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><rect x="819.78863" y="438.4737" width="6" height="27" transform="translate(-180.75644 888.28233) rotate(-68.32812)" fill="#3f3d56"/><polygon points="450.68 505.309 448.073 503.825 541.351 290.957 543.958 292.44 450.68 505.309" fill="#3f3d56"/><path d="M406.46357,365.28486c-17.653-40.503-58.64132-61.70977-91.54993-47.36676-73.32174,31.71782-21.00088,168.50073,54.522,149.77438l3.28,12.65965,21.8391-9.51844-7.04085-11.02049C413.79663,441.97911,422.46809,402.00562,406.46357,365.28486Z" transform="translate(-279.67138 -161.41057)" fill="#6c63ff"/><path d="M315.84888,427.6866l-8.25042,3.5959a146.49372,146.49372,0,0,1-20.37675-46.75242l8.25043-3.59589Q300.68422,407.51577,315.84888,427.6866Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><rect x="366.13977" y="463.42577" width="27" height="6" transform="translate(-434.41032 29.11894) rotate(-23.54967)" fill="#3f3d56"/><path d="M448.08285,673.26319h0a1.49991,1.49991,0,0,1-1.81676-1.09466L381.05867,465.5523l2.91162-.722,65.20734,206.61591A1.49991,1.49991,0,0,1,448.08285,673.26319Z" transform="translate(-279.67138 -161.41057)" fill="#3f3d56"/><path d="M465.51017,738.58943h-157a1,1,0,0,1,0-2h157a1,1,0,0,1,0,2Z" transform="translate(-279.67138 -161.41057)" fill="#ccc"/><path d="M864.51017,738.58943h-157a1,1,0,0,1,0-2h157a1,1,0,0,1,0,2Z" transform="translate(-279.67138 -161.41057)" fill="#ccc"/><path d="M677.51017,697.58943h-157a1,1,0,0,1,0-2h157a1,1,0,0,1,0,2Z" transform="translate(-279.67138 -161.41057)" fill="#ccc"/><circle cx="314.86635" cy="468.24973" r="14.71921" fill="#fff"/><circle cx="314.86635" cy="468.24974" r="4.90643" fill="#3f3d56"/><path d="M606.22226,656.88283a9.57244,9.57244,0,0,1-18.83533,3.42884h0l-.00335-.0185c-.94178-5.20215,3.08038-7.043,8.28253-7.98474S605.28055,651.68075,606.22226,656.88283Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/></svg>`
            div = document.createElement('div');
            div.innerHTML = well_done_svg
            document.querySelector('#voting-view').insertBefore(div, voting_view);
            
            text = document.createElement('h3')
            text.style.color = "rgb(22, 22, 24)";
            text.innerText = "There are no tasks to vote for right now!"
            document.querySelector('#voting-view').insertBefore(text, div);            
        } else if (tasks_get == "") {

            document.querySelector(".voting-separator").style.display = "none"
            document.querySelector(".voting-container").style.display = "none"
            document.querySelector("#voting-container-right").style.display = "none"

            document.querySelector("#voting-view").style.flexDirection = "column"

            voting_view = document.querySelector('#voting-container-left')
            well_done_svg = `<svg id="b799fbe1-7cb7-4635-8884-b814a9e7e215" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="350px" height="350px" viewBox="0 0 640.65724 577.17886"><path d="M438.404,307.82132c-11.01605-32.92966-45.0348-51.23148-67.41427-43.7448s-38.5377,42.57432-27.52165,75.504c10.19672,30.48049,41.09425,48.07684,62.34943,44.93672a2.4111,2.4111,0,0,0-.29727.86443l-.64994,5.42078a2.44167,2.44167,0,0,0,3.24841,2.589l10.94888-3.92591a2.44172,2.44172,0,0,0,.8633-4.06338l-3.94671-3.77257a2.41653,2.41653,0,0,0-.46175-.33188C434.48011,371.08126,448.62292,338.36807,438.404,307.82132Z" transform="translate(-279.67138 -161.41057)" fill="#f2f2f2"/><path d="M398.52421,283.59439a40.17042,40.17042,0,0,1,18.17735,52.25234c-.9474,2.15673,2.53662,3.29094,3.4778,1.1483A43.92349,43.92349,0,0,0,400.556,280.54609C398.48974,279.45115,396.44264,282.49133,398.52421,283.59439Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><path d="M884.404,259.82132c-11.016-32.92966-45.0348-51.23148-67.41427-43.7448s-38.5377,42.57432-27.52165,75.504c10.19672,30.48049,41.09425,48.07684,62.34943,44.93672a2.4111,2.4111,0,0,0-.29727.86443l-.64994,5.42078a2.44167,2.44167,0,0,0,3.24841,2.589l10.94888-3.92591a2.44172,2.44172,0,0,0,.8633-4.06338l-3.94671-3.77257a2.41653,2.41653,0,0,0-.46175-.33188C880.48011,323.08126,894.62292,290.36807,884.404,259.82132Z" transform="translate(-279.67138 -161.41057)" fill="#f2f2f2"/><path d="M844.52421,235.59439a40.17042,40.17042,0,0,1,18.17735,52.25234c-.9474,2.15673,2.53662,3.29094,3.4778,1.1483A43.92349,43.92349,0,0,0,846.556,232.54609C844.48974,231.45115,842.44264,234.49133,844.52421,235.59439Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><path d="M625.404,206.82132c-11.016-32.92966-45.0348-51.23148-67.41427-43.7448s-38.5377,42.57432-27.52165,75.504c10.19672,30.48049,41.09425,48.07684,62.34943,44.93672a2.4111,2.4111,0,0,0-.29727.86443l-.64994,5.42078a2.44167,2.44167,0,0,0,3.24841,2.589l10.94888-3.92591a2.44172,2.44172,0,0,0,.8633-4.06338l-3.94671-3.77257a2.41653,2.41653,0,0,0-.46175-.33188C621.48011,270.08126,635.62292,237.36807,625.404,206.82132Z" transform="translate(-279.67138 -161.41057)" fill="#f2f2f2"/><path d="M585.52421,182.59439a40.17042,40.17042,0,0,1,18.17735,52.25234c-.9474,2.15673,2.53662,3.29094,3.4778,1.1483A43.92349,43.92349,0,0,0,587.556,179.54609C585.48974,178.45115,583.44264,181.49133,585.52421,182.59439Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><circle cx="290.48241" cy="201.23783" r="2.62444" fill="#ccc"/><circle cx="284.8888" cy="303.95675" r="5.18452" fill="#ccc"/><circle cx="198.09305" cy="286.18213" r="2.99584" fill="#ccc"/><circle cx="243.60567" cy="236.87991" r="3.24432" fill="#ccc"/><circle cx="403.25036" cy="427.44691" r="2.62444" fill="#ccc"/><circle cx="317.30063" cy="370.92163" r="5.18452" fill="#ccc"/><circle cx="376.33906" cy="304.8618" r="2.99584" fill="#ccc"/><circle cx="396.04016" cy="369.00206" r="3.24432" fill="#ccc"/><ellipse cx="836.6349" cy="684.24158" rx="6.76007" ry="21.53369" transform="translate(-523.77203 535.2876) rotate(-39.93837)" fill="#2f2e41"/><circle cx="511.15638" cy="515.35311" r="43.06732" fill="#2f2e41"/><rect x="516.30144" y="549.15264" width="13.08374" height="23.44171" fill="#2f2e41"/><rect x="490.13396" y="549.15264" width="13.08374" height="23.44171" fill="#2f2e41"/><ellipse cx="518.48204" cy="572.86693" rx="10.90314" ry="4.08868" fill="#2f2e41"/><ellipse cx="492.31456" cy="572.3218" rx="10.90314" ry="4.08868" fill="#2f2e41"/><path d="M777.30491,622.62674c3.84558-15.487,20.82056-24.60077,37.91474-20.35617s27.83429,20.2403,23.9887,35.7273-16.60394,15.537-33.69812,11.29235S773.45933,638.11377,777.30491,622.62674Z" transform="translate(-279.67138 -161.41057)" fill="#e6e6e6"/><ellipse cx="742.31957" cy="656.78005" rx="6.76007" ry="21.53369" transform="translate(-448.87657 884.62646) rotate(-64.62574)" fill="#2f2e41"/><circle cx="504.71776" cy="506.26552" r="14.35864" fill="#fff"/><circle cx="498.81639" cy="501.11873" r="4.78621" fill="#3f3d56"/><path d="M793.39653,697.59149a9.57244,9.57244,0,0,1-18.83533,3.42884h0l-.00336-.0185c-.94177-5.20215,3.08039-7.043,8.28253-7.98474S792.45481,692.38941,793.39653,697.59149Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><ellipse cx="430.43769" cy="644.24148" rx="21.53369" ry="6.76007" transform="translate(-604.69403 654.88722) rotate(-69.08217)" fill="#2f2e41"/><circle cx="110.95912" cy="515.35305" r="43.06735" fill="#2f2e41"/><rect x="91.33351" y="549.15265" width="13.08374" height="23.44171" fill="#2f2e41"/><rect x="117.50099" y="549.15265" width="13.08374" height="23.44171" fill="#2f2e41"/><ellipse cx="102.23666" cy="572.86693" rx="10.90314" ry="4.08868" fill="#2f2e41"/><ellipse cx="128.40414" cy="572.32178" rx="10.90314" ry="4.08868" fill="#2f2e41"/><circle cx="112.04946" cy="504.44983" r="14.71921" fill="#fff"/><circle cx="112.04945" cy="504.44983" r="4.90643" fill="#3f3d56"/><path d="M348.85377,636.7121c-3.47748-15.57379,7.63867-31.31043,24.82861-35.1488s33.94422,5.67511,37.4217,21.24884-7.91492,21.31762-25.10486,25.156S352.33125,652.286,348.85377,636.7121Z" transform="translate(-279.67138 -161.41057)" fill="#e6e6e6"/><ellipse cx="342.12235" cy="656.7801" rx="6.76007" ry="21.53369" transform="translate(-677.57762 523.03713) rotate(-64.62574)" fill="#2f2e41"/><path d="M369.476,692.30048c0,4.21515,10.85328,12.53857,22.89658,12.53857s23.33514-11.867,23.33514-16.08209-11.29193.81775-23.33514.81775S369.476,688.08533,369.476,692.30048Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><circle cx="316.67837" cy="474.35295" r="43.06733" fill="#2f2e41"/><rect x="297.05274" y="508.15264" width="13.08374" height="23.44171" fill="#2f2e41"/><rect x="323.22024" y="508.15264" width="13.08373" height="23.44171" fill="#2f2e41"/><ellipse cx="307.95583" cy="531.86693" rx="10.90314" ry="4.08868" fill="#2f2e41"/><ellipse cx="334.12337" cy="531.32176" rx="10.90314" ry="4.08868" fill="#2f2e41"/><path d="M554.573,595.71222c-3.47747-15.57379,7.63866-31.31042,24.82866-35.1488s33.94422,5.67511,37.4217,21.2489-7.91492,21.31769-25.10486,25.156S558.05049,611.286,554.573,595.71222Z" transform="translate(-279.67138 -161.41057)" fill="#6c63ff"/><ellipse cx="637.4534" cy="611.64234" rx="23.89244" ry="7.50055" transform="translate(-525.45495 468.82357) rotate(-45.0221)" fill="#2f2e41"/><ellipse cx="544.74805" cy="614.64234" rx="7.50055" ry="23.89244" transform="translate(-554.71702 403.49289) rotate(-44.9779)" fill="#2f2e41"/><path d="M858.1781,362.43165c-1.4297-44.15967-31.675-79.01642-67.55466-77.8548-79.853,2.36609-81.80308,148.80118-4.70743,159.32l-1.63226,12.97539,23.81077-.77089-2.46814-12.84263C836.64005,436.4039,859.47429,402.46761,858.1781,362.43165Z" transform="translate(-279.67138 -161.41057)" fill="#ff6584"/><path d="M750.91418,386.91539l-8.99528.29122a146.49353,146.49353,0,0,1-1.65029-50.97329l8.99528-.29123Q744.28032,362.56747,750.91418,386.91539Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><rect x="782.36555" y="443.49202" width="27" height="6" transform="translate(-293.7025 -135.42359) rotate(-1.85434)" fill="#3f3d56"/><polygon points="451.208 511.273 448.491 510.001 515.303 283.429 518.02 284.702 451.208 511.273" fill="#3f3d56"/><path d="M913.47588,399.77386c16.3163-41.05969,2.49878-85.09205-30.86214-98.349-74.15988-29.70541-134.40019,103.77921-67.9117,144.19784l-6.676,11.2453,22.13927,8.7977,2.8634-12.76032C864.20072,459,898.68322,436.99934,913.47588,399.77386Z" transform="translate(-279.67138 -161.41057)" fill="#6c63ff"/><path d="M805.35487,379.40605l-8.36382-3.32362a146.49359,146.49359,0,0,1,18.83383-47.395l8.36382,3.32362Q808.99136,354.434,805.35487,379.40605Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><rect x="819.78863" y="438.4737" width="6" height="27" transform="translate(-180.75644 888.28233) rotate(-68.32812)" fill="#3f3d56"/><polygon points="450.68 505.309 448.073 503.825 541.351 290.957 543.958 292.44 450.68 505.309" fill="#3f3d56"/><path d="M406.46357,365.28486c-17.653-40.503-58.64132-61.70977-91.54993-47.36676-73.32174,31.71782-21.00088,168.50073,54.522,149.77438l3.28,12.65965,21.8391-9.51844-7.04085-11.02049C413.79663,441.97911,422.46809,402.00562,406.46357,365.28486Z" transform="translate(-279.67138 -161.41057)" fill="#6c63ff"/><path d="M315.84888,427.6866l-8.25042,3.5959a146.49372,146.49372,0,0,1-20.37675-46.75242l8.25043-3.59589Q300.68422,407.51577,315.84888,427.6866Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/><rect x="366.13977" y="463.42577" width="27" height="6" transform="translate(-434.41032 29.11894) rotate(-23.54967)" fill="#3f3d56"/><path d="M448.08285,673.26319h0a1.49991,1.49991,0,0,1-1.81676-1.09466L381.05867,465.5523l2.91162-.722,65.20734,206.61591A1.49991,1.49991,0,0,1,448.08285,673.26319Z" transform="translate(-279.67138 -161.41057)" fill="#3f3d56"/><path d="M465.51017,738.58943h-157a1,1,0,0,1,0-2h157a1,1,0,0,1,0,2Z" transform="translate(-279.67138 -161.41057)" fill="#ccc"/><path d="M864.51017,738.58943h-157a1,1,0,0,1,0-2h157a1,1,0,0,1,0,2Z" transform="translate(-279.67138 -161.41057)" fill="#ccc"/><path d="M677.51017,697.58943h-157a1,1,0,0,1,0-2h157a1,1,0,0,1,0,2Z" transform="translate(-279.67138 -161.41057)" fill="#ccc"/><circle cx="314.86635" cy="468.24973" r="14.71921" fill="#fff"/><circle cx="314.86635" cy="468.24974" r="4.90643" fill="#3f3d56"/><path d="M606.22226,656.88283a9.57244,9.57244,0,0,1-18.83533,3.42884h0l-.00335-.0185c-.94178-5.20215,3.08038-7.043,8.28253-7.98474S605.28055,651.68075,606.22226,656.88283Z" transform="translate(-279.67138 -161.41057)" fill="#fff"/></svg>`
            div = document.createElement('div');
            div.innerHTML = well_done_svg
            document.querySelector('#voting-view').insertBefore(div, voting_view);
            
            text = document.createElement('h3')
            text.style.color = "rgb(22, 22, 24)";
            text.innerText = "There are no tasks to vote for right now!"
            document.querySelector('#voting-view').insertBefore(text, div);
        }
        tasks_get.forEach(task => {
            render_task_preview(task.id, view, task.classification, task.title, task.progress, task.completed)            
        });
    })
    .then(() => {
        if (view == 'voting' && !mediaQuery.matches) {
        add_hover_class();
        add_hover_function();
        }
    })
}
function add_voting_button_mobile() {
        // Create save button
        save_button = document.createElement('button');
        save_button.setAttribute('class', 'save-button');
        save_button.setAttribute('id', 'save-button-voting');
        save_button.setAttribute('onclick', 'new_rating()');
        save_button.setAttribute('style', 'color: white');
        save_button.innerText = "Vote"
        document.querySelector('#voting-view').appendChild(save_button);
}
async function render_task_mobile_voting(id, view) {
    task = await get_task(id);
    console.log(task)

    document.querySelector('#slider-importance').value = task.importance;
    document.querySelector('#slider-urgency').value = task.urgency;
    // Activate save button and add task ID
    document.querySelector('#save-button-voting').setAttribute('class', 'save-button-active');
    document.querySelector('#save-button-voting').setAttribute('data-id', id);
    // Activate Sliders
    document.querySelector('#container-slider-1').setAttribute('class', 'container-sliders');
    document.querySelector('#container-slider-2').setAttribute('class', 'container-sliders');



}