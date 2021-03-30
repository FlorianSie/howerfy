document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#teams').onclick = () => {
        document.querySelector('#start').style.display = 'none'
        document.querySelector('#task').style.display = 'none';
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('#voting-view').style.display = 'none';
        document.querySelector('#new-team').style.display = 'none';
        document.querySelector('#all-tasks').style.display = 'none';
        document.querySelector('#dropdown-view').style.display = 'none';
        document.querySelector('#team-overview').style.display = 'flex';
        document.querySelector('.team-select').style.display = 'block';

        clear_view('#team-people-box');
        clear_view('#team-overview-section-3');
        clear_view('#team-list');
        clear_view('#all-tasks');

        render_all_tasks('team-overview-section-3')
        
        team_select("overview");


    }
});
// Create team select list
async function team_select(view) {
    console.log(view)

    teams = await get_teams()

    if (view == "overview") {
        teams.forEach(team => {
            div = document.createElement('div');
            div.setAttribute('class', 'team-list-item');
            div.setAttribute('id', `team-${team.id}`);
            div.setAttribute('onclick', `display_team(${team.id})`)
            document.querySelector('#team-list').appendChild(div)
                p = document.createElement('p');
                p.innerHTML = team.name
                document.querySelector(`#team-${team.id}`).appendChild(p);                
        });
    } else if (view == "all-tasks") {
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('.team-select').style.display = 'block';
        teams.forEach(team => {
            div = document.createElement('div');
            div.setAttribute('class', 'team-list-item');
            div.setAttribute('id', `team-${team.id}`);
            div.setAttribute('onclick', `display_team_tasks(${team.id})`)
            document.querySelector('#team-list').appendChild(div)
                p = document.createElement('p');
                p.innerHTML = team.name
                document.querySelector(`#team-${team.id}`).appendChild(p);                
        });
    } else if (view == "task") {

    }
}
// Get teams by signed in user
async function get_teams() {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `/team/all-teams`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    var res = await fetch(request, { method: 'POST'})
    return res.json()
}

