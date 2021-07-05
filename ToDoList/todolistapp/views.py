import json
from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect
from .models import Details, Category,Tasks
from django.db.models import Q
import datetime

def updateTask(request):
    username = request.session['username']
    categorySelected = request.POST.get('category')
    print(categorySelected)
    task = request.POST.get('task')
    print(task)
    try:
        details = Details.objects.get(Q(username=username) | Q(email=username))
        category = Category.objects.get(Q(category=categorySelected) & Q(categoryDetails=details))
        taskDetails = Tasks.objects.get(Q(taskName=task) & Q(taskCategory=category) & Q(taskDetails=details))
        day = request.POST.get('day')
        month = request.POST.get('month')
        year = request.POST.get('year')
        taskDetails.date = datetime.date(int(year), int(month), int(day));
        taskDetails.save()
        print("Saved")
    except details.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    except category.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    except taskDetails.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    statusMsg = "Ok"
    return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
def deleteTask(request):
    username = request.session['username']
    categorySelected = request.POST.get('category')
    print(categorySelected)
    task = request.POST.get('task')
    print(task)
    try:
        details = Details.objects.get(Q(username=username) | Q(email=username))
        category = Category.objects.get(Q(category=categorySelected) & Q(categoryDetails=details))
        taskDetails = Tasks.objects.get(Q(taskName=task) & Q(taskCategory=category) & Q(taskDetails=details))
        taskDetails.delete()
    except details.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    except category.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    except taskDetails.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    statusMsg = "Ok"
    return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')

def displayTasks(request):
    taskResults = []
    taskTimes = []
    username = request.session['username']
    categorySelected = request.POST.get('category')
    print(categorySelected)
    try:
        details = Details.objects.get(Q(username=username) | Q(email=username))
        category = Category.objects.get(Q(category=categorySelected) & Q(categoryDetails=details))
        tasks = Tasks.objects.filter(taskCategory=category, taskDetails=details)
    except details.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'tasks': taskResults}), content_type='application/json')
    except category.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'tasks': taskResults}), content_type='application/json')
    except taskDetails.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'tasks': taskResults}), content_type='application/json')
    for task in tasks:
        taskResults.append(task.taskName)
        taskTimes.append(str(task.date.day)+"-"+str(task.date.month)+"-"+str(task.date.year))
    print(taskResults)
    print(taskTimes)
    return HttpResponse(json.dumps({'tasks': taskResults,'tasktimings':taskTimes}), content_type='application/json')
@csrf_protect
def getToDo(request):
    print('Hello')
    data = request.POST.get('tododata');
    selectedCategory = request.POST.get('todoCategory')
    username= request.session['username']
    try:
        details = Details.objects.get(Q(username=username) | Q(email=username))
        category = Category.objects.get(Q(category=selectedCategory) & Q(categoryDetails=details))
    except details.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    except category.DoesNotExist:
        statusMsg = "NotOk"
        return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
    print(username)
    myTask = Tasks(taskName=data,taskCategory=category,taskDetails=details)
    myTask.save();
    statusMsg ="Ok"
    return HttpResponse(json.dumps({'Status': statusMsg}), content_type='application/json')
@csrf_protect
def getCategory(request):
    print(request.method)
    username = request.session['username']
    category = request.POST.get('category')
    print(category)
    details = Details.objects.get(Q(username=username) | Q(email=username))
    updateCategory = Category(category=category, categoryDetails=details)
    updateCategory.save()
    status = "Ok"
    return HttpResponse(json.dumps({'Status': status}), content_type='application/json')


@csrf_protect
def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        user = Details.objects.filter(Q(username=username) | Q(password=password))
        if len(user) != 0:
            return render(request, 'register.html', {'err_msg': 'Username Or Email Already exists'})
        else:
            details = Details(username=username, password=password, email=email)
            details.save()
            return render(request, 'register.html', {'sucess': 'Sucessfully Registered'})
    else:
        return render(request, 'register.html', {})


@csrf_protect
def login(request):
    category_result = []
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            details = Details.objects.get(Q(username=username) | Q(email=username))
            if details.password == password:
                request.session['username'] = username
                request.session['password'] = password
                getCategoryData = Category.objects.filter(categoryDetails=details)
                print(getCategoryData)
                for data in getCategoryData:
                    category_result.append(data.category)
                print(category_result)
                return render(request, 'index.html', {'details': details, 'category_result': category_result})
            else:
                return render(request, 'login.html', {'err_msg': 'Invalid Password'})
        except Details.DoesNotExist:
            return render(request, 'login.html', {'err_msg': 'Invalid Username Or Email'})
    else:
        if request.session.has_key('username') and request.session.has_key('password'):
            details = Details.objects.get(
                Q(username=request.session['username']) | Q(email=request.session['username']))
            getCategoryData = Category.objects.filter(categoryDetails=details)
            print(getCategoryData)
            for data in getCategoryData:
                category_result.append(data.category)
            print(category_result)
            return render(request, 'index.html', {'details': details, 'category_result': category_result})
        else:
            return render(request, 'login.html', {})
def logout(request):
    del request.session['username']
    del request.session['password']
    return HttpResponseRedirect('/login')