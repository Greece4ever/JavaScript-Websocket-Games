from darius.server import server,routes
from .routes import sock_url_patterns,rest_api_patterns

server = server.Server(socket_paths=sock_url_patterns,http_paths=rest_api_patterns,CORS_DOMAINS=['127.0.0.1:3000'])
server.start()