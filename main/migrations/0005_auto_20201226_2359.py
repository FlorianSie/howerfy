# Generated by Django 3.1.4 on 2020-12-26 23:59

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20201226_2303'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='deadline',
            field=models.DateField(blank=True),
        ),
        migrations.RemoveField(
            model_name='task',
            name='voted_by',
        ),
        migrations.AddField(
            model_name='task',
            name='voted_by',
            field=models.ManyToManyField(related_name='voted', to=settings.AUTH_USER_MODEL),
        ),
    ]
