# Generated by Django 3.1.4 on 2020-12-29 21:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_rating_task'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='milestones',
        ),
        migrations.AddField(
            model_name='milestone',
            name='task',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='main.task'),
        ),
    ]