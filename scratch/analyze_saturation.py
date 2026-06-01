from PIL import Image

def analyze_saturation():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    max_diff = 0
    non_gray_pixels = 0
    for y in range(h):
        for x in range(w):
            r, g, b = img.getpixel((x, y))
            diff = max(r, g, b) - min(r, g, b)
            if diff > max_diff:
                max_diff = diff
            if diff > 20:
                non_gray_pixels += 1
                
    print(f"Max R-G-B difference: {max_diff}")
    print(f"Number of pixels with R-G-B difference > 20: {non_gray_pixels}")

if __name__ == '__main__':
    analyze_saturation()
