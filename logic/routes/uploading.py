from fastapi import FastAPI,UploadFile,File,APIRouter
import pandas as pd
from routes.analysis import analysis
router=APIRouter()
app=FastAPI()
@router.post("/upload")
async def upload(file:UploadFile=File(...)):
    df=pd.read_csv(file.file)
    result=analysis(df)
    return {
        "filename":file.filename,
        "analysis":result
        }


