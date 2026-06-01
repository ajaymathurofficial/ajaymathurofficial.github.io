from PIL import Image
from collections import Counter

def analyze():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    # Let's get the color distribution of the image
    pixels = list(img.getdata())
    counter = Counter(pixels)
    print("Top 15 colors:")
    for color, count in counter.most_common(15):
        print(f"Color: {color}, Count: {count} ({count/(w*h)*100:.2f}%)")

if __name__ == '__main__':
    analyze()
