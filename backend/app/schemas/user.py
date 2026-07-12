from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    email: str
    password: str
    role: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    role: str
    is_active: bool
    is_verified: bool
