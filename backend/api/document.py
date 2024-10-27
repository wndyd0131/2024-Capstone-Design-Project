import uuid
from typing import List
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
import os

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.api.auth import get_current_user_from_cookie
from backend.db.session import get_db
from backend.schema.document.request_model import DeleteDocumentRequest
from backend.schema.jwt.response_model import Payload
from backend.schema.models import Document

load_dotenv()

router = APIRouter()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY_ID")
S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")

s3_client = boto3.client(
    "s3", aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

# upload document
@router.post("/", tags=["document"])
async def upload_document(files: List[UploadFile] = File(...),
                          chatroom_id: str = Form(...),
                          db: AsyncSession = Depends(get_db)):
        uploaded_documents = []
        try:
            for file in files:
                s3_key = f"{uuid.uuid4()}-{file.filename}"
                s3_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"

                s3_client.upload_fileobj(
                    file.file,
                    S3_BUCKET_NAME,
                    s3_key
                )

                document = Document(
                    document_name=file.filename,
                    uploaded_name=s3_key,
                    s3_url=s3_url,
                    chatroom_id=int(chatroom_id)
                )

                db.add(document)
                uploaded_documents.append(document)
            await db.commit()
            for document in uploaded_documents:
                await db.refresh(document)

            return {
                "chatroom_id": chatroom_id,
                "uploaded_files": [
                    {"document_id": document.document_id,
                     "uploaded_name": document.uploaded_name,
                     "document_name": document.document_name,
                     "s3_url": document.s3_url
                     } for document in uploaded_documents
                ]
            }

        except (BotoCoreError, ClientError) as e:
            raise HTTPException(status_code=500, detail=f"S3 upload fails: {str(e)}")


# should be more secure
@router.delete("/", tags=["document"])
async def delete_document(document_request: DeleteDocumentRequest,
                          db: AsyncSession = Depends(get_db),
                          current_user: Payload = Depends(get_current_user_from_cookie)):
    try:
        result = await db.execute(select(Document).where(document_request.document_id == Document.document_id))
        document = result.scalars().first()
        print(document)

        s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=document.uploaded_name)
        result = await db.execute(delete(Document).where(document.document_id == Document.document_id))

        if result.rowcount == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

        await db.delete(document)
        await db.commit()

        return {"message": "Document deleted successfully"}

    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 delete fails: {str(e)}")