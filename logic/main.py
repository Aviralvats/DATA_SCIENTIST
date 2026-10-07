from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.uploading import router
from routes.visualisation import visualization_router
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(visualization_router)