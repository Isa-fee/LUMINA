from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///lumina.db"

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session