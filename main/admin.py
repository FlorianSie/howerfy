from django.contrib import admin
from .models import User, Milestone, Team, Task, Rating, VisibilitySetting
# Register your models here.

class MilestoneAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "completed")

class VisibilitySettingAdmin(admin.ModelAdmin):
    list_display = ("id","setting")

class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "created", "created_by", "name", "description")

class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "to_team", "completed", "user", "created", "title", "progress", "deadline", "description", "importance", "urgency", "to_team")

class RatingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "importance", "urgency")

admin.site.register(User)
admin.site.register(VisibilitySetting, VisibilitySettingAdmin)
admin.site.register(Milestone, MilestoneAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Rating, RatingAdmin)


