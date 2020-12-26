from django.contrib import admin
from .models import User, Milestone, Team, Task
# Register your models here.

class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("title", "completed")

class TeamAdmin(admin.ModelAdmin):
    list_display = ("created", "created_by", "name", "description", "members", "admins")

class TaskAdmin(admin.ModelAdmin):
    list_display = ("user", "created", "title", "progress", "voted_by", "deadline", "description", "milestones", "importance", "urgency", "to_team", "to_team_member", "visibility", "editable", "milestones")

admin.site.register(User)
admin.site.register(Milestone, MilestoneAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Task, TaskAdmin)


