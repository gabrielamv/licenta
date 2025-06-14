from django.db import models

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Simbol(models.Model):
    nume = models.CharField(max_length=100)
    semnificatie = models.TextField(default="")
    descriere = models.TextField(default="")
    regiuni = models.TextField(default="")
    id_imagine = models.CharField(max_length=100)

