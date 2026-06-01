from PIL import Image

def analyze_bg_noise():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    # Content bounding box is min_x=209, min_y=338, max_x=1367, max_y=621
    # Let's check pixels outside this box (the background)
    max_r = 0
    max_g = 0
    max_b = 0
    
    for y in range(h):
        for x in range(w):
            # If outside the bounding box
            if not (200 <= x <= 1380 and 320 <= y <= 640):
                r, g, b = img.getpixel((x, y))
                max_r = max(max_r, r)
                max_g = max(max_g, g)
                max_b = max(max_b, b)
                
    print(f"Max background RGB values: R={max_r}, G={max_g}, B={max_b}")

if __name__ == '__main__':
    analyze_bg_noise()
