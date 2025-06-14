# myapp/admin.py
from django.contrib import admin
from .models import UploadedImage, Simbol

admin.site.register(UploadedImage)
admin.site.register(Simbol)