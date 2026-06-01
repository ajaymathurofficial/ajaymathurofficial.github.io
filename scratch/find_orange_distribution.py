from PIL import Image

def find_orange_distribution():
    img = Image.open('logo.png').convert('RGB')
    w, h = img.size
    
    # We will record the x coordinates where orange pixels exist
    orange_xs = []
    orange_ys = []
    
    for y in range(h):
        for x in range(w):
            r, g, b = img.getpixel((x, y))
            if r > 200 and 50 < g < 150 and b < 80:
                orange_xs.append(x)
                orange_ys.append(y)
                
    # Group xs and ys
    from collections import Counter
    x_counts = Counter(orange_xs)
    y_counts = Counter(orange_ys)
    
    print("Orange pixels distribution by Y coordinate:")
    for y, count in sorted(y_counts.items()):
        if count > 5:
            print(f"y={y}: {count} pixels")
            
    print("\nOrange pixels distribution by X coordinate (summarized ranges):")
    # Group into continuous ranges of x
    xs_sorted = sorted(list(set(orange_xs)))
    ranges = []
    if xs_sorted:
        start = xs_sorted[0]
        prev = xs_sorted[0]
        for x in xs_sorted[1:]:
            if x - prev > 10: # gap threshold
                ranges.append((start, prev))
                start = x
            prev = x
        ranges.append((start, prev))
        
    for start, end in ranges:
        # Sum counts in this range
        total_pixels = sum(x_counts[x] for x in range(start, end + 1))
        print(f"x={start} to {end}: total {total_pixels} pixels")

if __name__ == '__main__':
    find_orange_distribution()
