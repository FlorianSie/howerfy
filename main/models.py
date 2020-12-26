from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.

class User(AbstractUser):
    pass

class Milestone(models.Model):
    title = models.CharField(max_length=15, blank=True)
    completed = models.BooleanField(default=False)

class Team(models.Model):
    created = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created')
    name = models.CharField(max_length=20, blank=False)
    description = models.CharField(max_length=200, blank=False)
    members = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='team_members', null=True)
    admins = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='team_admins', null=True)

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task')
    created = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=10, blank=False)
    progress = models.IntegerField(default=0)
    voted_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='voted', null=True)
    deadline = models.DateField(blank=False)
    description = models.CharField(max_length=200, blank=False)
    milestones = models.ForeignKey(Milestone, on_delete=models.DO_NOTHING, related_name='milestone', null=True)

    importance = models.IntegerField(default=50)
    urgency = models.IntegerField(default=50)

    to_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, related_name='tasks', null=True)
    to_team_member = models.ForeignKey(Team, on_delete=models.DO_NOTHING, related_name='team_member', null=True)

    visibility = models.CharField(max_length=20, blank=False)
    editable = models.CharField(max_length=20, blank=False)
    milestones = models.CharField(max_length=20, blank=False)







