document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#nav-plus').onclick = () => {
        document.querySelector('#task').style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';

        render_task("task");
    }
});


// Close task view
function close_task(view) {
    if (view == "voting") {
        document.querySelector('#close-icon-svg').addEventListener('click', () => {
            document.querySelector('.task-prev-hover').addEventListener('mouseleave', clear_task_view);
            clear_task_view(); 
        }); 
    } else if (view == "task") {
        document.querySelector('#overlay').style.display = 'none';
        div = document.querySelector('#task');
        while (div.firstChild) {
            div.removeChild(div.lastChild)
        }
    }
}

// fill circles depending on whether task is open or not
function set_circle(id, status) {
    if (status) {
        document.querySelector(`#milestone-circle-${id}`).setAttribute('fill', 'rgba(75, 83, 88, 1)')
    } else {
        document.querySelector(`#milestone-circle-${id}`).setAttribute('fill', 'rgba(99, 193, 50, 1)') 
    }
}

// Add voting function to menue button on task view
function show_sliders() {
    console.log('show sliders evoked')
    if (document.querySelector('#voting-container-task').style.display == 'flex') {
        document.querySelector('#voting-container-task').style.display = 'none'
    } else {
        document.querySelector('#voting-container-task').style.display = 'flex'
    }    
}

// Hower vote button function
function hower_vote() {
    console.log('hower_vote evoked')
    clear_view('#voting-container-task');
    show_sliders();
    
    div = document.createElement('div');
    div.setAttribute('class', 'container-sliders');
    div.setAttribute('id', 'container-slider-1');
    document.querySelector('#voting-container-task').appendChild(div)
    
    div = document.createElement('div');
    div.setAttribute('class', 'container-sliders');
    div.setAttribute('id', 'container-slider-2');
    document.querySelector('#voting-container-task').appendChild(div)

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

privacy_settings = ['visibility', 'editable', 'milestones']
team_settings = ['to_team', 'to_team_member']

function settings(array) {
    // container that holds options below the task box
    clear_view('#voting-container-task');
    show_sliders();

    div = document.createElement('div');
    div.setAttribute('class', 'settings-box');
    document.querySelector('#voting-container-task').appendChild(div);

    div = document.createElement('div');
    div.setAttribute('class', 'settings-box');
    div.setAttribute('id', 'settings-box-wrap');
    document.querySelector('.settings-box').appendChild(div);

    array.forEach(element => {

        row = document.createElement('div');
        row.setAttribute('class', 'settings-row-inner');
        row.setAttribute('id', `settings-row-${element}`);
        document.querySelector('#settings-box-wrap').appendChild(row)

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
                input.innerText = "only me"
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

function render_task(view) {
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
        {
        "id": "2",
        "task": "do yoga",
        "open": false,    
        }
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
                title_text = document.createElement('h3');
                title_text.setAttribute('class', 'h3');
                title_text.setAttribute('id', 'title-text');
                document.querySelector('.div-title').appendChild(title_text);
                title_text = document.querySelector('#title-text');
                
                title_text.innerText = title_get;

                // task progress
                progress_text = document.createElement('h3');
                progress_text.setAttribute('class', 'h3');
                progress_text.setAttribute('id', 'progress-text');
                document.querySelector('.div-title').appendChild(progress_text);
                progress_text = document.querySelector('#progress-text');

                progress_text.innerText = progress;
                // task date
                date_text = document.createElement('h3');
                date_text.setAttribute('class', 'h3');
                date_text.setAttribute('id', 'date-text');
                document.querySelector('.div-title').appendChild(date_text);
                date_text = document.querySelector('#date-text');
                
                date_text.innerText = date;

        // row 2 insinde left div
        row_2 = document.createElement('div');
        row_2.setAttribute('class', 'row-2');
        document.querySelector('.container-left').appendChild(row_2)

            // task description div
            description_div = document.createElement('div');
            description_div.setAttribute('class', 'div-description');
            document.querySelector('.row-2').appendChild(description_div);

                description = document.createElement('p');
                description.setAttribute('class', 'description');
                description.setAttribute('id', 'task-description');
                document.querySelector('.div-description').appendChild(description);
                description_text = document.querySelector('#task-description');

                description_text.innerText = description_get;

            // task nav
            nav_container = document.createElement('div');
            nav_container.setAttribute('class', 'row-3');
            document.querySelector('.container-left').appendChild(nav_container);
                // nav container 1 -- HOWER VOTE ICON
                nav_svg_container = document.createElement('div');
                nav_svg_container.setAttribute('class', 'task-nav-icon');
                nav_svg_container.setAttribute('id', 'task-nav-icon-1');
                nav_svg_container.setAttribute('tabindex', '0');
                nav_svg_container.setAttribute('onclick', `hower_vote()`)
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
                nav_svg_container.setAttribute('onclick', 'settings(team_settings)');
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
                nav_svg_container.setAttribute('onclick', `settings(privacy_settings)`);
                nav_svg_container.setAttribute('tabindex', '0');
                document.querySelector('.row-3').appendChild(nav_svg_container);
                    // add SVG LOCK
                    task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    task_svg.setAttribute('class', 'task-nav-svg-container');
                    task_svg.setAttribute('height', '30px');
                    task_svg.setAttribute('width', '30px');
                    document.querySelector('#task-nav-icon-4').appendChild(task_svg);
                        // render SVG
                        document.querySelector('#task-nav-icon-4').innerHTML = `<svg class="nav-svg" width="30px" height="30px" viewBox="0 0 68 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
                        <g transform="matrix(1,0,0,1,-505.388,-576.657)">
                            <g id="Lock" transform="matrix(0.155392,0,0,0.154854,410.867,530.572)">
                                <path stroke-width:"4" class="nav-svg" d="M825.741,720.251C833.938,718.663 840.142,713.061 843.209,707.116L843.209,657.828C868.963,622.084 840.428,600.335 825.645,603.526C810.394,600.975 779.49,617.682 804.513,656.448L804.513,707.299C810.639,715.17 817.73,719.432 825.741,720.251Z"/>
                                <rect stroke-width:"4" class="nav-svg" x="622.755" y="507.12" width="402.877" height="316.279"/>
                                <path stroke-width:"4" class="nav-svg" d="M950.245,507.12L950.245,400.935C894.004,282.001 752.037,282.958 701.395,401.254"/>
                                <path stroke-width:"4" class="nav-svg" d="M701.395,507.12L701.395,401.254"/>
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

        // append row 2 for milestones
        row_2_right = document.createElement('div');
        row_2_right.setAttribute('class', 'row-2-right');
        document.querySelector('.container-right').appendChild(row_2_right)

            // function for creating LI for each Milestone
            milestones_data.forEach(milestone => { 
                
                li_wrap = document.createElement('div');
                li_wrap.setAttribute('class', 'li-wrap');
                li_wrap.setAttribute('id', `li-wrap-${milestone.id}`);
                document.querySelector('.row-2-right').appendChild(li_wrap);
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
                        milestone_title = document.createElement('p');
                        milestone_title.setAttribute('class', 'description');
                        milestone_title.setAttribute('id', `description-${milestone.id}`);                      
                        document.querySelector(`#li-right-${milestone.id}`).appendChild(milestone_title);
                        milestone_title.innerText = milestone.task 

             set_circle(milestone.id, milestone.open);
            });
    
    // Create create container for voting sliders
    voting_container = document.createElement('div');
    voting_container.setAttribute('id', 'voting-container-task');
    voting_container.setAttribute('style', 'display: none')
    document.querySelector('.task-box').appendChild(voting_container); 
    
};

function set_status(status) {
    if (status == "open") {
        svg = document.querySelector('#check-circle');
        svg.style.removeProperty('stroke')

        svg = document.querySelector('#check-path');
        svg.style.removeProperty('stroke')

        document.querySelector('#task-nav-icon-3').setAttribute('onclick', 'set_status("close")')

    } else if (status == "close") {
        svg = document.querySelector('#check-circle');
        svg.setAttribute('style', 'stroke: rgba(99, 193, 50, 1)')

        svg = document.querySelector('#check-path');
        svg.setAttribute('style', 'stroke: rgba(99, 193, 50, 1)')

        document.querySelector('#task-nav-icon-3').setAttribute('onclick', 'set_status("open")')
    }
    
}