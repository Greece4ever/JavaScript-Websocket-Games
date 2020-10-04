from darius.server import server,routes
from .routes import url_patterns

server = server.RoutedWebsocketServer(paths=url_patterns,global_max_size=1024,CORS_DOMAINS=['127.0.0.1:3000'])
server.start()