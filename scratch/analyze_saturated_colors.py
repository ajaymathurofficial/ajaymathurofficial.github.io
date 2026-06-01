from PIL import Image
from collections import Counter

def analyze():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    pixels = list(img.getdata())
    sat_pixels = [p for p in pixels if max(p) - min(p) > 20]
    
    counter = Counter(sat_pixels)
    print("Top saturated colors:")
    for color, count in counter.most_common(20):
        print(f"Color: {color}, Count: {count}")

if __name__ == '__main__':
    analyze()
