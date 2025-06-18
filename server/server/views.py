import base64
from django.http import HttpResponse
from django.core.handlers.wsgi import WSGIRequest
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .models import Simbol
from .upscale.upscale import upscale_fsrcnn
from .detectare_simboluri.detectare import detectare

def index(request: WSGIRequest):
    return HttpResponse("""                                      
        <html>
            <body>
                <form action="/upload/" method="POST" enctype="multipart/form-data">
                    <label for="image"> Choose an image to upload: </label>
                    <input type="file" id="image" name="image" accept="image/*" required>
                    <input type="submit" value="Upload Image">
                </form>
            </body>
        </html>
    """)


@csrf_exempt
def detectare_simboluri(request: WSGIRequest):
    if request.method == 'POST':
        image = request.FILES.get('image')
        if image:
            #aplicam detectare simboluri
            models = detectare(image)
            return JsonResponse({'models':models})
        return JsonResponse({'eroare':'EROARE!'})
    
def simboluri(request):
    d = []
    for simbol in Simbol.objects.all():
        d.append({
            'nume': simbol.nume,
            'semnificatie': simbol.semnificatie,
            'descriere': simbol.descriere,
            'regiuni': simbol.regiuni,
            'id_imagine': simbol.id_imagine,
        })
    return JsonResponse({'simboluri': d})


@csrf_exempt
def superrezolutie(request: WSGIRequest):
    if request.method == 'POST':
        image = request.FILES.get('image')
        if image:
            #aplicam superrezolutie
            image = upscale_fsrcnn(image.read())
            b64img = base64.b64encode(image).decode('utf-8')
            return JsonResponse({'imagine':b64img})
        return JsonResponse({'eroare':'EROARE!'})
    
@csrf_exempt
def restaurare(request: WSGIRequest):
    if request.method == 'POST':
        image = request.FILES.get('image')
        if image:
            #aplicam restaurare
            image = upscale_fsrcnn(image.read()) #TODO restaurare, nu upscale_fsrcnn
            b64img = base64.b64encode(image).decode('utf-8')
            return JsonResponse({'imagine':b64img})
        return JsonResponse({'eroare':'EROARE!'})