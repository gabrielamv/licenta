from torchvision.io import decode_image, ImageReadMode
import torchvision.transforms.functional as TF
import torch
import io
from PIL import Image, ImageOps

from .utils import gaussian_blur, rgb2ycbcr, norm01, denorm01, ycbcr2rgb
from .model import FSRCNN 

def upscale_fsrcnn(original_image, scale='auto'):

    lr_image = decode_image(torch.frombuffer(original_image, dtype=torch.uint8), mode=ImageReadMode.RGB)
    _, height, width = lr_image.shape
    print(height, width)
    if scale == 'auto':
        if height <= 1280:
            scale = 4
        elif height <= 1920:
            scale = 3
        elif height <= 2560:
            scale = 2
        else:
            scale = 1
    if scale != 1:
        ckpt_path = f"./server/upscale/checkpoint/x{scale}/FSRCNN-x{scale}.pt"
        sigma = 0.3 if scale == 2 else 0.2
        device = "cuda" if torch.cuda.is_available() else "cpu"

        lr_image = gaussian_blur(lr_image, sigma=sigma)
        lr_image = rgb2ycbcr(lr_image)
        lr_image = norm01(lr_image)
        lr_image = torch.unsqueeze(lr_image, dim=0)

        model = FSRCNN(scale, device)
        model.load_weights(ckpt_path)
        with torch.no_grad():
            lr_image = lr_image.to(device)
            sr_image = model.predict(lr_image)[0]

        sr_image = denorm01(sr_image)
        sr_image = sr_image.type(torch.uint8)
        sr_image = ycbcr2rgb(sr_image)
    else:
        sr_image = lr_image

    pil_image = TF.to_pil_image(sr_image)
    pil_image = ImageOps.fit(pil_image, (1080, 1920), method=Image.BICUBIC)
    # pil_image.show()
    buffer = io.BytesIO()
    pil_image.save(buffer, format="JPEG", quality=85, optimize=True)
    return buffer.getvalue()
