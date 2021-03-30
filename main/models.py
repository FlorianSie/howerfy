from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date
from django.core import serializers
from django.db.models import Avg
from rest_framework import serializers




# Create your models here.

class User(AbstractUser):
    pass

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class VisibilitySetting(models.Model):
    setting = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return self.setting

class Team(models.Model):
    created = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created')
    name = models.CharField(max_length=20, blank=True)
    description = models.CharField(max_length=200, blank=True)
    members = models.ManyToManyField(User, related_name='team_members')
    admins = models.ManyToManyField(User, related_name='team_admins', blank=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    completed = models.BooleanField(default=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task')
    created = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=10, blank=False)
    voted_by = models.ManyToManyField(User, related_name='voted', blank=True)
    deadline = models.DateField(null=True)
    description = models.CharField(max_length=200, blank=False)

    importance = models.IntegerField(default=50, null=True)
    urgency = models.IntegerField(default=50, null=True)

    to_team = models.ForeignKey(Team, on_delete=models.DO_NOTHING, related_name='tasks', null=True)
    to_team_member = models.ForeignKey(Team, on_delete=models.DO_NOTHING, related_name='team_member', null=True)

    visibility = models.ForeignKey(VisibilitySetting, on_delete=models.DO_NOTHING, related_name='task_visibility', null=True)
    editable = models.ForeignKey(VisibilitySetting, on_delete=models.DO_NOTHING, related_name='task_editability', null=True)
    milestone_settings = models.ForeignKey(VisibilitySetting, on_delete=models.DO_NOTHING, related_name='milestone_editability', null=True)

    def __str__(self):
        return self.title

    @property
    def classification(self):
        importance = int(self.rating_set.all().aggregate(Avg('importance'))['importance__avg'])
        urgency = int(self.rating_set.all().aggregate(Avg('urgency'))['urgency__avg'])

        if importance <= 50 and urgency <=50:
            return "1" 
        elif importance <= 50 and urgency >= 50:
            return "2"
        elif importance >=50 and urgency >= 50:
            return "3"
        elif importance >= 50 and urgency <= 50:
            return "4"

    @property
    def milestones(self):
        milestones = self.milestone_set.all()

        return milestones

    @property
    def progress(self):
        if int(self.milestone_set.all().count()) == 0:
            progress = 0
        else:
            total = int(self.milestone_set.all().count())
            closed = int(self.milestone_set.filter(completed=True).count())
            progress = int(closed/total * 100)

        return progress
        

class Milestone(models.Model):
    title = models.CharField(max_length=15, blank=True)
    completed = models.BooleanField(default=False)
    task = models.ForeignKey(Task, on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return f"{self.pk}: {self.title}"

class TaskSerializer(serializers.ModelSerializer):
    classification = serializers.IntegerField()

    class Meta:
        model = Task
        fields = ["id", "title", "progress", "classification", "progress", "completed"]

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'title', 'completed'] 

class TaskSerializerFull(serializers.ModelSerializer):
    classification = serializers.IntegerField()
    progress = serializers.IntegerField()
    editable = serializers.StringRelatedField()
    milestone_settings = serializers.StringRelatedField()
    milestones = MilestoneSerializer(read_only=True, many=True)
    visibility = serializers.StringRelatedField()

    class Meta:
        model = Task
        fields = "__all__"

class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(read_only=True, many=True)
    admins = UserSerializer(read_only=True, many=True)
    class Meta:
        model = Team
        fields = "__all__"

        
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rating')
    importance = models.IntegerField(default=50, null=True)
    urgency = models.IntegerField(default=50, null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.importance)





