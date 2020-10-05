import sqlite3,os,pprint
from secrets import token_hex as hx
from random import  randint as rn
from time import time as now

DB_PATH = lambda *paths : os.path.join(
            os.getcwd(),"source","sql",*paths
        )

class Database:
    def __init__(self,db_name):
        self.db_name = db_name
        self.connection = sqlite3.connect(db_name)
        self.cursor = [self.connection.cursor()] # Use as pointer
        SQL_PATH = DB_PATH("user.SQL")
        with open(SQL_PATH,'r') as f:
            statements = iter(f.read().split("\n\n"))
            for statement in statements:
                self.cursor[0].execute(statement)
            self.connection.commit()

    def create_cursor(self):
        self.connection = sqlite3.connect(self.db_name)
        self.cursor[0] = self.connection.cursor()
        return

class User:
    def __init__(self,db):
        self.db = db
        self.cursor = self.db.cursor
        self.connection = self.db.connection
    
    def create(self,username,password,img):
        self.cursor[0].execute("""
        INSERT INTO USER VALUES (null,?,?,?)
        """,(username, password,img))
        self.connection.commit()

    def retrieve(self,username):
        self.cursor[0].execute("""
            SELECT * FROM USER
            WHERE name like %hello%
        """)

    def verify(self,name,password):
        self.cursor[0].execute("""
            SELECT * FROM USER
            WHERE name=? AND password=?""",(name,password))

    def user_exists(self,username):
        stats = self.cursor[0].execute("""
            SELECT * FROM USER
            WHERE name=?""",(username,)).fetchone()
        return stats

    def token_exists(self,token):
        tokens = self.cursor[0].execute("""
            SELECT * FROM TOKEN
            WHERE token=?
        """,(token,)).fetchone()
        print(tokens)
        return tokens

    def generate_token(self):
        key = hx(rn(2,8))
        exists = self.token_exists(key)
        while(exists):
            key = hx(rn(2,8))
        return key

    def create_token(self,user_id):
        token = self.generate_token()
        usrs = self.cursor[0].execute("""
            SELECT * FROM USER
            WHERE id=?
        """,(user_id,)).fetchall()
        if usrs is None:
            return False
        self.cursor[0].execute("""
            INSERT INTO TOKEN values (null,?,?)
        """,(token,user_id))        
        self.connection.commit()
        return token

    def id(self,username):
        return self.cursor[0].execute("""
        SELECT id FROM USER
        WHERE name=?
        """,(username,))

class Chat:
    def __init__(self, database : Database):
        self.db = database
        self.cursor = self.db.cursor
        self.connection = self.db.connection

    def msg(self,user_id : int,msg : str):
        self.cursor.execute("""
            INSERT INTO MSG values (null,?,?)
        """,(user_id,msg,))        
        self.connection.commit()

    def construct(self):
        self.cursor.execute("""
            INSERT INTO CHAT values(null,?)
        """,(now()))
        return self.cursor.lastrowid

if __name__ == "__main__":
    db = Database()
    users = User(db)
    chat = Chat(db)
    
    # users.create('pakis','password123','/peos/chat')
    print(users.cursor.execute("""
        SELECT * FROM USER
    """).fetchall())
    
    # userID = users.id("pakis").fetchone()[0]
    # users.create_token(userID)
    print(users.cursor.execute("""
        SELECT * FROM TOKEN
    """).fetchall())
    
    # chat.msg('1',"GOODBY WORLDdsa")
    print(chat.cursor.execute("""
        SELECT * FROM MSG
    """).fetchall())

    print(chat.construct())