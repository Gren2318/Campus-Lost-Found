import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URL = os.getenv("MONGO_URL")
    DB_NAME = os.getenv("DB_NAME", "campus_connect_db")
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    
    COLAB_AI_URL = os.getenv("COLAB_AI_URL", "")

settings = Settings()



