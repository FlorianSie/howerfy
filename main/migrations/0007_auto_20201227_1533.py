# Generated by Django 3.1.4 on 2020-12-27 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20201227_0003'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='deadline',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
