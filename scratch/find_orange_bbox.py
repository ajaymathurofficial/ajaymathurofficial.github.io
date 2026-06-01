from PIL import Image

def find_orange_bbox():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    min_x, min_y, max_x, max_y = w, h, 0, 0
    orange_pixel_count = 0
    
    for y in range(h):
        for x in range(w):
            r, g, b = img.getpixel((x, y))
            # Orange: R is high, G is medium, B is low.
            # e.g., (253, 98, 37)
            if r > 200 and 50 < g < 150 and b < 80:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
                orange_pixel_count += 1
                
    if orange_pixel_count > 0:
        print(f"Orange pixels count: {orange_pixel_count}")
        print(f"Orange Bounding Box: min_x={min_x}, min_y={min_y}, max_x={max_x}, max_y={max_y}")
        print(f"Orange Size: width={max_x - min_x + 1}, height={max_y - min_y + 1}")
    else:
        print("No orange pixels found.")

if __name__ == '__main__':
    find_orange_bbox()
