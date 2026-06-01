from PIL import Image

def check_sharpness():
    img = Image.open('logo_transparent.png')
    w, h = img.size
    
    total_pixels = 0
    opaque_pixels = 0
    semi_transparent_pixels = 0
    transparent_pixels = 0
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = img.getpixel((x, y))
            if a == 0:
                transparent_pixels += 1
            elif a == 255:
                opaque_pixels += 1
            else:
                semi_transparent_pixels += 1
                
    total = w * h
    print(f"Total pixels: {total}")
    print(f"Transparent pixels: {transparent_pixels} ({transparent_pixels/total*100:.2f}%)")
    print(f"Opaque pixels: {opaque_pixels} ({opaque_pixels/total*100:.2f}%)")
    print(f"Semi-transparent pixels: {semi_transparent_pixels} ({semi_transparent_pixels/total*100:.2f}%)")
    
if __name__ == '__main__':
    check_sharpness()
