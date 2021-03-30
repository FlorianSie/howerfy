from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("index", views.index, name="index"),
    path("home", views.home, name="home"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register_view, name="register"),
    path("register_new", views.register_new, name="register_new"),
    path("new_task", views.new_task, name="new_task"),
    path("new_rating", views.new_rating, name="new_rating"),
    path("new_team", views.new_team, name="new_team"),
    path("team/<int:id_get>", views.get_team, name="get_team"),
    path("team/stats/<int:id_get>", views.stats, name="stats"),
    path("team/all-teams", views.team_by_user, name="team_by_user"),
    path("tasks/<str:filter>", views.show_tasks, name="show_tasks"),
    path("voting", views.get_voting_tasks, name="get_voting_tasks"),
    path("tasks/<str:filter>/<int:team_id>", views.show_team_tasks, name="show_team_tasks"),
    path("task/<int:id_get>", views.show_task, name="show_task"),
    path("task/update/<int:id_get>/<str:spec>", views.update_task, name="update_task"),
    path("user/all", views.user_all, name="user_all"),
    path("user/user", views.user_user, name="user_user"),
    path("add-user/<int:team_id>/<int:user_id>", views.user_to_team, name="user_to_team"),
]