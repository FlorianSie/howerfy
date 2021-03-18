document.addEventListener('DOMContentLoaded', () => {

    // Show logout icon in footer on mobile
    if (mediaQuery.matches) {
        document.querySelector('#nav-login-footer').style.display == 'block'
    }

    sign_out_buttons = document.querySelectorAll('#user-avatar')
            sign_out_buttons.forEach(element => {
                element.onclick = logout;
            });     
    
    // If "home", add button functions
    if (window.location.pathname == "/home") {
        document.querySelector('#launch-app').onclick = () => {
            window.location = "/index"
        }    
        document.querySelector('#welcome-register-button').onclick = () => {
            window.location = "/register"
    }
    }
    display_username();
    hover_user_icon();
});

async function display_username() {
    username = await get_user();
    fields = document.querySelectorAll('#username')
    fields.forEach(element => {
        element.innerHTML = username.username;
    });
    return username
}

function hover_user_icon() {
    document.querySelector('#user-avatar').addEventListener('mouseenter', () => {
        if (!document.querySelector('#username').innerText.includes(" / Logout")) {
            document.querySelector('#username').innerHTML= "Logout"
        }        
    })
    document.querySelector('#user-avatar').addEventListener('mouseleave', display_username)
}

function logout() {
    window.location = "/logout"
}

function not_authenticated() {
    const csrftoken = getCookie('csrftoken');
    overlay = document.querySelector('#overlay')
    overlay.style.display = "block"
        // Sign-in container
        form = document.createElement('form');
        form.setAttribute('class', 'sign-in-form');
        form.setAttribute('action', '/login');
        form.setAttribute('method', 'post')

        overlay.appendChild(form);
            // Sign-in image
            // sign in button container
            div = document.createElement('div');
            div.setAttribute('class', 'auth-button-container')
            document.querySelector('.sign-in-form').appendChild(div)
            // CSRF
            hidden = document.createElement('input');
            hidden.setAttribute('type', 'hidden');
            hidden.setAttribute('name', 'csrfmiddlewaretoken');
            hidden.setAttribute('value', csrftoken);
            document.querySelector('.sign-in-form').appendChild(hidden)

            // Username field
            user = document.createElement('input');
            user.setAttribute('class', 'user-login-field');
            user.setAttribute('placeholder', 'Username');
            user.setAttribute('name', 'username');
            document.querySelector('.auth-button-container').appendChild(user)
            // Password field
            password = document.createElement('input');
            password.setAttribute('class', 'user-login-field');
            password.setAttribute('type', 'password');
            password.setAttribute('name', 'password');
            password.setAttribute('placeholder', 'Password');
            document.querySelector('.auth-button-container').appendChild(password)
            // Login button
            button = document.createElement('button');
            button.setAttribute('class', 'sign-in-button');
            button.setAttribute('type', 'submit');

            button.innerText = "Login"
            document.querySelector('.auth-button-container').appendChild(button)
            // Register text
            register = document.createElement('small');
            register.innerHTML = "No account yet? Register here"
            document.querySelector('.auth-button-container').appendChild(register);
}



