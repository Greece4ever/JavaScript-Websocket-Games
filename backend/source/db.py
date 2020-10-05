import sqlite3,os,pprint,secrets.token_hex as hx,random.randint as rn
    
class Database:
    def __init__(self):
        self.connection = sqlite3.connect('db.SQL')
        self.cursor = self.connection.cursor()
        SQL_PATH = os.path.join(
            os.getcwd(),"sql","user.SQL"
        )

        with open(SQL_PATH,'r') as f:
            statements = iter(f.read().split("\n\n"))
            for statement in statements:
                self.cursor.execute(statement)
            self.connection.commit()

class User:
    def __init__(self,db):
        self.db = db
        self.cursor = self.db.cursor
    
    def create(self,username,password,img):
        self.cursor.execute("""
        INSERT INTO USER VALUES (?,?,?)
        """,(username, password,img))
        self.connection.commit()

    def retrieve(self,username):
        self.cursor.execute("""
            SELECT * FROM USER
            WHERE name like %hello%
        """)

    def verify(self,name,password):
        self.cursor.execute("""
            SELECT * FROM USER
            WHERE name=? AND password=?
        """,name,password)

    def token_exists(self,token):
        tokens = self.cursor.execute("""
            SELECT * FROM TOKEN
            WHERE token=?
        """,token)
        return tokens is None

    def generate_token(self):
        key = hx(rn(2,8))
        while(self.token_exists(key)):
            key = hx(rn(2,8))
        return key

    def create_token(self,user_id):
        token = self.generate_token(user_id)
        usrs = self.cursor.execute("""
            SELECT * FROM USER
            WHERE id=?
        """,user_id)
        if usrs is None:
            return False
        self.cursor.execute("""
            INSERT INTO TOKEN values (?,?)
        """,(token,user_id))        
        self.connection.commit()
        return True

    def id(self,username):
        return self.cursor.execute("""
        SELECT id FROM USER
        WHERE name=?
        """,(username,))

if __name__ == "__main__":
    db = Database()
    users = User(db)
    print(users.create("pakis","password","/path/to/img"))
    print(users.id("pakis"))