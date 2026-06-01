from PIL import Image

def inspect_slice():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    # Let's inspect a horizontal slice at y = 330 (which is 8 pixels above min_y=338)
    # We will print the values of every 20th pixel from x = 200 to 1300
    print("Slice at y=330:")
    row_pixels = []
    for x in range(200, 1300, 20):
        row_pixels.append(img.getpixel((x, 330)))
    print(row_pixels)
    
    # Let's check y = 500 (middle of the logo) but at x = 180 (just left of min_x=209)
    print("Column slice at x=180, from y=330 to 630:")
    col_pixels = []
    for y in range(330, 630, 10):
        col_pixels.append(img.getpixel((180, y)))
    print(col_pixels)

if __name__ == '__main__':
    inspect_slice()
