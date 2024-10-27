from pydantic import BaseModel


class DeleteDocumentRequest(BaseModel):
    document_id: int