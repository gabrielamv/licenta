from PIL import Image
import os
import numpy as np


def add_gaussian_noise(image, mean=0, sigma=25):
    image_array = np.array(image)
    noise = np.random.normal(mean, sigma, image_array.shape)
    noisy_image_array = np.clip(image_array + noise, 0, 255).astype(np.uint8)
    noisy_image = Image.fromarray(noisy_image_array)
    return noisy_image

directory = "poze/"
for file in os.listdir(directory):
    image = Image.open(directory + file)
    # Apply Gaussian blur
    modificat = add_gaussian_noise(image, 5, 20)

    modificat.save("noise/"+file)