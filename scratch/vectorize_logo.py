import os
import subprocess
from PIL import Image

def vectorize():
    # Load original logo
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    # We found the bounding box: min_x=209, min_y=338, max_x=1367, max_y=621
    # Add margin of 10px to ensure no edge clipping
    margin = 10
    min_x = max(0, 209 - margin)
    min_y = max(0, 338 - margin)
    max_x = min(w - 1, 1367 + margin)
    max_y = min(h - 1, 621 + margin)
    
    # Crop
    cropped = img.crop((min_x, min_y, max_x, max_y))
    cw, ch = cropped.size
    print(f"Cropped size: {cw}x{ch}")
    
    # Create white-only and orange-only images (white foreground on black bg)
    # Actually, potrace needs black foreground on white bg!
    # So: foreground = black (0), background = white (255)
    img_white = Image.new('L', (cw, ch), 255)
    img_orange = Image.new('L', (cw, ch), 255)
    
    # Loop over cropped pixels
    for y in range(ch):
        for x in range(cw):
            r, g, b = cropped.getpixel((x, y))
            
            # Is it background?
            is_bg = (r <= 5 and g <= 5 and b <= 5)
            
            if not is_bg:
                # Is it orange?
                is_orange = (r > 180 and 40 < g < 160 and b < 100)
                
                # We want to determine the brightness to handle anti-aliasing.
                # However, potrace does thresholding internally.
                # We can output a grayscale image where the foreground is dark (0) and bg is white (255)
                # Brightness = (r + g + b) // 3
                # Let's map it: foreground (white/orange) should be black (0), background is white (255)
                # To preserve shape, we can invert the brightness
                brightness = int(0.299*r + 0.587*g + 0.114*b)
                # Scale so that brightest (255) maps to 0 (black), and darkest (0) maps to 255 (white)
                val = 255 - brightness
                # Clamp val
                val = max(0, min(255, val))
                
                if is_orange:
                    img_orange.putpixel((x, y), val)
                else:
                    img_white.putpixel((x, y), val)
                    
    # Save BMPs
    img_white.save('scratch/logo_white.bmp')
    img_orange.save('scratch/logo_orange.bmp')
    print("Saved logo_white.bmp and logo_orange.bmp")
    
    # Run potrace
    # potrace options:
    # -s: SVG output
    # -o: output file
    # -k: black level threshold (default 0.5)
    # -a: alphamax (corner threshold, default 1)
    # -O: curve optimization tolerance (default 0.2)
    # -u: unit scaling (default 10)
    try:
        subprocess.run(['potrace', 'scratch/logo_white.bmp', '-s', '-o', 'scratch/logo_white.svg'], check=True)
        subprocess.run(['potrace', 'scratch/logo_orange.bmp', '-s', '-o', 'scratch/logo_orange.svg'], check=True)
        print("Successfully ran potrace to generate white and orange SVGs!")
    except Exception as e:
        print(f"Error running potrace: {e}")
        return
        
    # Read the two SVG files and extract the path definitions
    def extract_paths(svg_path):
        paths = []
        if not os.path.exists(svg_path):
            return paths
        with open(svg_path, 'r') as f:
            content = f.read()
        
        # Simple extraction of <path d="..." />
        import re
        path_matches = re.findall(r'<path[^>]+d="([^"]+)"[^>]*>', content)
        return path_matches

    white_paths = extract_paths('scratch/logo_white.svg')
    orange_paths = extract_paths('scratch/logo_orange.svg')
    
    print(f"Found {len(white_paths)} paths in white logo, {len(orange_paths)} paths in orange logo.")
    
    # We will build a combined SVG
    # The SVG should have viewbox matching cropped size: "0 0 cw ch"
    # We color white paths with #ffffff and orange paths with #f46c38 (theme accent)
    svg_content = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw} {ch}" width="{cw}" height="{ch}">',
        f'  <g fill="#ffffff" stroke="none" transform="translate(0.000000,{ch}.000000) scale(0.100000,-0.100000)">'
    ]
    
    for d in white_paths:
        svg_content.append(f'    <path d="{d}" />')
        
    svg_content.append('  </g>')
    svg_content.append(f'  <g fill="#f46c38" stroke="none" transform="translate(0.000000,{ch}.000000) scale(0.100000,-0.100000)">')
    
    for d in orange_paths:
        svg_content.append(f'    <path d="{d}" />')
        
    svg_content.append('  </g>')
    svg_content.append('</svg>')
    
    # Save the output logo.svg
    with open('logo.svg', 'w') as f:
        f.write('\n'.join(svg_content))
        
    print("Combined and saved logo.svg successfully!")

if __name__ == '__main__':
    vectorize()
