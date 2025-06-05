import base64
from django.http import HttpResponse
from django.core.handlers.wsgi import WSGIRequest
from django.views.decorators.csrf import csrf_exempt
from .models import UploadedImage
from django.http import JsonResponse

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
def upload_image(request: WSGIRequest):
    if request.method == 'POST':
        print (request.FILES)
        print(request.POST.get('selectedModel'))
        image = request.FILES.get('image')
        if image:
            img = UploadedImage(image=image) #creezi obiectul din models pentru salvare in db
            img.save() #salvezi in db
            b64img = base64.b64encode(image.read()).decode('utf-8')

            print("trimitem mesaj")
            return JsonResponse({'mesaj':'Operatia s-a finlizat cu succes!', 'imagine':b64img})#aici sa iti dea raspuns json
        return JsonResponse({'eroare':'EROARE!'})
    