from PIL import Image

def process_logo():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    # We found the bounding box: min_x=209, min_y=338, max_x=1367, max_y=621
    # Let's add 15px margin to prevent any clipping of anti-aliasing
    margin = 15
    min_x = max(0, 209 - margin)
    min_y = max(0, 338 - margin)
    max_x = min(w - 1, 1367 + margin)
    max_y = min(h - 1, 621 + margin)
    
    # Crop the image
    cropped = img.crop((min_x, min_y, max_x, max_y))
    cw, ch = cropped.size
    print(f"Cropped size: {cw}x{ch}")
    
    # Create new RGBA image
    out_img = Image.new('RGBA', (cw, ch))
    
    # Background color estimate
    bg_r, bg_g, bg_b = 1, 2, 0
    
    for y in range(ch):
        for x in range(cw):
            r, g, b = cropped.getpixel((x, y))
            
            # Subtract background
            r_sub = max(0, r - bg_r)
            g_sub = max(0, g - bg_g)
            b_sub = max(0, b - bg_b)
            
            # Use max channel as alpha
            alpha = max(r_sub, g_sub, b_sub)
            
            if alpha > 0:
                # Un-premultiply
                r_new = min(255, int(r_sub * 255 / alpha))
                g_new = min(255, int(g_sub * 255 / alpha))
                b_new = min(255, int(b_sub * 255 / alpha))
                
                # If it's a white pixel, let's keep it clean
                # If it's close to white, we can make it pure white (255,255,255)
                # But let's see what the logo colors are first.
                out_img.putpixel((x, y), (r_new, g_new, b_new, alpha))
            else:
                out_img.putpixel((x, y), (0, 0, 0, 0))
                
    out_img.save('logo_transparent.png', 'PNG')
    print("Saved logo_transparent.png successfully!")

if __name__ == '__main__':
    process_logo()
