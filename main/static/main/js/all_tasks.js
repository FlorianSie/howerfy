document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.logo').onclick = () => {
        clear_view('#all-tasks');
        clear_view('#voting-view');
        clear_view('#new-team');
        document.querySelector('#task').style.display = "none"
        document.querySelector('#new-team').style.display = 'none'
        document.querySelector('#voting-view').style.display = 'none'
        document.querySelector('#team-overview').style.display = 'none'
        document.querySelector('#all-tasks').style.display = "flex"
        document.querySelector('#dropdown-view').style.display = "block"
        render_all_tasks('all-tasks');
        add_view_dropdown('all_tasks');
        dropdown('dropdown-item-1');
    }

    if (document.querySelector('#start').style.display == 'block' && window.location.pathname != '/home') {
        document.querySelector('#all-tasks').style.display = "flex"
        document.querySelector('#dropdown-view').style.display = "block"
        render_all_tasks('all-tasks');
        add_view_dropdown('all_tasks');
        dropdown('dropdown-item-1');
    }

    document.querySelector('#nav-hower').onclick = () => {
        clear_view('#all-tasks');
        clear_view('#voting-view');
        clear_view('#new-team');
        document.querySelector('#task').style.display = "none"
        document.querySelector('#new-team').style.display = 'none'
        document.querySelector('#voting-view').style.display = 'none'
        document.querySelector('#team-overview').style.display = 'none'
        document.querySelector('#all-tasks').style.display = "flex"
        document.querySelector('#dropdown-view').style.display = "block"
        render_all_tasks('all-tasks');
        add_view_dropdown('all_tasks');
        dropdown('dropdown-item-1');
        activate_nav_icon();
    }
    if (window.location.pathname != "/home") {
        document.querySelector('.nav-svg-tasks').addEventListener('mousemove', () => {
            document.querySelector('.dropdown-list').style.display = 'block'
        })
        document.querySelector('.dropdown-list').addEventListener('mousemove', () => {
            document.querySelector('.dropdown-list').style.display = 'block'
        })
        document.querySelector('.dropdown-list').addEventListener('mouseout', () => {
            document.querySelector('.dropdown-list').style.display = 'none'
        })
    }
});

// later used for category titles
c1 = "Not Important / Not Urgent"
c2 = "Not Important / Urgent"
c3 = "Important / Urgent"
c4 = "Important / Not Urgent"

