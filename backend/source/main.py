from darius.server import server,routes
from .routes import sock_url_patterns,rest_api_patterns

server = server.Server(
    host=server.LOCALHOST,
    port=8000,
    socket_paths=sock_url_patterns,
    http_paths=rest_api_patterns,
    CORS_DOMAINS=['http://localhost:3000'],
    XFRAME_DOMAINS=['http://localhost:3000']
)
server.start()