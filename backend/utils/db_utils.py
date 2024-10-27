from backend.db.session import engine, Base


def create_tables():
    drop_tables()
    Base.metadata.create_all(bind=engine)
    print("Tables successfully created")

def drop_tables():
    engine.begin()
    Base.metadata.drop_all(bind=engine)
    print("Tables successfully dropped")