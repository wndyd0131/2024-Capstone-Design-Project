from backend.api.user import create_user
from backend.main import app
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from backend.schema.user.request_models import UserCreateRequest

client = TestClient(app)

@patch("backend.db.session.get_db")
def test_user_created_successfully(mock_db):

    mock_session = MagicMock()
    mock_db.return_value = mock_session

    user_request = UserCreateRequest(
        first_name = "Ben",
        last_name = "Rhee",
        email = "br@gmail.com",
        password = "br12345678"
    )

    with patch("backend.api.user.hash_password", return_value="hashed_password"):
        user = create_user(user_request=user_request, db=mock_session)

        assert user.first_name == "Ben"
        assert user.last_name == "Rhee"
        assert user.email == "br@gmail.com"
        assert user.password == "hashed_password"