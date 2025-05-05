from PIL import Image, ImageDraw
import os
import random

def add_stains(image, stain_count=50, stain_size_range=(10, 50)):
    # Create a copy of the original image to draw stains on
    background=Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(background)

    # Get image dimensions
    width, height = background.size

    for _ in range(stain_count):
        # Randomly choose the position and size of the stain
        stain_size = random.randint(*stain_size_range)
        x = random.randint(0, width)
        y = random.randint(0, height)

        # Draw an ellipse (stain) on the image
        r = random.randint(0, 255)
        g = random.randint(0, 255)
        b = random.randint(0, 255)
        
        stain_color = (r, g, b, 64)
        draw.ellipse((x, y, x + stain_size, y + stain_size), fill=stain_color)
    final_image = Image.alpha_composite(image.convert("RGBA"), background)

    return final_image.convert("RGB")

directory = "blurr_noise_stains/"
for file in os.listdir(directory):
    image = Image.open(directory + file)
    # Apply Gaussian blur
    modificat = add_stains(image, 100, (10, 50))

    modificat.save("blurr_noise_stains/"+file)
