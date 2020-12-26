document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#voting').onclick = () => {
        // defined in main.js --> clears div if not null
        clear_view('#voting-view');
        clear_view('#new-team');
        clear_view('#all-tasks');
        document.querySelector('#voting-view').style.display = 'flex'
        document.querySelector('#task').style.display = 'none'
        document.querySelector('#new-team').style.display = 'none'
        document.querySelector('#all-tasks').style.display = 'block'
        document.querySelector('#dropdown-view').style.display = "block"
        voting();
    }  

    


})
// collect ids in array
// dummy data
array = [12,13,14,15,16]

function add_hover_class(array) {
    array.forEach(id => {
        prev = document.querySelector(`#task-prev-${id}`);
        prev.setAttribute('class', 'task-prev-hover');

    });
}

function clear_task_view() {
    if (document.querySelector('#voting-container-right').hasChildNodes()) {
        div = document.querySelector('#voting-container-right');
        while (div.firstChild) {
            div.removeChild(div.lastChild)
        }
    }
}

function add_hover_function() {


    document.querySelector('.task-prev-hover').addEventListener('mouseover', () => {
        render_task("voting");
    });
    document.querySelector('.task-prev-hover').addEventListener('mouseleave', clear_task_view)


    document.querySelector('.task-prev-hover').addEventListener('click', () => {  
        render_task_full();
        document.querySelector('.task-prev-hover').removeEventListener('mouseleave', clear_task_view);   
    })

}

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

    // Dummy data
    render_task_preview(12, "voting", 3, "do homework", "20%", true);
    render_task_preview(13, "voting", 3, "do homework", "20%", true);
    render_task_preview(14, "voting", 3, "do homework", "20%", true);
    render_task_preview(15, "voting", 3, "do homework", "20%", true);
    render_task_preview(16, "voting", 3, "do homework", "20%", true);


    add_hover_class(array);
    add_hover_function();


}

