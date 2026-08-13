from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "mysql+pymysql://root:admin@localhost/lumina"

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
