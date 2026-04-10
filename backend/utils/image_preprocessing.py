import numpy as np
from PIL import Image, ImageFilter
import io

def is_skin_image(img):
    """
    Heuristic to check if an image is likely skin.
    Relaxed to support dermoscopic images (with hair, dark lesions, or cool lighting).
    """
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # 1. Blur Detection (Keep this, usually helpful)
    edges = img.filter(ImageFilter.FIND_EDGES)
    edge_data = np.array(edges).astype(np.float32)
    edge_variance = np.var(edge_data)
    if edge_variance < 5.0: # Relaxed from 10.0
        return False, "The image appears too blurry. Please take a sharp, focused photo."

    # 2. Advanced Skin Tone Heuristics
    small_img = img.resize((50, 50))
    np_img = np.array(small_img).astype(np.float32)
    
    avg_r = np.mean(np_img[:, :, 0])
    avg_g = np.mean(np_img[:, :, 1])
    avg_b = np.mean(np_img[:, :, 2])
    
    # Reject extremely dark or bright images (but inclusive of dark lesions)
    if (avg_r + avg_g + avg_b) / 3 < 20: # Extremely dark
        return False, "Lighting is too poor (too dark). Please use better light."
        
    # Standard Skin Check: Red channel should usually be the most dominant
    # But in dermoscopy, lighting can be very balanced (white/grey)
    # So we mainly reject "obviously wrong" colors:
    
    # Reject high GREEN (likely nature/trees)
    if avg_g > (avg_r + 10) and avg_g > (avg_b + 10):
        return False, "This appears to be a non-skin image (excessive green detected)."
        
    # Reject high BLUE (likely sky/clothing)
    if avg_b > (avg_r + 20) and avg_b > (avg_g + 20):
        return False, "This appears to be a non-skin image (excessive blue detected)."

    # Reject greyscale/desaturated non-skin (like walls or paper)
    # Skin usually has a distinct Red-Green difference even if small
    rgb_diff = max(avg_r, avg_g, avg_b) - min(avg_r, avg_g, avg_b)
    if rgb_diff < 5 and avg_r > 100: # Very grey and bright
        return False, "The image lacks skin-like color characteristics. Please use natural light."

    return True, "Success"

def prepare_image(file_storage):
    """
    Loads an image from Flask FileStorage, validates it, resizes it,
    and preprocesses it for the model.
    """
    try:
        # We need to read the file once to validate and once to process
        # Or better, read it once and pass the cursor back if needed
        # But PIL Image.open doesn't consume the stream entirely if we are careful
        
        img_bytes = file_storage.read()
        img = Image.open(io.BytesIO(img_bytes))
        
        # Validate if it's skin
        is_skin, message = is_skin_image(img)
        if not is_skin:
            return None, message

        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img = img.resize((224, 224))
        img_array = np.array(img)
        
        # Expand dims to create batch (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Preprocess input (Assuming MobileNetV2: [-1, 1])
        img_array = (img_array.astype(np.float32) / 127.5) - 1.0
        
        return img_array, "Success"
    except Exception as e:
        print(f"Error processing image: {e}")
        return None, "Error processing image file."
