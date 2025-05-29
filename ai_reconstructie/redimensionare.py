from PIL import Image 
import os

directory = "poze"
for folder in os.listdir(directory):
    for file in os.listdir(f"{directory}/{folder}"):
        image = Image.open(f"{directory}/{folder}/{file}")
        x, y = image.size
        ratio = x/y
        new_size = (240, 320)

        if x > y:#landscape
            target = new_size[1]/new_size[0]
            if ratio != target:
                if ratio > target:
                    target_x = (x/ratio)*target
                    x_diff = (x-target_x)//2
                    crop_box = ( x_diff, 0, target_x+x_diff, y)
                else:
                    target_y = (y/target)*ratio
                    y_diff = (y-target_y)//2
                    crop_box = (0, y_diff, x, target_y+y_diff)
                image = image.crop(crop_box)
            rot = image.rotate(90, expand=True)
            image = rot.resize(new_size)
        else: #portrait
            target = new_size[0]/new_size[1]
            if ratio != target:
                if ratio > target:
                    target_x = (x/ratio)*target
                    x_diff = (x-target_x)//2
                    crop_box = ( x_diff, 0, target_x+x_diff, y)
                else:
                    target_y = (y/target)*ratio
                    y_diff = (y-target_y)//2
                    crop_box = (0, y_diff, x, target_y+y_diff)
                image = image.crop(crop_box)
            image = image.resize(new_size)
        
        image.save(f"redimensionate/{folder}/{file}") 

