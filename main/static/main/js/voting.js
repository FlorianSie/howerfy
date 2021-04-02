document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#voting').onclick = () => {
        activate_nav_icon();      
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
        render_image();
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

// Render "please hover png" if tasks are displayed
async function render_image() {
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        `voting`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    const response = await fetch(request, {method:'POST'})

    if (response !== "" && !mediaQuery.matches) {
        console.log('more than one task returned')
        container = document.querySelector('#voting-container-right')
        // Add instructions
        description = document.createElement('p')
        description.setAttribute('class', 'black-p')
        description.setAttribute('id', 'instructions-voting')
        description.innerText = "Move your mouse over a task to rate it's level of urgency and importance"
        container.appendChild(description)
        // Add SVG image
        svg = document.createElement('svg')
        svg.innerHTML = `<svg id="voting-svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="250px" height="250px" viewBox="0 0 914.81679 687.57485">
        <title>voting</title>
        <circle cx="772.09812" cy="242.42547" r="21.92017" fill="#6c63ff" opacity="0.4"/><circle cx="309.93005" cy="112.5011" r="31.2479" fill="#6c63ff" opacity="0.4"/><circle cx="252.09812" cy="127.42547" r="21.92017" fill="#6c63ff" opacity="0.4"/><path d="M933.04867,593.76205c-17.32009,18.96224-17.949,46.58449-17.949,46.58449s27.4525-3.12163,44.77258-22.08387,17.949-46.58449,17.949-46.58449S950.36875,574.7998,933.04867,593.76205Z" transform="translate(-142.59161 -106.21258)" fill="#3f3d56"/><path d="M942.83253,599.21845c-5.241,25.14129-27.27179,41.81544-27.27179,41.81544s-13.53351-24.08793-8.29253-49.22921S934.54,549.98924,934.54,549.98924,948.07351,574.07717,942.83253,599.21845Z" transform="translate(-142.59161 -106.21258)" fill="#6c63ff"/><polygon points="777.746 233.581 777.746 533.289 677.843 615.818 166.746 615.818 166.746 301.631 315.876 233.581 777.746 233.581" fill="#3f3d56"/><polygon points="777.746 233.581 777.746 234.782 741.882 258.788 677.843 301.631 166.746 301.631 315.876 233.581 777.746 233.581" opacity="0.1"/><polygon points="777.746 233.581 777.746 533.289 677.843 615.818 678.567 300.907 741.882 258.788 777.167 233.581 777.746 233.581" opacity="0.1"/><polygon points="643.094 274.845 331.803 274.845 354.969 261.814 653.23 261.814 643.094 274.845" fill="#2f2e41"/><path d="M1054.35223,738.3321s6.03477,25.23633.54862,26.33356-32.36834.74308-38.95173,1.84031-20.29878-.74308-20.29878-5.68062,14.264-8.22924,14.264-8.22924,20.29879-10.97231,20.8474-11.52093S1054.35223,738.3321,1054.35223,738.3321Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path d="M1049.41469,589.65722s-1.64585,18.65294-1.64585,20.29879,1.64585,27.43079,0,28.528,1.09723,8.77785,1.09723,11.52093,8.77786,48.27819,6.58339,65.8339,3.2917,15.90985,1.64585,17.5557-1.64585,1.64585-1.64585,4.93754-17.5557,6.03478-17.5557,6.03478L1018.6922,623.12279l9.87509-36.20865Z" transform="translate(-142.59161 -106.21258)" fill="#575a89"/><path d="M1049.41469,589.65722s-1.64585,18.65294-1.64585,20.29879,1.64585,27.43079,0,28.528,1.09723,8.77785,1.09723,11.52093,8.77786,48.27819,6.58339,65.8339,3.2917,15.90985,1.64585,17.5557-1.64585,1.64585-1.64585,4.93754-17.5557,6.03478-17.5557,6.03478L1018.6922,623.12279l9.87509-36.20865Z" transform="translate(-142.59161 -106.21258)" opacity="0.1"/><path d="M1046.67161,746.01272s5.48616,19.75017,0,20.8474-32.36833-1.25692-38.95172-.15968-20.29879,1.25692-20.29879-3.68063,14.264-8.22923,14.264-8.22923,20.29879-10.97232,20.8474-11.52093S1046.67161,746.01272,1046.67161,746.01272Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path d="M1054.35223,567.71259s6.58339,15.90986-1.09723,24.13909-16.45847,24.68772-16.45847,25.78495,15.36124,110.27177,13.16677,117.40378-1.64584,11.52093-1.09723,12.61816-5.48616,7.132-12.06954,7.132-16.45848-4.93754-17.55571-9.32647,1.64585-42.24342,1.09723-49.37542-3.29169-17.55571-4.38893-19.75017-7.132-4.38893-8.22923-10.97232-9.87509-90.52161-7.132-93.26468S1054.35223,567.71259,1054.35223,567.71259Z" transform="translate(-142.59161 -106.21258)" fill="#575a89"/><circle cx="870.06582" cy="316.66544" r="18.65294" fill="#ffb9b9"/><path d="M1024.17836,432.20449s-3.84031,20.29878-1.09723,22.49324-20.8474,5.48616-20.8474,5.48616-2.74308-26.88217-3.29169-29.62525S1024.17836,432.20449,1024.17836,432.20449Z" transform="translate(-142.59161 -106.21258)" fill="#ffb9b9"/><path d="M998.942,458.538s6.58338-19.20155,33.46556-13.71539c0,0,4.93754,1.64585,3.29169,3.29169s-3.29169,1.64585-1.09723,3.2917,4.93754,0,3.2917,1.64585,14.81262,11.52093,13.71539,30.17387,3.84031,44.98649,0,49.37542,2.74308,23.59048,1.64585,27.43079,6.58339,8.77785,3.29169,10.4237-62.5422,11.52093-64.188,0-.54862-3.2917-2.19447-6.03478-2.19446-7.68062-1.09723-13.71539,3.84031-20.8474,2.74308-26.33356,0-51.56988,3.29169-57.056S998.942,458.538,998.942,458.538Z" transform="translate(-142.59161 -106.21258)" fill="#6c63ff"/><path d="M1010.463,592.4003s8.22923,31.2711-2.19447,31.2711-9.87508-32.36833-9.87508-32.36833Z" transform="translate(-142.59161 -106.21258)" fill="#ffb9b9"/><path d="M1004.42819,422.878c0,1.591,2.30416,2.60043,5.87566,2.83084h.00549a29.891,29.891,0,0,0,4.54255-.08776c2.2822-.20848,3.22587,1.93659,3.61543,4.76747.63635,4.66873-.25241,11.21371.7735,12.23962,1.41547,1.4154,11.7349-.00549,14.96076-3.21488a2.98113,2.98113,0,0,0,.9491-1.72267,9.16647,9.16647,0,0,1,2.75406-5.11859c1.90368-2.07924,4.61381-4.38344,7.66964-8.04818,5.48616-6.58339,0-7.132-1.64585-12.06955s-4.38893-6.58339-4.38893-9.87509-12.61816-6.03477-23.04186-5.48615-8.22924,13.71539-8.22924,13.71539-.61993,1.591-1.36055,3.64282a57.21447,57.21447,0,0,0-2.43582,7.911A3.98649,3.98649,0,0,0,1004.42819,422.878Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path d="M1006.62266,466.76728s18.65293-1.09723,20.29878,26.33356,1.09723,53.21573,1.09723,53.76435-7.68062,52.66712-14.81262,52.66712-12.61817-1.09724-14.264-3.84031,4.38892-42.24342,4.38892-42.24342,2.74308-41.6948-1.64585-54.86158S996.74757,468.41313,1006.62266,466.76728Z" transform="translate(-142.59161 -106.21258)" opacity="0.1"/><path d="M1003.87958,464.0242s18.65293-1.09723,20.29878,26.33356,1.09723,53.21573,1.09723,53.76435-7.68062,52.66712-14.81262,52.66712-12.61817-1.09723-14.264-3.84031,4.38892-42.24342,4.38892-42.24342,2.74308-41.6948-1.64584-54.86158S994.00449,465.67005,1003.87958,464.0242Z" transform="translate(-142.59161 -106.21258)" fill="#6c63ff"/><path d="M694.57306,195.85392s-8.12905-23.0323-14-15.80648,9.03228,19.41939,9.03228,19.41939Z" transform="translate(-142.59161 -106.21258)" fill="#a0616a"/><path d="M732.96023,173.27323,728.07,175.08556s-2.33563,10.38124-1.43241,12.1877,1.35485.45161,0,4.06452-5.41936,13.0968-5.871,14.45164-26.1936-8.58066-26.1936-13.54841c0,0-5.41937,6.32259-8.12905,7.67743,0,0,29.80651,21.67746,33.871,24.38715s6.32259,1.35484,9.9355-1.80646,18.96778-29.35489,18.96778-29.35489Z" transform="translate(-142.59161 -106.21258)" fill="#575a89"/><path d="M719.86343,333.59612s.45161,4.96775,1.35484,5.41936,7.67743,11.742,0,14-12.19357,1.35484-14,2.25807-33.41942,2.70968-33.871-2.25807,15.35487-5.871,15.35487-5.871,14.45164-9.48389,16.70971-14.45164S719.86343,333.59612,719.86343,333.59612Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path d="M811.541,342.62839s10.83873,18.51617,8.12905,20.77424-29.09883,10.487-32.96781,10.83873c-4.96775.45161-8.58066-3.61291-4.51613-5.871s12.64518-11.742,12.64518-14.90326v-8.12905Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path d="M821.92814,221.5959s9.48389,11.742-5.41937,30.70974L791.67,283.9186s15.35486,24.38715,15.80648,37.03233,3.61291,9.9355,4.51614,15.35487,4.96775,2.70968,1.80645,6.77421-14.90325,7.67743-18.51616,4.51613a11.196,11.196,0,0,1-3.61291-9.03227c0-1.80646-6.3226-12.19357-6.77421-15.35487s-17.16132-28.90328-17.16132-28.90328-5.41937-15.35487.90322-23.93553,10.50059-20.75047,10.50059-20.75047-18.62963,22.55692-31.72643,27.97629c0,0-4.96775.90323-4.06453,3.1613s0,3.61291-1.35484,5.871-10.83873,28.45166-14,35.22587-1.80646,10.83873-5.41937,13.0968-19.871.45161-19.871-1.80646,2.25807-8.129,3.61291-11.29034,12.19358-39.742,11.29035-46.06461.45161-14.90325,7.22582-18.51616,41.09685-32.9678,42.90331-32.9678S821.92814,221.5959,821.92814,221.5959Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><circle cx="588.56217" cy="25.51219" r="18.96778" fill="#a0616a"/><path d="M746.50864,133.53122s5.871,10.38712,13.0968,11.742-18.96778,22.12907-18.96778,22.12907-6.32259-19.871-11.742-20.77423S746.50864,133.53122,746.50864,133.53122Z" transform="translate(-142.59161 -106.21258)" fill="#a0616a"/><path d="M727.99248,175.98291c0,5.871,17.61293,22.58069,17.61293,22.58069l16.70971,14s.45162,4.96775,2.25807,5.41936,4.06452.45162,2.25807,3.1613-6.32259,8.58066-2.25807,9.48389a33.19905,33.19905,0,0,0,3.69869.35224c1.08394.06324,2.35741.12195,3.7891.17614,3.3419.11742,7.52385.19419,12.05355.16257q1.93071-.00678,3.929-.04515c17.07555-.33871,36.85625-2.30324,35.23944-8.77485-2.70968-10.83873-.90323-14.45164-6.77421-20.32262s-15.35486-26.1936-15.35486-26.1936-18.96778-32.06457-34.77426-32.06457l-3.28325-.8626a7.51865,7.51865,0,0,0-8.20578,3.15228c-3.17034,4.82775-8.16973,12.08067-11.09166,14.42-4.51614,3.61292-5.22068,1.02066-5.22068,1.02066S727.99248,170.11193,727.99248,175.98291Z" transform="translate(-142.59161 -106.21258)" fill="#575a89"/><path d="M768.1861,244.62821s-13.0968,20.32261-4.96775,23.93552,12.64518-21.22584,12.64518-21.22584Z" transform="translate(-142.59161 -106.21258)" fill="#a0616a"/><path d="M743.55383,129.58233c-.728-.09186-.95819-1.01038-1.08072-1.73382-.65615-3.87406-3.54323-7.54771-7.42237-8.1731a10.50968,10.50968,0,0,0-4.42234.3564,16.77941,16.77941,0,0,0-5.67433,2.793,9.35988,9.35988,0,0,1-2.83563,1.78059c-.71175.209-3.73378,1.55256-4.43989,1.77989-1.55246.4998-2.83715,2.12472-4.436,1.803-1.52966-.30781-2.1106-2.15493-2.35645-3.69575-.56011-3.51031,1.44913-8.748,3.44681-11.6883,1.516-2.23127,4.0813-3.51539,6.64622-4.3508a47.75242,47.75242,0,0,1,9.21763-1.83157c4.219-.49827,8.5887-.76263,12.63192.54148s7.72477,4.49426,8.47957,8.675c.15723.87088.18669,1.7629.37937,2.62663.47006,2.10707,1.8642,3.87819,2.67744,5.878a11.3188,11.3188,0,0,1-.3453,9.17585c-1.12613,2.26466-3.08447,4.44091-2.66184,6.93456l-3.48505-2.748a2.53111,2.53111,0,0,1-1.16328-2.96248l.50663-4.36376a3.8395,3.8395,0,0,0-.226-2.35932C745.4412,125.314,744.76757,129.73548,743.55383,129.58233Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path d="M776.31515,213.46686l-4.25417,17.6897c4.29033.15356,9.967.23485,15.98256.11742,1.51748-4.55227,2.96714-9.29874,4.07809-13.7426,4.06452-16.2581-2.70968-41.09685-6.32259-52.83881s-12.64519-14.90326-12.64519-14.90326a41.18516,41.18516,0,0,0-10.38711,5.41937C756.89576,159.2732,776.31515,213.46686,776.31515,213.46686Z" transform="translate(-142.59161 -106.21258)" opacity="0.1"/><path d="M772.70224,212.56363l-4.43036,18.41679c1.08394.06324,2.35741.12195,3.7891.17614,3.3419.11742,7.52385.19419,12.05355.16257,1.63026-4.83676,3.2065-9.94,4.39419-14.691,4.06452-16.25809-2.70968-41.09685-6.32259-52.83881s-11.51615,1.129-11.51615,1.129,3.16129-7.67744-2.70969-3.61291S772.70224,212.56363,772.70224,212.56363Z" transform="translate(-142.59161 -106.21258)" opacity="0.1"/><path d="M771.3474,148.88609s9.03227,3.16129,12.64518,14.90325,10.38712,36.58072,6.32259,52.83881S777.67,253.20887,777.67,253.20887s-8.58066-6.3226-11.742-4.96775l8.58066-35.67749S755.0893,158.37,760.96028,154.30545A41.185,41.185,0,0,1,771.3474,148.88609Z" transform="translate(-142.59161 -106.21258)" fill="#575a89"/><polygon points="635.488 269.199 510.541 8.828 301.62 109.085 378.456 269.199 635.488 269.199" fill="#f2f2f2"/><rect x="495.4802" y="243.49125" width="123.08078" height="7.6395" transform="translate(-194.75884 159.12232) rotate(-25.6354)" fill="#3f3d56"/><rect x="524.85952" y="304.71353" width="123.08078" height="7.6395" transform="translate(-218.35428 177.85945) rotate(-25.6354)" fill="#3f3d56"/><rect x="637.96766" y="186.32584" width="30.55799" height="30.55799" transform="translate(-165.51243 196.25476) rotate(-25.6354)" fill="#3f3d56"/><rect x="667.34698" y="247.54812" width="30.55799" height="30.55799" transform="translate(-189.10786 214.9919) rotate(-25.6354)" fill="#3f3d56"/><polygon points="519.718 55.924 508.372 88.206 493.077 82.83 490.984 88.785 512.214 96.246 525.672 58.017 519.718 55.924" fill="#57b894"/><polygon points="549.097 117.146 537.751 149.428 522.457 144.053 520.364 150.007 541.593 157.468 555.052 119.239 549.097 117.146" fill="#57b894"/><g id="b6a4aa65-5bff-4dd4-a595-827386906092" data-name="woman"><rect x="147.98395" y="611.96674" width="57.72353" height="57.72353" transform="translate(341.06453 1124.36413) rotate(167.94236)" fill="#f2f2f2"/><path id="ac286760-ef31-4470-8aba-995faff60c3b" data-name="right hand" d="M209.52991,591.4916s-20.73423,14.81016-13.82282,20.73423,20.73422-17.7722,20.73422-17.7722Z" transform="translate(-142.59161 -106.21258)" fill="#ffb9b9"/><path id="ad0ee0d5-d520-47bd-bca9-706ef112ee3c" data-name="left leg" d="M305.30228,614.20052s-3.94938,49.3672-4.93672,56.27861-1.97469,69.11408-3.94938,76.02549-3.94938,23.69625-3.94938,23.69625H280.61868s.98734-30.60766-1.97469-42.45579-1.97469-44.43048-1.97469-44.43048-5.92406-58.2533-2.962-66.15205S305.30228,614.20052,305.30228,614.20052Z" transform="translate(-142.59161 -106.21258)" fill="#ffb9b9"/><path id="a2d865fc-f989-4a0f-bdfe-5d1a04b5cb09" data-name="left shoe" d="M289.50477,767.23884s4.93672,2.962,4.93672,4.93672-.98734,6.91141,0,8.8861,7.89876,9.87344,3.94938,11.84813-21.72157,0-21.72157,0,.98734-13.82282,1.97469-14.81016-.98735-10.86079-.98735-10.86079Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path id="a5afd73e-dc2f-49f8-bb76-01b6bc8ff4ec" data-name="right leg" d="M229.82555,612.99062s-1.25432,49.509-.9979,56.4859-5.29085,68.93956-4.05254,76.02006,1.44026,23.97991,1.44026,23.97991l11.78267,1.24365s2.23088-30.54222,6.4202-42.014,6.62748-43.97776,6.62748-43.97776,12.006-57.30967,9.88939-65.4757S229.82555,612.99062,229.82555,612.99062Z" transform="translate(-142.59161 -106.21258)" fill="#ffb9b9"/><path id="bae9c969-98bd-41cd-ab49-dced4866e2f9" data-name="right shoe" d="M229.472,766.84173s-5.22036,2.42748-5.42764,4.39126.25643,6.97687-.93274,8.837-8.89149,8.98979-5.17121,11.36812,21.60158,2.28,21.60158,2.28.469-13.85009-.40922-14.93562,2.12191-10.69715,2.12191-10.69715Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path id="efa1face-c8d6-4f61-8a17-c81461288bfc" data-name="pants" d="M291.47946,540.14971s7.89875.98735,10.86079,17.7722,13.82281,59.24064,4.93672,62.20267-35.54439,8.8861-36.53173,6.91141-2.962-6.91141-2.962-6.91141,2.962,8.8861-.98734,8.8861-42.45579-5.92407-41.46845-8.8861,2.962-24.6836,2.962-24.6836,5.92407-36.53173,11.84813-42.45579a16.19188,16.19188,0,0,0,4.93672-12.83548Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/><path id="ba787e0e-2496-4127-9664-864bc1f1b460" data-name="left hand" d="M306.28962,532.251s-12.83547-2.962-14.81016.98734,4.93672,9.87345,7.89875,9.87345,7.89876-2.962,7.89876-2.962Z" transform="translate(-142.59161 -106.21258)" fill="#ffb9b9"/><circle id="af432612-84fe-4a80-a474-ad6710b59c23" data-name="head" cx="137.03973" cy="324.34195" r="17.77219" fill="#ffb9b9"/><path id="fc691572-079c-4ac7-a111-0c7206f484e6" data-name="neck" d="M276.6693,443.39s-2.962,13.82281-.98734,13.82281-14.81016,8.8861-14.81016,8.8861l-12.83548-1.97469-3.94937-5.92406s20.73422-13.82282,20.73422-21.72157S276.6693,443.39,276.6693,443.39Z" transform="translate(-142.59161 -106.21258)" fill="#ffb9b9"/><path id="a377c2ac-5aad-4dd5-94e4-d6887260be3a" data-name="upper body" d="M267.7832,457.21281s2.962-1.97468,3.94938-1.97468h7.89875c.98735,0,13.82282,2.962,13.82282,2.962l7.89875,44.43048s-13.82282,22.70891-3.94938,40.48111c0,0-2.962-1.97469-16.78484-.98735s-38.50642,3.94938-39.49377,3.94938-.98734-7.89876,0-9.87344-.98734-.98735-.98734-5.92407-2.962-13.82281-2.962-13.82281l-13.82282-50.35455s17.77219-9.87344,20.73423-8.8861,11.84813,3.94938,13.82281,2.962S267.7832,457.21281,267.7832,457.21281Z" transform="translate(-142.59161 -106.21258)" fill="#6c63ff"/><path id="fd50713a-8150-4e39-832b-91f38638a5e4" data-name="left arm" d="M290.49212,459.1875l2.962-.98734s5.92406-.98735,12.83547,4.93672S338.872,486.83314,338.872,486.83314s9.87344,7.89875,6.91141,16.78484-7.89875,30.60767-22.70891,29.62032c0,0-8.8861,11.84813-13.82282,9.87345s-8.88609-9.87345-5.92406-10.86079,10.86078-10.86078,10.86078-10.86078l-9.87344-18.75954h-2.962l-10.86078-5.92406Z" transform="translate(-142.59161 -106.21258)" fill="#6c63ff"/><path id="a85ddca5-281c-4897-a8aa-82a4133bac02" data-name="right arm" d="M231.25147,465.11157l-7.89875.98734s-6.91141,2.962-5.92406,15.7975-5.92407,71.08878-2.962,78.00018c0,0-9.87344,33.5697-7.89876,34.557s13.82282,6.91141,12.83548,2.962,10.86078-31.595,10.86078-31.595,13.82282-14.81016,7.89875-35.54439V513.49142Z" transform="translate(-142.59161 -106.21258)" fill="#6c63ff"/><path id="eb14ef5a-0bc4-48da-8b11-b0e113a7ef46" data-name="hair" d="M294.42253,447.737l-12.55176,2.73445-1.613-6.18045.6202,6.39679L260.62935,455.099l-.89049-3.41192.34233,3.53138-12.9691,2.82538-2.77438-26.632c-2.85224-10.92841,7.55753-22.576,18.48589-25.42826l4.84809-1.26532c8.02653-2.09487,22.61655-.19014,24.71141,7.83633C288.71652,426.54868,282.46607,441.89025,294.42253,447.737Z" transform="translate(-142.59161 -106.21258)" fill="#2f2e41"/></g></svg>`
        container.appendChild(svg)
    }  
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