# HOWERFY

## Introduction & Motivation

One of the key challenges that teams within various different fields are facing is to agree on priorities and decide, which tasks to focus on and which to delegate. A popular method to address this challenge is the "Eisenhower Matrix" (https://todoist.com/de/productivity-methods/eisenhower-matrix). The method is based on assigning tasks to four different categories, according the task's level of urgency and importance. The method suggests that tasks with a low level of importance and urgency should be ignored. Tasks that are urgent but not important should be delegated. Those tasks which are considered to be important but not yet urgent should be scheduled, while tasks which are urgent as well as important needs to be taken care of immediately.

## Problem Definition

As of today, there doesn't exist a comprehensive tool that enables individuals and teams to apply the Eisenhower framework to their daily work. While there are some websites that deal with the topic, most of them provide a pdf document or a simplified tool that doesn't allow sharing and managing tasks within teams (e.g. https://app.eisenhower.me/). Also, there is no solution that follows a "democratized" approach, meaning that all members of a team decide about the priority of their tasks collectively. Another aspect that is not part of the Eisenhower framework in narrow sense but a logical extension to it is that breaking down tasks into subtasks makes the concept much more powerful. My application aims at solving these issues through providing a responsive web application.

## Workflow

The user journey or typical workflow can be broken down into the below steps:

1. **Landingpage**

    The howerfy landingpage provides a short description of the application, already registered users can launch the application by clicking on the "Launch App" button. New users can create an account by clikcing on the "Register" button.

2. **Creating a New Task**

    After a new user has registered, he or she will automatically be logged in, the application is launched. From there, users are presented with a navbar that contains the five core functions or views of the application. Tpically, the first step that a user takes is to create a new task. This can be achieved by clicking on the "+" icon in the nav bar. From there, the user can create a new task by filling in the different fields (details to be outlined below).

3. **Keeping Track of All Tasks**

    After a new task has been created, it will show up under the "All Tasks" view, which can be opened by clicking on the second icon in the navbar. The newly created task will be assigned to one of the four categories of the Eisenhower framework, depending on the rating for urgency and importance that the user submitted while creating the task.

4. **Rating Tasks**

    The new task will also show up under the "Voting View", which is the third icon in the navbar. Here, the user can submit an (additional) rating for the task. This means that the owner of a task effectively has two votes, while potential team members have one vote only.

5. **Creating a Team**

    It is very likely that users have to deal with tasks which, in order to be completed, require others to get involved. In order to be able to align priorities within a group in a transparent and democratized way, a user can create a new team by clicking on the "New Team" icon. Once a new team has been created, team tasks can be displayed under the "All Tasks" view. Alternatively, users can take a closer look at different teams by using the "Team Overview Function"

6. **Update Tasks**

    Tasks can be update by the owner of the task. This can be done from different points within the application, e.g. by clicking on a task under the "All Tasks" view or by clicking on a task shown under a respective "Team Overview". The two mosst common things to update are:
        - Subtasks ("Milestones"): Adding additional ones or changing statuses to open or completed (can be set by clicking on the dot next to each milestone)
        - Completion status of a tasks (can be set by clicking on the check icon within the navbar of a task)

7. **Logout**

    Users can logout by clicking on the user avatar, which is displayed either in the header or footer of the application.

## Key Functions

The app is based on seven key functions, most of which can be accessed via the main navigation bar.

1. **Create New Task**

    By clicking on the "+" icon, a popup is shown that enables the user to define a new task. Besides descriptive fields such as "title", "description" and "deadline", the user can assign milestones to the task. Before each milestone, a circle indicates whether the milestone has been completed. The user can toggle the status by clicking on the respecitve circle, located next to each milestone. Based on the number of completed milestones divided by the total number of milestones, the overall progress of the task is indicated in percentage. The calculation is based on a property that has been added to the "Task" model.

    In accordance with the Eisenhower method, the user can rate urgency and importance of the task based on two sliders. The task can be assigned to a team and its visibility can be set to "only me" or "public" which will allow the task to be displayed by other users. A "check" button enables the user to set a task's status to "completed", even though not all milestones might have been completed.

    The "create new task" view is always accessible by the user. It can always be displayed on top of an overlay, which enables the user to add new tasks without the need to navigate aways from an active view (e.g. "Team Overview").

2. **Task Overview**

    The "Task Overview" shows all tasks according to its level of importance and urgency. The user can select between showing all tasks, showing all open- or closed tasks or all tasks of a specific team.

    By clicking on a task, the user can change its preferences, in case it is his or hers own task or the task has been assigned to a team that the user is member of.

3. **Voting View**

    The voting view displays all tasks that haven't received a voting by the user yet. By hovering over the task previews, the task is rendered on the right and "urgency" and "importance" sliders are shown. Once the user clicks on a task, the hover function is disabled until the user submits a rating or closes the task. Once done, the task is greyed out so that users cannot submit multiple ratings for a task.

4. **New Team**

    The "new team" function enables the user to create and manage a team. Other users can be added to a team, which enables them to see tasks that other team members created.
    Tasks can be assigned to a team in three different ways. The user who creates a new team can decide to add tasks from the "create new team" view. These tasks will then be displayed under the "tasks section", next to team title, description and team members. Alternatively a user can assign a task to a team when creating a new task via the "create new task" function.
    Already created tasks can be assigned to teams in retrospect.

5. **Team Overview**

    The "team overview" view enables users to display teams they have created or are member of. The view provides a brief statistic that shows the progress of the team ("open tasks", "completed tasks", "focus tasks").
    Below the stats, users find an overview about all tasks that have been assigned to the team, categorized by the four quadrants of the eisenhower framework. By clicking on one of the tasks, its details can be changed.

6. **Editing Tasks**

    Each task preview enables the user to edit and update its details by clicking on it, no matter under which key funtiocn it is displayed (except "voting view")

7. **Other**

    Other functions include:

    - Authentification & registration (only registered users can access the app)
    - Landingpage ("/home")

## File Structure

HTML Files
- **Index.html**

    The index file serves as main hmtl file which provides placeholder divs for the content that is rendered dynamically. The app is setup as single page application.

- **home.html**

    Provides landingpage content

- **layout.html**

    Provides navbar and footer content, extended by Index.html

- **register.html**

    Provides registration page content

Javascript and CSS files are named according to key functions as outlined above and therefore should be self explanatory. An exception is the "main.js" file, which contains more general functions (e.g. "dropdown rendering", "displaying signed in user",...) that are used as part of key functions.

## Models

There are four main models: Task, Team, Rating, Milestone

- **Task**

    The Task model contains all information about a task and is linked to the Team, Rating and Milestone model. The model has different properties linked to it, which enable to dynamically retrieve e.g. a tasks's progress or classification.
    The model uses REST framework serializers in order to cope with properties, foreign keys and many to many fields.

- **Team**
    Contains all information about a team, linked to user model

- **Rating**
    The Rating model holds all ratings (importance / urgency). It is linked to the User and Task model. Based on the Rating model, the "classification" property value of a task is calculated.

- **Milestone**
    Holds all milestone information, is linked to Task model

## "Why do you believe your project satisfies the distinctiveness and complexity requirements"?

There are three main aspects that define the complexity of the project and differentiate it from other projects of the course:

1. **Models**

    Particularly the "Task" model uses comprehensive properties, which enable to display dynamic content based on the input of users. Properties wasn't covered in the course.
    The models make use of more complex serializers, which wasn't covered in other projects or lectures. Hence my application builds on the content of the course while making use of advanced features that were not covered comprehensively.

2. **Interconnectedness of Javascript Functions**

    Each of the key functions as outlined above corresponds to a "root" Javascript functions that dynamically renders the respective content (e.g. "render_new_task").
    As those "root" functions are used at different points in the application and within different contexts, those functions are enhanced by additional functions depending on different conditions. An example can be found when considering the voting view. It makes use of the "render_task" root functions but excludes unecessary fields ("team-" and "privacy" settings) while adding e.g. voting sliders. This aspect adds a high level of complexity to the project.

3. **Design & "Eye Candy"**

    All icons and elements are created by myself. Besides that, there are some features worth to highlight:

    - When searching for other users as part of the "new team" function, user avatars are rendered according to the letters the user filled into the search field

    - Once a new team is created, a "success" message is displayed on top of the page

    - Under "voting view", tasks are rendered once the user hovers over a task preview. By clicking on a task preview, the task is fixed. After the user submits a rating, the task greys out            

## Summary & Outlook

The application solves the problem as outlined above and works well on desktop and mobile devices. It fulfils all requirements while leaving room for continued development and future releases.
The project helped me to turn theory into practice and pushed me to go further into detail while exploring additional methods and Django functionalities. While building the application, I soon discovered that there are many additional features that could be implemented - e.g.:

- Profile functionalities (e.g. "add profile picture", "follow other users",...)
- Extended team roles (e.g. "view tasks only", "add and edit tasks", "allowed to add team members",...)
- Extended dashboard
- Enable to edit a team retrospectively (e.g. add or exclude members)
- Email notifications
- Extending the use of messages
- Display who created a task
- Deleting a task
- ...

Besides various coding related learnings, it also became clear to me that planning the functioning of an application is key. Looking at the different Javascript functions in retrospect, many of these could be streamlined and simplified. Next time I will focus more on planning functions in advance while taking dependencies into account.
As the application is based on rendering content dynamically, my plan is to dive into the react framework as a next step. I hope it will enable me to build interfaces and additional features much faster. I am looking forward to building version 2.0 of my capstone project.



