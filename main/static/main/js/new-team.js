// Event listeners
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#team').onclick = () => {
        // defined in main.js --> clears div if not null
        clear_view('#new-team');
        clear_view('#all-tasks');
        clear_view('#voting-view');

        document.querySelector('#start').style.display = 'none'
        document.querySelector('#voting-view').style.display = 'none'
        document.querySelector('#task').style.display = 'none'
        document.querySelector('#all-tasks').style.display = 'none'
        document.querySelector('#new-team').style.display = 'flex'
        document.querySelector('#dropdown-view').style.display = "none"
        document.querySelector('#team-overview').style.display = 'none'

        new_team_view();
    }
})

// Dummy data 


async function get_team(ID) {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `/team/${ID}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    var res = await fetch(request, { method: 'POST'})
    return res.json()
}
async function render_new_team_task(view, ID) {
    document.querySelector('#task').style.display = 'block';
    document.querySelector('#overlay').style.display = 'block';
    render_new_task(view);
    // Pre fill "new task" mask
    team = await get_team(ID); 

    document.querySelector('#settings-input-Team').innerText = team.name;
    document.querySelector('#settings-input-Team').setAttribute('data-team_id', `${ID}`);
    document.querySelector('#dropdown-row-svg-to_team').setAttribute('onclick', '');    
}
// Creates title and description within the left div of the new team section. --> Function could be used to display existing teams content
function create_text_box() {
    box = document.createElement('div');
    box.setAttribute('class', 'text-box');
    box.setAttribute('id', 'new-team-text-box')
    document.querySelector('#new-team-container-left').appendChild(box);
        // Title
        title_container = document.createElement('input');
        title_container.setAttribute('class', 'new-team-title-container change');
        title_container.setAttribute('placeholder', 'Name your team...');
        title_container.setAttribute('id', 'new-team-title');
        title_container.setAttribute('oninput', 'enable_create()');
        document.querySelector('#new-team-text-box').appendChild(title_container);
            // Text
            title = document.createElement('h2');
            title.innerText = 'dummy title';
            document.querySelector('#new-team-title').appendChild(title);
        // Description
        title_container = document.createElement('textarea');
        title_container.setAttribute('class', 'new-team-description-container change');
        title_container.setAttribute('id', 'new-team-description');
        title_container.setAttribute('oninput', 'enable_create()');
        title_container.setAttribute('placeholder', 'Add a short text that describes the purpose of your team...');
        document.querySelector('#new-team-text-box').appendChild(title_container);
            // Description
            title = document.createElement('p');
            title.setAttribute('id', 'description');
            title.innerText = 'dummy description this team is going to achieve something great, we just have to work very very hard. dummy description this team is going to achieve something great, we just have to work very very hard.';
            document.querySelector('#new-team-description').appendChild(title);
        // Add separator
        separator = document.createElement('div');
        separator.setAttribute('class', 'separator-horizontal');
        document.querySelector('#new-team-container-left').appendChild(separator);
} 
function people_container() {
    box = document.createElement('div');
    box.setAttribute('class', 'new-team-people-box');
    box.setAttribute('id', 'new-team-people-box');
    document.querySelector('#new-team-container-left').appendChild(box);
}
function render_avatar(data) {
    box = document.createElement('div')
    box.setAttribute('class', 'avatar-box-team')
    document.querySelector('#new-team-people-box').appendChild(box);
        // Add plus container
        avatar_box = document.createElement('div');
        avatar_box.setAttribute('class', 'avatar-container');
        avatar_box.setAttribute('id', 'avatar-container-plus');

        document.querySelector('.avatar-box-team').appendChild(avatar_box);

        avatar_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        avatar_svg.setAttribute('class', 'avatar-svg-container');
        avatar_svg.setAttribute('id', `avatar-svg-container-plus`)
        avatar_svg.setAttribute('onclick', 'icon_plus_user(1)')
        avatar_svg.setAttribute('height', '40px');
        avatar_svg.setAttribute('width', '40px');
        document.querySelector('#avatar-container-plus').appendChild(avatar_svg);

        document.querySelector('#avatar-svg-container-plus').innerHTML = `<svg width="100%" height="100%" viewBox="0 0 105 105" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
        <g transform="matrix(1,0,0,1,-204.003,-325.481)">
            <g id="Plus-icon" serif:id="Plus icon" transform="matrix(1,0,0,1,-3.61055,-0.667249)">
                <g>
                    <g transform="matrix(1,0,0,1,-0.517319,-0.195682)">
                        <path class="nav-svg" d="M260.7,351.534L260.7,406.516"/>
                    </g>
                    <g transform="matrix(6.12323e-17,1,-1,6.12323e-17,639.208,118.129)">
                        <path class="nav-svg" d="M260.7,351.534L260.7,406.516"/>
                    </g>
                </g>
                <g transform="matrix(1.12992,0,0,1.12992,-43.952,-53.2295)">
                    <circle class="nav-svg" cx="268.883" cy="382" r="44.251"/>
                </g>
            </g>
        </g>
    </svg>`    

        // Avatar container --> for each
        if (data != "") {
        data.forEach(element => {
        
            avatar_box = document.createElement('div');
            avatar_box.setAttribute('class', 'avatar-container');
            avatar_box.setAttribute('id', `avatar-container-${element.id}`);

            document.querySelector('.avatar-box-team').appendChild(avatar_box);
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
                    name_text.innerText = `${element.name}`;
                    document.querySelector(`#name-div-${element.id}`).appendChild(name_text);
                });
            }     
}
async function new_team_view() {
// Create message container
messages = document.createElement('div');
messages.setAttribute('class', 'new-team-messages');
messages.setAttribute('style', 'display: none');
document.querySelector('#new-team').appendChild(messages);
    // Create message <P>
    p = document.createElement('p');
    p.setAttribute('id', 'new-team-message');
    document.querySelector('.new-team-messages').appendChild(p);
// Create Box
box = document.createElement('div');
box.setAttribute('class', 'new-team-box')
document.querySelector('#new-team').appendChild(box);
    // Create left container
    left_div = document.createElement('div');
    left_div.setAttribute('class', 'new-team-container');
    left_div.setAttribute('id', 'new-team-container-left');
    document.querySelector('.new-team-box').appendChild(left_div);
    // Create center Container
    separator = document.createElement('div');
    separator.setAttribute('class', 'voting-separator')
    document.querySelector('.new-team-box').appendChild(separator);
    // Create Right Container
    right_div = document.createElement('div');
    right_div.setAttribute('class', 'new-team-container');
    right_div.setAttribute('id', 'new-team-container-right');
    document.querySelector('.new-team-box').appendChild(right_div);
            // Title
            title_container = document.createElement('div');
            title_container.setAttribute('class', 'new-team-title-container');
            title_container.setAttribute('id', 'new-team-tasks-title');
            document.querySelector('#new-team-container-right').appendChild(title_container);
                // Text
                title = document.createElement('h2');
                title.innerText = 'Tasks';
                document.querySelector('#new-team-tasks-title').appendChild(title);
            tasks_container = document.createElement('div');
            tasks_container.setAttribute('class', 'new-team-tasks-container');
            tasks_container.setAttribute('id', 'new-team-tasks-container');
            document.querySelector('#new-team-container-right').appendChild(tasks_container);
            // Add message container
            message_container = document.createElement('div');
            message_container.setAttribute('class', 'message-container')
            message_container.setAttribute('id', 'message-container-newTeam')
            document.querySelector('#new-team-container-right').appendChild(message_container);
                // X icon
                task_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                task_svg.setAttribute('class', 'task-nav-svg-container');
                task_svg.setAttribute('id', 'close-icon-messages');
                task_svg.setAttribute('onclick', 'close_task("message")');
                task_svg.setAttribute('height', '30px');
                task_svg.setAttribute('width', '30px');
                document.querySelector('#message-container-newTeam').appendChild(task_svg);
    
                document.querySelector('#close-icon-messages').innerHTML = `<svg onclick='close_task("message")' id="close-icon-svg" width="20px" height="20px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" class="nav-svg">
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
                // message
                message = document.createElement('p');
                message.setAttribute('class', 'message-text')
                document.querySelector('#message-container-newTeam').appendChild(message)
                message.innerText = "Create team first before assigning tasks to it"

            

    // Create plus icon that links to create new task view
    circle_box = document.createElement('div');
    circle_box.setAttribute('class', 'avatar-container');
    circle_box.setAttribute('id', 'tasks-container-plus');

    document.querySelector('#new-team-container-right').appendChild(circle_box);

    circle_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    circle_svg.setAttribute('class', 'avatar-svg-container');
    circle_svg.setAttribute('id', `tasks-svg-container-plus`)
    circle_svg.setAttribute('height', '40px');
    circle_svg.setAttribute('width', '40px');
    document.querySelector('#tasks-container-plus').appendChild(circle_svg);

    document.querySelector('#tasks-svg-container-plus').innerHTML = `<svg width="100%" height="100%" viewBox="0 0 105 105" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g transform="matrix(1,0,0,1,-204.003,-325.481)">
        <g id="Plus-icon" serif:id="Plus icon" transform="matrix(1,0,0,1,-3.61055,-0.667249)">
            <g>
                <g transform="matrix(1,0,0,1,-0.517319,-0.195682)">
                    <path class="nav-svg-inactive" d="M260.7,351.534L260.7,406.516"/>
                </g>
                <g transform="matrix(6.12323e-17,1,-1,6.12323e-17,639.208,118.129)">
                    <path class="nav-svg-inactive" d="M260.7,351.534L260.7,406.516"/>
                </g>
            </g>
            <g transform="matrix(1.12992,0,0,1.12992,-43.952,-53.2295)">
                <circle class="nav-svg-inactive" cx="268.883" cy="382" r="44.251"/>
            </g>
        </g>
    </g>
</svg>`

    // Create save button
    save_button = document.createElement('button');
    save_button.setAttribute('class', 'save-button');
    save_button.setAttribute('id', 'create-team-button');
    save_button.setAttribute('style', 'color: white');
    save_button.innerText = "Create Team"
    document.querySelector('#new-team-container-right').appendChild(save_button);



// Left div
 create_text_box();
 people_container();
 render_avatar("");
 user = await get_user();
 console.log(user)
 add_avatar(user);

// Right div

}
function search_render_avatar(data) {
    box = document.createElement('div')
    box.setAttribute('class', 'avatar-box')
    document.querySelector('#suggestions').appendChild(box);

        // Avatar container --> for each
        data.forEach(element => {
        
            avatar_box = document.createElement('div');
            avatar_box.setAttribute('class', 'avatar-container');
            avatar_box.setAttribute('id', `avatar-container-${element.id}`);

            document.querySelector('.avatar-box').appendChild(avatar_box);
            // Render SVG
                avatar_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                avatar_svg.setAttribute('class', 'avatar-svg-container-search');
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

                document.querySelector(`#avatar-svg-container-${element.id}`).setAttribute('onclick', `user_to_team(${element.id})`)
                name_div = document.createElement('div');
                name_div.setAttribute('class', 'name-div');
                name_div.setAttribute('id', `name-div-${element.id}`)
                document.querySelector(`#avatar-container-${element.id}`).appendChild(name_div);

                    name_text = document.createElement('p');
                    name_text.setAttribute('class', 'name-text');
                    name_text.innerText = `${element.username}`;
                    document.querySelector(`#name-div-${element.id}`).appendChild(name_text);
        });     

}
async function user_to_team(user_id) {
    team_id = document.querySelector('.user-search-container').dataset.team_id;

    new_member = await fetch(`add-user/${team_id}/${user_id}`);
    member = await new_member.json();

    console.log(member)

    add_avatar(member)

    document.querySelector('.user-search-container').style.display = 'none'
    document.querySelector('#overlay').style.display = 'none'
}
function icon_plus_user(team_id) {
    document.querySelector('#overlay').style.display = "block"
    search = document.querySelector('.user-search-container');
    search.style.display = 'flex'
    search.setAttribute('data-team_id', team_id)
    document.querySelector('#user-search').style.display = 'flex';
}
function add_avatar(data) {
    console.log('add_avatar evoked')

        
    avatar_box = document.createElement('div');
    avatar_box.setAttribute('class', 'avatar-container');
    avatar_box.setAttribute('id', `avatar-container-team-${data.id}`);

    var node = document.querySelector('.avatar-box-team')
    node.insertBefore(avatar_box, node.lastChild)

    // Render SVG
        avatar_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        avatar_svg.setAttribute('class', 'avatar-svg-container');
        avatar_svg.setAttribute('id', `avatar-svg-container-team-${data.id}`)
        avatar_svg.setAttribute('data-id', `${data.id}`)
        avatar_svg.setAttribute('height', '60px');
        avatar_svg.setAttribute('width', '60px');
        document.querySelector(`#avatar-container-team-${data.id}`).appendChild(avatar_svg);

        document.querySelector(`#avatar-svg-container-team-${data.id}`).innerHTML = `<svg width="100%" height="100%" viewBox="0 0 124 124" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
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
        name_div.setAttribute('id', `name-div-team-${data.id}`)
        document.querySelector(`#avatar-container-team-${data.id}`).appendChild(name_div);


            name_text = document.createElement('p');
            name_text.setAttribute('class', 'name-text');
            name_text.innerText = `${data.username}`;
            document.querySelector(`#name-div-team-${data.id}`).appendChild(name_text);




}
// Listens for input into TITLE and DESCRIPTION field. If both aren't empty, the "Create Team" button is enabled
function enable_create() {    
    var title_get = document.querySelector('#new-team-title').value;
    var description_get = document.querySelector('#new-team-description').value;
    console.log(`title: ${title_get}, description: ${description_get}`)

    if (title_get !="" && description_get !="") {
        document.querySelector('#create-team-button').setAttribute('class', 'save-button-active');
        document.querySelector('#create-team-button').setAttribute('onclick', 'new_team()');        
    } else {
        document.querySelector('#create-team-button').setAttribute('class', 'save-button');
        document.querySelector('#create-team-button').removeAttribute('onclick');
    }
}
function new_team() {
    const csrftoken = getCookie('csrftoken');

    var team_title = document.querySelector('#new-team-title').value
    var team_description = document.querySelector('#new-team-description').value
    var team_members = document.querySelectorAll('.avatar-svg-container')
    //var team_tasks = 
    

    members = []
    team_members.forEach(member => {
        if (member.dataset.id) {
            id = member.dataset.id
            members.push(id);
        }
    });
    console.log(`${team_title}, ${team_description}, ${members}`) 

    const request = new Request(
        '/new_team',
        {headers: {'X-CSRFToken': csrftoken}}
    );

    fetch(request, {
        method: 'POST',
        body: JSON.stringify({
            title: team_title,
            description: team_description,
            members_get: members,        
        })
    })
    .then(response => response.json())
    .then(res => {
        document.querySelector('#new-team-message').innerText = res['message']
        document.querySelector('.new-team-messages').style.display = 'flex'
        document.querySelector('#message-container-newTeam').style.display = 'none'
        document.querySelector('.new-team-title-container').setAttribute('readonly', 'True')
        document.querySelector('#new-team-description').setAttribute('readonly', 'True')
        document.querySelector('#avatar-svg-container-plus').setAttribute('onclick', '')
        document.querySelector('#create-team-button').setAttribute('class', 'save-button')
        document.querySelector('#tasks-svg-container-plus').setAttribute('onclick', `render_new_team_task("task", ${res['ID']})`);
        inactive = document.querySelectorAll('.nav-svg-inactive');
        inactive.forEach(element => {
            element.setAttribute('class', 'nav-svg')            
        });
        setTimeout(() => {
            document.querySelector('.new-team-messages').style.display = 'none'
        }, 5000);
    });
}



