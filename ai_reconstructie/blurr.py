from PIL import Image, ImageFilter
import os

directory = "poze/"
for file in os.listdir(directory):
    image = Image.open(directory + file)
    # Apply Gaussian blur
    modificat = image.filter(ImageFilter.GaussianBlur(radius=1))

    modificat.save("blurr/"+file)