function dropdown(id) {
    All_tasks = document.querySelector(`#${id}`).innerText
    req = document.querySelector(`#${id}`).dataset.req
    view = document.querySelector(`#${id}`).dataset.view
    document.querySelector('.dropdown-title').innerText = All_tasks
    if (view == 'all_tasks') {
        clear_view('#all-tasks-r2-1');
        clear_view('#all-tasks-r2-2');
        clear_view('#all-tasks-r2-3');
        clear_view('#all-tasks-r2-4');
        get_tasks(req, view);
    }
    if (view == 'voting') {
        clear_view('#voting-container-left');
        get_tasks(req, view);
    }
    clear_view('#team-list');
}
// function that adds "view" information to dropdown items in order to distinguish between voting and all tasks view
function add_view_dropdown(view) {
    a = document.querySelectorAll('.dropdown-item');
    a.forEach(item => {
        item.setAttribute('data-view', `${view}`)        
    });
    document.querySelector('.dropdown-item-first').setAttribute('data-view', `${view}`)
    document.querySelector('.dropdown-item-last').setAttribute('data-view', `${view}`)
} 
// function to create column for each category
function create_column(category, title) {
    console.log('create column evoked')
    column = document.createElement('div');
    column.setAttribute('class', 'column-div');
    column.setAttribute('id', `column-${category}`);

    document.querySelector('.all-tasks-container').appendChild(column);

        row_1 = document.createElement('div');
        row_1.setAttribute('class', 'all-tasks-r1');
        row_1.setAttribute('id', `all-tasks-r1-${category}`);
        document.querySelector(`#column-${category}`).appendChild(row_1);

            category_title = document.createElement('h2');
            category_title.setAttribute('class', 'h2');
            category_title.innerText = title
            document.querySelector(`#all-tasks-r1-${category}`).appendChild(category_title)

        row_2 = document.createElement('div');
        row_2.setAttribute('class', 'all-tasks-r2');
        row_2.setAttribute('id', `all-tasks-r2-${category}`);
        document.querySelector(`#column-${category}`).appendChild(row_2); 
}
function render_task_preview(id, view, category, title, progress, status) {
    console.log(`render_task_preview evoked, view: ${view}`)
    task_prev = document.createElement('div');
    task_prev.setAttribute('class', 'task-prev-hover');
    task_prev.setAttribute('id', `task-prev-${id}`);
    task_prev.setAttribute('data-id', `${id}`);
    if (view == "all_tasks" || "team-tasks") {
        task_prev.setAttribute('onclick', `render_task(${id}, 'general')`)
    }
    // Check if voting view or all_tasks view is active and append previews to the respective div
    if (view == "all_tasks") {
        document.querySelector(`#all-tasks-r2-${category}`).appendChild(task_prev);
    } else if (view == "voting") {
        document.querySelector('#voting-container-left').appendChild(task_prev);
        if (mediaQuery.matches) {
            task_prev.setAttribute('onclick', `render_task_mobile_voting(${id}, 'voting')`)
        } else {
            task_prev.setAttribute('onclick', `render_task(${id}, 'voting')`)
        }
    } else if (view == "new-team") {
        document.querySelector('#new-team-tasks-container').appendChild(task_prev);
    } else {
        document.querySelector(`#all-tasks-r2-${category}`).appendChild(task_prev);
    }     
        // circle
        milestone_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        milestone_icon.setAttribute('class', 'milestone-svg-container');
        milestone_icon.setAttribute('height', '30px');
        milestone_icon.setAttribute('width', '10px');
        milestone_icon.setAttribute('id', `svg-circle-${id}`)
        document.querySelector(`#task-prev-${id}`).appendChild(milestone_icon)

        circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', `milestone-circle-${category}`);
        circle.setAttribute('id', `circle-${category}`);
        circle.setAttribute('r', '5');
        circle.setAttribute('cx', '5px');
        circle.setAttribute('cy', '50%');
        if (!status) {
            circle.setAttribute('fill', 'rgba(22, 22, 24, 1)'); // grey
        } else {
            circle.setAttribute('fill', 'rgba(99, 193, 50, 1)'); // green
        }
        document.querySelector(`#svg-circle-${id}`).appendChild(circle)
        // title
        title_text = document.createElement('p');
        title_text.setAttribute('class', 'p');
        title_text.setAttribute('id', 'task-prev-title');
        title_text.innerText = title;
        document.querySelector(`#task-prev-${id}`).appendChild(title_text)        
        // progress
        progress_text = document.createElement('p');
        progress_text.setAttribute('class', 'progress-prev');
        progress_text.setAttribute('id', 'task-prev-progress');
        progress_text.innerText = `${progress}%`;
        document.querySelector(`#task-prev-${id}`).appendChild(progress_text)   
        // details
}
function render_all_tasks(view) {
        console.log('render_all_tasks evoked')
        div = document.querySelector(`#${view}`);    
    // create container
    container = document.createElement('div');
    container.setAttribute('class', 'all-tasks-container');
    div.appendChild(container);
        // create column
        create_column(1, c1);
        create_column(2, c2);
        create_column(3, c3);
        create_column(4, c4);
}
function get_tasks(filter, view) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `/tasks/${filter}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {method:'POST'})
    .then(response => response.json())
    .then(tasks => tasks_get = tasks)
    .then(() => console.log(tasks_get))
    .then(() => {
        tasks_get.forEach(task => {
            render_task_preview(task.id, view, task.classification, task.title, task.progress, task.completed)            
        });
    })
    .then(() => {
        if (view == 'voting') {
        add_hover_class();
        add_hover_function();
        }
    })
}