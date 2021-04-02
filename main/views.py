from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from django.contrib import messages
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail

from main.models import Task, User, Milestone, VisibilitySetting, Team, Rating, TaskSerializer, TaskSerializerFull, MilestoneSerializer, TeamSerializer, UserSerializer


# Authentification
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return render(request, "main/index.html")
    else:
        messages.add_message(request, messages.INFO, "Invalid username and/or password")
        return render(request, "main/index.html", {
            "message": "Invalid username and/or password"
        })

def register_view(request):
    return render(request, "main/register.html")

def register_new(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    username = request.POST["username"]
    password = request.POST["password"]
    eMail = request.POST["eMail"]

    user = User.objects.create_user(username, eMail, password)
    user.save()

    user = authenticate(request, username=username, password=password)

    send_mail(
        'Welcome to Howerfy!',
        'Thanks for signing up',
        'Flo@howerfy.com',
        [eMail],
        fail_silently=True,
    )

    if user is not None:
        login(request, user)
        return render(request, "main/index.html")
    else:
        messages.add_message(request, messages.INFO, "Invalid username and/or password")
        return render(request, "main/index.html", {
            "message": "Please log in with your credentials"
        })

def logout_view(request):
    logout(request)
    return render(request, "main/index.html")


# Create your views here.
@ensure_csrf_cookie
def index(request):
    return render(request, "main/index.html")

@ensure_csrf_cookie
def home(request):
    return render(request, "main/home.html")

@ensure_csrf_cookie
@csrf_protect
def new_task(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    # mandatory data
    title_data = data.get("title","")
    description_data = data.get("description","")
    deadline_data = data.get("deadline","")
    milestones_data = data.get("milestones","")
    # slider data
    urgency_data = data.get("urgency")
    importance_data = data.get("importance","")
    # completed status
    completed_get = data.get("completed","")
    # privacy settings data
    visibility_get = data.get("visibility","")
    editable_get = data.get("editable","")
    milestone_settings_get = data.get("milestone_settings","")
    # team assignment
    team_get = data.get("team")

    if team_get == "":
        to_team_set = None
    else:
        to_team_set = Team.objects.get(id=team_get)

    new_task = Task(
        user = request.user,
        title = title_data,
        description = description_data,
        deadline = deadline_data,
        completed = completed_get,
        visibility = VisibilitySetting.objects.get(setting=visibility_get),  
        editable = VisibilitySetting.objects.get(setting=editable_get),
        milestone_settings = VisibilitySetting.objects.get(setting=milestone_settings_get),
        to_team = to_team_set   
    )
    new_task.save()
    # Get id of the new task just saved
    new_task_id = new_task.pk
    # slider data
    new_rating = Rating(
        user = request.user,
        urgency = urgency_data,
        importance = importance_data,
        task = Task.objects.get(id=new_task_id)
    )
    new_rating.save()
    
    if milestones_data != "":

        for milestone in milestones_data:
            if milestone != "":
                new_milestone = Milestone(title = milestone, task=new_task)
                new_milestone.save()

    return JsonResponse({"message": "Successfully created new post", "ID": new_task_id}, status=201)

def update_task(request, id_get, spec):
    if (request.method == "PUT") and (spec == "milestone"):
        ## id_get = milestone id!
        milestone = Milestone.objects.get(id = id_get)
        if milestone.completed == True:
            milestone.completed = False
            milestone.save(update_fields=['completed'])
            progress = Milestone.objects.get(id = id_get).task.progress
            return JsonResponse({"message": "Successfully updated task", "progress": progress}, status=201)
        else:
            milestone.completed = True
            milestone.save(update_fields=['completed'])
            progress = Milestone.objects.get(id = id_get).task.progress
            return JsonResponse({"message": "Successfully updated task", "progress": progress}, status=201)   

        
    elif (request.method == "PUT") and (spec == "status"):
            ## id_get = task id!
            task = Task.objects.get(id = id_get)
            if task.completed == True:
                task.completed = False
                task.save(update_fields=['completed'])
                return JsonResponse({"message": "Successfully changed status" }, status=201)
            else:
                task.completed = True
                task.save(update_fields=['completed'])
                return JsonResponse({"message": "Successfully changed status" }, status=201)        


    elif (request.method == "PUT") and (spec == "update"):
        # Load task to be updated
        task = Task.objects.get(id = id_get)

        data = json.loads(request.body)
        
        title_data = data.get("title","")
        description_data = data.get("description","")
        deadline_data = data.get("deadline","")
        milestones_data = data.get("milestones","")
        # Update Task
        task.title = title_data
        task.description = description_data
        task.deadline = deadline_data
        task.save(update_fields= ['title', 'description', 'deadline' ])
        # Update Milestones
        if milestones_data != "":
            for milestone in milestones_data:
                if milestone != "":
                    new_milestone = Milestone(title = milestone, task=task)
                    new_milestone.save()

    return JsonResponse({"message": "Successfully updated status" }, status=201)
 
@ensure_csrf_cookie
@csrf_protect
def show_tasks(request, filter):

    if filter == "all-tasks":
        data = Task.objects.filter(Q(user=request.user)) #| Task.objects.filter(Q(to_team__members=request.user))
        data = data.distinct()
        data_serialized = TaskSerializer(data, many=True)
        response = JSONRenderer().render(data_serialized.data)
                  
        return HttpResponse(response)

    if filter == "all-open-tasks":
        data = Task.objects.filter(user=request.user).filter(completed=False)
        data_serialized = TaskSerializer(data, many=True)
        response = JSONRenderer().render(data_serialized.data)
                
        return HttpResponse(response)

    if filter == "all-closed-tasks":
        data = Task.objects.filter(user=request.user).filter(completed=True)
        data_serialized = TaskSerializer(data, many=True)
        response = JSONRenderer().render(data_serialized.data)
                  
        return HttpResponse(response)   

@ensure_csrf_cookie
@csrf_protect
def show_team_tasks(request, filter, team_id):

    if filter == "team-tasks":
        team = Team.objects.get(id=team_id)
        data = Task.objects.filter(to_team=team)
        data_serialized = TaskSerializer(data, many=True)
        response = data_serialized.data

        return JsonResponse(response, safe=False)

    if filter == "new-team":
        team = Team.objects.get(id=team_id)
        data = Task.objects.filter(to_team=team)
        data_serialized = TaskSerializer(data, many=True)
        response = data_serialized.data

        return JsonResponse(response, safe=False)

@ensure_csrf_cookie
@csrf_protect
def show_task(request, id_get):
    data = Task.objects.get(id=id_get)
    data_serialized = TaskSerializerFull(data)
                
    return JsonResponse(data_serialized.data)

@ensure_csrf_cookie
@csrf_exempt
def new_rating(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)

    task_get = data.get("task","")
    urgency_data = data.get("urgency","")
    importance_data = data.get("importance","")

    new_rating = Rating(
        user = request.user,
        urgency = urgency_data,
        importance = importance_data,
        task = Task.objects.get(id=task_get)
    )
    new_rating.save()
    # add user to voted_by
    task = Task.objects.get(id=task_get)
    task.voted_by.add(request.user)

    return JsonResponse({"message": "Successfully created new rating"}, status=201)

@ensure_csrf_cookie
@csrf_exempt
def user_all(request):
    users = User.objects.all()
    users_serialized = UserSerializer(users, many=True).data

    return JsonResponse(users_serialized, safe=False)

@ensure_csrf_cookie
@csrf_exempt
def user_to_team(request, user_id, team_id):
    team = Team.objects.get(id=team_id)
    user = User.objects.get(id=user_id)

    team.members.add(user)

    user_serialized = UserSerializer(user).data

    return JsonResponse(user_serialized, safe=False)

@ensure_csrf_cookie
@csrf_exempt
def user_user(request):
    try:
        user = User.objects.get(id=request.user.id)
        user_serialized = UserSerializer(user).data

        return JsonResponse(user_serialized, safe=False)

    except NameError as error:
        return JsonResponse({"message": "no_user"}, status=204)

@ensure_csrf_cookie
@csrf_protect
def new_team(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)

    title_get = data.get("title")
    description_get = data.get("description")
    members_get = data.get("members_get")

    new_team = Team(
        created_by= request.user,
        name = title_get,
        description = description_get,
    )
    new_team.save()
    new_team_id = new_team.pk
    # Add team mebers
    new = Team.objects.get(id=new_team_id)
    for member in members_get:
        user = User.objects.get(id=int(member))
        new.members.add(user)
    # Add user who created the team as admin
    # Admin function ignored for the moment
    # new.admins.add(request.user)    
    team_id = str(new_team_id)
    team_name = f"Successfully created Team: {str(Team.objects.get(id=new_team_id).name)}"

    return JsonResponse({"message": team_name, "ID": team_id}, status=201)
# Get Team 
@ensure_csrf_cookie
@csrf_protect
def get_team(request, id_get):
    
    team_get = Team.objects.get(id=id_get)
    team = TeamSerializer(team_get).data

    return JsonResponse(team)
# Get teams created by the user or where the user is member
@ensure_csrf_cookie
@csrf_protect
def team_by_user(request):
    
    team_get = Team.objects.filter(Q(created_by=request.user) | Q(members=request.user)).distinct()
    team = TeamSerializer(team_get, many=True).data

    return JsonResponse(team, safe=False)
# Get team stats
@ensure_csrf_cookie
@csrf_protect
def stats(request, id_get):

    open_tasks = Task.objects.filter(to_team=id_get).filter(completed=False).count()
    completed_tasks = Task.objects.filter(to_team=id_get).filter(completed=True).count()
       

    all_tasks = Task.objects.filter(to_team=id_get)
    focus_tasks_get = []

    for task in all_tasks:
        if task.classification == "4":
            focus_tasks_get.append(task)

    focus_tasks = len(focus_tasks_get)  
    
    response = {"team_id": id_get, "open_tasks": open_tasks, "completed_tasks": completed_tasks, "focus_tasks": focus_tasks}

    return JsonResponse(response)


@ensure_csrf_cookie
@csrf_protect
def get_voting_tasks(request):

    # Tasks created by the user + not voted by user 
    tasks = Task.objects.filter(Q(user=request.user)) | Task.objects.filter(Q(to_team__members=request.user))
    tasks = tasks.distinct().exclude(voted_by=request.user)
    tasks = TaskSerializer(tasks, many=True).data

    return JsonResponse(tasks, safe=False)

    

