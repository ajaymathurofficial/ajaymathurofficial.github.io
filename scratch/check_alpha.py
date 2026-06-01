from PIL import Image
from collections import Counter

def check_alpha_histogram():
    img = Image.open('logo_transparent.png')
    w, h = img.size
    
    alphas = []
    for y in range(h):
        for x in range(w):
            _, _, _, a = img.getpixel((x, y))
            alphas.append(a)
            
    counter = Counter(alphas)
    print("Alpha Histogram (grouped):")
    ranges = [
        ("0 (Transparent)", lambda x: x == 0),
        ("1-50 (Very Faint)", lambda x: 0 < x <= 50),
        ("51-100 (Faint)", lambda x: 50 < x <= 100),
        ("101-150 (Medium)", lambda x: 100 < x <= 150),
        ("151-200 (Semi-opaque)", lambda x: 150 < x <= 200),
        ("201-254 (Opaque-ish)", lambda x: 200 < x < 255),
        ("255 (Opaque)", lambda x: x == 255)
    ]
    
    for label, func in ranges:
        count = sum(c for val, c in counter.items() if func(val))
        print(f"{label}: {count} ({count/len(alphas)*100:.2f}%)")

if __name__ == '__main__':
    check_alpha_histogram()
