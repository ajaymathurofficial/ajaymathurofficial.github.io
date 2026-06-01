import sys
from PIL import Image

def analyze():
    img = Image.open('logo.png').convert('RGBA')
    print(f"Format: {img.format}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")
    
    # Get corner pixel colors to identify background color
    w, h = img.size
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((w - 1, 0)),
        img.getpixel((0, h - 1)),
        img.getpixel((w - 1, h - 1))
    ]
    print(f"Corner pixels: {corners}")
    
    # Let's count color distribution
    # We can convert to RGB if not already
    img_rgb = img.convert('RGB')
    
    # Sample every 10th pixel to get a rough outline
    bg_color = corners[0] # assuming top-left is background
    
    # Find bounding box of non-background pixels
    non_bg_pixels = []
    min_x, min_y, max_x, max_y = w, h, 0, 0
    
    # Let's define a threshold for "background" since it might not be exact
    # But usually it is exact in logos
    for y in range(h):
        for x in range(w):
            r, g, b = img_rgb.getpixel((x, y))
            # If not background (allowing some tolerance)
            # Let's see if background is white or black
            # Typically background is white (255,255,255) or black (0,0,0)
            is_bg = (abs(r - bg_color[0]) < 15 and 
                     abs(g - bg_color[1]) < 15 and 
                     abs(b - bg_color[2]) < 15)
            if not is_bg:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
                
    if min_x < max_x and min_y < max_y:
        print(f"Content Bounding Box: min_x={min_x}, min_y={min_y}, max_x={max_x}, max_y={max_y}")
        print(f"Content Size: width={max_x - min_x + 1}, height={max_y - min_y + 1}")
    else:
        print("No content found or threshold too high.")
        
if __name__ == '__main__':
    analyze()
