from app.core.ai_service import generate_image_caption

# 1. Read the image file as bytes
print("📂 Reading image...")
with open("testimage1.jpg", "rb") as f: # Adjust path if needed
    image_data = f.read()

# 2. Call the AI
print("Sending to AI Model (this might take a few seconds)...")
caption = generate_image_caption(image_data)

# 3. Show result
print("-" * 30)
print(f"AI Description: {caption}")
print("-" * 30)