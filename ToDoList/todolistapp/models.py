import datetime
from django.db import models


class Details(models.Model):
    username = models.CharField(max_length=200, db_index=True)
    password = models.CharField(max_length=200)
    email = models.EmailField(max_length=200)

    def __str__(self):
        return self.username


class Category(models.Model):
    category = models.CharField(max_length=200)
    categoryDetails = models.ForeignKey(Details, on_delete=models.CASCADE)

    def __str__(self):
        return self.category


class Tasks(models.Model):
    date = models.DateField(default=datetime.date.today())
    taskName = models.CharField(max_length=200)
    taskCategory = models.ForeignKey(Category, on_delete=models.CASCADE)
    taskDetails = models.ForeignKey(Details,on_delete=models.CASCADE)

    def __str__(self):
        return self.taskName