dummy = 60
// Get team stats
async function get_stats(id) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `/team/stats/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    var res = await fetch(request, { method: 'POST'})
    return res.json()
}
// get team tasks
async function get_team_tasks(filter, id) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `/tasks/${filter}/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    var res = await fetch(request, { method: 'POST'})
    return res.json()
}
// Function that adds team data to team overview placeholders
async function display_team(id) {
    console.log('display team')

    team = await get_team(id)
    stats = await get_stats(id)
    tasks = await get_team_tasks("team-tasks", id)

    name_get = document.querySelector('#team-overview-title');
    description = document.querySelector('#team-overview-description');
    open_tasks = document.querySelector('#reporting-figure-1');
    completed_tasks = document.querySelector('#reporting-figure-2');
    focus_tasks = document.querySelector('#reporting-figure-3');

    name_get.value = team.name
    description.innerText = team.description
    open_tasks.innerText = stats.open_tasks
    completed_tasks.innerText = stats.completed_tasks
    focus_tasks.innerText = stats.focus_tasks

    // render team members and admins
    members = team.members
    admins = team.admins
    team_add_avatar(members);
    team_add_avatar(admins);
    // render task previews
    tasks.forEach(task => {
        render_task_preview(task.id, "team-tasks", task.classification, task.title, task.progress, task.completed)
        console.log(`rendered task: ${task.id}`)
    });

    close_task('team');  
    clear_view('#team-list') 


}
// Display team tasks
async function display_team_tasks(id) {
    console.log('display team tasks evoked')
    clear_view('#all-tasks-r2-1');
    clear_view('#all-tasks-r2-2');
    clear_view('#all-tasks-r2-3');
    clear_view('#all-tasks-r2-4');

    teamName = event.target.innerText
    console.log(teamName)
    document.querySelector('.dropdown-title').innerHTML = teamName;

    tasks = await get_team_tasks("team-tasks", id)
    tasks.forEach(task => {
        render_task_preview(task.id, "all_tasks", task.classification, task.title, task.progress, task.completed)
    });
    close_task('team');
    clear_view('#team-list');

    

}
// add member avatars to overview
function team_add_avatar(members) {

    members.forEach(element => {
    
        avatar_box = document.createElement('div');
        avatar_box.setAttribute('class', 'avatar-container');
        avatar_box.setAttribute('id', `avatar-container-${element.id}`);

        document.querySelector('#team-people-box').appendChild(avatar_box);
        // Render SVG
            avatar_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            avatar_svg.setAttribute('class', 'avatar-svg-container');
            avatar_svg.setAttribute('id', `avatar-svg-container-${element.id}`)
            avatar_svg.setAttribute('height', '60px');
            avatar_svg.setAttribute('width', '60px');
            document.querySelector(`#avatar-container-${element.id}`).appendChild(avatar_svg);

            document.querySelector(`#avatar-svg-container-${element.id}`).innerHTML = `<svg width="100%" height="100%" viewBox="0 0 124 124" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
            <g transform="matrix(1,0,0,1,-1174.21,-586.067)">
                <g>
                    <g transform="matrix(1.39812,0,0,1.77998,-498.863,-734.875)">
                        <ellipse cx="1240.93" cy="776.888" rx="44.275" ry="34.777" style="fill:rgba(119, 150, 203, 1);"/>
                    </g>
                    <g transform="matrix(0.385017,0,0,0.385017,713.163,414.569)">
                        <path class="nav-svg" d="M1357.91,631.105C1354.05,620.552 1348.09,616.683 1339.56,623.325C1329.1,639.334 1327.12,654.43 1311.24,658.318C1294,659.788 1286.25,651.443 1287.06,633.098C1273.52,647.962 1287.93,677.652 1311.51,677.224C1338.71,676.731 1353.21,670.336 1357.71,659.284"/>
                        <g transform="matrix(-1,0,0,1,2715.55,0)">
                            <path class="nav-svg"  d="M1357.63,631.105C1353.77,620.552 1348.09,616.683 1339.56,623.325C1329.1,639.334 1327.12,654.43 1311.24,658.318C1294,659.788 1286.25,651.443 1287.06,633.098C1273.52,647.962 1287.93,677.652 1311.51,677.224C1338.71,676.731 1353.34,670.336 1357.84,659.284"/>
                        </g>
                        <path class="nav-svg"  d="M1247.82,548.079C1278.24,531.224 1309.69,531.55 1341.97,545.289C1345.34,583.166 1333.46,605.895 1300.53,607.695C1272.34,605.418 1255.32,597.387 1247.82,548.079Z"/>
                        <g transform="matrix(-1,0,0,1,2716.52,0)">
                            <path class="nav-svg"  d="M1247.82,548.079C1278.24,531.224 1309.69,531.55 1341.97,545.289C1345.34,583.166 1333.46,605.895 1300.53,607.695C1272.34,605.418 1255.32,597.387 1247.82,548.079Z"/>
                        </g>
                        <path class="nav-svg"  d="M1341.97,545.289C1352.07,540.422 1362.84,539.859 1374.55,545.289"/>
                    </g>
                </g>
            </g>
        </svg>`

            name_div = document.createElement('div');
            name_div.setAttribute('class', 'name-div');
            name_div.setAttribute('id', `name-div-${element.id}`)
            document.querySelector(`#avatar-container-${element.id}`).appendChild(name_div);

                if (element.role == "admin") {

                    role_circle = document.createElementNS("http://www.w3.org/2000/svg", "svg");                
                    role_circle.setAttribute('class', 'milestone-svg-container');
                    role_circle.setAttribute('id', `circle-${element.id}`);
                    role_circle.setAttribute('height', '20px');
                    role_circle.setAttribute('width', '20px');
                    document.querySelector(`#name-div-${element.id}`).appendChild(role_circle);

                    circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('r', '5');
                    circle.setAttribute('cx', '5px');
                    circle.setAttribute('cy', '50%');
                    circle.setAttribute('fill', 'rgba(227, 99, 151, 1)');
                    document.querySelector(`#circle-${element.id}`).appendChild(circle);
                }

                name_text = document.createElement('p');
                name_text.setAttribute('class', 'name-text');
                name_text.innerText = `${element.username}`;
                document.querySelector(`#name-div-${element.id}`).appendChild(name_text);
            });
}

