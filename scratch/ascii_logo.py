from PIL import Image

def ascii_art():
    img = Image.open('logo_transparent.png')
    # Resize to a readable console width, e.g. 100 characters wide
    w, h = img.size
    aspect = h / w
    new_w = 180
    new_h = int(new_w * aspect * 0.5) # 0.5 vertical correction
    
    resized = img.resize((new_w, new_h), Image.Resampling.BILINEAR)
    
    for y in range(new_h):
        line = ""
        for x in range(new_w):
            r, g, b, a = resized.getpixel((x, y))
            if a > 50:
                # If it's orange
                if r > 200 and g < 150:
                    line += "O"
                else:
                    line += "#"
            else:
                line += " "
        print(line)

if __name__ == '__main__':
    ascii_art()
