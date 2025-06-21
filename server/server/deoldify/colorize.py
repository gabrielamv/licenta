from deoldify.visualize import get_image_colorizer
from PIL import Image
import io
from pathlib import Path

colorizer = get_image_colorizer(artistic=True, root_folder=Path("./server/deoldify/"))
def colorize_image(image):
    pil_image = Image.open(image).convert("RGB")
    colorized = colorizer.get_transformed_image(image=pil_image, render_factor=35)
    
    buffer = io.BytesIO()
    colorized.save(buffer, format='JPEG')
    buffer.seek(0)
    return buffer.getvalue()

