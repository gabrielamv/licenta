from ultralytics import YOLO
from PIL import Image

model = YOLO("./server/detectare_simboluri/best.pt")

def detectare(imagine):
    imagine = Image.open(imagine).convert("L")
    imagine = imagine.convert("RGB")
    results = model(imagine)[0]

    detections = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        cls_id = int(box.cls[0])
        label = results.names[cls_id]
        detections.append({
            "x": float((x1 + x2) / 2),
            "y": float((y1 + y2) / 2),
            "label": label
        })
    return detections