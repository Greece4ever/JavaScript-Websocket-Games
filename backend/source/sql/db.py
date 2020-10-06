import sqlite3,os
from secrets import token_hex as hx
from random import  randint as rn
from time import time as now

DB_PATH = lambda *paths : os.path.join(
            os.getcwd(),"source","sql",*paths
        )

class Database:
    def __init__(self,db_name):
        self.db_name = db_name
        self.connection = sqlite3.connect(db_name,check_same_thread=False)
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

    def fetchUser(self, token_id):
        token = self.cursor[0].execute("""
            SELECT user_id FROM TOKEN
            WHERE token=?
        """,(token_id,)).fetchone()
        if token is None: return False
        user_id = token[0]
        user = self.cursor[0].execute("""
            SELECT name,img FROM USER
            WHERE id=? 
        """,(user_id,)).fetchone()
        return user

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
        return tokens

    def generate_token(self):
        key = hx(rn(6,16))
        exists = self.token_exists(key)
        while(exists):
            key = hx(rn(2,8))
        return key

    def create_token(self,user_id):
        token = self.generate_token()
        if user_id is None:
            return
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
        """,(username,)).fetchone()

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
    pass