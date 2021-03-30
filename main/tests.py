from django.test import TestCase
from .models import Task, Team, Milestone

# Create your tests here.

def setUp(self): 

    # create tasks
    t1 = Task.objects.create(title="Test 1", description="Please have a look at the spread sheet shared by eMail and let us know your thoughts", user="Florian", progress="60", deadline="01.12.2021")
    t2 = Task.objects.create(title="Test 2", description="Please have a look at the spread sheet shared by eMail and let us know your thoughts", user="Pia", progress="57", deadline="01.12.2022")
    t3 = Task.objects.create(title="Test 3", description="Please have a look at the spread sheet shared by eMail and let us know your thoughts", user="Adro", progress="54", deadline="01.12.2023")
    t4 = Task.objects.create(title="Test 4", description="Please have a look at the spread sheet shared by eMail and let us know your thoughts", user="Adro", progress="20", deadline="01.12.2024")
    t5 = Task.objects.create(title="Test 5", description="Please have a look at the spread sheet shared by eMail and let us know your thoughts", user="Pia", progress="10", deadline="01.12.2025")
    t6 = Task.objects.create(title="Test 6", description="Please have a look at the spread sheet shared by eMail and let us know your thoughts", user="Florian", progress="59", deadline="01.12.2026")
    t7 = Task.objects.create(title="Test 7", description="Please have a look at the spread sheet shared by eMail and let us know your thoughts", user="Pia", progress="80", deadline="01.12.2027")

    # create teams
    team1 = Team.objects.create(created_by="Florian", name="Team Alpha", description="Hi Team, thanks for joining. This is going to be awesome!")
    team2 = Team.objects.create(created_by="Pia", name="Team Beta", description="Hi Team, thanks for joining. This is going to be awesome!")
    team3 = Team.objects.create(created_by="Adro", name="Team Delta", description="Hi Team, thanks for joining. This is going to be awesome!")

    # create milestones
    milestone1 = Milestone.objects.create(title="call customer")
    milestone2 = Milestone.objects.create(title="Do yoga")
    milestone3 = Milestone.objects.create(title="repair bike")
    milestone4 = Milestone.objects.create(title="prepare slides")
    milestone5 = Milestone.objects.create(title="prepare market analysis")
