import unittest

from app.services.auth_service import create_access_token, decode_token


class AuthServiceTokenTest(unittest.TestCase):
    def test_create_access_token_subject_is_string(self):
        token = create_access_token({"sub": 1})
        payload = decode_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload["sub"], "1")


if __name__ == "__main__":
    unittest.main()
